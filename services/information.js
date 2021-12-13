const fs = require("fs");


const references  = ()=>{
    let data = fs.readFileSync("./services/references.json", "utf-8");
    return data;
};

const skills  =  ()=>{
    let data = fs.readFileSync("./services/skills.json", "utf-8");
    return data;
};

module.exports = {references,skills};