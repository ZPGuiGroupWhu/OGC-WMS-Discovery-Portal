import os
import time
import copy
import multiprocessing

from MDL_RM.src.main import Intention
from MDL_RM.src.main.samples.input import Sample
from MDL_RM.src.main.samples.input.Data import Data
from MDL_RM.src.main.intention_recognition import Config, Run_MDL_RM
from MDL_RM.src.main.experience import EvaluationIndex
from MDL_RM.src.main.util.FileUtil import save_as_json, load_json

sample_version = Intention.__sample_version__
file_path_prefix = "../../../resources/samples"
scenes_path = os.path.join(file_path_prefix, sample_version)
output_path_prefix = os.path.join("../../../result/MDL_RM", "scenes_" +
                                  sample_version + "_" + Intention.__version__)
if not os.path.exists(output_path_prefix):
    os.mkdir(output_path_prefix)

auto_save_threshold = 100


def experience_get_specific_samples_result(part_name, sample_paths):
    output_dir = os.path.join(output_path_prefix, "experience_parameter_sensibility_result")
    if not os.path.exists(output_dir):
        os.mkdir(output_dir)

    tmp_round_num = 0  # 为了自动保存而设置的变量
    # set parameters
    feedback_noise_rates = [0, 0.1, 0.2, 0.3]
    label_noise_rates = [0, 0.2, 0.4, 0.6, 0.8, 1]
    methods = ["MDL_RM_r"]
    random_merge_numbers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]
    rule_covered_positive_sample_rate_thresholds = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    total_run_num = len(sample_paths) * len(feedback_noise_rates) * len(
        label_noise_rates) * len(methods) * (len(random_merge_numbers)
                                             + len(rule_covered_positive_sample_rate_thresholds) - 1)
    #  若要运行两个参数所有组合以确定两者最佳取值，需将total run num改为下面注释的部分
    # total_run_num = len(sample_paths) * len(feedback_noise_rates) * len(
    #     label_noise_rates) * len(methods) * len(
    #     random_merge_numbers) * len(rule_covered_positive_sample_rate_thresholds)

    # config
    run_time = 50
    # for MDL_RM
    Config.adjust_sample_num = True

    output_path = os.path.join(output_dir,
                               "result_jaccard_similarity_time_use_avg" + str(run_time) + "_" + part_name + ".json")

    finished_result_path = os.path.join(output_path_prefix, "experience_parameter_sensibility_result",
                                        "result_jaccard_similarity_time_use_avg" + str(
                                            run_time) + "_" + part_name + ".json")
    result = []
    finished_record_keys = []
    if os.path.exists(finished_result_path):
        result = load_json(finished_result_path)
        finished_record_keys = [(copy.copy(x["scene"]),
                                 copy.copy(x["feedback_noise_rate"]),
                                 copy.copy(x["label_noise_rate"]),
                                 copy.copy(x["method"]),
                                 copy.copy(x["random_merge_number"]),
                                 copy.copy(x["rule_covered_positive_sample_rate_threshold"]))
                                for x in result]
        print("####", len(finished_record_keys))

    tmp_run_num = 0
    for tmp_sample_name in sample_paths:
        print("##### ", tmp_sample_name, " #####")
        tmp_sample_path_prefix = sample_paths[tmp_sample_name]

        for tmp_feedback_noise_rate in feedback_noise_rates:
            tmp_feedback_noise_rate_str = "_S" + str(tmp_feedback_noise_rate).replace(".", "p")
            for tmp_label_noise_rate in label_noise_rates:
                tmp_label_noise_rate_str = "_L" + str(tmp_label_noise_rate).replace(".", "p")

                if tmp_feedback_noise_rate == 0:
                    if tmp_label_noise_rate == 0:
                        tmp_sample_path = os.path.join(tmp_sample_path_prefix, "final_samples.json")
                    else:
                        tmp_sample_path = os.path.join(tmp_sample_path_prefix,
                                                       "noise_samples" + tmp_label_noise_rate_str + ".json")
                else:
                    if tmp_label_noise_rate == 0:
                        tmp_sample_path = os.path.join(tmp_sample_path_prefix,
                                                       "noise_samples" + tmp_feedback_noise_rate_str + ".json")
                    else:
                        tmp_sample_path = os.path.join(tmp_sample_path_prefix,
                                                       "noise_samples" + tmp_feedback_noise_rate_str
                                                       + tmp_label_noise_rate_str + ".json")
                # load sample data
                docs, real_intention = Sample.load_sample_from_file(tmp_sample_path)
                data = Data(docs, real_intention)
                samples = data.docs
                ontology_root = Data.Ontology_Root
                direct_ancestors = Data.direct_Ancestor
                information_content = data.concept_information_content
                for tmp_method in methods:
                    for tmp_random_merge_number in random_merge_numbers:
                        for tmp_threshold in rule_covered_positive_sample_rate_thresholds:
                            # 探究随机合并次数时，将正样本覆盖占比阈值固定为0.3
                            # 探究正样本覆盖占比阈值时，将随机合并次数固定为50
                            # 若要运行两个参数所有组合以确定两者最佳取值，注释此if语句即可
                            if not ((tmp_random_merge_number == 50 and
                                     tmp_threshold in rule_covered_positive_sample_rate_thresholds)
                                    or
                                    (tmp_random_merge_number in random_merge_numbers and tmp_threshold == 0.3)):
                                continue
                            tmp_run_num += 1
                            tmp_record_key = (
                                tmp_sample_name, tmp_feedback_noise_rate,
                                tmp_label_noise_rate, tmp_method, tmp_random_merge_number, tmp_threshold)
                            if tmp_record_key in finished_record_keys:
                                print(
                                    f"running: {part_name} - {tmp_run_num}/{total_run_num} - {tmp_sample_name} - "
                                    f"{tmp_feedback_noise_rate} - {tmp_label_noise_rate} - "
                                    f"{tmp_method} - {tmp_random_merge_number} - {tmp_threshold} - skip")
                                finished_record_keys.remove(tmp_record_key)
                                continue

                            print(
                                f"running: {part_name} - {tmp_run_num}/{total_run_num} - {tmp_sample_name} - "
                                f"{tmp_feedback_noise_rate} - {tmp_label_noise_rate} - "
                                f"{tmp_method} - {tmp_random_merge_number} - {tmp_threshold}")
                            all_jaccard_index = []
                            all_intention_similarity = []
                            all_precision = []
                            all_recall = []
                            all_time_use = []
                            all_rules = []
                            all_encoding_length_compression_rates = []
                            for i in range(run_time):
                                time01 = time.time()
                                intention_result = None
                                method_result = None
                                if tmp_method == "MDL_RM_r":
                                    method_result = Run_MDL_RM.get_intention_by_MDL_RM_r(samples,
                                                                                         tmp_random_merge_number,
                                                                                         tmp_threshold)
                                    intention_result = Run_MDL_RM.result_to_intention(method_result)

                                time02 = time.time()
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

                                tmp_encoding_length_compression_rates = method_result[1] / method_result[2]

                                all_intention_similarity.append(best_map_average_semantic_similarity)
                                all_jaccard_index.append(jaccard_index)
                                all_precision.append(precision)
                                all_recall.append(recall)
                                all_rules.append(intention_result)
                                all_encoding_length_compression_rates.append(tmp_encoding_length_compression_rates)

                            tmp_result = {"scene": tmp_sample_name,
                                          "feedback_noise_rate": tmp_feedback_noise_rate,
                                          "label_noise_rate": tmp_label_noise_rate,
                                          "method": tmp_method,
                                          "random_merge_number": tmp_random_merge_number,
                                          "rule_covered_positive_sample_rate_threshold": tmp_threshold,
                                          "time_use": all_time_use,
                                          "jaccard_index": all_jaccard_index,
                                          "intention_similarity": all_intention_similarity,
                                          "precision": all_precision,
                                          "recall": all_recall,
                                          "extracted_rules_json": all_rules,
                                          "encoding_length_compression_rates": all_encoding_length_compression_rates}
                            result.append(tmp_result)
                            tmp_round_num += 1
                            if tmp_round_num == auto_save_threshold:
                                save_as_json(result, output_path)
                                tmp_round_num = 0
    save_as_json(result, output_path)


# take scene, sample level noise rate, label level noise rate, use sub intention order constraint or not,
#   method as variable and record the time use, jaccard index and rules(in json_str).
def experience_get_all_samples_result():
    Run_MDL_RM.TAG_RECORD_MERGE_PROCESS = False
    # get sample paths
    samples_dir = os.path.join("../../../resources/samples", "scenes_" + sample_version)
    sample_names = os.listdir(samples_dir)
    sample_paths = {}
    for tmp_sample_name in sample_names:
        sample_paths[tmp_sample_name] = os.path.join(samples_dir, tmp_sample_name)
    sample_names = list(sample_paths.keys())
    sample_names.sort()
    print(len(sample_names), sample_names)

    # split all samples name to several parts, and calculate every part with a thread
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
                                        args=(part_name, tmp_sample_part))
        tmp_p.start()


if __name__ == "__main__":
    experience_get_all_samples_result()
    print("Aye")
