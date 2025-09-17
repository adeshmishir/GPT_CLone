import express from 'express'

import dotenv  from 'dotenv'
dotenv.config();
import { connectDB } from './utils/db.js';
const app  = express();
const PORT  = 5000;

app.get("/api/arr",(req,res)=>{
    const arr = [
        {
            id:1,
            title:'A',
            name:"bahubali"

        },
         {
            id:2,
            title:"a",
            name:"bahubali"

        },
         {
            id:3,
            title:"a",
            name:"bahubali"

        },
    ]
    res.send(arr);
})

connectDB();
app.listen(PORT,()=>{
    console.log(`server is LIstennig at http://localhost:${PORT}/`);
    
})