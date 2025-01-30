const TryCatch = require("../utils/TryCatch.js");
const getDataUrl = require("../utils/urlGenerator.js");
const axios = require('axios');
const cloudinary = require('cloudinary')
const img = require("../model/imgModel.js")
const createImg = TryCatch(
    async(req, res) => {
        const { title, pin } = req.body // Metadata from the client
        const file = req.file // File captured by Multer
        const fileUrl = getDataUrl(file) // Generate a DataURI
        console.log('Generated Data URI:', fileUrl);

        //use cloudinary to upload the image
        try {

            const result = await axios.post('http://localhost:5100/check_meme', {
                image_url: fileUrl.content || fileUrl // Pass the Data URI to the Python service
            });


            const isMeme = result.data.is_meme;
            if (isMeme) {
                const cloud = await cloudinary.v2.uploader.upload(fileUrl.content)
                await img.create({
                    title,
                    pin,
                    owner: req.user._id, //loggedIn user
                    image: {
                        id: cloud.public_id,
                        url: cloud.secure_url,
                    }
                })
                res.json({ message: "Img added" });
            } else
                return res.status(400).send({ error: "This image is not a meme. Please try with another image." });
        } catch (error) {
            console.error('Error calling Python service or uploading to Cloudinary:', error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }





    }
)

module.exports = createImg