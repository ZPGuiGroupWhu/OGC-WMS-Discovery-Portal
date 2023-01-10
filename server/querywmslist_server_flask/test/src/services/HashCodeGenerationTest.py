import requests
import base64
import json
import time
import string

def image_base64_decode_test():
    url = "http://127.0.0.1:5000/imageBase64Decode"
    image_paths = ["./../../data/61.jpg", "./../../data/62.jpg"]
    data = []
    for image_path in image_paths:
        f = open(image_path, 'rb')
        base64Str = str(base64.b64encode(f.read()), 'utf-8')
        f.close()
        data.append(base64Str)

    headers = {"Content-Type": "application/json"}

    # print(json.dumps(data))
    time0 = time.time()
    r1 = requests.post(url, headers=headers, data=json.dumps(data))
    print(time.time() - time0)
    print(r1.status_code)
    # print(json.loads(r1.content))


def get_hashcodes_test():
    url = "http://127.0.0.1:8081/hashcodes"
    image_paths = ["./../../data/61.jpg", "./../../data/62.jpg"]
    # image_paths = list(filter(lambda x: x.endswith("jpg"), os.listdir("./../data/")))
    # image_paths = ["./../data/" + x for x in image_paths][2:3]
    print(image_paths)
    images = []
    for image_path in image_paths:
        f = open(image_path, 'rb')
        base64Str = str(base64.b64encode(f.read()), 'utf-8')
        f.close()
        images.append(base64Str)

    headers = {"Content-Type": "application/json"}
    # print(images)
    data = {'images': json.dumps(images)}
    # print(json.dumps(data))
    # print(json.dumps(data))
    time0 = time.time()
    r1 = requests.post(url, headers=headers, json=data)
    print(time.time() - time0)
    print(r1.status_code)
    print(r1.content)
    result = json.loads(r1.content)
    for tmp_hashcode in result:
        print(tmp_hashcode)


def query_layer_by_uploaded_template_test():
    url = "http://127.0.0.1:8081/search/queryLayerByUploadedTemplate"
    image_paths = ["./../../data/61.jpg"]
    # image_paths = list(filter(lambda x: x.endswith("jpg"), os.listdir("./../data/")))
    # image_paths = ["./../data/" + x for x in image_paths][2:3]
    print(image_paths)
    images = []
    for image_path in image_paths:
        f = open(image_path, 'rb')
        base64Str = str(base64.b64encode(f.read()), 'utf-8')
        f.close()
        images.append(base64Str)

    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    # print(images)
    data = {'images': json.dumps(images),
            'sessionID': '5a6c03a929ff48e8befb8a09e80d7fc4',
            'pageNum': 1,
            'pageSize': 10,
            'photoType': 'Base64Str'}
    # print(json.dumps(data))
    # print(json.dumps(data))
    time0 = time.time()
    r1 = requests.post(url, headers=headers, json=data)
    print(time.time() - time0)
    print(r1.status_code)
    # print(r1.content)
    result = json.loads(r1.content)
    for tmp_key in result:
        print(tmp_key, result[tmp_key])


def testsearchByIntentionID():
    url = "http://127.0.0.1:8081/search/queryLayerByMDL"
    headers = {"Content-Type": "application/json"}


    # data = {
    #     'sessionID':' ',
    #     'layers': '{\"irrelevance\": [2292,2292,2292], \"relevance\":[454,454,454]}',
    #     'parameter': '{\"random_merge_number\":50,\"rule_covered_positive_sample_rate_threshold\":0.3}',
    #     'pageNum': 1,
    #     'pageSize': 10,
    #     'photoType': ' '}
    data = {
        'sessionID': ' ',
        'layers': {"irrelevance": [454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454,454],
                   "relevance":[2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292,2292]},
        'parameter': {"random_merge_number":50,"rule_covered_positive_sample_rate_threshold":0.3},
        'pageNum': 1,
        'pageSize': 10,
        'photoType': ' '}
    r1 = requests.post(url, headers=headers, json=data)
    result = json.loads(r1.content)
    for tmp_key in result:
        print(tmp_key, result[tmp_key])


def testsearchByIntention():
    url = "http://127.0.0.1:8081/search/queryLayerByIntention"
    headers = {"Content-Type": "application/json"}
    file_object = open(r"G:\1文档\地图检索意图识别\系统开发\intentionResult2022.2.23.json")
    all_the_text = file_object.read()

    arr = json.loads(all_the_text)
    file_object.close()

    data = {
        'sessionID': '',
        'intention': [{"confidence":100,"content":["lake"],"location":[],"style":[],"topic":[]},{"confidence":100,"content":["tree"],"location":[],"style":[],"topic":[]}],
        'pageNum': 1,
        'pageSize': 10,
        'photoType': ' '}
    r1 = requests.post(url, headers=headers, json=data)
    result = json.loads(r1.content)
    for tmp_key in result:
        print(tmp_key, result[tmp_key])

if __name__ == '__main__':
    # image_base64_decode_test()
    # get_hashcodes_test()
#query_layer_by_uploaded_template_test()
    testsearchByIntentionID()
    #testsearchByIntention()
