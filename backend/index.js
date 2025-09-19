import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import asyncHandler from './utils/asyncHandler.js';
import { connectDB } from './config/connectDB.js';
import route from './routes/index.js';

const app = express();
const PORT = process.env.PORT;

connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', route);

app.get('/', 
    asyncHandler(async(req, res) => {
        return res.json({
            success : true, 
            status: 201, 
            message : 'Hello Developer !'
        })
    })
)

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT : ${PORT}`);
})