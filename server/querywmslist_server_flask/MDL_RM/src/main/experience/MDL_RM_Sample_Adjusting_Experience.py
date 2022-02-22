# 试验1：通过调整正负样本比例和样本数量处理正负样本不平衡与样本数量不足的问题


import os
import time
import multiprocessing

from MDL_RM.src.main import Intention
from MDL_RM.src.main.samples.input import Sample
from MDL_RM.src.main.samples.input.Data import Data
from MDL_RM.src.main.intention_recognition import Config, Run_MDL_RM
from MDL_RM.src.main.experience import EvaluationIndex
from MDL_RM.src.main.util.FileUtil import save_as_json, load_json

sample_version = Intention.__sample_version__
output_path_prefix = os.path.join("../../../result/MDL_RM", "scenes_" +
                                  sample_version + "_" + Intention.__version__)
if not os.path.exists(output_path_prefix):
    os.mkdir(output_path_prefix)
auto_save_threshold = 10


def experience_get_specific_samples_result(part_name, sample_paths, adjust_type):
    output_dir = os.path.join(output_path_prefix, "experience_sample_adjusting_result")
    if not os.path.exists(output_dir):
        os.mkdir(output_dir)

    tmp_round_num = 0  # 为了自动保存而设置的变量
    # set parameters
    adjust = [True, False]  # 是否调整样本
    methods = ["MDL_RM_r"]

    # 正样本所占总样本比例的分子为1时的分母
    positive_or_negative_sample_nums = [5, 10, 20, 30, 40, 50, 75, 100, 125, 150]  # positive or negative samples num
    parameter_to_experience = positive_or_negative_sample_nums
    total_run_num = len(sample_paths) * len(methods) * len(parameter_to_experience) * len(adjust)

    # config
    run_time = 50
    # for MDL_RM
    tmp_threshold = Config.rule_covered_positive_sample_rate_threshold
    Config.MDL_RM_beam_width = 3

    Config.use_sub_intention_order_constraint = False

    output_path = os.path.join(output_dir,
                               "result_jaccard_similarity_time_use_avg" + str(run_time) + "_" + part_name + ".json")
    # result = [["scene", "feedback_noise_rates", "label_noise_rates", "use_sub_intention_order_constraints",
    #            "methods", "time_use", "jaccard_index", "min_encoding_length", "extracted_rules_json", "method_logs"]]
    result = []
    finished_record_keys = []
    if os.path.exists(output_path):
        result = load_json(output_path)
        finished_record_keys = [(x["scene"], x["adjust_type"], x["parameter_value"], x["adjust"], x["method"])
                                for x in result]

    tmp_run_num = 0
    for tmp_sample_name in sample_paths:
        print("##### ", tmp_sample_name, " #####")
        # tmp_sample_path = sample_paths[tmp_sample_name]["pure"]
        tmp_sample_path_prefix = sample_paths[tmp_sample_name]
        for tmp_value in parameter_to_experience:
            tmp_sample_path = None
            if adjust_type == "sample_num":
                tmp_sample_path = os.path.join(tmp_sample_path_prefix,
                                               f"final_samples_PN{tmp_value}_NN{tmp_value}.json")
            for tmp_adjust in adjust:
                Config.adjust_sample_num = tmp_adjust
                Config.adjust_sample_ratio = tmp_adjust

                # load sample data
                docs, real_intention = Sample.load_sample_from_file(tmp_sample_path)
                data = Data(docs, real_intention)
                samples = data.docs
                ontology_root = Data.Ontology_Root
                direct_ancestors = Data.direct_Ancestor
                information_content = data.concept_information_content
                for tmp_method in methods:
                    tmp_run_num += 1
                    tmp_record_key = (tmp_sample_name, adjust_type, tmp_value, tmp_adjust, tmp_method)
                    if tmp_record_key in finished_record_keys:
                        continue
                    print(
                        f"running: {part_name} - {tmp_run_num}/{total_run_num} - {tmp_sample_path} - "
                        f"{tmp_adjust} - {tmp_method}")
                    all_jaccard_index = []
                    all_intention_similarity = []
                    all_precision = []
                    all_recall = []
                    all_time_use = []
                    all_rules = []
                    all_encoding_length_compression_rates = []
                    all_time_use_sample_enhancement = []
                    all_time_use_merge = []
                    all_time_use_others = []
                    for i in range(run_time):
                        intention_result = None
                        Run_MDL_RM.init_time_use()
                        time01 = time.time()
                        method_result = None
                        if tmp_method == "MDL_RM_r":
                            method_result = Run_MDL_RM.get_intention_by_MDL_RM_r(samples,
                                                                                 Config.MDL_RM_random_merge_number,
                                                                                 tmp_threshold)
                            intention_result = Run_MDL_RM.result_to_intention(method_result)
                        elif tmp_method == "MDL_RM_g":
                            method_result = Run_MDL_RM.get_intention_by_MDL_RM_g(samples, tmp_threshold)
                            intention_result = Run_MDL_RM.result_to_intention(method_result)
                        time02 = time.time()
                        time_use = method_result[-1]["time_use"]
                        time_use_others = time_use["time_use_others"]
                        time_use_sample_enhancement = time_use["time_use_sample_enhancement"]
                        time_use_merge = time_use["time_use_merge"]
                        all_time_use_sample_enhancement.append(time_use_sample_enhancement)
                        all_time_use_merge.append(time_use_merge)
                        all_time_use_others.append(time_use_others)
                        all_time_use.append(time02 - time01)
                        jaccard_index = EvaluationIndex.get_jaccard_index(samples, real_intention,
                                                                          intention_result,
                                                                          Data.Ontologies, Data.Ontology_Root)
                        best_map_average_semantic_similarity = \
                            EvaluationIndex.get_intention_similarity(intention_result, real_intention,
                                                                     direct_ancestors, ontology_root,
                                                                     information_content)
                        precision = EvaluationIndex.get_precision(samples, real_intention,
                                                                  intention_result,
                                                                  Data.Ontologies, Data.Ontology_Root)
                        recall = EvaluationIndex.get_recall(samples, real_intention,
                                                            intention_result,
                                                            Data.Ontologies, Data.Ontology_Root)
                        all_intention_similarity.append(best_map_average_semantic_similarity)
                        all_jaccard_index.append(jaccard_index)
                        all_precision.append(precision)
                        all_recall.append(recall)
                        all_rules.append(intention_result)
                        tmp_encoding_length_compression_rates = method_result[1] / method_result[2]
                        all_encoding_length_compression_rates.append(tmp_encoding_length_compression_rates)

                    tmp_result = {"scene": tmp_sample_name,
                                  "adjust_type": adjust_type,
                                  "parameter_value": tmp_value,
                                  "adjust": tmp_adjust,
                                  "method": tmp_method,
                                  "rule_covered_positive_sample_rate_threshold": tmp_threshold,
                                  "time_use": all_time_use,
                                  "time_use_sample_enhancement": all_time_use_sample_enhancement,
                                  "time_use_merge": all_time_use_merge,
                                  "time_use_others": all_time_use_others,
                                  "jaccard_index": all_jaccard_index,
                                  "intention_similarity": all_intention_similarity,
                                  "precision": all_precision,
                                  "recall": all_recall,
                                  "extracted_rules_json": all_rules,
                                  "encoding_length_compression_rates": all_encoding_length_compression_rates}
                    result.append(tmp_result)
                    finished_record_keys.append(tmp_record_key)
                    tmp_round_num += 1
                    if tmp_round_num == auto_save_threshold:
                        save_as_json(result, output_path)
                        tmp_round_num = 0
    save_as_json(result, output_path)


