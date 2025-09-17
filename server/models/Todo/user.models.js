import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  userName:{
    type:String,
    unique:true,

  },
  email:{
    type:String,
    unique:true,
  },
  password:{
    type:String,
    minlength:6
  }

},{timestamps:true})

export const User = mongoose.model("User",userSchema);