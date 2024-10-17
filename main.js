'use strict';
const result = require('dotenv').config();
if (result.error) throw result.error

const linebot = require('linebot');
const Express = require('express');
const BodyParser = require('body-parser');

// Line Channel info
const bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LIEN_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

const linebotParser = bot.parser();
// const linebotParser="https://fresh-facts-give.loca.lt"
const app = Express();
// for line webhook usage
app.post('/linewebhook', linebotParser);

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

// a http endpoint for trigger broadcast
app.post('/broadcast', (req, res) => {
  bot.broadcast(req.body.message).then(() => {
    res.send('broadcast ok');
  }).catch(function (error) {
    res.send('broadcast fail');
  });
});

app.listen(3000);

// echo user message
bot.on('message', function (event) {
  // get user message from `event.message.text`
  // reply same message
  var replyMsg = `${event.message.text}\n${event.source.groupId}123`;
  const  targetGroupId=event.source.groupId
//   event.reply(replyMsg)
bot.push(targetGroupId, { 
    type: 'text', 
    text: replyMsg
  })
  .then(() => {
    console.log('Message sent to group successfully!');
  })
  .catch((error) => {
    console.error('Failed to send message:', error);
  });
});
