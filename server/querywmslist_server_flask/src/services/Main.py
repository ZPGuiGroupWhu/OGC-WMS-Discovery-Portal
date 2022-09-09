from flask import request, Flask, jsonify

# import json
# from tensorflow.keras.models import load_model
# from tensorflow.keras.models import Model
# from tensorflow.keras import backend
# from tensorflow.keras.applications.vgg19 import preprocess_input
# import base64
# import cv2
# import numpy as np
# from werkzeug.exceptions import abort
# import matlab

import os
import sys

# # import MCPkg
# from querywmslist_server_flask.src.core import HashPkg

__dir__ = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.abspath(os.path.join(__dir__, "../")))

from src.services.ParTrans import ParTrans
from src.core import FeatureExtraction

import pymysql
from sqlalchemy import create_engine,Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# model_path = os.path.abspath(os.path.join(__dir__, "..\\")) + "\\core\\Type_model3.h5"
#
# vgg19_model = load_model(model_path)
# # 将模型作为一个层，输出第7层的输出，输出参数
# layer_model = Model(inputs=vgg19_model.input, outputs=vgg19_model.layers[22].output)
# IMAGE_SIZE = 224

# # mcInstance = MCPkg.initialize()
# generateHashInstance = HashPkg.initialize()
# gabor_filters = FeatureExtraction.build_filters()

app = Flask(__name__)
# 数据库url，使用需修改密码及数据库名！！！！！！！！！！！！！！！！！！！
DB_URI = "mysql+pymysql://root:123456@127.0.0.1:3306/wmsall_0705"
engine = create_engine(DB_URI)
# 创建ORM
Base = declarative_base(engine)
# 创建回话
session = sessionmaker(engine)()


class Layer(Base):
    __tablename__ = 'layerlist_for_intent'
    ID = Column(Integer, primary_key = True)
    FContent = Column(Text,unique = True)
    FSpace = Column(Text,unique = True)
    FTopic = Column(Text,unique = True)
    FStyle = Column(Text,unique = True)

    def __init__(self, ID, FContent, FSpace, Ftopic,Fstyle):
        self.ID = ID
        self.FContent = FContent
        self.FSpace = FSpace
        self.FTopic = Ftopic
        self.FStyle = Fstyle

    def __repr__(self):
        return '<Layer {}>'.format(self.ID)

# 模型映射到数据库中
Base.metadata.create_all()

@app.route("/process/recognizeIntention", methods=['POST'])
def recognizeIntention():

    try:

        # samples = request.json.get('layers')  # 正负反馈样本
        samplesID = request.json.get('layers')  # 正负反馈样本id
        clientPar = request.json.get("parameter")

        # 数据库获取数据，格式转换
        samples = {}
        samples["irrelevance"] = []
        samples["relevance"] = []
        for key,idlist in samplesID.items():
            for smpid in idlist:
                # 查询
                smp = session.query(Layer).get(smpid)
                # 格式重写
                samples[key].append({})
                samples[key][-1]["Theme"] = smp.FTopic.split(',')
                samples[key][-1]["MapMethod"] = smp.FStyle.split(',')
                samples[key][-1]["MapContent"] = smp.FContent.split(',')
                samples[key][-1]["Spatial"] = smp.FSpace.split(',')
                samples[key][-1]["Spatial"] = []
                for loc in smp.FSpace.split(','):
                    samples[key][-1]["Spatial"].append(loc.split('/')[-1])

        try:
            result, par = ParTrans(samples, clientPar)
            errCode = 0000
            reqMsg = "正确响应"
        except Exception as e:
            errCode = 1002
            reqMsg = "计算错误"

            if samples["irrelevance"] == []:
                errCode = 1004
                reqMsg = "负样本不能为空"

            result = []
            par = {}
            print(e)

    except Exception as e:
        errCode = 1004
        reqMsg = "数据错误"
        result = []
        par = {}
        print(e)

    return jsonify({'errCode': errCode, 'reqMsg': reqMsg, 'result': result,
                    'parameter': par})


