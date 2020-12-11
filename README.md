## 使用

index.js同级目录下创建一个`config.json`, 里面填入账号以及密码

> 例子

``` json
{
  "userInfo": [
    {
      "username": "31701000",
      "password": "123321"
    },
    {
      "username": "31701001",
      "password": "123321"
    },
    {
      "username": "31701002",
      "password": "123321"
    }
  ]
}
```

### 微信通知
[Server酱](http://sc.ftqq.com/3.version)获取 SCKEY

拿到的 SCKEY 填入配置中

``` json
{
  "userInfo": [
    {
      "username": "31701000",
      "password": "123321",
      "SCKEY": "TESTTESTTEST"
    },
    {
      "username": "31701001",
      "password": "123321"
    },
    {
      "username": "31701002",
      "password": "123321"
    }
  ]
}

```


### 定时任务运行

在配置中填入要打卡的时间点, hour 和 minute 对应每天的几点几分进行打卡, 不填写默认每天10点整运行
``` json
{
  "userInfo": [],
  "hour": 10,
  "minute": 0
}

```


``` bash
node index.js

```

### 立即运行

立即运行, 直接进行打卡
``` bash
node index.js --start
```

## 如果要后台运行的话建议安装pm2
``` bash
yarn global add pm2
pm2 start index.js
```


## TODO
- [x] 定时任务
- [ ] 自定义选项配置
- [ ] 选项变更后邮件提醒