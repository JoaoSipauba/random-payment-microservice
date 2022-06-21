const nodemailer = require('nodemailer');
var amqp = require('amqplib/callback_api');

var transporter = nodemailer.createTransport({
    host: "outlook.office365.com",
    port: 995,
    secure: true,
    service: "Outlook365",
    auth: {
        user: "joaosipauba@hotmail.com",
        pass: "amominhamae29",
    },
    tls: {
        ciphers:'SSLv3'
    }
});

function log(message) {
    var now = new Date()
    var log = `${now.toUTCString()} - ${message}`;

    console.log(log);
}

async function sendMail(msg) {
    let info = await transporter.sendMail({
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
    });

    log('Mail sent')
}

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'mail-queue';

    channel.assertQueue(queue, {
      durable: true
    });

    channel.consume(queue, async function(msg) {
        msg = JSON.parse(msg.content.toString());
        console.log(msg);
        try{
            await sendMail(msg);
        }
        catch(error){
            console.log(error);
        }
    }, {
        noAck: true
    });
  });
});
