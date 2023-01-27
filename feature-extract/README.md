### 恶意包特征  

#### 从单个包提取的特征

 <img src="./img/截屏2023-01-15 14.17.39.png"/>  

##### 特征来源

通过统计比较恶意样本和正常样本的差别

##### 详细解释
- 关注特征的位置，是在install hook中有还是在普通的文件中有
  - 普通文件在被导入使用时也会执行
- 特殊字符串
  - 个人信息
    - /etc/shadow
    - .bashrc
    - .zshrc
    - /etc/hosts
    - /etc/passwd
    - ping
    - aes
    - des
  - shell解释器
    - /bin/sh

- install hook访问网络
  - install hook中
    - curl http/https
    - 使用ping
    - 使用/dev/tcp/domain or ip/port
    - wget
    - host命令
  - 安装脚本文件中使用网络连接api
    - 使用http,https库
    - 邮件库nodemailer
    - 第三方库axios
    - 第三方库request
    - node-fetch
- 有install hook
  - package.json install preinstall postinstall
- install hook运行的文件
  - node *.js
    - *.js依赖其他文件，需要找出所有依赖的文件,区别自己编写的模块和第三方包
    - 考虑文件不存在的情况
  - 使用child_process执行其他的node.js文件
    - fork找出路径
    - 执行命令spawn根据node后面的文件确定js文件
    - **Todo: 代码没实现这点，可以作为优化点**
- 包含域名
  - 使用了dns官方库
  - 包含域名
- 访问文件系统
  - 使用fs，fs/promises，path、promise-fs库
- 字节字符串
  - 16进制字符串，统计出现次数?
    - \x开头，\x7c，注:无法使用ast匹配，会被解析为字符，使用正则表达式
- 从ascii数组创建buffer
  - Buffer.from([34,...])
- install hook执行恶意命令
  - shutdown关机命令
  - 访问设备
    - /dev/** */
  - 
- 补充
  - 使用加密函数crpyto
  - 使用压缩函数zlib
  - 使用os库的函数获得系统信息os.hostname()，os.userinfo等
  - 恶意包没有使用到hook，而是在js文件被导入使用时发生恶意行为

#### 特征为包版本间的差别

 <img src="./img/截屏2023-01-15%2014.18.08.png"/>

#### 问题

+ 安装脚本中使用了第三方包来进行恶意操作，如何检测这种行为?
+ knife有大量重复的样本
  + arm-**有大量重复，且版本都是99.10.9，恶意行为为窃取并发送隐私数据
+ 改变文件扩展名，js改成md --> 把node命令后面的文件作为js文件来分析
+ knife样本集中包含非恶意包，比如ca-bucky-client
+ package.json中的仓库url不准确
+ 异常情况的处理: install hook提供的js文件目录不对
+ 依赖的包是恶意的，源码没有包含恶意代码，加入对依赖包的检测?，案例event-stream
  + 注意:也属于恶意包
+ 注入攻击检测，案例event-stream
+ 如何检测使用代码混淆(打包和压缩，比如webpack，rollup等工具)的恶意包
  + 案例event-stream
+ 没有考虑ts文件

