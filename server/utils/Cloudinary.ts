import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadImage = async (
  buffer: Buffer,
  imageName: string,
  folder: string = "office-management",
): Promise<UploadResult> => {
  try {
    return new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder,
          public_id: imageName,
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          quality: "auto",
          format: "webp",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(new Error("Image upload failed"));
          }
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
          });
        },
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Image upload failed");
  }
};
