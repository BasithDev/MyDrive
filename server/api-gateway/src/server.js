const express = require("express");
const metadataClient = require("./services/metadataClient");
const uploadClient = require("./services/uploadClient");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { originalname, mimetype, buffer } = req.file;
  const fileSize = buffer.length;
  const filename = originalname.replace(/\s+/g, "_");

  const call = uploadClient.UploadFile((error, response) => {
    if (error) {
      console.error("Upload failed:", error.message);
      return res.status(500).json({ message: "Failed to upload file" });
    }
    res.json({ message: "success", fileUrl: response.fileUrl });
  });

  const chunkSize = 64 * 1024;
  for (let i = 0; i < fileSize; i += chunkSize) {
    const chunk = buffer.slice(i, i + chunkSize);
    call.write({ filename, mimetype, fileChunk: chunk });
  }
  call.end();
});

app.get("/files", async (req, res) => {
  metadataClient.GetAllFiles({}, (error, response) => {
    if (error) {
      console.error("Failed to get files:", error.message);
      return res.status(500).json({ message: "Failed to get files" });
    }
    res.json(response);
  });
});

// Only start server when running directly
if (require.main === module) {
  const server = app.listen(3000, () => {
    console.log("API Gateway running on port 3000");
  });
  module.exports = server; // Export server instance
} else {
  module.exports = app; // Export app instance for testing
}
