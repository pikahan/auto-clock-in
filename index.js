const childProcess = require('child_process');
const config = require('./config');
const schedule = require("node-schedule");
const axios = require('axios');
const rule = new schedule.RecurrenceRule();
const task = () => {
  for (let i = 0; i < config.userInfo.length; i++) {
    const userData = config.userInfo[i]
    const child = childProcess.fork(__dirname + '/server.js', [userData.username, userData.password]);
    child.send('start');
    child.on('message', msg => {
      const SCKEY = userData.SCKEY || config.SCKEY || null;
      if (SCKEY) {
        axios.get(`https://sc.ftqq.com/${SCKEY}.send`, {
          params: {
            text: msg,
          }
        }).then(() => {
          child.disconnect();
        })
      } else {
        child.disconnect()
      }
    })
  }
}

if (process.argv[2] === '--start') { // 立即执行
  task();
} else {
  rule.dayOfWeek = [new schedule.Range(0, 6)];
  rule.hour = typeof config.hour === 'undefined' ? 10 : config.hour;
  rule.minute = typeof config.minute === 'undefined' ? 0 : config.minute;
  schedule.scheduleJob(rule, () => {
    task();
  })
}

