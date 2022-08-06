const { default: axios } = require('axios');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const message = require('./models/message')

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded());

// mongodb connection
mongoose.connect(process.env.MONGODB_URI, ()=>{
    console.log('connected to MongoDB...')
})

const TWILIO_SEND = `https://api.twilio.com/2010-04-01/Accounts/${process.env.ACCOUNT_SID}/Messages.json`

const PRIORITY_MAP = {
    "queued": 0,
    "send": 1,
    "delivered": 2,
    "read": 4,
    "failed": 5,
    "undelivered": 6
}

app.get('/health', (req, res)=>{
    res.json({
        success: true,
        message: 'All Good'
    })
})

app.post("/send", async(req,res)=>{
  const {to, text} = req.body
    //send
    const response = await axios.post(TWILIO_SEND, 
        new URLSearchParams({
        From:"whatsapp:+14155238886",
        To:`whatsapp:${to}`,
        Body: text
    }), {
        auth: {
            username: process.env.ACCOUNT_SID,
            password: process.env.AUTH_TOKEN
          }
        });
         // store message to db
        const messageObj = new message({
            sid: response.data.sid,
            to: response.data.to,
            from: response.data.from,
            text: response.data.body,
            status: response.data.status,
            direction: 'outgoing',
            createdAt: response.data.date_created,
            updatedAt: response.data.date_updated
            // StatusCallback: 'https://0a38-2409-4042-220d-3674-a986-ca6d-937a-c74f.in.ngrok.io'
         })

         const savedMessage = await messageObj.save()

        res.json({
            success: true,
            data: savedMessage,
            message: 'Message sent'
        })
})

app.post('/status_update', async (req, res)=>{
    const sid = req.body.MessageSid;
    const newStatus = req.body.MessageStatus;
    const msgFromDB = await message.findOne({
        sid: sid
    })
    if(!msgFromDB)
    {
        res.send({
            status: true
        });
    }

    const currentStatus = msgFromDB.status;

    if(PRIORITY_MAP[newStatus] > PRIORITY_MAP[currentStatus])
    {
        await message.updateOne({sid: sid}, {
            $set: {
                status: newStatus
            }
        })
    }

    res.send({
        status: true
    });
});

app.post('/receive', async(req, res)=>{
    console.log(req.body)
    // console.log(req.params)
    // console.log('message received')

    //store message to db
    const messageObj = new message({
        sid: req.body.SmsSid,
        to: req.body.to,
        from: req.body.from,
        text: req.body.body,
        status: req.body.SmsStatus,
        direction: 'incoming',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
        // StatusCallback: 'https://0a38-2409-4042-220d-3674-a986-ca6d-937a-c74f.in.ngrok.io'
     })
    await messageObj.save()

    res.send({
        status: true
    });
});

app.get('/allMessages', async(req, res)=>{
    const send = await message.find();
    res.send(send);
})

app.listen(PORT, ()=>{
    console.log('Server started on PORT', PORT)
})