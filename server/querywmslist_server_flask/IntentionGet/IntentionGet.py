from flask import request, Flask, jsonify
from ParTrans import ParTrans

app = Flask(__name__)

@app.route("/process/recognizeIntention", methods=['POST'])
def recognizeIntention():

    try:
        samples = request.json.get('layers')  # 正负反馈样本
        clientPar = request.json.get("parameter")

        try:
            result, par = ParTrans(samples, clientPar)
            errCode = 0000
            reqMsg = "正确响应"
        except Exception as e:
            errCode = 1002
            reqMsg = "计算错误"
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

if __name__ == '__main__':
    app.run()
