const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const computeRoute   = require("./routes/compute");
const materials = require("./config/materials.config");
const materialsRoute = require("./routes/materials");

let port = 8080;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/compute", computeRoute);
app.use("/api/materials", materialsRoute);

app.get("/", (req, res)=>{
    res.send("backend running");
});
app.listen(port, ()=>{
    console.log("app working on 8080");
});

module.exports = app;
