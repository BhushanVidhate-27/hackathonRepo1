const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const computeRoute   = require("./routes/compute.js");
const materialsRoute = require("./routes/materials.js");

let port = 8080;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api", computeRoute);
app.use("/api", materialsRoute);

app.get("/", (req, res)=>{
    res.send("backend running");
});
app.listen(port, ()=>{
console.log(`app working on ${port}`);
});

module.exports = app;
