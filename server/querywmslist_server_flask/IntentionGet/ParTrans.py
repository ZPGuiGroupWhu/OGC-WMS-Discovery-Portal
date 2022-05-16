import os
import sys
import random

__dir__ = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.abspath(os.path.join(__dir__, "../")))

from MDL_RM.src.main.intention_recognition import Config,Run_MDL_RM

def ParTrans(samples,clientPar):

    par = {}
    result = []
    Config.TAG_RECORD_MERGE_PROCESS = True  # 若要记录每次迭代的情况，需要将此参数设置为True

    if clientPar:

        if ("random_merge_number" in clientPar) & ("rule_covered_positive_sample_rate_threshold" in clientPar):
            method_result = Run_MDL_RM.get_intention_by_MDL_RM_r \
                (samples, clientPar["random_merge_number"],
                 clientPar["rule_covered_positive_sample_rate_threshold"])  # 调用意图识别方法
            par["mergeNum"] = clientPar["random_merge_number"]
            par["filtrationCoefficient"] = clientPar["rule_covered_positive_sample_rate_threshold"]
        elif "random_merge_number" in clientPar:
            method_result = Run_MDL_RM.get_intention_by_MDL_RM_r \
                (samples, clientPar["random_merge_number"],
                 0.3)  # 调用意图识别方法
            par["mergeNum"] = clientPar["random_merge_number"]
            par["filtrationCoefficient"] = 0.3

        elif "rule_covered_positive_sample_rate_threshold" in clientPar:
            method_result = Run_MDL_RM.get_intention_by_MDL_RM_r \
                (samples, 50,
                 clientPar["rule_covered_positive_sample_rate_threshold"])  # 调用意图识别方法
            par["mergeNum"] = 50
            par["filtrationCoefficient"] = clientPar["rule_covered_positive_sample_rate_threshold"]

    # 默认参数
    else:
        method_result = Run_MDL_RM.get_intention_by_MDL_RM_r \
            (samples, 50, 0.3)  # 调用意图识别方法

        par["mergeNum"] = 50
        par["filtrationCoefficient"] = 0.3

    intention, min_encoding_length, init_min_encoding_length, method_log = method_result  # 方法运行结果包含四项内容
    intention_transformed = Run_MDL_RM.rules_to_intention_frontend(intention)  # 将意图结果转化为前端需要的格式
    intention_transformed = IntentionTrans(intention_transformed)
    result.append(intention_transformed)

    par["encodingLength"] = []
    for process in method_log['merge_process']:
        for one in process:
            par["encodingLength"].append(one['total_encoding_length'])

    par["initMinEncodingLength"] = init_min_encoding_length
    par["minEncodingLength"] = min_encoding_length

    return result,par

def IntentionTrans(intention):

    intention['confidence'] = random.random()
    for one in intention['intention']:

        one['content'] = one.pop('MapContent')
        one['style'] = one.pop('MapMethod')
        one['topic'] = one.pop('Theme')
        one['location'] = one.pop('Spatial')

        if one['content'] == 'Thing':
            one['content'] = []
        else:one['content'] = [one['content']]

        if one['style'] == 'MapMethodRoot':
            one['style'] = []
        else:one['style'] = [one['style']]

        if one['topic'] == 'ThemeRoot':
            one['topic'] = []
        else:one['topic'] = [one['topic'] ]

        if one['location'] == 'America':
            one['location'] = []
        else:one['location'] = [one['location']]

        one['confidence'] = random.random()

    return intention

