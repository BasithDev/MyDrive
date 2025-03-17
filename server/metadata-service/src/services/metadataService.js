const grpc = require("@grpc/grpc-js");
const FileMetadata = require("../models/FileMetadata");

const saveMetadata = async (call, callback) => {
    try {
        const { filename, mimetype, size, fileUrl } = call.request;
        
        const metadata = new FileMetadata({ filename, mimetype, size, fileUrl });
        const savedMetadata = await metadata.save();

        console.log("Metadata saved:", savedMetadata);
        callback(null, { message: "Metadata saved successfully", id: savedMetadata._id.toString() });

    } catch (error) {
        console.error("Error saving metadata:", error);
        callback(error);
    }
};

const getAllFiles = async (call, callback) => {
    try {
        const files = await FileMetadata.find();
        callback(null, { files });
    } catch (error) {
        console.error("Error getting all files:", error);
        callback(error);
    }
}

module.exports = { saveMetadata, getAllFiles };
