require("dotenv").config();
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { uploadFile } = require("./services/uploadService");

const PROTO_PATH = path.join(__dirname,"../../proto/upload.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const uploadProto = grpc.loadPackageDefinition(packageDefinition).upload;

const server = new grpc.Server();
server.addService(uploadProto.UploadService.service, { UploadFile: uploadFile });

const PORT = process.env.GRPC_PORT || "50051";
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC upload service running on port ${PORT}`);
});
