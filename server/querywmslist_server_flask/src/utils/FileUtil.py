
import json
import pandas as pd


def save_as_json(data, path):
    data_json = json.dumps(data)
    data_file = open(path, "w+", encoding='utf-8')
    data_json.encode(encoding='utf-8')      # 进行UTF-8编码
    data_file.write(data_json)
    data_file.close()


def load_json(path):
    data_file = open(path, encoding='utf-8')
    data = json.load(data_file)
    data_file.close()
    return data


def save_as_csv(data, path):
    data_file = open(path, "w+", encoding='utf-8')
    for tmp_line_data in data:
        tmp_line_str = ",".join([str(x) for x in tmp_line_data]) + "\n"
        tmp_line_str.encode(encoding='utf-8')       # 进行UTF-8编码
        data_file.write(tmp_line_str)
    data_file.close()


def load_csv(path):
    data_file = open(path, encoding='utf-8')
    data = []
    for tmp_line_str in data_file.readlines():
        tmp_line_data = tmp_line_str.strip().split(",")
        data.append(tmp_line_data)
    data_file.close()
    return data


def save_as_excel(data, path):
    df = pd.DataFrame(data)
    df.to_excel(path, index=False, encoding='utf-8')


# if __name__ == '__main__':
#     # 测试utf-8编码
#     # save_as_csv([['\xe3', 2]], r"D:\project\wms search\03进展\意图识别\06代码\Intention\result\file\test.csv")
#     dic1 = {'标题列1': ['张三', '李四', '34'],
#             '标题列2': [80, 90]
#             }
#     path = "./test.xlsx"
#     save_as_excel(dic1, path)
#     print("Aye")

