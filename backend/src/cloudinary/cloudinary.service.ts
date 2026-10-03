import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { config } from 'dotenv';
import 'multer';
import * as streamifier from 'streamifier';

config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

@Injectable()
export class CloudinaryService {
  async uploadImageStream(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'articles',
          allowed_formats: ['jpg', 'png', 'jpeg'],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(
              error || new Error('Upload failed: result is undefined'),
            );
          }
          resolve(result.secure_url);
        },
      );
      const stream = streamifier.createReadStream(file.buffer);
      stream.pipe(uploadStream);
    });
  }
}
