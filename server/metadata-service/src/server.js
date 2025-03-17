const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const connectDB = require("./config/db");
const { saveMetadata, getAllFiles } = require("./services/metadataService");
// Load proto file
const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../../proto/metadata.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const metadataProto = grpc.loadPackageDefinition(packageDefinition).metadata;

// Start gRPC server
const server = new grpc.Server();
server.addService(metadataProto.MetadataService.service, { SaveMetadata: saveMetadata, GetAllFiles: getAllFiles });

const PORT = process.env.GRPC_PORT || 50052;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Metadata Service running on port ${PORT}`);
});

// Connect to MongoDB
connectDB();