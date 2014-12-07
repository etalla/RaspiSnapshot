var camera, createCamera;

var fs = require('fs');
if (fs.existsSync('/tmp/snowsnap/snapshot.jpg'){
	fs.unlinkSync('/tmp/snowsnap/snapshot.jpg');
};

createCamera = require('./camera').createCamera;

camera = createCamera({
  imageDirectory: process.env.IMAGE_DIRECTORY || '/tmp/snowsnap/',
  timezone: process.env.TIMEZONE || 'UTC',
  resolution: process.env.RESOLUTION || '1280x720',
  device: process.env.VIDEO_DEVICE || '/dev/video0'
});

camera.takeSnapshot();

var sensor = require('ds18x20');
var temperature = sensor.get(sensor.list()[0]);

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'snowsnap007@gmail.com',
        pass: 'suavemente'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Snow Snap ✔ <snowsnap007@gmail.com>', // sender address
    to: 'eva.tallaksen@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: temperature, // plaintext body
    html: '<b>Hello world ✔</b>', // html body
	attachments: [{
        filename: 'snapshot.jpg',
        path: '/tmp/snowsnap/snapshot.jpg',
    }]
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});