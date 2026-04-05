const express = require("express");
const app = express();
const path = require("path");
let port = 8080;



app.use(express.json());

app.get("/", (req, res)=>{
    res.send("backend running");
});
app.listen(port, ()=>{
    console.log("app working on 8080");
});

app.post("/compute", (req, res)=>{//3 components 1var 2 formulas 3result
    //vars
    let data = req.body;
    let layers = data.layers;
    let totalRes = 0;//convective resistance
    let A = data.area || 1;
    let { T_left, T_inf, h } = data.boundary;

     
    //formulas. 
    //1  conduction thermal  resistance r = dx / a* k
    for(let layer of layers) {
        let r = layer.thickness / layer.k;
        totalRes += r;
    }
    //convection res r = 1/ha
    totalRes += 1 / (h*A);
    //2 q -> heat transfer = (left temp  - ambient(air) temp) / R_total;
    let q = (T_left - T_inf) / totalRes;

    //arr to store temps at each lvl
    let temp = [];
    let ct = T_left;//current temp
    temp.push(ct);


    for(let layer of layers) {
        let r = layer.thickness / layer.k;//calculage temp drop through each level or wall using its delta T val 
        let deltaT = q * r;
        ct = ct - deltaT;
        temp.push(ct);
    }




    // res.send(totalRes);
    //or use res.json
    res.json({
        resistance : totalRes,
        heat_flux : q,
        tempratures : temp
    })

});