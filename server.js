
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve frontend files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// 1. Ping test
app.get("/api/ping", (req, res) => {
    res.set("Cache-Control", "no-store");

    res.json({
        message: "Server is working!",
        time: Date.now()
    });
});

// 2. Download speed test
app.get("/api/download", (req, res) => {
    const requestedSize = Number(req.query.bytes) || 5000000;

    // Allow between 1 MB and 20 MB
    const size = Math.max(
        1000000,
        Math.min(requestedSize, 20000000)
    );

    const data = Buffer.alloc(size, "A");

    res.set({
        "Content-Type": "application/octet-stream",
        "Content-Length": String(data.length),
        "Cache-Control": "no-store, no-cache, must-revalidate"
    });

    res.send(data);
});

// 3. Upload speed test
app.post(
    "/api/upload",
    express.raw({
        type: "application/octet-stream",
        limit: "20mb"
    }),
    (req, res) => {
        if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
            return res.status(400).json({
                error: "No upload data received."
            });
        }

        res.set("Cache-Control", "no-store");

        res.json({
            message: "Upload received successfully",
            bytesReceived: req.body.length
        });
    }
);

// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
