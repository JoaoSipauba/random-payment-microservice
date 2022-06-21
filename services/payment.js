const express = require('express');
var amqp = require('amqplib/callback_api');

const app = express();

app.use(express.json());

const router = express.Router();

router.post('/payment', (req, res) => {
  const { to, subject, text, html } = req.body;

  amqp.connect('amqp://localhost', function(error0, connection) {
    connection.createChannel(function(error1, channel) {
      const queue = 'mail-queue';
  
      channel.assertQueue(queue, {
        durable: true
      });
      
      const now = new Date()

      var msg = {
        from: '<joaosipauba@hotmail.com>',
        to,
        subject,
        text,
        html,
      };

      msg = JSON.stringify(msg);

      channel.sendToQueue(queue, Buffer.from(msg));
      res.status(200).send(`${now.toUTCString()} - message sent to queue`);
    });
  });
});

app.use(router);

app.listen(3333, () => console.log('Service running on port 3333'));