const mongoose = require("mongoose");

const fileMetadataSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    fileUrl: { type: String, required: true },
},{timestamps: true});

module.exports = mongoose.model("FileMetadata", fileMetadataSchema);