## 使用

index同级目录下创建一个`config.json`, 里面填入账号以及密码

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

运行
``` bash
node index.js

```

如果要后台运行的话建议安装pm2
``` bash
yarn global add pm2
pm2 start index.js
```


## TODO
- [x] 定时任务
- [ ] 自定义选项配置
- [ ] 选项变更后邮件提醒