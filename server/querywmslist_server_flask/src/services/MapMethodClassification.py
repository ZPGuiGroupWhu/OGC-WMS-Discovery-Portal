import json
import os.path
import time
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.models import Model
from tensorflow.keras import backend
from tensorflow.keras.applications.vgg19 import preprocess_input
import base64
import cv2
import numpy as np

from werkzeug.exceptions import abort

model_path = os.path.expanduser('~') + "/gsv/models/Type_model3.h5"
vgg19_model = load_model(model_path)
# 将模型作为一个层，输出第7层的输出，输出参数
layer_model = Model(inputs=vgg19_model.input, outputs=vgg19_model.layers[22].output)
IMAGE_SIZE = 224

app = Flask(__name__)


@app.route("/process/getImageMapMethod", methods=['POST'])
def getMapMethod():
    if request.method != 'POST':
        abort(400)
    else:
        data = request.get_data(as_text=True)
        images = json.loads(data)
        result = []
        for tmp_image in images:
            # print(tmp_image)
            # time01 = time.time()
            tmp_image_id, tmp_base64Str = tmp_image
            image_data = base64.b64decode(tmp_base64Str)

            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            # cv2.imshow("image", image)
            # cv2.waitKey()

            # tmp_image_id, tmp_image_data = tmp_image
            # image = np.array(tmp_image_data, np.uint8)

            # time02 = time.time()
            # print(time02 - time01)

            # time0 = time.time()
            image_vgg19 = cv2.resize(image, (IMAGE_SIZE, IMAGE_SIZE))
            x = backend.expand_dims(image_vgg19, axis=0)
            # 需要被预处理下
            x = preprocess_input(x)
            # 数据预测
            # time1 = time.time()
            y = vgg19_model.predict(x, steps=1)
            map_method_id = int(backend.eval(backend.argmax(y))[0])
            # time2 = time.time()
            deep_feature = layer_model.predict(x)[0].tolist()
            # print([tmp_image_id, map_method_id, deep_feature])
            result.append([tmp_image_id, map_method_id, deep_feature])
            # time3 = time.time()
            # print(time1 - time0, time2 - time1, time3 - time2)
        return jsonify(result)


if __name__ == '__main__':
    app.run('127.0.0.1', 5001, threaded=True)
