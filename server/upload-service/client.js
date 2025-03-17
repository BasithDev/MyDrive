const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types"); // Detect MIME type

// Load proto file
const packageDefinition = protoLoader.loadSync(path.join(__dirname,"../proto/upload.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const uploadProto = grpc.loadPackageDefinition(packageDefinition).upload;

// Create gRPC client
const client = new uploadProto.UploadService("localhost:50051", grpc.credentials.createInsecure());

// File to upload (change this to test with other files)
const filePath = path.join(__dirname, "testvid.webm"); // Change filename here
const fileSize = fs.statSync(filePath).size;
const fileStream = fs.createReadStream(filePath);
const filename = path.basename(filePath);
const mimetype = mime.lookup(filePath) || "application/octet-stream"; // Auto-detect MIME

// Start gRPC streaming call
const call = client.UploadFile((error, response) => {
    if (error) {
        console.error("Upload failed:", error.message);
    } else {
        console.log("\nUploaded:", response);
    }
});



// Send metadata (filename and MIME type) only once at the start
call.write({ filename, mimetype });

// Track progress
let uploadedSize = 0;
fileStream.on("data", (chunk) => {
  uploadedSize += chunk.length;
  const progress = ((uploadedSize / fileSize) * 100).toFixed(2);
  console.log(`Uploading...(${progress}% complete)`);
  call.write({ fileChunk: chunk });
});

// End stream when done
fileStream.on("end", () => {
  console.log("\nFile upload complete. Ending stream.");
  call.end();
});

// Handle errors
fileStream.on("error", (err) => {
  console.error("File read error:", err);
});