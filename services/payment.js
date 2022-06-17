var amqp = require('amqplib/callback_api');

function sendMensage(channel, queue) {
  const now = new Date()

  var msg = {
    from: '<joaosipauba@hotmail.com>',
    to: 'CROWOFCODE@gmail.com',
    subject: 'Testing RabbitMQ with MicroServices',
    text: 'This is a automatic message from RabbitMQ with MicroServices. Do not repply',
    html: "<b>Hello from microservices</b>",
  };

  msg = JSON.stringify(msg);

  channel.sendToQueue(queue, Buffer.from(msg));
  console.log(`${now.toUTCString()} - send message`);
}

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
      }
      
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
          }
          
        const queue = 'mail-queue';
    
        channel.assertQueue(queue, {
          durable: true
        });
        
        sendMensage(channel, queue)
        
        setTimeout(function() {
          connection.close();
          process.exit(0)
          }, 500);
    });

});