# take scene, sample level noise rate, label level noise rate method as variable
# and record the time use, jaccard score， intention_similarity，and rules(in json_str).
def experience_get_all_samples_result():
    # load sample paths
    samples_dir = os.path.join("../../../resources/samples", "scenes_" + sample_version)
    sample_names = os.listdir(samples_dir)
    sample_paths = {}
    for tmp_sample_name in sample_names:
        sample_paths[tmp_sample_name] = os.path.join(samples_dir, tmp_sample_name)
    sample_names = list(sample_paths.keys())
    print(len(sample_names), sample_names)

    # split all samples name to several parts, and calculate every part with a thread
    adjust_type = "sample_num"
    part_num = 12  # 12 process
    split_size = len(sample_names) // part_num + 1
    all_samples_parts = []
    for i in range(part_num - 1):
        tmp_sample_part = {}
        for j in range(split_size):
            tmp_sample_name = sample_names.pop(0)
            tmp_sample_part[tmp_sample_name] = sample_paths[tmp_sample_name]
        all_samples_parts.append(tmp_sample_part)
    last_sample_part = {}
    for tmp_sample_name in sample_names:
        last_sample_part[tmp_sample_name] = sample_paths[tmp_sample_name]
    all_samples_parts.append(last_sample_part)
    for i, tmp_sample_part in enumerate(all_samples_parts):
        part_name = "PART_" + str(i)
        tmp_p = multiprocessing.Process(target=experience_get_specific_samples_result,
                                        args=(part_name, tmp_sample_part, adjust_type))
        tmp_p.start()


if __name__ == "__main__":
    experience_get_all_samples_result()
    print("Aye")
