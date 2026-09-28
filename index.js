import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8","1.1.1.1"]);

const MONGO_URI ="mongodb+srv://golisindhi_db_user:hYXEE7.N.28dpuY@cluster0.zsksu4i.mongodb.net/meeshostore";

const app = express();
const PORT = 3000;

app.use(express.json());
if(!MONGO_URI){
    console.error("MongoDB is not defined.please set the MONGO_URL environment variable.");
    process.exit(1);
}
mongoose.connect(MONGO_URI);
const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
});

const Product = mongoose.model("Product",productSchema);

app.get("/products", async (req,res) => {
    try{
    const products = await Product.find();
    res.status(200).json({ message : " get all products",data: products});
    }catch(error){
    res.status(500).json({ message:"Error fetching products",error});
    }
});
app.post("/products", async (req,res)=>{
    try{
        // const product = new Product(req.body);
        // await product.save();
      const product = await Product.create(req.body);

        res.status(201).json({ message : "products created",data:product});
    }catch(error){
        res.status(400).json({ message : "error creating product",error});
    }
});
app.put("/products/:id", async (req,res)=>{
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
        });
        res
            .status(200)
            .json({ message : "product updated",id:req.params.id,data:product});
        }catch(error){
            res.status(400).json({ message : "Error updating product",error});
        }
});
app.delete("/products/:id", async(req,res)=>{
    try{
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message : "products deleted",id:req.params.id});
    }catch(error){
    res.status(400).json({ mesage:"Error deleting product",error});
    }
});
app.listen(PORT,() => {
    console.log(`server is running on port http://localhost:${PORT}`);
});
