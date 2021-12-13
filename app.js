const express = require('express');
const fs = require("fs");
const nodemailer = require('./api/nodemailer');
const validator = require('email-validator');
const information = require('./services/information');
const { json } = require('express/lib/response');
require('dotenv').config()

const app = express();

/* MIDDLE WARE */

app.use(express.json());
app.use(express.static('views'));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
const port = process.env.PORT || 5500;
const module_references = information.references();
const module_skills = information.skills();

app.get('/',(req,res)=>{
  const tmp = [];
  const sk = JSON.parse(JSON.stringify(module_skills));
  const ref = JSON.parse(JSON.stringify(module_references));
  try {
      const sk_tmp = JSON.parse(sk);
      const ref_tmp = JSON.parse(ref);
      res.render('index',{skills:sk_tmp,references:ref_tmp});
  }catch (err) {
          console.log("JSON File is empty or missing", err);
  }
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
              }
          });
      }
      catch(err){
          res.status(200).redirect(`/?success=false`)
      }
  }
  
})

app.listen(port,()=>{
    console.log("Listening on port: ", port);
});
