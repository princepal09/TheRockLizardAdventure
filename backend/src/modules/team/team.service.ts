import { Prisma, type TeamMember } from '../../../generated/prisma/client.js';
import { logger } from '../../lib/logger.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../utils/cloudinary/cloudinary.helper.js';
import { AppError } from '../../utils/common/error/AppError.js';
import type { ITeamRepository } from './team.interface.js';
import type { CreateTeamMemberDTO, UpdateTeamMemberDTO } from './team.schema.js';

function toTeamMemberResponse(member: TeamMember) {
  const { id, name, role, bio, qualifications, photoUrl, sortOrder, isActive } = member;
  return { id, name, role, bio, qualifications, photoUrl, sortOrder, isActive };
}

export class TeamService {
  async hideSelected(ids: string[]) {
    return this.teamRepo.hideSelected(ids);
  }

  constructor(private readonly teamRepo: ITeamRepository) {}

  async createMember(data: CreateTeamMemberDTO, file?: Express.Multer.File) {
    const photo = file ? await uploadToCloudinary(file, 'rocklizard/team') : undefined;

    try {
      const member = await this.teamRepo.createMember(
        photo ? { ...data, photoUrl: photo.secure_url, photoPublicId: photo.public_id } : data,
      );
      return toTeamMemberResponse(member);
    } catch (error) {
      await this.cleanupPhoto(photo?.public_id);
      throw error;
    }
  }

  async getMembers(activeOnly = false) {
    const members = await this.teamRepo.findMembers(activeOnly ? true : undefined);
    return members.map(toTeamMemberResponse);
  }

  async getMember(id: string) {
    return toTeamMemberResponse(await this.findMember(id));
  }

  async updateMember(id: string, data: UpdateTeamMemberDTO, file?: Express.Multer.File) {
    if (!file && Object.keys(data).length === 0) {
      throw new AppError('Provide at least one field to update', 400);
    }

    const current = file ? await this.findMember(id) : undefined;
    const photo = file ? await uploadToCloudinary(file, 'rocklizard/team') : undefined;

    try {
      const member = await this.teamRepo.updateMember(
        id,
        photo ? { ...data, photoUrl: photo.secure_url, photoPublicId: photo.public_id } : data,
        current?.photoPublicId,
      );
      if (photo) await this.cleanupPhoto(current?.photoPublicId);
      return toTeamMemberResponse(member);
    } catch (error) {
      await this.cleanupPhoto(photo?.public_id);
      if (
        current &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        await this.findMember(id);
        throw new AppError('Team member photo changed. Retry the update', 409);
      }
      this.handleWriteError(error);
    }
  }

  async deleteMember(id: string) {
    try {
      const member = await this.teamRepo.deleteMember(id);
      await this.cleanupPhoto(member.photoPublicId);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  private async findMember(id: string) {
    const member = await this.teamRepo.findMemberById(id);
    if (!member) throw new AppError('Team member not found', 404);
    return member;
  }

  private async cleanupPhoto(publicId?: string | null) {
    if (!publicId) return;

    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      logger.warn({ err: error, publicId }, 'Failed to delete team member photo from Cloudinary');
    }
  }

  private handleWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Team member not found', 404);
    }
    throw error;
  }
}
