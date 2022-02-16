import requests
import base64
import json
import time

if __name__ == '__main__':
    url = "http://127.0.0.1:5001//process/getImageMapMethod"
    image_path = "./../../data/61.jpg"
    image_id = int(image_path.split("/")[-1].split(".")[0])
    f = open(image_path, 'rb')
    base64Str = str(base64.b64encode(f.read()), 'utf-8')
    # image = base64.b64decode(base64Str)
    # print(image)
    # print(str(base64Str))
    f.close()
    headers = {"Content-Type": "application/json"}
    data = [[image_id, base64Str]]
    # print(json.dumps(data))
    time0 = time.time()
    r1 = requests.post(url, headers=headers, data=json.dumps(data))
    print(r1.status_code)
    print(json.loads(r1.content))
    print(time.time() - time0)
