import base64
import json
# import time

import HashPkg
#import MCPkg
import cv2
import matlab
import requests
from flask import Flask, request, jsonify
import numpy as np

from werkzeug.exceptions import abort

from querywmslist_server_flask.src.core import FeatureExtraction

# mcInstance = MCPkg.initialize()
generateHashInstance = HashPkg.initialize()
gabor_filters = FeatureExtraction.build_filters()
mapMethodURL = "http://127.0.0.1:5001/process/getImageMapMethod"

app = Flask(__name__)


@app.route("/process/imageBase64Decode", methods=['POST'])
def imageBase64Decode():
    if request.method != 'POST':
        abort(400)
    else:
        data = request.get_data(as_text=True)
        imageBase64Strs = json.loads(data)
        # print(imageBase64Strs)
        result = []
        for tmp_base64Str in imageBase64Strs:
            # base64 decoding
            tmp_image_data = base64.b64decode(tmp_base64Str)
            nparr = np.frombuffer(tmp_image_data, np.uint8)
            tmp_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            # print(tmp_image.shape)
            tmp_image = cv2.cvtColor(tmp_image, cv2.COLOR_BGR2RGB)
            # print(tmp_image.shape)
            tmp_image = tmp_image.tolist()
            result.append(tmp_image)
        return jsonify(result)


@app.route("/process/getImageHashcodes", methods=['POST'])
def getHashCodes():
    if request.method != 'POST':
        abort(400)
    else:
        data = request.get_data(as_text=True)
        images_data = json.loads(data)
        classname = []
        color = []
        texture = []
        shape = []
        # time_mainpart_RG = 0
        # time_mainpart = 0
        # time_hist480 = 0
        # time_gabor384 = 0
        # time_deep_feature = 0
        # print("len(images_data)", len(images_data))
        for tmp_image_data in images_data:
            # print(len(tmp_image_data))
            # tmp_image, tmp_image_mainpart_MC = tmp_image_data
            #
            # tmp_image = np.array(tmp_image, np.uint8)
            # tmp_mainpart_MC = np.array(tmp_image_mainpart_MC, np.uint8)

            tmp_image_base64str, tmp_image_mainpart_MC_base64str, tmp_image_mainpart_RG_base64str = tmp_image_data

            # base64 decoding
            image_data = base64.b64decode(tmp_image_base64str)
            nparr = np.frombuffer(image_data, np.uint8)
            tmp_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            # tmp_image = cv2.cvtColor(tmp_image, cv2.COLOR_BGR2RGB)
            # cv2.imshow("tmp_image", tmp_image)
            # cv2.waitKey()

            mainpart_MC_data = base64.b64decode(tmp_image_mainpart_MC_base64str)
            nparr2 = np.frombuffer(mainpart_MC_data, np.uint8)
            tmp_mainpart_MC = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)
            tmp_mainpart_MC = cv2.cvtColor(tmp_mainpart_MC, cv2.COLOR_BGR2GRAY)
            tmp_mainpart_MC = FeatureExtraction.otsu(tmp_mainpart_MC)
            # cv2.imshow("tmp_mainpart_MC", tmp_mainpart_MC)
            # cv2.waitKey()

            mainpart_RG_data = base64.b64decode(tmp_image_mainpart_RG_base64str)
            nparr3 = np.frombuffer(mainpart_RG_data, np.uint8)
            tmp_mainpart_RG = cv2.imdecode(nparr3, cv2.IMREAD_COLOR)
            # tmp_mainpart_RG = cv2.cvtColor(tmp_mainpart_RG, cv2.COLOR_BGR2GRAY)
            # cv2.imshow("tmp_mainpart_RG", tmp_mainpart_RG)
            # cv2.waitKey()
            # print(tmp_image)
            # print(tmp_mainpart_MC)

            # time0 = time.time()
            # get image main part by RG
            # tmp_mainpart_RG = FeatureExtraction.regionGrow(tmp_image)

            # time1 = time.time()
            # get main part
            mainpart = FeatureExtraction.get_image_mainpart(tmp_image, tmp_mainpart_MC, tmp_mainpart_RG)
            # cv2.imshow("mainpart", mainpart)
            # cv2.waitKey()

            # time2 = time.time()
            # get color feature
            hist480 = FeatureExtraction.get_hist480(tmp_image, mainpart).tolist()
            color.append(hist480)
            # print(hist480)

            # time3 = time.time()
            # get gabor
            gabor384 = FeatureExtraction.get_gabor384(tmp_image, gabor_filters, mainpart).tolist()
            texture.append(gabor384)
            # print(gabor384)

            # time4 = time.time()
            # get map method and deep feature
            headers = {"Content-Type": "application/json"}
            # data = [[0, tmp_image.tolist()]]
            data = [[0, tmp_image_base64str]]
            # print(data)
            r1 = requests.post(mapMethodURL, headers=headers, data=json.dumps(data))
            if r1.status_code != 200:
                abort(500)
            else:
                tmp_image_id, tmp_map_method_id, tmp_deep_feature = json.loads(r1.content)[0]
                classname.append([tmp_image_id, tmp_map_method_id])
                shape.append(tmp_deep_feature)

            # time5 = time.time()
            # time_mainpart_RG += time1 - time0
            # time_mainpart += time2 - time1
            # time_hist480 += time3 - time2
            # time_gabor384 += time4 - time3
            # time_deep_feature += time5 - time4

        # time6 = time.time()
        # print(classname)
        # print(color)
        # print(texture)
        # print(shape)
        # get hashcode
        tmp_hashcodes = generateHashInstance.generateHashCodeOnline(matlab.double(classname),
                                                                   matlab.double(color),
                                                                   matlab.double(texture),
                                                                   matlab.double(shape), nargout=1)
        tmp_hashcodes = [[int(x) for x in y] for y in tmp_hashcodes]
        # print(tmp_hashcodes)

        # time7 = time.time()
        # time_get_hashcode = time7 - time6

        # print("time_mainpart_RG", time_mainpart_RG)
        # print("time_mainpart", time_mainpart)
        # print("time_hist480", time_hist480)
        # print("time_gabor384", time_gabor384)
        # print("time_deep_feature", time_deep_feature)
        # print("time_get_hashcode", time_get_hashcode)

        return jsonify(tmp_hashcodes)


if __name__ == '__main__':
    app.run('127.0.0.1', 5000)






