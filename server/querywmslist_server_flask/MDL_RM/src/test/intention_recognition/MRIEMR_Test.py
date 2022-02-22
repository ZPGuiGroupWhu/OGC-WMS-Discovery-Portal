from math import log2, gamma
import time
import json

from MDL_RM.src.main.experience import EvaluationIndex
from MDL_RM.src.main.intention_recognition import Config, Run_MDL_RM
from MDL_RM.src.main.samples.input import Sample
from MDL_RM.src.main.samples.input.Data import Data
from MDL_RM.src.main.util import FileUtil


def _test_get_encoding_length_by_ppc():
    value1 = -log2(gamma(10 + 1) * gamma(8 + 1) * gamma(7) / gamma(10 + 8 + 7))
    value2 = -log2(gamma(13 + 1) * gamma(1 + 1) * gamma(7) / gamma(13 + 1 + 7))
    value3 = -log2(gamma(20 + 1) * gamma(7) / gamma(20 + 7))
    value4 = -log2(gamma(4 + 1) * gamma(4 + 1) * gamma(7) / gamma(4 + 4 + 7))
    value5 = -log2(gamma(41 + 1) * gamma(7) / gamma(41 + 7))
    print(value1 + value2 + value3 + value4 + value5)


def _test_get_intention_by_method1():
    scene = "11"
    test_sample_path = "./../../../resources/samples/scenes_v4_5/Scene" + scene + "/noise_samples_S0p1_L1.json"
    docs, real_intention = Sample.load_sample_from_file(test_sample_path)
    data = Data(docs, real_intention)
    # intention = Sample.real_intention
    test_samples = data.docs
    data_encoding_method = "amcl"
    for i in range(10):
        method_result = Run_MDL_RM.get_intention_by_method1(test_samples, data_encoding_method, 0.3)
        predict_intention = Run_MDL_RM.result_to_intention(method_result)
        print(predict_intention, method_result[1])


def _test_get_intention_by_method6():
    Run_MDL_RM.init_time_use()
    scene = "21"
    sample_version = "scenes_v4_5"
    test_sample_path = "./../../../resources/samples/" + sample_version + "/Scene" + scene + "/final_samples.json"
    docs, real_intention = Sample.load_sample_from_file(test_sample_path)
    # data = Data(docs, real_intention)
    test_ontologies = Data.Ontologies
    test_ontology_root = Data.Ontology_Root
    test_direct_ancestors = Data.direct_Ancestor
    test_information_content = Data.concept_information_content
    test_samples = docs
    data_encoding_method = "amcl"
    Config.adjust_sample_num = True
    Config.TAG_RECORD_MERGE_PROCESS = True
    time01 = time.time()
    method_result = None
    predict_intention = None
    best_num = 0
    for i in range(1):
        method_result = Run_MDL_RM.get_intention_by_method6(test_samples, data_encoding_method, 200, 1, 0.3)
        predict_intention = Run_MDL_RM.result_to_intention(method_result)
        for sub_intention in predict_intention:
            print(sub_intention)
        print(method_result[1])
        if method_result[1] == 181.0278169704525:
            best_num += 1
    print("best_num", best_num)
    time02 = time.time()
    print("time_use", time02 - time01)
    print("time_use_init", Run_MDL_RM.time_use_sample_enhancement)
    print("time_use_merge", Run_MDL_RM.time_use_merge)
    print("\ttime_get_max_similarity_value_pair", Run_MDL_RM.time_use_calculate_merge_statistic)
    print("\t\ttime_get_similarity_Lin", Run_MDL_RM.time_use_get_similarity_Lin)
    print("\ttime_get_LCA", Run_MDL_RM.time_use_get_LCA)
    print("time_use_calculate_merge_statistic", Run_MDL_RM.time_use_calculate_merge_statistic)
    print("time_update_rule", Run_MDL_RM.time_use_update_rule)
    print("time_retrieve_docs", Run_MDL_RM.time_use_retrieve_docs)

    jaccard_score = EvaluationIndex.get_jaccard_index(test_samples, real_intention,
                                                      predict_intention, test_ontologies, test_ontology_root)
    intention_similarity = EvaluationIndex.get_intention_similarity(real_intention, predict_intention,
                                                                    test_direct_ancestors, test_ontology_root,
                                                                    test_information_content)
    print(jaccard_score)
    print(intention_similarity)

    method_log = method_result[-1]
    time_use_log = method_log["time_use"]
    merge_process_log = method_log["merge_process"]
    print("time_use", time_use_log)
    print(merge_process_log)
    print("merge_process")
    for i, tmp_iteration_log in enumerate(merge_process_log):
        print("\t iteration", i)
        for tmp_rules_log in tmp_iteration_log:
            print("\t\t", tmp_rules_log)


def _test_init_for_intention_extraction():
    scene = "362"
    sample_version = "scenes_v4_5"
    test_sample_path = "./../../../resources/samples/" + sample_version + "/Scene" + scene + "/noise_samples_L1.json"
    docs, real_intention = Sample.load_sample_from_file(test_sample_path)
    data = Data(docs, real_intention)
    test_samples = data.docs
    test_origin_positive_samples = test_samples["relevance"]
    test_origin_negative_samples = test_samples["irrelevance"]
    print("before balancing: \n"
          "\torigin_positive_samples_num: {len(test_origin_positive_samples)}\n"
          "\torigin_negative_samples_num: {len(test_origin_negative_samples)}\n\n")
    data, positive_samples, negative_samples, positive_samples_id_num_dict, \
    negative_samples_id_num_dict, uncovered_positive_samples_id, \
    uncovered_negative_samples_id, min_encoding_length = Run_MDL_RM.init_for_intention_extraction(test_samples, "amcl")
    print("after balancing: \n"
          "\torigin_positive_samples_num: {len(positive_samples)}\n"
          "\torigin_negative_samples_num: {len(negative_samples)}\n"
          "\tpositive_samples_id_num_dict: {positive_samples_id_num_dict}\n"
          "\tnegative_samples_id_num_dict: {negative_samples_id_num_dict}\n")


def get_intention_by_MDL_RM_r_test():
    scene = "223"
    sample_version = "scenes_v4_5"
    test_sample_path = "./../../../resources/samples/" + sample_version + "/Scene" + scene + "/final_samples.json"
    samples = FileUtil.load_json(test_sample_path)  # 加载样本文件

    Config.TAG_RECORD_MERGE_PROCESS = True  # 若要记录每次迭代的情况，需要将此参数设置为True
    relevance_feedback_samples = Sample.transform_sample(samples)   # 转换样本文件

    method_result = Run_MDL_RM.get_intention_by_MDL_RM_r(relevance_feedback_samples, 50, 0.3)   # 调用意图识别方法
    intention, min_encoding_length, init_min_encoding_length, method_log = method_result    # 方法运行结果包含四项内容
    intention_transformed = Run_MDL_RM.rules_to_intention_frontend(intention)   # 将意图结果转化为前端需要的格式
    print(intention_transformed)


if __name__ == "__main__":
    time0 = time.time()
    # _test_get_intention_by_method1()
    # _test_get_intention_by_method6()
    get_intention_by_MDL_RM_r_test()
    # _test_init_for_intention_extraction()
    # print(MDL_RM.get_sub_intention_encoding_length())
    time1 = time.time()
    print("total time use", time1 - time0)
    print("Aye")
