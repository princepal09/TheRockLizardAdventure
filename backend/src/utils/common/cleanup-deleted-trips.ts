import { logger } from '../../lib/logger.js';
import { deleteFromCloudinary } from '../cloudinary/cloudinary.helper.js';

type DeletedTrip = {
  coverImagePublicId: string | null;
  images: { imagePublicId: string | null }[];
};

export async function cleanupDeletedTrips(trips: DeletedTrip[]) {
  const publicIds = [
    ...new Set(
      trips
        .flatMap((trip) => [
          trip.coverImagePublicId,
          ...trip.images.map((image) => image.imagePublicId),
        ])
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  let cleanupFailures = 0;
  for (let index = 0; index < publicIds.length; index += 5) {
    const results = await Promise.all(
      publicIds.slice(index, index + 5).map(async (publicId) => {
        try {
          await deleteFromCloudinary(publicId);
          return true;
        } catch (error) {
          logger.warn({ err: error, publicId }, 'Failed to delete bulk trip image from Cloudinary');
          return false;
        }
      }),
    );
    cleanupFailures += results.filter((success) => !success).length;
  }
  return { deletedCount: trips.length, cleanupFailures };
}
