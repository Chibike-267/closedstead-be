import { v2 as cloudinary } from "cloudinary";

interface UploadResult {
  public_id: string;
  secure_url: string;
}

const uploadImage = async (filePath: string): Promise<UploadResult> => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log(result);
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default uploadImage;
