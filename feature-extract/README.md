#### 配置

使用时node版本不能低于16!!!，否则会报错架构不对
commons.ts 中 should_use_console_log 控制是否输出信息

### 恶意包特征

#### 从单个包提取的特征

 <img src="./img/截屏2023-01-15 14.17.39.png"/>

##### 特征来源

通过统计比较恶意样本和正常样本的差别

##### 详细解释

- 关注特征的位置，是在 install hook 中有还是在普通的文件中有
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
  - shell 解释器
    - /bin/sh

- install hook 访问网络
  - install hook 中
    - curl http/https
    - 使用 ping
    - 使用/dev/tcp/domain or ip/port
    - wget
    - host 命令
  - 安装脚本文件中使用网络连接 api
    - 使用 http,https 库
    - 邮件库 nodemailer
    - 第三方库 axios
    - 第三方库 request
    - node-fetch
- 有 install hook
  - package.json install preinstall postinstall
- install hook 运行的文件
  - node \*.js
    - \*.js 依赖其他文件，需要找出所有依赖的文件,区别自己编写的模块和第三方包
    - 考虑文件不存在的情况
  - 使用 child_process 执行其他的 node.js 文件
    - fork 找出路径
    - 执行命令 spawn 根据 node 后面的文件确定 js 文件
    - **Todo: 代码没实现这点，可以作为优化点**
- 包含域名
  - 使用了 dns 官方库
  - 包含域名
- 访问文件系统
  - 使用 fs，fs/promises，path、promise-fs 库
- 字节字符串
  - 16 进制字符串，统计出现次数?
    - \x 开头，\x7c，注:无法使用 ast 匹配，会被解析为字符，使用正则表达式
- 从 ascii 数组创建 buffer
  - Buffer.from([34,...])
- install hook 执行恶意命令
  - shutdown 关机命令
  - 访问设备
    - /dev/\*\* \*/
  -
- Todo
  - 包含 IP 分为本地 IP 127.0.0.1 和非本地 IP 127.0.0.12
  - 细分 os（出现 os 不是 Node os 库的情况）
  - 排除常见的 install behavior
    - node-gyp
    - echo $string
    - npm run docs
  - eval 函数的参数如果是字符串，则将字符串作为代码分析
  - 恶意包没有使用到 hook，而是在 js 文件被导入使用时发生恶意行为
  - 在 install hook 中使用命令，比如 bash sh 执行脚本
  - 敏感库
    - net http2
  - 敏感函数、对象
    - Function

#### 特征为包版本间的差别

 <img src="./img/截屏2023-01-15%2014.18.08.png"/>

#### 问题

- 安装脚本中使用了第三方包来进行恶意操作，如何检测这种行为?
- knife 有大量重复的样本
  - arm-\*\*有大量重复，且版本都是 99.10.9，恶意行为为窃取并发送隐私数据
- **todo**: 改变文件扩展名，js 改成 md --> 把 node 命令后面的文件作为 js 文件来分析
- knife 样本集中包含非恶意包，比如 ca-bucky-client
- package.json 中的仓库 url 不准确
- 异常情况的处理: install hook 提供的 js 文件目录不对
- 依赖的包是恶意的，源码没有包含恶意代码，加入对依赖包的检测?，案例 event-stream
  - 注意:也属于恶意包
- 注入攻击检测，案例 event-stream
- 如何检测使用代码混淆(打包和压缩，比如 webpack，rollup 等工具)的恶意包
  - 案例 event-stream
- 没有考虑 ts 文件
- js 中的 babel，正则表达式无法分析大文件（阈值: 2MB），比如/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/momnet/2.28.0/package/moment.js，不过恶意代码文件一般不会这么大
- 通过命令下载恶意代码执行恶意代码，比如/Users/huchaoqun/Desktop/code/school-course/毕设/数据集/恶意数据集/knife/rrgod/1.0.0 下载 python 执行
  - 可以作为优化点

#### npm 包

分类

- 流行包：文件较多，包较大，提供一些功能
- 测试包：个人发布的一些测试学习用的包，文件较少，包较小，不提供功能接口
- 恶意包：第一次发布的恶意包和由正常包受到攻击后变成了恶意包
