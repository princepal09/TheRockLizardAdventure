import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../../lib/cloudinary.js';

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,

        resource_type: 'image',

        transformation: [
          {
            width: 2000,
            height: 2000,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },

      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed'));
          return;
        }

        resolve(result);
      },
    );

    stream.end(file.buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
