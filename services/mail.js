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


amqp.connect('amqp://localhost', (error0, connection) => {
  connection.createChannel((error1, channel) => {
    var queue = 'mail-queue';

    channel.prefetch(1);
    channel.assertQueue(queue, {
      durable: true
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
    
        return info
    }
    
    const processMessage = async (msg) => {
      try {
        await sendMail(JSON.parse(msg.content.toString()));
        channel.ack(msg);
      } catch(error) {
        channel.reject(msg)
        console.error(error);
      }
    }
    channel.consume(queue, processMessage, {
        noAck: false
    });
  });
});
