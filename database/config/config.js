import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3500
export const DATABASE_URI = process.env.DATABASE_URI;
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_APIKEY = process.env.CLOUDINARY_APIKEY;
export const CLOUDINARY_APISECRET = process.env.CLOUDINARY_APISECRET;
