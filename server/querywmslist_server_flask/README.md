
实现了基于制图方法分类与深度特征提取接口及哈希码生成接口，为querywmslist_server提供算法支撑

部署时需要将制图方法分类模型文件（Type_model3.h5）放在"${user.home}/gsv/models"目录中，其中"${user.home}"为用户目录，如Windows中的"C:\Users\XXX"，linux下的"/home/XXX"