import Post from '../database/models/Post.js';
import {
    uploadImage,
    deleteImage
} from "../libs/cloudinary.js";
import fs from 'fs-extra';


export const postsControllers = {
    getPosts: async (req, res) => {
        try {
            const posts = await Post.find();

            res.status(200).json(posts)
        } catch (error) {
            res.status(404).json({
                message: error.message
            })
        }
    },
    getPostsByCategory: async (req, res) => {
        try {
            const posts = await Post.find({ category: req.params.category });

            res.status(200).json(posts);
        } catch (error) {
            console.error('Error al obtener los posts:', error);

            res.status(500).json({ error: 'Error al obtener los posts' });
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            res.status(200).json(post);
        } catch (error) {
            res.status(404).json({
                message: error.message
            })
        }
    },
    newPost: async (req, res) => {

        try {
            const {
                creator,
                title,
                body,
                category,
                video,
                createdAt
            } = req.body;

            let images = [];

            if (req.files && Array.isArray(req.files.image) && req.files.image[0]) {
                for (let i = 0; i < req.files.image.length; i++) {
                    const image = req.files.image[i];
                    let imagePosted = await uploadImage(image.tempFilePath);

                    let imageUpd = {
                        url: imagePosted.secure_url,
                        public_id: imagePosted.public_id
                    };

                    images[i] = imageUpd;
                    await fs.remove(image.tempFilePath);
                }
            } else if (req.files && req.files.image && !Array.isArray(req.files.image)) {
                let imagePosted = await uploadImage(req.files.image.tempFilePath);

                let imageUpd = {
                    url: imagePosted.secure_url,
                    public_id: imagePosted.public_id
                };

                images.push(imageUpd);
                await fs.remove(req.files.image.tempFilePath);
            }

            const newPost = new Post({
                creator,
                title,
                body,
                category,
                image: images,
                createdAt
            });


            await newPost.save();

            res.status(201).json(newPost);
        } catch (error) {
            res.status(409).json({
                message: error.message
            })
        }
    },
    updatePost: async (req, res) => {
        try {
            const postToUpdate = await Post.findById(req.params.id)
            let images = postToUpdate.image;

            let filesToDel;
            if (req.body.filesToDelete) {
                filesToDel = JSON.parse(req.body.filesToDelete)
                if (filesToDel && Array.isArray(filesToDel) && filesToDel.length > 0) {
                    await Promise.all(filesToDel.map(async (public_id) => {
                        await deleteImage(public_id);
                        const updatedFiles = images.filter(file => file.public_id !== public_id);
                        images = updatedFiles;
                    }));
                }
            }


            if (req.files && Array.isArray(req.files.image) && req.files.image[0]) {
                await Promise.all(req.files.image.map(async (image) => {
                    let imagePosted = await uploadImage(image.tempFilePath);

                    let imageUpd = {
                        url: imagePosted.secure_url,
                        public_id: imagePosted.public_id
                    };

                    images.push(imageUpd);
                    await fs.remove(image.tempFilePath);
                }));
            } else if (req.files && req.files.image && !Array.isArray(req.files.image)) {
                let imagePosted = await uploadImage(req.files.image.tempFilePath);

                let imageUpd = {
                    url: imagePosted.secure_url,
                    public_id: imagePosted.public_id
                };

                images.push(imageUpd);
                await fs.remove(req.files.image.tempFilePath);
            }

            const postUpd = {
                ...req.body,
                image: images
            }

            const updatePost = await Post.findByIdAndUpdate(req.params.id,
                postUpd, {
                new: true
            })

            res.status(201).json(updatePost)
        } catch (error) {
            res.status(409).json({
                message: error.message
            })
        }
    },
    deletePost: async (req, res) => {
        try {
            const postRemove = await Post.findById(req.params.id);
            const removeImages = async (postRemove) => {
                if (postRemove && postRemove.image && Array.isArray(postRemove.image)) {
                    try {
                        await Promise.all(postRemove.image.map(async (image) => {
                            if (image.public_id) {
                                await deleteImage(image.public_id);
                            }
                        }));
                    } catch (error) {
                        console.error(error);
                    }
                } else if (postRemove && postRemove.image && !Array.isArray(postRemove.image)) {
                    try {
                        await deleteImage(postRemove.image)
                    } catch (error) {
                        console.log(error);
                    }
                }
            };

            removeImages(postRemove);

            await Post.deleteOne({ _id: postRemove._id })

            res.status(204).send()
        } catch (error) {
            res.status(409).json({
                message: error.message
            })
        }
    }
}