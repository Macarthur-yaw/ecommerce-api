import { Router, Request, Response } from 'express';
import upload from '../../Config/Upload';
const fileRouter = Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     description: This endpoint allows the user to upload an image file to Cloudinary.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: image
 *         in: formData
 *         description: The image file to be uploaded.
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 imageUrl:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/v1645699900/uploads/image_1617306783000.jpg
 *       400:
 *         description: No file uploaded
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: No file uploaded
 */
fileRouter.post('/upload', upload.single('image'), (req: Request, res: Response) => {
    console.log(req.file);
  if (req.file) {
    res.json({
      message: 'File uploaded successfully',
      imageUrl: req.file.path, 
    });
  } else {
    res.status(400).send('No file uploaded');
  }
});

export default fileRouter;
