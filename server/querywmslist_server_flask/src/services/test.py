import os
from gevent import monkey
monkey.patch_all()
from flask import Flask, request
from gevent import pywsgi as wsgi
import tensorflow as tf

os.environ["CUDA_VISIBLE_DEVICES"] = "" #不使用GPU
a = tf.placeholder(tf.int32, shape=(), name="input")
asquare = tf.multiply(a, a, name="output")
sess = tf.Session()  # 创建tensorflow session，也可以在这里载入tensorflow模型

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello World'

@app.route('/hello', methods=['GET','POST'])
def response_request():
    num = request.args.get('num')
    for i in range (100):
        ret = sess.run([asquare], feed_dict={a: num})  #运行tensorflow模型
    return str(ret)

if __name__ == "__main__":
    # server = wsgi.WSGIServer(('127.0.0.1', 19877), app)
    # server.serve_forever()
    app.run(host="127.0.0.1", port=8888, threaded=True)
