import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

interface UploadResult {
  public_id: string;
  secure_url: string;
}

// const uploadImage = async (filePath: string): Promise<UploadResult> => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath);
//     console.log(result);
//     return {
//       public_id: result.public_id,
//       secure_url: result.secure_url,
//     };
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     throw error;
//   }
// };

// export default uploadImage;




const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, res: Response, file: Express.Multer.File) => {
    return {
      folder: "Image_Uploads",
    };
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png and .jpg format allowed!"));
  }
};
export const upload = multer({ storage: storage, fileFilter:fileFilter });