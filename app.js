const express = require('express');
const fs = require("fs");
const nodemailer = require('./api/nodemailer');
const validator = require('email-validator');


const app = express();

/* MIDDLE WARE */

app.use(express.json());
app.use(express.static('views'));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
const port = 5500;


app.get('/',(req,res)=>{
  fs.readFile("services/skills.json", "utf-8", (err, jsonString) => {
        if (err) {
          console.log("Error reading file from disk:", err);
          return;
        }
        try {
            const skill_data = JSON.parse(JSON.stringify(jsonString));
            let skills = JSON.parse(skill_data);
            fs.readFile("services/references.json", "utf-8", (err, refString) => {
                    if (err) {
                      console.log("Error reading file from disk:", err);
                      return;
                    }
                    try {
                      const ref_data = JSON.parse(JSON.stringify(refString));
                      let references = JSON.parse(ref_data);
                      res.render('index',{skills:skills,references:references});
                    } 
                    catch (err) {
                      console.log("Error parsing References JSON string:", err);
                    }   
            });
          } catch (err) {
            console.log("Error parsing Skills JSON string:", err);
          }
    });
   
});

app.get('/fetch-projects',(req,res)=>{
    pageSize = Number(req.query.pageSize);
    pageNumber = Number(req.query.pageNumber);
    pageArray = [];
    fs.readFile("services/portpolio.json", "utf-8", (err, jsonString) => {
        if (err) {
          console.log("Error reading file from disk:", err);
          return;
        }
        try {
          const projects = JSON.parse(JSON.stringify(jsonString))
          let end_point = pageNumber * pageSize;
          let starting_point =  end_point - pageSize;
          const OBJ = JSON.parse(projects)
          OBJ.data.forEach((values,index)=>{
            current_index = index;
            if(starting_point == current_index && starting_point < end_point){
                pageArray.push(values)
                starting_point += 1
            }
          });
          res.status(200).send(pageArray)
        } catch (err) {
          console.log("Error parsing JSON string:", err);
        }
    });
})
app.get('/fetch-certificates',(req,res)=>{
    pageSize = Number(req.query.pageSize);
    pageNumber = Number(req.query.pageNumber);
    pageArray = [];
    fs.readFile("services/certificates.json", "utf-8", (err, jsonString) => {
        if (err) {
          console.log("Error reading file from disk:", err);
          return;
        }
        try {
          const projects = JSON.parse(JSON.stringify(jsonString))
          let end_point = pageNumber * pageSize;
          let starting_point =  end_point - pageSize;
          const OBJ = JSON.parse(projects)
          OBJ.data.forEach((values,index)=>{
            current_index = index;
            if(starting_point == current_index && starting_point < end_point){
                pageArray.push(values)
                starting_point += 1
            }
          });
          res.status(200).send(pageArray)
        } catch (err) {
          console.log("Error parsing JSON string:", err);
        }
    });
});


app.post('/send',async (req,res)=>{
  const {name,email,subject,message} = req.body;
  const regex = /\d/; // has number in name
  const validEmail = validator.validate(email);
  const invalidName = regex.test(name);
  if(!validEmail || invalidName){
      res.status(200).redirect(`/?success=false`)
  }
  else{
      const Txtmessage = `
          From ${name}, ${message}, his/her mailing address is ${email}.
      `;
      const HTMLmessage =   `
          <p style='font-weight:bold'>FROM: ${name}</p>
              <br>
              <p> ${message} </p>
              <br>
          <p>From: ${email}</p>
      `;
      let mailDetails = {
          from: email,
          to: "jhicer@gmail.com",
          sender: email,
          subject: `RESUME NOTIFICATION [${subject}]`,
          text:  Txtmessage,
          html: HTMLmessage
      };
      try{
          await nodemailer.mailTransporter.sendMail(mailDetails,(err,data)=>{
              if (err) {
                  res.status(500).redirect(`/?success=false`)
                  console.log("Error Occurs");
                  console.log(err)
              } else {
                  res.status(200).redirect(`/?success=true`)
                  console.log("Email sent successfully");
                  console.log(data)
              }
          });
      }
      catch(err){
          res.status(200).redirect(`/?success=false`)
      }
  }
  
})

app.listen(port,'0.0.0.0',()=>{
    console.log("Listening on port: ", port);
});
