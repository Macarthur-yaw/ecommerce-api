import { Router } from "express";
import { products } from "../../Model/ProductSchema";
import { ProductSchemaTypes } from "../../types/productsSchemaTypes";
import AuthMiddleware from "../../Middleware/AuthMiddleware";

const productRouter = Router();

productRouter.use(AuthMiddleware)
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management operations
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: productId1
 *                       name:
 *                         type: string
 *                         example: Product Name
 *                       category:
 *                         type: string
 *                         example: Category Name
 *                       price:
 *                         type: number
 *                         example: 20
 *                       description:
 *                         type: string
 *                         example: Product Description
 */
productRouter.get("/", async (req, res) => {
    try {
        const results = await products.find();
        res.status(200).send({ message: "Success", data: results });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: productId1
 *                     name:
 *                       type: string
 *                       example: Product Name
 *                     category:
 *                       type: string
 *                       example: Category Name
 *                     price:
 *                       type: number
 *                       example: 20
 *                     description:
 *                       type: string
 *                       example: Product Description
 */
productRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await products.findById(id);
        res.status(200).send({ message: "Success", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /products/add-products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Product Name
 *               category:
 *                 type: string
 *                 example: Category Name
 *               price:
 *                 type: number
 *                 example: 20
 *               description:
 *                 type: string
 *                 example: Product Description
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product Created
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: newProductId
 *                     name:
 *                       type: string
 *                       example: Product Name
 *                     category:
 *                       type: string
 *                       example: Category Name
 *                     price:
 *                       type: number
 *                       example: 20
 *                     description:
 *                       type: string
 *                       example: Product Description
 */
productRouter.post("/add-products", async (req, res) => {
    try {
        const productData: ProductSchemaTypes = req.body;
        const newProduct = new products(productData);
        const result = await newProduct.save();
        res.status(201).send({ message: "Product Created", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Product Name
 *               category:
 *                 type: string
 *                 example: Updated Category Name
 *               price:
 *                 type: number
 *                 example: 30
 *               description:
 *                 type: string
 *                 example: Updated Product Description
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product Updated
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: productId
 *                     name:
 *                       type: string
 *                       example: Updated Product Name
 *                     category:
 *                       type: string
 *                       example: Updated Category Name
 *                     price:
 *                       type: number
 *                       example: 30
 *                     description:
 *                       type: string
 *                       example: Updated Product Description
 */
productRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productData: ProductSchemaTypes = req.body;
        const result = await products.findByIdAndUpdate(id, productData, { new: true });
        res.status(200).send({ message: "Product Updated", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product Deleted
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: productId
 *                     name:
 *                       type: string
 *                       example: Product Name
 *                     category:
 *                       type: string
 *                       example: Category Name
 *                     price:
 *                       type: number
 *                       example: 20
 *                     description:
 *                       type: string
 *                       example: Product Description
 */
productRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await products.findByIdAndDelete(id);
        res.status(200).send({ message: "Product Deleted", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /products/category:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Category to filter products
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of products filtered by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: productId1
 *                       name:
 *                         type: string
 *                         example: Product Name
 *                       category:
 *                         type: string
 *                         example: electronics
 *                       price:
 *                         type: number
 *                         example: 20
 *                       description:
 *                         type: string
 *                         example: Product Description
 */
productRouter.get(`/category`, async (req, res) => {
    try {
        const { category } = req.query;
        const result = await products.find({ category: category });
        res.status(200).send({ message: "Success", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export { productRouter };
