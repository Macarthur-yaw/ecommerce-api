import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './CloudinaryConfig';


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:<any> {
    folder: 'uploads', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
    public_id: (req: any, file: any) => `image_${Date.now()}`, 
  },
});

const upload = multer({ storage: storage });

export default upload;
