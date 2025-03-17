const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load proto
const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../proto/metadata.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const metadataProto = grpc.loadPackageDefinition(packageDefinition).metadata;

// Create gRPC client
const client = new metadataProto.MetadataService("localhost:50052", grpc.credentials.createInsecure());

// Test request
// const metadata = {
//     filename: "testvid.webm",
//     mimetype: "video/webm",
//     size: 2563897,
//     fileUrl: "https://supabase.com/example/testvid.webm"
// };

// client.SaveMetadata(metadata, (error, response) => {
//     if (error) {
//         console.error("Error:", error.message);
//     } else {
//         console.log("Metadata saved:", response);
//     }
// });

// Test getAllFiles
client.GetAllFiles({},(error, response) => {
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("All files:", response);
    }
});