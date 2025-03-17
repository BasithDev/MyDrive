const supabase = require("../supabase");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "../../../proto/metadata.proto"), 
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
);

const metadataProto = grpc.loadPackageDefinition(packageDefinition).metadata;

const metadataClient = new metadataProto.MetadataService("localhost:50052", grpc.credentials.createInsecure());

const uploadFile = async (call, callback) => {
    let fileBuffer = [];
    let filename = "";
    let mimetype = "";

    call.on("data", (chunk) => {

        if (chunk.filename) {
            filename = chunk.filename;
            mimetype = chunk.mimetype;
            console.log(`\nFile name: ${filename}, Type: ${mimetype}`);
        }

        if (chunk.fileChunk && chunk.fileChunk.length > 0) {  
            fileBuffer.push(chunk.fileChunk);
        }
    });

    call.on("end", async () => {
        console.log("Stream ended. Processing upload...");

        if (fileBuffer.length === 0) {
            console.error("No file data received!");
            return callback(new Error("No file data received."));
        }

        const fileData = Buffer.concat(fileBuffer);
        console.log(`Final file size: ${fileData.length} bytes`);

        try {
            console.log("\nUploading file to Supabase...");
            
            // Ensure Supabase upload completes before proceeding
            const { data, error } = await supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .upload(`uploads/${Date.now()}_${filename}`, fileData, {
                    contentType: mimetype,
                });

            if (error) {
                console.error("Supabase Upload Error:", error);
                return callback(error);  // Return the error to the client
            }

            // Generate public URL
            const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${data.path}`;

            console.log("\nFile uploaded to supabase", fileUrl);

            const metadata = {
                filename,
                mimetype,
                size: fileData.length,
                fileUrl
            };

            metadataClient.SaveMetadata(metadata, (metaError, metaResponse) => {
                if (metaError) {
                    console.error("MetadataService Error:", metaError);
                    return callback(metaError);  
                }

                console.log("\nMetadata saved successfully:", metaResponse);

                return callback(null, { 
                    message: "File uploaded and metadata saved successfully", 
                    fileUrl: fileUrl
                });
            });

        } catch (error) {
            console.error("Unexpected error:", error);
            return callback(error);  // Ensure the client receives an error if upload fails
        }
    });
};

module.exports = { uploadFile };
