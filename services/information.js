const fs = require("fs");
const path = require('path');

const work_exp  = ()=>{
    let data = fs.readFileSync(path.join(__dirname,"/work-experienced.json"), "utf-8");
    return data;
};

const skills  =  ()=>{
    let data = fs.readFileSync(path.join(__dirname,"/skills.json"), "utf-8");
    return data;
};

module.exports = {work_exp,skills};