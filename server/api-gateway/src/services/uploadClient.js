const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
require("dotenv").config();

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../../../proto/upload.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const uploadProto = grpc.loadPackageDefinition(packageDefinition).upload;

const uploadClient = new uploadProto.UploadService(
    process.env.UPLOAD_SERVICE_URL || "localhost:50051",
    grpc.credentials.createInsecure()
);

module.exports = uploadClient;