# @app.route("/process/getImageMapMethod", methods=['POST'])
# def getMapMethod():
#     if request.method != 'POST':
#         abort(400)
#     else:
#         data = request.get_data(as_text=True)
#         images = json.loads(data)
#         result = []
#         for tmp_image in images:
#             # print(tmp_image)
#             # time01 = time.time()
#             tmp_image_id, tmp_base64Str = tmp_image
#             image_data = base64.b64decode(tmp_base64Str)
#
#             nparr = np.frombuffer(image_data, np.uint8)
#             image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#             image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
#             # cv2.imshow("image", image)
#             # cv2.waitKey()
#
#             # tmp_image_id, tmp_image_data = tmp_image
#             # image = np.array(tmp_image_data, np.uint8)
#
#             # time02 = time.time()
#             # print(time02 - time01)
#
#             # time0 = time.time()
#             image_vgg19 = cv2.resize(image, (IMAGE_SIZE, IMAGE_SIZE))
#             x = backend.expand_dims(image_vgg19, axis=0)
#             # 需要被预处理下
#             x = preprocess_input(x)
#             # 数据预测
#             # time1 = time.time()
#             y = vgg19_model.predict(x, steps=1)
#             map_method_id = int(backend.eval(backend.argmax(y))[0])
#             # time2 = time.time()
#             deep_feature = layer_model.predict(x)[0].tolist()
#             # print([tmp_image_id, map_method_id, deep_feature])
#             result.append([tmp_image_id, map_method_id, deep_feature])
#             # time3 = time.time()
#             # print(time1 - time0, time2 - time1, time3 - time2)
#         return jsonify(result)
#
# @app.route("/process/imageBase64Decode", methods=['POST'])
# def imageBase64Decode():
#     if request.method != 'POST':
#         abort(400)
#     else:
#         data = request.get_data(as_text=True)
#         imageBase64Strs = json.loads(data)
#         # print(imageBase64Strs)
#         result = []
#         for tmp_base64Str in imageBase64Strs:
#             # base64 decoding
#             tmp_image_data = base64.b64decode(tmp_base64Str)
#             nparr = np.frombuffer(tmp_image_data, np.uint8)
#             tmp_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#             # print(tmp_image.shape)
#             tmp_image = cv2.cvtColor(tmp_image, cv2.COLOR_BGR2RGB)
#             # print(tmp_image.shape)
#             tmp_image = tmp_image.tolist()
#             result.append(tmp_image)
#         return jsonify(result)
#
# mapMethodURL = "http://127.0.0.1:8090/process/getImageMapMethod"
#
# @app.route("/process/getImageHashcodes", methods=['POST'])
# def getHashCodes():
#     if request.method != 'POST':
#         abort(400)
#     else:
#         data = request.get_data(as_text=True)
#         images_data = json.loads(data)
#         classname = []
#         color = []
#         texture = []
#         shape = []
#         # time_mainpart_RG = 0
#         # time_mainpart = 0
#         # time_hist480 = 0
#         # time_gabor384 = 0
#         # time_deep_feature = 0
#         # print("len(images_data)", len(images_data))
#         for tmp_image_data in images_data:
#             # print(len(tmp_image_data))
#             # tmp_image, tmp_image_mainpart_MC = tmp_image_data
#             #
#             # tmp_image = np.array(tmp_image, np.uint8)
#             # tmp_mainpart_MC = np.array(tmp_image_mainpart_MC, np.uint8)
#
#             tmp_image_base64str, tmp_image_mainpart_MC_base64str, tmp_image_mainpart_RG_base64str = tmp_image_data
#
#             # base64 decoding
#             image_data = base64.b64decode(tmp_image_base64str)
#             nparr = np.frombuffer(image_data, np.uint8)
#             tmp_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#             # tmp_image = cv2.cvtColor(tmp_image, cv2.COLOR_BGR2RGB)
#             # cv2.imshow("tmp_image", tmp_image)
#             # cv2.waitKey()
#
#             mainpart_MC_data = base64.b64decode(tmp_image_mainpart_MC_base64str)
#             nparr2 = np.frombuffer(mainpart_MC_data, np.uint8)
#             tmp_mainpart_MC = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)
#             tmp_mainpart_MC = cv2.cvtColor(tmp_mainpart_MC, cv2.COLOR_BGR2GRAY)
#             tmp_mainpart_MC = FeatureExtraction.otsu(tmp_mainpart_MC)
#             # cv2.imshow("tmp_mainpart_MC", tmp_mainpart_MC)
#             # cv2.waitKey()
#
#             mainpart_RG_data = base64.b64decode(tmp_image_mainpart_RG_base64str)
#             nparr3 = np.frombuffer(mainpart_RG_data, np.uint8)
#             tmp_mainpart_RG = cv2.imdecode(nparr3, cv2.IMREAD_COLOR)
#             # tmp_mainpart_RG = cv2.cvtColor(tmp_mainpart_RG, cv2.COLOR_BGR2GRAY)
#             # cv2.imshow("tmp_mainpart_RG", tmp_mainpart_RG)
#             # cv2.waitKey()
#             # print(tmp_image)
#             # print(tmp_mainpart_MC)
#
#             # time0 = time.time()
#             # get image main part by RG
#             # tmp_mainpart_RG = FeatureExtraction.regionGrow(tmp_image)
#
#             # time1 = time.time()
#             # get main part
#             mainpart = FeatureExtraction.get_image_mainpart(tmp_image, tmp_mainpart_MC, tmp_mainpart_RG)
#             # cv2.imshow("mainpart", mainpart)
#             # cv2.waitKey()
#
#             # time2 = time.time()
#             # get color feature
#             hist480 = FeatureExtraction.get_hist480(tmp_image, mainpart).tolist()
#             color.append(hist480)
#             # print(hist480)
#
#             # time3 = time.time()
#             # get gabor
#             gabor384 = FeatureExtraction.get_gabor384(tmp_image, gabor_filters, mainpart).tolist()
#             texture.append(gabor384)
#             # print(gabor384)
#
#             # time4 = time.time()
#             # get map method and deep feature
#             headers = {"Content-Type": "application/json"}
#             # data = [[0, tmp_image.tolist()]]
#             data = [[0, tmp_image_base64str]]
#             # print(data)
#             r1 = requests.post(mapMethodURL, headers=headers, data=json.dumps(data))
#             if r1.status_code != 200:
#                 abort(500)
#             else:
#                 tmp_image_id, tmp_map_method_id, tmp_deep_feature = json.loads(r1.content)[0]
#                 classname.append([tmp_image_id, tmp_map_method_id])
#                 shape.append(tmp_deep_feature)
#
#             # time5 = time.time()
#             # time_mainpart_RG += time1 - time0
#             # time_mainpart += time2 - time1
#             # time_hist480 += time3 - time2
#             # time_gabor384 += time4 - time3
#             # time_deep_feature += time5 - time4
#
#         # time6 = time.time()
#         # print(classname)
#         # print(color)
#         # print(texture)
#         # print(shape)
#         # get hashcode
#         tmp_hashcodes = generateHashInstance.generateHashCodeOnline(matlab.double(classname),
#                                                                    matlab.double(color),
#                                                                    matlab.double(texture),
#                                                                    matlab.double(shape), nargout=1)
#         tmp_hashcodes = [[int(x) for x in y] for y in tmp_hashcodes]
#         # print(tmp_hashcodes)
#
#         # time7 = time.time()
#         # time_get_hashcode = time7 - time6
#
#         # print("time_mainpart_RG", time_mainpart_RG)
#         # print("time_mainpart", time_mainpart)
#         # print("time_hist480", time_hist480)
#         # print("time_gabor384", time_gabor384)
#         # print("time_deep_feature", time_deep_feature)
#         # print("time_get_hashcode", time_get_hashcode)
#
#         return jsonify(tmp_hashcodes)


if __name__ == '__main__':
    app.run('127.0.0.1', 8090, threaded=True)


# pyinstaller -F D:\documents\PycharmProjects\server\server\querywmslist_server_flask\src\services\Main.py
# pyi-makespec D:\documents\PycharmProjects\server\server\querywmslist_server_flask\src\services\Main.py
# pyinstaller Main.spec
