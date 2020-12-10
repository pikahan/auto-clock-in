const childProcess = require('child_process')
const config = require('./config')

for (let i = 0; i < config.userInfo.length; i++) {
  const userData = config.userInfo[i]
  childProcess.fork(__dirname + '/server.js', [userData.username, userData.password])
}