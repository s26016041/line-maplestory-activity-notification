'use strict';
const result = require('dotenv').config();
if (result.error) throw result.error
const linebot = require('linebot');

const Express = require('express');
const BodyParser = require('body-parser');
const MaplestoryActivityNotification = require('./src/services/maplestoryActivityNotification.js');
// Line Channel info
const bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

const maplestoryActivityNotification = new MaplestoryActivityNotification(bot)

// const linebotParser="https://fresh-facts-give.loca.lt"
const app = Express();
app.post('/webhook', bot.parser());
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }));

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
// bot.on('message', function (event) {
//   console.log(event.message.text)


// });


bot.on('join', function (event) {
  event.reply(`歡迎使用楓之谷活動通知機器人`)
  if (event.source.type === 'group') {
    maplestoryActivityNotification.addGroup(event.source.groupId)
  }
});