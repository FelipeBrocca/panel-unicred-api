import {v2 as cloudinary} from 'cloudinary';
import {CLOUDINARY_APIKEY, CLOUDINARY_APISECRET, CLOUDINARY_NAME} from '../database/config/config.js'

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_APIKEY,
    api_secret: CLOUDINARY_APISECRET
})

export const uploadImage = async filePath => {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'PhotoPost'
    })
}

export const deleteImage = async id => { 
   await cloudinary.uploader.destroy(id)
}