import mongoose from 'mongoose';
import { DATABASE_URI } from './config/config.js';

export async function connectDB(){
    try{
        const db = await mongoose.connect(DATABASE_URI)
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
    }
}