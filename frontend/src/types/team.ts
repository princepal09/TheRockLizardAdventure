export type TeamMemberInput = {
  name: string;
  role: string;
  bio: string | null;
  qualifications: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type TeamMember = TeamMemberInput & {
  id: string;
  photoUrl: string | null;
};
