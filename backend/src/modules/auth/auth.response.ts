import { Admin } from '../../../generated/prisma/client.js';

export const sanitizedUserResponse = (admin: Admin) => {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    profileImage:admin.profileImageUrl,
    isActive: admin.isActive,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
};
