# 基于最小描述长度与随机合并策略的地图检索意图识别算法(MDL-RM)

* ### 项目介绍
  Python3实现的基于最小描述长度(Minimum Description Length Principle)准则与随机合并(Random Merge)策略的意图识别算法
  MDL-RM。
----
* ### 代码目录及文件介绍
```
|-- src
    |-- main    // 代码主体
        |-- Intention.py  // 版本信息
        |-- experience    // 实验代码
        |   |-- EvaluationIndex.py    // 评价指标计算
        |   |-- MDL_RM_Comparision_Experience.py    // 性能对比
        |   |-- MDL_RM_Effectiveness_Experience.py  // 随机合并策略有效性验证
        |   |-- MDL_RM_Feasibility_Experience.py    // 可行性验证
        |   |-- MDL_RM_Parameter_Sensibility_Experience.py    // 参数影响分析
        |   |-- MDL_RM_Result_Analysis.py   // 实验结果处理分析
        |   |-- MDL_RM_Sample_Adjusting_Experience.py   // 样本增强策略有效性
        |   |-- RuleGO_TuningHyperparameters_Experience.py    // RUleGO调参实验
        |-- intention_recognition
        |   |-- Config.py   // 参数设置
        |   |-- DTHF_Kinnunen2018.py    // 基准算法,基于决策树的DTHF算法
        |   |-- MDL_RM.py   // 本项目算法MDL-RM
        |   |-- RuleGO_Gruca2017.py   // 基准算法,基于频繁项集挖掘的RuleGO算法
        |-- samples   // 样本处理代码
        |   |-- generation    // 样本生成
        |   |-- input   // 样本输入与预处理
        |-- util    // 文件输入输出工具   
    |-- test    // 测试代码
|-- resources
    |-- samples   // 样本集相关概念
    |-- ontologies    // 本体概念从属关系,概念信息量等数据
```
----
* ### 项目依赖
  * 数据处理: numpy, pandas
  * 结果绘图: matplotlib, seaborn
  * Excel输出: openpyxl
----
