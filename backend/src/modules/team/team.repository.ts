import { prisma } from '../../lib/prisma.js';
import type { ITeamRepository, TeamMemberPhoto } from './team.interface.js';
import type { CreateTeamMemberDTO, UpdateTeamMemberDTO } from './team.schema.js';

export class TeamRepository implements ITeamRepository {
  async hideSelected(ids: string[]) {
    const result = await prisma.teamMember.updateMany({
      where: { id: { in: ids }, isActive: true },
      data: { isActive: false },
    });
    return result.count;
  }

  async createMember(data: CreateTeamMemberDTO & TeamMemberPhoto) {
    return prisma.teamMember.create({ data });
  }

  async findMembers(isActive?: boolean) {
    return prisma.teamMember.findMany({
      where: { isActive },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  async findMemberById(id: string) {
    return prisma.teamMember.findUnique({ where: { id } });
  }

  async updateMember(
    id: string,
    data: UpdateTeamMemberDTO & TeamMemberPhoto,
    photoPublicId?: string | null,
  ) {
    const where = photoPublicId === undefined ? { id } : { id, photoPublicId };
    return prisma.teamMember.update({ where, data });
  }

  async deleteMember(id: string) {
    return prisma.teamMember.delete({ where: { id } });
  }
}
