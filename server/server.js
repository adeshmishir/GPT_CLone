import express from 'express'
import cors from 'cors'
import dotenv  from 'dotenv'
dotenv.config();
import { connectDB } from './utils/db.js';
import userRouter from './routes/userRoutes.js';
const app  = express();
const PORT  = 5000;

app.use(express.json())
app.use(cors())
app.get("/api/arr",(req,res)=>{
    
    res.send("Swayam ki Jay");
})
app.use('/api/user',userRouter)
connectDB();
app.listen(PORT,()=>{
    console.log(`server is LIstennig at http://localhost:${PORT}/`);
    
})