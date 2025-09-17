import mongoose, { mongo } from 'mongoose'


const todoSchema = new mongoose.Schema({
  content:{
    type:String,
    required:true,
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  sub_todos:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Sub_todo"
  }  
  ]

},{timestamps:true})


export const Todo = mongoose.model("Todo",todoSchema);