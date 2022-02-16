import requests
import base64
import json
import time


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

    headers = {"Content-Type": "application/json"}
    # print(images)
    data = {'images': json.dumps(images),
            'sessionID': '5a6c03a929ff48e8befb8a09e80d7fc4',
            'pageNum': 1,
            'pageSize': 2}
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


if __name__ == '__main__':
    # image_base64_decode_test()
    # get_hashcodes_test()
    query_layer_by_uploaded_template_test()
