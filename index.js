const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];
const axios = require('axios');
const userInfo = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};
const task = async () => {
  const browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto('http://yqdj.zucc.edu.cn/feiyan_api/h5/html/daka/daka.html');

  let res = await page.evaluate((userInfo) => {
    const userNameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (!userInfo.password || !userInfo.username) {
      return { err: '请输入用户名或密码' }
    }
    userNameInput.value = userInfo.username;
    passwordInput.value = userInfo.password;
  }, userInfo);

  if (res && typeof res.err !== 'undefined') {
    console.error(res.err);
    await browser.close();
    return;
  }
  await Promise.all([
    page.click('.zj_btn'),
    page.waitForNavigation( { waitUntil: "networkidle2" } ),
  ]);
  res = await page.evaluate(() => {
    const list = document.querySelectorAll('.question-item.required');
    if (list.length === 0) {
      return {
        err: '打卡失败, 今天已经提交'
      };
    }
    let restList = [].slice.call(list, 2);
    // 目标所在地填充
    list[1].querySelector('input').value = '校内 校内 校内';

    restList.forEach(item => {
      const optionList = item.querySelectorAll('.option-item');
      let falsyOption = optionList[optionList.length-1].querySelector('input');
      if (falsyOption.value.indexOf('否') === -1) {

        // TODO: 校验功能
        falsyOption = optionList[0].querySelector('input');
      }
      falsyOption.checked = true;
    })
  })
  let ret = `账号: ${userInfo.username} `;
  if (res && typeof res.err !== 'undefined') {
    await browser.close()
    return ret + res.err;
  }

  await page.click('.content-block.submit-box');
  await browser.close();
}

(async () => {
  try {
    await task();
  } catch(e) {
    axios.post(`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${process.env.QWKEY}`, {
      msgtype: 'text',
      text: {
        content: `${process.env.USERNAME} 今日打卡失败 原因为${JSON.stringify(e)}`
      }
    }).then(() => {
      console.log('推送成功')
    }).catch((e) => {
      console.log('推送失败', JSON.stringify(e))
    })
  }
  axios.post(`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${process.env.QWKEY}`, {
    msgtype: 'text',
    text: {
      content: `${process.env.USERNAME} 今日打卡成功`
    }
  }).then(() => {
    console.log('推送成功')
  }).catch((e) => {
    console.log('推送失败', JSON.stringify(e))
  })
})();