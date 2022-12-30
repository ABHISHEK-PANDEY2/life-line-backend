const express = require("express");
const router = express.Router();
const User = require("../model/user");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

app.use(express.json());

async function sendMail(data,patientDetails){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "abhishekpandey3188@gmail.com",
          pass: "tlmxntmjvasyjigb",
        },
      });
      console.log(data);
      const mailDetails = await transporter.sendMail({
        from: '"Life Line" <abhishekpandey3188@gmail.com>', 
        to: data.email,
        subject: `🚨 Urgent requirement of ${data.type} ${(data.organ.toLowerCase() === "blood")? "blood":null } 🚨`, 
        text: `Urgent requirement of ${data.organ}`,
        html: `<b>Hello</b><br> We are from <b>Life Line</b> an organization which helps critical patients in need of an organ , And such a patient needs help right now from your hospital, Here are the contact details and requested organ details if you could help in any way possible then please contact the patient.<br/><br/>
            <p>
               <h3><b>Patient Details</b></h3>
               Name: ${patientDetails.name}<br/>
               Age: ${patientDetails.age}<br/>
               Gender: ${patientDetails.gender}<br/>
               Contact Email: ${patientDetails.email}<br/>
               Contact Phone Number: ${patientDetails.phNum}<br/>
            </p>   
               `,
      });

      console.log("Message sent: %s", mailDetails.messageId);
}

router.post("/organRequest",async(req,res) => {
    const token = req.headers.token;
    const data = req.body;
    let patient;
    const decode = jwt.verify(token,"secretjwtkey",(err,data) => {
        if(err){
            console.log(err);
        }
        else{
            patient = data.obj;
        }
    })
    sendMail(data,patient).catch((e) => console.log(e));
    const patientUpdated = await User.updateOne({_id : patient._id},{$set:{phNum : 9454884456}});
})

module.exports = router;