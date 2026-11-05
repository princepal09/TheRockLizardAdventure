import type { TeamMember } from '../../../generated/prisma/client.js';
import type { CreateTeamMemberDTO, UpdateTeamMemberDTO } from './team.schema.js';

export type TeamMemberPhoto = Partial<Pick<TeamMember, 'photoUrl' | 'photoPublicId'>>;

export interface ITeamRepository {
  hideSelected(ids: string[]): Promise<number>;
  createMember(data: CreateTeamMemberDTO & TeamMemberPhoto): Promise<TeamMember>;
  findMembers(isActive?: boolean): Promise<TeamMember[]>;
  findMemberById(id: string): Promise<TeamMember | null>;
  updateMember(
    id: string,
    data: UpdateTeamMemberDTO & TeamMemberPhoto,
    photoPublicId?: string | null,
  ): Promise<TeamMember>;
  deleteMember(id: string): Promise<TeamMember>;
}
