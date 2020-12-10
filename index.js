const childProcess = require('child_process')
const config = require('./config')
const schedule = require("node-schedule");

const rule = new schedule.RecurrenceRule();

const task = () => {
  for (let i = 0; i < config.userInfo.length; i++) {
    const userData = config.userInfo[i]
    childProcess.fork(__dirname + '/server.js', [userData.username, userData.password])
  }
}

rule.dayOfWeek = [new schedule.Range(0, 6)];
rule.hour = 10;
rule.minute = 0;
schedule.scheduleJob(rule, () => {
  task();
})