const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const computeRoute   = require("./routes/compute.js");
const materialsRoute = require("./routes/materials.js");

const port = Number(process.env.PORT) || 8080;

// Allow local dev servers (Vite may auto-increment ports).
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
  })
);
app.use(express.json());

app.use("/api", computeRoute);
app.use("/api", materialsRoute);

app.get("/", (req, res)=>{
    res.send("backend running");
});
const server = app.listen(port, ()=>{
  console.log(`app working on ${port}`);
});

server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the other process or set PORT to a free port.`);
    process.exit(1);
  }
  throw err;
});

module.exports = app;
