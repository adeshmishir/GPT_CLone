import mongoose from "mongoose";

const itemSchemas = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
       
    },
    quantity:{
        type:Number,
         required:true,
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice:{
        type:Number,
        required:true,
    },
    orderItems:{
        type:[itemSchemas]
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Cancelled","Delevered"],
        default:"pending"
    },
    orderedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    
},{timestamps:true})

export const Order = mongoose.model("Order",orderSchema);