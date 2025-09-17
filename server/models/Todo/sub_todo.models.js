import mongoose from "mongoose";

const sub_todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{})

export const Sub_todo = mongoose.model("Sub_todo",sub_todoSchema);