const express = require("express");
const multer = require("multer");
const { Worker } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config: save file into src/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

// POST /upload
router.post("/upload", upload.single("file"), (req, res, next) => {
  const worker = new Worker(
    path.join(__dirname, "../workers/uploadWorker.js"),
    {
      workerData: { filePath: req.file.path },
    }
  );

  worker.on("message", (count) =>
    res.json({ message: "File processed", insertedRows: count })
  );

  worker.on("error", (err) => {
    console.error("Worker error:", err);
    res.status(500).send("Worker failed");
  });

  worker.on("exit", (code) => {
    if (code !== 0)
      console.error(`Worker stopped with non-zero exit code: ${code}`);
  });
});

module.exports = router;
