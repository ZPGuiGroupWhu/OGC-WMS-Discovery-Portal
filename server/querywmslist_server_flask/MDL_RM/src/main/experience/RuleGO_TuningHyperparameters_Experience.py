# method:
#   RuleGO：Gruca A ,  Sikora M . Data- and expert-driven rule induction and filtering framework for functional
#       interpretation and description of gene sets[J]. Journal of Biomedical Semantics, 2017, 8(1).
# parameters to tune:
#   RuleGO_min_support [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
#   RuleGO_use_similarity_criteria [True, False]


import os
import time
import multiprocessing

from MDL_RM.src.main import Intention
from MDL_RM.src.main.samples.input import Sample
from MDL_RM.src.main.samples.input.Data import Data
from MDL_RM.src.main.intention_recognition import Config, RuleGO_Gruca2017
from MDL_RM.src.main.experience import EvaluationIndex
from MDL_RM.src.main.util.FileUtil import save_as_json, load_json

sample_version = Intention.__sample_version__
output_path_prefix = os.path.join("../../../result/MDL_RM", "scenes_" +
                                  sample_version + "_" + Intention.__version__)
if not os.path.exists(output_path_prefix):
    os.mkdir(output_path_prefix)
auto_save_threshold = 100


def experience_get_specific_samples_result(part_name, sample_paths):
    output_dir = os.path.join(output_path_prefix, "experience_RuleGO_tuning_hyperparameters_result")
    if not os.path.exists(output_dir):
        os.mkdir(output_dir)

    tmp_round_num = 0  # 为了自动保存而设置的变量
    # set parameters
    feedback_noise_rates = [0, 0.1, 0.2, 0.3]
    label_noise_rates = [0, 0.2, 0.4, 0.6, 0.8, 1]
    methods = ["RuleGO"]
    RuleGO_min_support_values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]  # 最小支持度
    RuleGO_use_similarity_criteria = [True, False][1:]  # 是否基于意图相似度保证意图多样
    total_run_num = len(sample_paths) * len(feedback_noise_rates) * len(label_noise_rates) * len(methods) * \
                    len(RuleGO_min_support_values) * len(RuleGO_use_similarity_criteria)

    # config
    run_time = 50

    # for RuleGO
    Config.RuleGO_statistical_significance_level = 0.05  # 规则的统计显著性阈值
    Config.RuleGO_max_term_num_in_rule = 4  # 一个规则包含的词项的最大值
    Config.RuleGO_rule_similarity_threshold = 0.5  # 意图的相似度阈值

    output_path = os.path.join(output_dir,
                               "result_jaccard_similarity_time_use_avg" + str(run_time) + "_" + part_name + ".json")

    result = []
    finished_record_keys = []
    if os.path.exists(output_path):
        result = load_json(output_path)
        finished_record_keys = [(x["scene"], x["feedback_noise_rate"], x["label_noise_rate"], x["method"],
                                 x["min_support"], x["use_similarity_criteria"])
                                for x in result]

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
                positive_samples = samples["relevance"]
                negative_samples = samples["irrelevance"]
                ancestors = Data.Ancestor
                ontologies = Data.Ontologies
                ontology_root = Data.Ontology_Root
                direct_ancestors = Data.direct_Ancestor
                information_content = data.concept_information_content
                terms = data.all_relevance_concepts
                terms_covered_samples = data.all_relevance_concepts_retrieved_docs
                for tmp_method in methods:
                    for tmp_min_support in RuleGO_min_support_values:
                        for tmp_use_similarity_criteria in RuleGO_use_similarity_criteria:
                            Config.RuleGO_min_support = tmp_min_support
                            Config.RuleGO_use_similarity_criteria = tmp_use_similarity_criteria

                            tmp_run_num += 1
                            tmp_record_key = (
                                tmp_sample_name, tmp_feedback_noise_rate, tmp_label_noise_rate, tmp_method,
                                tmp_min_support, tmp_use_similarity_criteria)
                            if tmp_record_key in finished_record_keys:
                                continue

                            print(
                                f"running: {part_name} - {tmp_run_num}/{total_run_num} - {tmp_sample_name} - "
                                f"{tmp_feedback_noise_rate} - {tmp_label_noise_rate} - {tmp_method} - "
                                f"{tmp_min_support} - {tmp_use_similarity_criteria}")
                            all_jaccard_index = []
                            all_intention_similarity = []
                            all_precision = []
                            all_recall = []
                            all_time_use = []
                            all_rules = []
                            for i in range(run_time):
                                time01 = time.time()
                                if tmp_method == "RuleGO":
                                    intention_result = RuleGO_Gruca2017.RuleGo(terms, positive_samples,
                                                                               negative_samples,
                                                                               terms_covered_samples, direct_ancestors,
                                                                               ancestors, ontologies, ontology_root)
                                else:
                                    raise Exception("Method must be RuleGO")

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
                                all_intention_similarity.append(best_map_average_semantic_similarity)
                                all_jaccard_index.append(jaccard_index)
                                all_precision.append(precision)
                                all_recall.append(recall)
                                all_rules.append(intention_result)

                            tmp_result = {"scene": tmp_sample_name,
                                          "feedback_noise_rate": tmp_feedback_noise_rate,
                                          "label_noise_rate": tmp_label_noise_rate,
                                          "method": tmp_method,
                                          "min_support": tmp_min_support,
                                          "use_similarity_criteria": tmp_use_similarity_criteria,
                                          "time_use": all_time_use,
                                          "jaccard_index": all_jaccard_index,
                                          "intention_similarity": all_intention_similarity,
                                          "precision": all_precision,
                                          "recall": all_recall,
                                          "extracted_rules_json": all_rules}
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
    samples_dir = os.path.join("../../../resources/samples", "scenes_" + sample_version)
    sample_names = os.listdir(samples_dir)
    sample_paths = {}
    for tmp_sample_name in sample_names:
        sample_paths[tmp_sample_name] = os.path.join(samples_dir, tmp_sample_name)
    sample_names = list(sample_paths.keys())
    print(len(sample_names), sample_names)
    # return

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
