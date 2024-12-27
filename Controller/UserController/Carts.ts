
import express,{Request,Response} from "express";
import AuthMiddleware from "../../Middleware/AuthMiddleware";
import user from "../../Model/UserSchema";
import { products } from "../../Model/ProductSchema";

const cartrouter =express.Router()
/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get all carts for a user
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           enum: [favorite, null]
 *         description: Type of cart to retrieve (favorite or normal)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: List of user carts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userCarts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete cart item
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           enum: [favorite, null]
 *         description: Type of cart to delete from (favorite or normal)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Add item to cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           enum: [favorite, null]
 *         description: Type of cart to add to (favorite or normal)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               id:
 *                 type: string
 *             required:
 *               - email
 *               - id
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */




cartrouter.get("/carts",AuthMiddleware,async(req,res)=>{
    const getQuery=req.query.data


    const {email}=req.body
    try{
        
const userCarts =await user.findOne({email:email});
if(!userCarts){
     res.status(404).send({message:"User Not Found"})
     return
}
const cartType = getQuery === "favorite" ? userCarts.favoriteCarts : userCarts.userCarts;


const result=[]
for(let x in cartType){
 const data=   await products.findOne({_id:userCarts.userCarts[x]})
result.push(data)
}

res.status(200).send({userCarts:result});

    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Internal Server Error"})
    }

})

cartrouter.delete("/carts/:id",AuthMiddleware,async(req,res)=>{
    const getQuery=req.query.data
    const {email}=req.body
    const {id}=req.params
    try {

        const userCarts =await user.findOne({email:email});
        if(!userCarts){
             res.status(404).send({message:"User Not Found"})
             return
        }
        const cartType = getQuery === "favorite" ? userCarts.favoriteCarts : userCarts.userCarts;

        const carts=cartType.filter((cart)=>cart!==id)
        userCarts.userCarts=carts
        await userCarts.save()
        res.status(200).send({message:"Cart Deleted Successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Internal Server Error"})
    }
})

cartrouter.post("/carts",AuthMiddleware,async(req,res)=>{
    const getQuery=req.query.data
    const {email}=req.body
    const {id}=req.body
    try {
        
        const userCarts =await user.findOne ({email:email});
        if(!userCarts){
             res.status(404).send({message:"User Not Found"})
             return
        }
        const cartType = getQuery === "favorite" ? userCarts.favoriteCarts : userCarts.userCarts;

        cartType.push(id);
        await userCarts.save();
        res.status(200).send({message:"Cart Added Successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Internal Server Error"})
    }
})

export default cartrouter;