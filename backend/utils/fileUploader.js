const cloudinary = require("cloudinary").v2;

exports.uploadToCloudinary = async (fileBuffer, folder = "resumes", options = {}) => {
    return new Promise((resolve, reject) => {
        const allowedFormats = ["pdf", "docx"];

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "raw",
                allowed_formats: allowedFormats,
                ...options,
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};