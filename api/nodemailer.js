const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config()
let transport = {
            service: "gmail",
            logger: true,
            debug: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        };
let mailTransporter = nodemailer.createTransport(
                                smtpTransport(transport)        
                        );
module.exports = {mailTransporter};