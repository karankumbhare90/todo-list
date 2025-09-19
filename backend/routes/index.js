import express from 'express';
import userRouter from './userRoutes.js'
import todoRouter from './todoRoutes.js'


const route = express.Router();

route.use('/user', userRouter);
route.use('/todo', todoRouter);


export default route;