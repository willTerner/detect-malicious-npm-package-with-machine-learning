### 训练集

+ knife中公有1530个不同名称的恶意包

### 处理特征文件
+ averageBracketNumber可能为NaN, 因为jsFiles number可能为0

### 训练
+ RF
  + 不需要缩放，表现好
+ MLP
  + 需要缩放，采取Standard
  + activation取logistic
  + max_iter要取大，400
+ SVM
  + 表现差于MLP
  + c取1.611045328589775
  + gramma_val取scale
  + 预处理方法取标准化
+ NB
  + smoothing取1e-9
  + 预处理方法取标准化
  
1. 交叉训练评估-四重
2. 使用不同分类器，取交集作为结果
3. 训练模型
   + 四个预处理方法
     + standardlize，Min-max-scale等数据转化
   + 三个超采样方法（论文中表现不好）
   + 三个特征加权方法方法，权重Bone, t-SNE, PCA, and Spearman Correlation(论文中没有优化?)
   + 机器学习专用超参数
4. 根据置信度选择最有可能的N，调节N的个数，而不是依赖算法直接给的分析
5. 首先不去重，然后去重恶意样本，对比分析
   + 判断标准，不考虑名称，品牌劫持，tgz大小相差在20个字节，其他一样为相同，最小5062
