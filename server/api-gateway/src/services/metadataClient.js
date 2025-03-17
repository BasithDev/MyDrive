const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
require("dotenv").config();

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../../../proto/metadata.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const metadataProto = grpc.loadPackageDefinition(packageDefinition).metadata;

// Create gRPC client
const metadataClient = new metadataProto.MetadataService(
    process.env.METADATA_SERVICE_URL || "localhost:50052", 
    grpc.credentials.createInsecure()
);

module.exports = metadataClient;