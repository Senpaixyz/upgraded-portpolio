const fs = require("fs");


const work_exp  = ()=>{
    let data = fs.readFileSync("./services/work-experienced.json", "utf-8");
    return data;
};

const skills  =  ()=>{
    let data = fs.readFileSync("./services/skills.json", "utf-8");
    return data;
};

module.exports = {work_exp,skills};