const request = require("supertest");
const app = require("../src/server"); // Import API Gateway server
const uploadClient = require("../src/services/uploadClient");
const metadataClient = require("../src/services/metadataClient");

// Mock the gRPC Clients
jest.mock("../src/services/uploadClient", () => ({
  UploadFile: jest.fn(),
}));

jest.mock("../src/services/metadataClient", () => ({
  GetAllFiles: jest.fn(),
}));

describe("API Gateway Tests", () => {
  test("should return 400 when no file is uploaded", async () => {
    const res = await request(app).post("/upload").send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "No file uploaded" });
  });

  test("should upload a file successfully", async () => {
    // Mock gRPC UploadFile response
    uploadClient.UploadFile.mockImplementation((callback) => {
      callback(null, { fileUrl: "https://example.com/testfile.txt" });
      return { write: jest.fn(), end: jest.fn() };
    });

    const res = await request(app)
      .post("/upload")
      .attach("file", Buffer.from("dummy content"), "test.txt");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "success",
      fileUrl: "https://example.com/testfile.txt",
    });
  });

  test("should return a list of files", async () => {
    // Mock gRPC GetAllFiles response
    metadataClient.GetAllFiles.mockImplementation((_, callback) => {
      callback(null, { files: [{ name: "test.txt", url: "https://example.com/test.txt" }] });
    });

    const res = await request(app).get("/files");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      files: [{ name: "test.txt", url: "https://example.com/test.txt" }],
    });
  });
});