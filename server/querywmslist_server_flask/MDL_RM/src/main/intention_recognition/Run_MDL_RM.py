# MDL-based Map Retrieval Intention Extraction by Greedy Algorithm considering Comprise Gain and Similarity
import copy
import os.path
import random
import sys
import time
from math import log2, gamma

__dir__ = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.abspath(os.path.join(__dir__, "../../../../")))

from MDL_RM.src.main.samples.input import OntologyUtil, Sample
from MDL_RM.src.main.samples.input.Data import Data
from MDL_RM.src.main.util.RetrievalUtil import retrieve_docs_based_on_terms_covered_samples
from MDL_RM.src.main.intention_recognition import Config

# print(sys.path)
sub_intention_encoding_length = None
similarity_Lin_cache = {}  # 概念间的最低公共祖先概念缓存

time_use_sample_enhancement = 0
time_use_merge = 0
time_use_calculate_merge_statistic = 0
time_use_update_rule = 0
time_use_retrieve_docs = 0
time_use_get_max_similarity_value_pair = 0
time_use_get_LCA = 0
time_use_get_similarity_Lin = 0
time_others = 0


def init_time_use():
    global time_use_sample_enhancement, time_use_merge, time_use_calculate_merge_statistic, \
        time_use_update_rule, time_use_retrieve_docs, time_use_get_max_similarity_value_pair, \
        time_use_get_LCA, time_use_get_similarity_Lin
    time_use_sample_enhancement = 0
    time_use_merge = 0
    time_use_calculate_merge_statistic = 0
    time_use_update_rule = 0
    time_use_retrieve_docs = 0
    time_use_get_max_similarity_value_pair = 0
    time_use_get_LCA = 0
    time_use_get_similarity_Lin = 0


# encoding length
# prequential plug-in code
def get_data_encoding_length_by_ppc(positive_num, negative_num):
    value = gamma(positive_num + 1) * gamma(negative_num + 1) * gamma(2) / gamma(positive_num + negative_num + 2)
    return -log2(value)


def get_average_encoding_length(positive_num, negative_num):
    if positive_num == 0 or negative_num == 0:
        return 0
    p = positive_num / (positive_num + negative_num)
    return -(p * log2(p) + (1 - p) * log2(1 - p))


# the average minimum encoding length by Shannon's Noiseless Channel Coding Theorem
def get_data_encoding_length_by_amcl(positive_num, negative_num):
    if positive_num == 0 or negative_num == 0:
        return 0
    average_encoding_length = get_average_encoding_length(positive_num, negative_num)
    result = average_encoding_length * (positive_num + negative_num)
    return result


def get_data_encoding_length(positive_num, negative_num, method):
    if method == "ppc":
        data_encoding_length = get_data_encoding_length_by_ppc(positive_num, negative_num)
    elif method == "amcl":
        data_encoding_length = get_data_encoding_length_by_amcl(positive_num, negative_num)
    else:
        raise Exception("Invalid method! method must be \"ppc\" or \"amcl\".", method)
    return data_encoding_length


# Rissanen's universal code for integers
# This code makes no priori assumption about the maximum number num
def rissanen(num):
    k0 = 2.865064
    result = log2(k0)
    tmp_value = log2(num)
    while tmp_value >= 1:
        result += tmp_value
        tmp_value = log2(tmp_value)
    return result


# values in every dimension encoding separately using uniform code
# rissanen(4) means the encoding length of the dimension number of every sub intention
# sub_intention_encoding_length = sum([log2(x) for x in dimension_value_nums]) + rissanen(4)
def get_sub_intention_encoding_length():
    global sub_intention_encoding_length
    if sub_intention_encoding_length is not None:
        return sub_intention_encoding_length
    else:
        sub_intention_num = 1
        for tmp_dim in Data.dimensions:
            #     print(len(Data.Ontologies[tmp_dim]))
            sub_intention_num *= len(Data.Ontologies[tmp_dim])
        sub_intention_encoding_length = log2(sub_intention_num)
        return sub_intention_encoding_length


def get_model_encoding_length(intention_covered_sample_nums):
    intention_num = len(intention_covered_sample_nums)
    result = rissanen(intention_num + 1) + intention_num * get_sub_intention_encoding_length()
    for sub_intention_covered_sample_nums in intention_covered_sample_nums:
        tmp_positive_num, tmp_negative_num = sub_intention_covered_sample_nums
        result += log2(tmp_positive_num + tmp_negative_num)
    return result


# sub_intention_covered_sample_nums = [covered_positive_num, covered_negative_num]
# intention_covered_sample_nums = [sub_intention_covered_sample_nums1, ...]
# method ∈ {"ppc", "amcl"}
def total_intention_covered_data_encoding_length(intention_covered_sample_nums, method):
    model_encoding_length = get_model_encoding_length(intention_covered_sample_nums)
    data_encoding_length = 0
    for sub_intention_covered_sample_nums in intention_covered_sample_nums:
        tmp_positive_num, tmp_negative_num = sub_intention_covered_sample_nums
        data_encoding_length += get_data_encoding_length(tmp_positive_num, tmp_negative_num, method)
    return model_encoding_length + data_encoding_length


# params:
#   ontologies:
# return [value1, value2, similarity]
def get_values_max_similarity(values1, values2, ontology, direct_ancestor, ontology_root_concept,
                              concept_information_content_yuan2013):
    global time_use_get_similarity_Lin
    label_similarities = []
    for sample1_tmp_value in values1:
        for sample2_tmp_value in values2:
            tmp_LCA = None
            if ontology is None:
                tmp_similarity = 1 if sample1_tmp_value == sample2_tmp_value else 0
            else:
                time000 = time.time()
                tmp_similarity_Lin_cache_key_list = [sample1_tmp_value, sample2_tmp_value]
                tmp_similarity_Lin_cache_key_list.sort()
                tmp_similarity_Lin_cache_key = tuple(tmp_similarity_Lin_cache_key_list)
                if tmp_similarity_Lin_cache_key in similarity_Lin_cache:
                    tmp_LCA, tmp_similarity = similarity_Lin_cache[tmp_similarity_Lin_cache_key]
                else:
                    tmp_LCA, tmp_similarity = OntologyUtil.get_similarity_Lin(sample1_tmp_value, sample2_tmp_value,
                                                                              direct_ancestor, ontology_root_concept,
                                                                              concept_information_content_yuan2013)
                    similarity_Lin_cache[tmp_similarity_Lin_cache_key] = (tmp_LCA, tmp_similarity)

                time001 = time.time()
                time_use_get_similarity_Lin += time001 - time000
            label_similarities.append([sample1_tmp_value, sample2_tmp_value, tmp_LCA, tmp_similarity])
    label_similarities.sort(key=lambda x: x[3], reverse=True)
    label_similarities_with_max_similarity = \
        list(filter(lambda x: x[3] == label_similarities[0][3], label_similarities))
    return random.choice(label_similarities_with_max_similarity)


# params:
#   ontologies: {"dim1": {"concept1": [...], ...}, "dim2": {...}, ...}
def similarity_of_samples(sample1, sample2, ontologies, direct_ancestors, ontology_root,
                          concept_information_content_yuan2013s,
                          dimensions_weight):
    result = 0
    for tmp_dim in sample1:
        sample1_tmp_dim_values = sample1[tmp_dim]
        sample2_tmp_dim_values = sample2[tmp_dim]
        labels_with_max_similarity = get_values_max_similarity(sample1_tmp_dim_values, sample2_tmp_dim_values,
                                                               ontologies[tmp_dim],
                                                               direct_ancestors[tmp_dim],
                                                               ontology_root[tmp_dim],
                                                               concept_information_content_yuan2013s[tmp_dim])
        _, _, _, tmp_similarity = labels_with_max_similarity
        result += tmp_similarity * dimensions_weight[tmp_dim]
    return result


# def similarity_of_all_samples(samples, ontologies, direct_ancestors, concept_information_content_yuan2013s):
#     # get similarity variation
def similarity_of_sub_intention_and_sample(sub_intention, sample, ontologies, direct_ancestors, ontology_root,
                                           concept_information_content_yuan2013s, dimensions_weight):
    tmp_virtual_sample = {}
    for tmp_dim in sub_intention:
        tmp_virtual_sample[tmp_dim] = [sub_intention[tmp_dim]]
    return similarity_of_samples(tmp_virtual_sample, sample, ontologies, direct_ancestors, ontology_root,
                                 concept_information_content_yuan2013s, dimensions_weight)


def similarity_of_sub_intentions(sub_intention1, sub_intention2, ontologies, direct_ancestors, ontology_root,
                                 concept_information_content_yuan2013s, dimensions_weight):
    result = 0
    for tmp_dim in sub_intention1:
        sub_intention1_tmp_dim_value = sub_intention1[tmp_dim]
        sub_intention2_tmp_dim_value = sub_intention2[tmp_dim]
        if ontologies[tmp_dim] is None:
            tmp_similarity = 1 if sub_intention1_tmp_dim_value == sub_intention2_tmp_dim_value else 0
        else:
            _, tmp_similarity = OntologyUtil.get_similarity_Lin(sub_intention1_tmp_dim_value,
                                                                sub_intention2_tmp_dim_value,
                                                                direct_ancestors[tmp_dim], ontology_root[tmp_dim],
                                                                concept_information_content_yuan2013s[tmp_dim])
        result += tmp_similarity * dimensions_weight[tmp_dim]
    return result


def merge_samples(sample1, sample2, ontologies, direct_ancestors, ontology_root, concept_information_content_yuan2013s):
    global time_use_get_max_similarity_value_pair, time_use_get_LCA
    result = {}
    for tmp_dim in sample1:
        sample1_tmp_dim_values = sample1[tmp_dim]
        sample2_tmp_dim_values = sample2[tmp_dim]
        time00 = time.time()
        labels_with_max_similarity = get_values_max_similarity(sample1_tmp_dim_values, sample2_tmp_dim_values,
                                                               ontologies[tmp_dim],
                                                               direct_ancestors[tmp_dim],
                                                               ontology_root[tmp_dim],
                                                               concept_information_content_yuan2013s[tmp_dim])
        label1, label2, tmp_LCA, similarity = labels_with_max_similarity
        time01 = time.time()
        tmp_dim_result = tmp_LCA
        time02 = time.time()
        time_use_get_max_similarity_value_pair += time01 - time00
        time_use_get_LCA += time02 - time01
        result[tmp_dim] = tmp_dim_result
    return result


def merge_sub_intention_and_sample(sub_intention, sample, ontologies, direct_ancestors, ontology_root,
                                   concept_information_content_yuan2013s):
    tmp_virtual_sample = {}
    for tmp_dim in sub_intention:
        tmp_virtual_sample[tmp_dim] = [sub_intention[tmp_dim]]
    return merge_samples(tmp_virtual_sample, sample, ontologies, direct_ancestors,
                         ontology_root,
                         concept_information_content_yuan2013s)


def merge_sub_intentions(sub_intention1, sub_intention2, direct_ancestors, ontology_root):
    result = {}
    for tmp_dim in sub_intention1:
        sub_intention1_tmp_dim_value = sub_intention1[tmp_dim]
        sub_intention2_tmp_dim_value = sub_intention2[tmp_dim]
        tmp_dim_result = OntologyUtil.getLCA(sub_intention1_tmp_dim_value,
                                             sub_intention2_tmp_dim_value,
                                             direct_ancestors[tmp_dim], ontology_root[tmp_dim])
        result[tmp_dim] = tmp_dim_result
    return result


# 判断一个意图是否包含另一个意图
def is_intention_cover(intent_a, intent_b, ancestors, ontology_root):
    dims_result = []
    for tmp_dim in intent_a:
        intent_a_value = intent_a[tmp_dim]
        intent_b_value = intent_b[tmp_dim]
        if intent_a_value == intent_b_value:
            dims_result.append("e")
        elif intent_a_value == ontology_root[tmp_dim] or \
                (ancestors[tmp_dim] is not None and intent_a_value in ancestors[tmp_dim][intent_b_value]):
            dims_result.append("a")
    if len(dims_result) >= len(intent_a.keys()):
        return True
    else:
        return False


def get_merge_pair_statistics(data, merge_pair, rules,
                              uncovered_positive_samples_id, uncovered_negative_samples_id,
                              per_positive_sample_times, per_negative_sample_times,
                              data_encoding_method):
    tmp_merged_rule = merge_pair[2]
    tmp_merge_item_a = merge_pair[0]
    tmp_merge_item_b = merge_pair[1]

    tmp_merged_rule_covered_positive_samples_id = set()
    tmp_merged_rule_covered_negative_samples_id = set()

    tmp_merged_rule_covered_rules_id = []
    tmp_merged_rule_uncovered_rules_id = []
    tmp_all_rules_covered_positive_negative_nums = []
    for tmp_rule_id in rules:
        tmp_rule = rules[tmp_rule_id]
        if is_intention_cover(tmp_merged_rule, tmp_rule[0], Data.Ancestor, Data.Ontology_Root):
            tmp_merged_rule_covered_rules_id.append(tmp_rule_id)
            tmp_merged_rule_covered_positive_samples_id = tmp_merged_rule_covered_positive_samples_id.union(tmp_rule[1])
            tmp_merged_rule_covered_negative_samples_id = tmp_merged_rule_covered_negative_samples_id.union(tmp_rule[2])
        else:
            tmp_merged_rule_uncovered_rules_id.append(tmp_rule_id)
            tmp_all_rules_covered_positive_negative_nums.append(tmp_rule[3])

    tmp_merged_rule_covered_positive_samples_id = \
        retrieve_docs_based_on_terms_covered_samples(tmp_merged_rule, data.all_relevance_concepts_retrieved_docs,
                                                     "positive")
    tmp_merged_rule_covered_negative_samples_id = \
        retrieve_docs_based_on_terms_covered_samples(tmp_merged_rule, data.all_relevance_concepts_retrieved_docs,
                                                     "negative")

    tmp_merged_rule_retrieved_uncovered_positive_samples_id = \
        uncovered_positive_samples_id.intersection(tmp_merged_rule_covered_positive_samples_id)
    tmp_merged_rule_retrieved_uncovered_negative_samples_id = \
        uncovered_negative_samples_id.intersection(tmp_merged_rule_covered_negative_samples_id)

    tmp_merged_rule_retrieved_positive_samples_id_in_uncovered_positive_samples = \
        tmp_merged_rule_retrieved_uncovered_positive_samples_id
    tmp_merged_rule_retrieved_negative_samples_id_in_uncovered_negative_samples = \
        tmp_merged_rule_retrieved_uncovered_negative_samples_id

    tmp_merged_rule_covered_positive_samples_id = \
        tmp_merged_rule_covered_positive_samples_id.union(
            tmp_merged_rule_retrieved_positive_samples_id_in_uncovered_positive_samples)
    tmp_merged_rule_covered_negative_samples_id = \
        tmp_merged_rule_covered_negative_samples_id.union(
            tmp_merged_rule_retrieved_negative_samples_id_in_uncovered_negative_samples)

    tmp_merged_rule_remain_uncovered_positive_samples_id = \
        uncovered_positive_samples_id - tmp_merged_rule_retrieved_positive_samples_id_in_uncovered_positive_samples
    tmp_merged_rule_remain_uncovered_negative_samples_id = \
        uncovered_negative_samples_id - tmp_merged_rule_retrieved_negative_samples_id_in_uncovered_negative_samples

    tmp_merged_rule_covered_positive_negative_samples_num = \
        [len(tmp_merged_rule_covered_positive_samples_id) * per_positive_sample_times,
         len(tmp_merged_rule_covered_negative_samples_id) * per_negative_sample_times]

    tmp_merged_rule_remain_uncovered_positive_samples_num = \
        len(tmp_merged_rule_remain_uncovered_positive_samples_id) * per_positive_sample_times
    tmp_merged_rule_remain_uncovered_negative_samples_num = \
        len(tmp_merged_rule_remain_uncovered_negative_samples_id) * per_negative_sample_times
    tmp_all_rules_covered_positive_negative_nums.append(tmp_merged_rule_covered_positive_negative_samples_num)

    try:
        tmp_total_encoding_length = \
            total_intention_covered_data_encoding_length(tmp_all_rules_covered_positive_negative_nums,
                                                         data_encoding_method)
    except ValueError:
        print(tmp_merge_item_a, tmp_merge_item_b)
        print(tmp_merged_rule)
        print(tmp_all_rules_covered_positive_negative_nums)
        raise
    # add the default rule encoding length
    tmp_total_encoding_length += \
        get_data_encoding_length(tmp_merged_rule_remain_uncovered_positive_samples_num,
                                 tmp_merged_rule_remain_uncovered_negative_samples_num,
                                 data_encoding_method)

    return (tmp_merged_rule,
            tmp_merged_rule_covered_positive_samples_id,
            tmp_merged_rule_covered_negative_samples_id,
            tmp_merged_rule_covered_positive_negative_samples_num,
            tmp_merged_rule_remain_uncovered_positive_samples_id,
            tmp_merged_rule_remain_uncovered_negative_samples_id,
            tmp_merged_rule_uncovered_rules_id,
            [tmp_total_encoding_length, None, None])


# 将规对应的编码长度计算分离出来，用于在过滤掉不合格子规则后调用重新计算编码长度。其中不合格子规则是覆盖的正样本占正样本集合的比例低于阈值的子规则。
# without sub intention order constraint
# result = (
#   tmp_remain_uncovered_positive_samples_id = [],
#   tmp_remain_uncovered_negative_samples_id = [],
#   new_rules_list = [rule1, rule2, ...],
#       rule = [tmp_merged_rule,
#               tmp_merged_rule_covered_positive_samples_id,
#               tmp_merged_rule_covered_negative_samples_id,
#               tmp_merged_rule_covered_positive_negative_num,
#               average_encoding_length]
#   encoding_length = [total_encoding_length, intention_encoding_length, sample_encoding_length]
# )
def get_rules_encoding_length_without_order_constraint(rules, positive_samples, negative_samples,
                                                       per_positive_sample_times, per_negative_sample_times):
    rules.sort(key=lambda x: x[-1], reverse=False)
    # get every rule covered samples id and calculate total encoding length
    tmp_intention_encoding_length = 0
    tmp_sample_encoding_length = 0

    tmp_covered_positive_samples_id = set()
    tmp_covered_negative_samples_id = set()
    new_rules_list = []
    for tmp_rule in rules:
        tmp_rule_covered_positive_samples_id = tmp_rule[1]
        tmp_rule_covered_negative_samples_id = tmp_rule[2]

        tmp_rule_covered_samples_num = \
            len(tmp_rule_covered_positive_samples_id) * per_positive_sample_times \
            + len(tmp_rule_covered_negative_samples_id) * per_negative_sample_times
        tmp_rule_real_covered_positive_samples_id = \
            tmp_rule_covered_positive_samples_id - tmp_covered_positive_samples_id
        tmp_rule_real_covered_negative_samples_id = \
            tmp_rule_covered_negative_samples_id - tmp_covered_negative_samples_id

        tmp_rule_real_covered_positive_samples_num = \
            len(tmp_rule_real_covered_positive_samples_id) * per_positive_sample_times
        tmp_rule_real_covered_negative_samples_num = \
            len(tmp_rule_real_covered_negative_samples_id) * per_negative_sample_times
        tmp_rule_real_covered_samples_num = \
            tmp_rule_real_covered_positive_samples_num + tmp_rule_real_covered_negative_samples_num
        if tmp_rule_real_covered_positive_samples_num < tmp_rule_real_covered_negative_samples_num:
            continue
        if tmp_rule_real_covered_positive_samples_num == 0:
            continue
        # add the sample encoding length covered by sub intention
        tmp_sample_encoding_length += tmp_rule_real_covered_samples_num * tmp_rule[4]
        # add sub intention encoding length
        tmp_intention_encoding_length += log2(tmp_rule_covered_samples_num) + get_sub_intention_encoding_length()

        tmp_covered_positive_samples_id |= tmp_rule_covered_positive_samples_id
        tmp_covered_negative_samples_id |= tmp_rule_covered_negative_samples_id
        new_rules_list.append(tmp_rule)
    tmp_remain_uncovered_positive_samples_id = set(range(len(positive_samples))) - tmp_covered_positive_samples_id
    tmp_remain_uncovered_negative_samples_id = set(range(len(negative_samples))) - tmp_covered_negative_samples_id
    tmp_remain_uncovered_positive_samples_num = \
        len(tmp_remain_uncovered_positive_samples_id) * per_positive_sample_times
    tmp_remain_uncovered_negative_samples_num = \
        len(tmp_remain_uncovered_negative_samples_id) * per_negative_sample_times
    # add the remain samples encoding length
    tmp_sample_encoding_length += get_data_encoding_length_by_amcl(tmp_remain_uncovered_positive_samples_num,
                                                                   tmp_remain_uncovered_negative_samples_num)

    tmp_intention_encoding_length += rissanen(len(new_rules_list) + 1)
    tmp_total_encoding_length = tmp_sample_encoding_length + tmp_intention_encoding_length
    return (
        tmp_remain_uncovered_positive_samples_id,
        tmp_remain_uncovered_negative_samples_id,
        new_rules_list,
        [tmp_total_encoding_length, tmp_intention_encoding_length, tmp_sample_encoding_length],
    )


# without sub intention order constraint
# result = (
#   tmp_remain_uncovered_positive_samples_id = [],
#   tmp_remain_uncovered_negative_samples_id = [],
#   new_rules_list = [rule1, rule2, ...],
#       rule = [tmp_merged_rule,
#               tmp_merged_rule_covered_positive_samples_id,
#               tmp_merged_rule_covered_negative_samples_id,
#               tmp_merged_rule_covered_positive_negative_num,
#               average_encoding_length]
#   encoding_length = [total_encoding_length, intention_encoding_length, sample_encoding_length]
# )
def get_merge_pair_statistics_without_order_constraint(data, merge_pair, rules, positive_samples, negative_samples,
                                                       per_positive_sample_times, per_negative_sample_times):
    global time_use_retrieve_docs

    tmp_merged_rule = merge_pair[2]
    # tmp_merge_item_a = merge_pair[0]
    # tmp_merge_item_b = merge_pair[1]
    # retrieve the positive samples and negative samples and get retrieved ids
    time01 = time.time()
    # 样本检索优化前
    # tmp_merged_rule_covered_positive_samples_id = retrieve_docs(tmp_merged_rule, positive_samples,
    #                                                             Data.Ontologies, Data.Ontology_Root)
    # tmp_merged_rule_covered_negative_samples_id = retrieve_docs(tmp_merged_rule, negative_samples,
    #                                                             Data.Ontologies, Data.Ontology_Root)
    # 样本检索优化后
    tmp_merged_rule_covered_positive_samples_id = \
        retrieve_docs_based_on_terms_covered_samples(tmp_merged_rule, data.all_relevance_concepts_retrieved_docs,
                                                     "positive")
    tmp_merged_rule_covered_negative_samples_id = \
        retrieve_docs_based_on_terms_covered_samples(tmp_merged_rule, data.all_relevance_concepts_retrieved_docs,
                                                     "negative")
    time02 = time.time()
    time_use_retrieve_docs += time02 - time01

    tmp_merged_rule_covered_positive_samples_num = \
        len(tmp_merged_rule_covered_positive_samples_id) * per_positive_sample_times
    tmp_merged_rule_covered_negative_samples_num = \
        len(tmp_merged_rule_covered_negative_samples_id) * per_negative_sample_times
    tmp_merged_rule_covered_positive_negative_num = [tmp_merged_rule_covered_positive_samples_num,
                                                     tmp_merged_rule_covered_negative_samples_num]
    # get the average minimum encoding length based on Shannon encoding method
    average_encoding_length = get_average_encoding_length(tmp_merged_rule_covered_positive_samples_num,
                                                          tmp_merged_rule_covered_negative_samples_num)
    # calculate the encoding length
    # sort rules by their average encoding length and then get every rules covered samples
    # if some rules cover no sample, then it will be filtered
    sorted_rules = [[tmp_merged_rule,
                     tmp_merged_rule_covered_positive_samples_id,
                     tmp_merged_rule_covered_negative_samples_id,
                     tmp_merged_rule_covered_positive_negative_num,
                     average_encoding_length]]
    for tmp_rule_id in rules:
        tmp_rule = rules[tmp_rule_id]
        tmp_rule_content = tmp_rule[0]
        if is_intention_cover(tmp_merged_rule, tmp_rule_content, Data.Ancestor, Data.Ontology_Root):
            continue
        sorted_rules.append(copy.deepcopy(rules[tmp_rule_id]))
    return get_rules_encoding_length_without_order_constraint(sorted_rules, positive_samples, negative_samples,
                                                              per_positive_sample_times, per_negative_sample_times)


# params format
#   merge_pair = [item_a, item_b, merged_rule, merge_type]
#   merge_type is one of ["SS", "RS", "RR"]
def get_merge_pair_similarity(merge_pair, dimensions_weight):
    tmp_merge_type = merge_pair[3]
    tmp_merge_item_a = merge_pair[0]
    tmp_merge_item_b = merge_pair[1]
    if tmp_merge_type == "SS":
        similarity_of_merge_pair = similarity_of_samples(tmp_merge_item_a, tmp_merge_item_b, Data.Ontologies,
                                                         Data.direct_Ancestor, Data.Ontology_Root,
                                                         Data.concept_information_content, dimensions_weight)
    elif tmp_merge_type == "RS":
        tmp_sub_intention = tmp_merge_item_a
        similarity_of_merge_pair = similarity_of_sub_intention_and_sample(tmp_sub_intention, tmp_merge_item_b,
                                                                          Data.Ontologies,
                                                                          Data.direct_Ancestor, Data.Ontology_Root,
                                                                          Data.concept_information_content,
                                                                          dimensions_weight)
    elif tmp_merge_type == "RR":
        tmp_sub_intention_a = tmp_merge_item_a
        tmp_sub_intention_b = tmp_merge_item_b
        similarity_of_merge_pair = similarity_of_sub_intentions(tmp_sub_intention_a, tmp_sub_intention_b,
                                                                Data.Ontologies,
                                                                Data.direct_Ancestor, Data.Ontology_Root,
                                                                Data.concept_information_content,
                                                                dimensions_weight)
    else:
        raise Exception("tmp_merge_type must be one of [SS , RS, RR]")
    return similarity_of_merge_pair


# sample enhancement
def init_for_intention_extraction(samples, data_encoding_method):
    # test_samples = Data.docs
    origin_positive_samples = samples["relevance"]
    origin_negative_samples = samples["irrelevance"]

    positive_samples = copy.deepcopy(origin_positive_samples)
    negative_samples = copy.deepcopy(origin_negative_samples)

    per_positive_sample_times = 1
    per_negative_sample_times = 1
    if Config.adjust_sample_ratio:
        if len(negative_samples) > len(positive_samples):
            per_positive_sample_times = len(negative_samples) / len(positive_samples)
            per_negative_sample_times = 1
        else:
            per_positive_sample_times = 1
            per_negative_sample_times = len(positive_samples) / len(negative_samples)
    if Config.adjust_sample_num:
        per_positive_sample_times = (rissanen(len(positive_samples) + 1) +
                                     len(positive_samples) * get_sub_intention_encoding_length()) / \
                                    ((len(positive_samples) + len(negative_samples)) *
                                     get_average_encoding_length(len(positive_samples), len(negative_samples))) \
                                    + 1
        per_negative_sample_times = per_positive_sample_times

    uncovered_negative_samples_id = set(range(len(negative_samples)))
    uncovered_positive_samples_id = set(range(len(positive_samples)))

    init_intention_encoding_length = rissanen(1)
    init_sample_encoding_length = get_data_encoding_length(len(positive_samples) * per_positive_sample_times,
                                                           len(negative_samples) * per_negative_sample_times,
                                                           data_encoding_method)
    init_total_encoding_length = init_intention_encoding_length + init_sample_encoding_length
    init_encoding_length = [init_total_encoding_length, init_intention_encoding_length, init_sample_encoding_length]

    # re-statistics Data
    new_samples = {"relevance": positive_samples, "irrelevance": negative_samples}
    # time_01 = time.time()
    data = Data(new_samples)
    # time_02 = time.time()
    return (data, positive_samples, negative_samples, per_positive_sample_times,
            per_negative_sample_times, uncovered_positive_samples_id,
            uncovered_negative_samples_id, init_encoding_length)


# result format
#   rules = {rule_id: rule, ...}
#   rule = [rule_content, positive_samples_id_set, negative_samples_id_set, positive_negative_samples_num,
#           average_minimum_encoding_length]
#   rule_content = {dim_name: dim_value, ...}
#   positive_samples_id_set = set(positive_sample_index, ...)
#   negative_samples_id_set = set(negative_sample_index, ...)
#   positive_negative_samples_num = [positive_sample_num, negative_sample_num]
# return format
#   rules, min_encoding_length, init_min_encoding_length, the method log
def get_intention_by_method1(test_samples, data_encoding_method, rule_covered_positive_sample_rate_threshold):
    global similarity_Lin_cache
    similarity_Lin_cache = {}
    data, positive_samples, negative_samples, per_positive_sample_times, \
    per_negative_sample_times, uncovered_positive_samples_id, \
    uncovered_negative_samples_id, encoding_length = init_for_intention_extraction(test_samples, data_encoding_method)

    min_encoding_length = encoding_length[0]
    init_min_encoding_length = copy.deepcopy(min_encoding_length)
    rules = {}
    while True:
        uncovered_negative_samples = [negative_samples[x] for x in uncovered_negative_samples_id]
        uncovered_positive_samples = [positive_samples[x] for x in uncovered_positive_samples_id]
        tmp_merged_rules = []
        # first, rule induction from uncovered_positive_samples
        merge_pairs = []
        for i, tmp_sample_a in enumerate(uncovered_positive_samples):
            for j, tmp_sample_b in enumerate(uncovered_positive_samples):
                if i <= j:
                    continue
                tmp_merged_rule = merge_samples(tmp_sample_a, tmp_sample_b, Data.Ontologies, Data.direct_Ancestor,
                                                Data.Ontology_Root,
                                                Data.concept_information_content)
                merge_pairs.append([tmp_sample_a, tmp_sample_b, tmp_merged_rule, "SS"])

        # second, the rules and uncovered positive samples
        for tmp_rule_id in rules:
            tmp_rule = rules[tmp_rule_id]
            tmp_sub_intention = tmp_rule[0]
            for i, tmp_sample in enumerate(uncovered_positive_samples):
                tmp_merged_rule = merge_sub_intention_and_sample(tmp_sub_intention, tmp_sample,
                                                                 Data.Ontologies, Data.direct_Ancestor,
                                                                 Data.Ontology_Root,
                                                                 Data.concept_information_content)
                merge_pairs.append([tmp_rule, tmp_sample, tmp_merged_rule, "RS"])
        visited_rule_id_pairs = set()
        for tmp_rule_id_a in rules:
            for tmp_rule_id_b in rules:
                tmp_rule_id_pair = [tmp_rule_id_a, tmp_rule_id_b]
                tmp_rule_id_pair.sort()
                tmp_rule_id_pair = tuple(tmp_rule_id_pair)
                if tmp_rule_id_pair in visited_rule_id_pairs or tmp_rule_id_a == tmp_rule_id_b:
                    continue
                visited_rule_id_pairs.add(tmp_rule_id_pair)
                tmp_rule_a = rules[tmp_rule_id_a]
                tmp_rule_b = rules[tmp_rule_id_b]
                tmp_sub_intention_a = tmp_rule_a[0]
                tmp_sub_intention_b = tmp_rule_b[0]
                tmp_merged_rule = merge_sub_intentions(tmp_sub_intention_a, tmp_sub_intention_b,
                                                       Data.direct_Ancestor, Data.Ontology_Root)
                merge_pairs.append([tmp_rule_a, tmp_rule_b, tmp_merged_rule, "RR"])

        for tmp_merge_pair in merge_pairs:
            tmp_merged_rule_statistics = \
                get_merge_pair_statistics_without_order_constraint(data, tmp_merge_pair, rules, positive_samples,
                                                                   negative_samples,
                                                                   per_positive_sample_times,
                                                                   per_negative_sample_times)
            tmp_merged_rules.append(tmp_merged_rule_statistics)

        tmp_merged_rules = list(filter(lambda x: x[-1][0] < min_encoding_length, tmp_merged_rules))
        if len(tmp_merged_rules) == 0:
            break

        # print("#### sorted by tmp_total_encoding_length ####")
        tmp_merged_rules.sort(key=lambda x: x[-1][0], reverse=False)
        tmp_merged_rule_with_min_encoding_length = tmp_merged_rules[0]

        tmp_min_encoding_length = tmp_merged_rule_with_min_encoding_length[-1][0]

        new_rules_list = tmp_merged_rule_with_min_encoding_length[-2]

        new_rules = {}
        for i, tmp_rule in enumerate(new_rules_list):
            new_rules[i] = tmp_rule

        rules = new_rules
        min_encoding_length = tmp_min_encoding_length
        uncovered_positive_samples_id = tmp_merged_rule_with_min_encoding_length[
            -4]  # remain_uncovered_positive_samples_id
        uncovered_negative_samples_id = tmp_merged_rule_with_min_encoding_length[
            -3]  # remain_uncovered_negative_samples_id
    rules, min_encoding_length = filter_rules(rules, rule_covered_positive_sample_rate_threshold,
                                              positive_samples, negative_samples,
                                              per_positive_sample_times, per_negative_sample_times)
    return rules, min_encoding_length, init_min_encoding_length, None


# without sub intention order constraint
# result = (
#   tmp_remain_uncovered_positive_samples_id = [],
#   tmp_remain_uncovered_negative_samples_id = [],
#   new_rules_list = [rule1, rule2, ...],
#       rule = [tmp_merged_rule,
#               tmp_merged_rule_covered_positive_samples_id,
#               tmp_merged_rule_covered_negative_samples_id,
#               tmp_merged_rule_covered_positive_negative_num,
#               average_encoding_length]
#   encoding_length = [total_encoding_length, intention_encoding_length, sample_encoding_length]
# )
def rules_to_intention(rules):
    intention_result = []
    if len(rules) == 0:
        tmp_sub_intention = {}
        for tmp_dim in Data.Ontology_Root:
            tmp_sub_intention[tmp_dim] = Data.Ontology_Root[tmp_dim]
        intention_result.append(tmp_sub_intention)
    else:
        for tmp_rule_id in rules:
            tmp_rule = rules[tmp_rule_id]
            intention_result.append(tmp_rule[0])
    return intention_result


# params format
#   method_result = (rules, min_encoding_length, init_min_encoding_length)
def result_to_intention(method_result):
    rules, min_encoding_length, init_min_encoding_length, method_log = method_result
    return rules_to_intention(rules)


def rules_to_intention_frontend(rules):
    intention = []
    intention_result = {'confidence': 0, 'intention': intention}
    if len(rules) == 0:
        tmp_sub_intention = {'confidence': 0}
        for tmp_dim in Data.Ontology_Root:
            tmp_sub_intention[tmp_dim] = Data.Ontology_Root[tmp_dim]
        intention.append(tmp_sub_intention)
    else:
        for tmp_rule_id in rules:
            tmp_rule = rules[tmp_rule_id][0]
            tmp_rule['confidence'] = 0
            intention.append(tmp_rule)
    return intention_result


# params format
#   method_result = (rules, min_encoding_length, init_min_encoding_length)
def result_to_intention_frontend(method_result):
    rules, min_encoding_length, init_min_encoding_length, method_log = method_result
    return rules_to_intention_frontend(rules)


# filter the rules and method log with rule_covered_positive_sample_rate_threshold
def filter_rules(rules, rule_covered_positive_sample_rate_threshold,
                 positive_samples, negative_samples,
                 per_positive_sample_times, per_negative_sample_times):
    filtered_rules_list = []
    for tmp_rule_id in rules:
        tmp_rule = rules[tmp_rule_id]
        tmp_rule_covered_positive_samples_num = len(tmp_rule[1])
        tmp_rule_covered_positive_sample_rate = tmp_rule_covered_positive_samples_num / len(positive_samples)
        if tmp_rule_covered_positive_sample_rate >= rule_covered_positive_sample_rate_threshold:
            filtered_rules_list.append(tmp_rule)
    filtered_rules_statistics = \
        get_rules_encoding_length_without_order_constraint(filtered_rules_list, positive_samples, negative_samples,
                                                           per_positive_sample_times, per_negative_sample_times)
    fixed_min_encoding_length = filtered_rules_statistics[3][0]
    filtered_rules = {}
    for i, tmp_rule in enumerate(filtered_rules_list):
        filtered_rules[i] = tmp_rule
    return filtered_rules, fixed_min_encoding_length


def filter_method_log(method_log, rule_covered_positive_sample_rate_threshold):
    old_merge_process_log = method_log["merge_process"]
    merge_process_log = []
    for old_tmp_iteration_log in old_merge_process_log:
        tmp_iteration_log = []
        for tmp_rules in old_tmp_iteration_log:
            tmp_rules_covered_positive_sample_rates = tmp_rules["covered_positive_sample_rates"]
            if len(list(filter(lambda x: x < rule_covered_positive_sample_rate_threshold,
                               tmp_rules_covered_positive_sample_rates))) == 0:
                tmp_iteration_log.append(tmp_rules)
        if len(tmp_iteration_log) > 0:
            merge_process_log.append(tmp_iteration_log)
    method_log["merge_process"] = merge_process_log
    return method_log


class Rules:
    def __init__(self, uncovered_positive_samples_id, uncovered_negative_samples_id, rules, encoding_length):
        self.uncovered_positive_samples_id = uncovered_positive_samples_id
        self.uncovered_negative_samples_id = uncovered_negative_samples_id
        self.rules = rules
        self.total_encoding_length = encoding_length[0]
        self.method_log = []
        self.intention_encoding_length = encoding_length[1]
        self.sample_encoding_length = encoding_length[2]


# 基于随机合并与集束搜索的意图提取
# params
#   samples 用于提取意图的正负样本
#   data_encoding_method 数据编码方式
#   random_merge_number 每次随机合并的次数
#   beam_width  集束宽度，每次保留的个数
def get_intention_by_method6(samples, data_encoding_method, random_merge_number,
                             beam_width, rule_covered_positive_sample_rate_threshold):
    global time_use_sample_enhancement, time_use_merge, time_use_calculate_merge_statistic, \
        time_use_update_rule, similarity_Lin_cache
    similarity_Lin_cache = {}
    time00 = time.time()

    # 初始化
    data, positive_samples, negative_samples, per_positive_sample_times, \
    per_negative_sample_times, uncovered_positive_samples_id, \
    uncovered_negative_samples_id, encoding_length = init_for_intention_extraction(samples, data_encoding_method)
    min_encoding_length = encoding_length[0]
    init_min_encoding_length = copy.deepcopy(min_encoding_length)

    time01 = time.time()
    time_use_sample_enhancement += time01 - time00
    # 初始化意图列表，添加集束宽度个空规则
    #   rules == intention， rule == sub_intention
    rules_list = []
    #
    merge_process_log = [[{
        "iteration": 0,
        "covered_positive_sample_rates": [1.0],
        "total_encoding_length": encoding_length[0],
        "intention_encoding_length": encoding_length[1],
        "sample_encoding_length": encoding_length[2],
        "encoding_length_compression_rates": 1.0,
        "intention_result": rules_to_intention([])
    }]]
    iteration_number = 1
    # 初始化临时意图列表
    tmp_rules_list = []
    for i in range(beam_width):
        tmp_rules = Rules(copy.deepcopy(uncovered_positive_samples_id), copy.deepcopy(uncovered_negative_samples_id),
                          {}, encoding_length)
        tmp_rules_list.append(tmp_rules)
    while True:
        # print([x.rules for x in tmp_rules_list])

        tmp_iteration_log = []

        new_tmp_rules_list = []
        # 开始遍历临时意图列表
        for tmp_rules in tmp_rules_list:
            tmp_rules_merge_num = 0  # 记录当前意图合并次数
            for i in range(random_merge_number):

                time02 = time.time()
                # uncovered_negative_samples = [negative_samples[x] for x in tmp_rules.uncovered_negative_samples_id]
                # uncovered_positive_samples = [positive_samples[x] for x in tmp_rules.uncovered_positive_samples_id]

                if len(tmp_rules.uncovered_positive_samples_id) == 1 and len(tmp_rules.rules) == 0:
                    break
                tag_for_selecting = [("S", x) for x in tmp_rules.uncovered_positive_samples_id] + \
                                    [("R", x) for x in tmp_rules.rules.keys()]
                if len(tag_for_selecting) < 2:
                    break
                selected_item_a, selected_item_b = random.sample(tag_for_selecting, 2)
                tmp_merge_pair = None
                if selected_item_a[0] == "S" and selected_item_b[0] == "S":
                    tmp_sample_a = positive_samples[selected_item_a[1]]
                    tmp_sample_b = positive_samples[selected_item_b[1]]
                    tmp_merged_rule = merge_samples(tmp_sample_a, tmp_sample_b, Data.Ontologies, Data.direct_Ancestor,
                                                    Data.Ontology_Root,
                                                    Data.concept_information_content)
                    tmp_merge_pair = [tmp_sample_a, tmp_sample_b, tmp_merged_rule, "SS"]
                elif selected_item_a[0] == "S" and selected_item_b[0] == "R":
                    tmp_sub_intention = tmp_rules.rules[selected_item_b[1]][0]
                    tmp_sample = positive_samples[selected_item_a[1]]
                    tmp_merged_rule = merge_sub_intention_and_sample(tmp_sub_intention, tmp_sample, Data.Ontologies,
                                                                     Data.direct_Ancestor, Data.Ontology_Root,
                                                                     Data.concept_information_content)
                    tmp_merge_pair = [tmp_sub_intention, tmp_sample, tmp_merged_rule, "RS"]
                elif selected_item_a[0] == "R" and selected_item_b[0] == "S":
                    tmp_sub_intention = tmp_rules.rules[selected_item_a[1]][0]
                    tmp_sample = positive_samples[selected_item_b[1]]
                    tmp_merged_rule = merge_sub_intention_and_sample(tmp_sub_intention, tmp_sample, Data.Ontologies,
                                                                     Data.direct_Ancestor, Data.Ontology_Root,
                                                                     Data.concept_information_content)
                    tmp_merge_pair = [tmp_sub_intention, tmp_sample, tmp_merged_rule, "RS"]
                elif selected_item_a[0] == "R" and selected_item_b[0] == "R":
                    tmp_sub_intention_a = tmp_rules.rules[selected_item_a[1]][0]
                    tmp_sub_intention_b = tmp_rules.rules[selected_item_b[1]][0]
                    tmp_merged_rule = merge_sub_intentions(tmp_sub_intention_a, tmp_sub_intention_b,
                                                           Data.direct_Ancestor, Data.Ontology_Root)
                    tmp_merge_pair = [tmp_sub_intention_a, tmp_sub_intention_b, tmp_merged_rule, "RR"]

                time03 = time.time()

                tmp_merged_rule_statistics = \
                    get_merge_pair_statistics_without_order_constraint(data, tmp_merge_pair, tmp_rules.rules,
                                                                       positive_samples,
                                                                       negative_samples,
                                                                       per_positive_sample_times,
                                                                       per_negative_sample_times)

                time04 = time.time()
                time_use_calculate_merge_statistic += time04 - time03
                time_use_merge += time04 - time02

                tmp_encoding_length = tmp_merged_rule_statistics[-1]
                tmp_total_encoding_length = tmp_encoding_length[0]
                # print(i, tmp_min_encoding_length, min_encoding_length)
                # print("\t", tmp_merge_pair[0])
                # print("\t", tmp_merge_pair[1])
                # print("\t", tmp_merge_pair[3], tmp_merge_pair[2])
                # print("\t", rules)

                time05 = time.time()
                if tmp_total_encoding_length < tmp_rules.total_encoding_length:
                    tmp_rules_merge_num += 1
                    # 合并生成新意图
                    new_rules_list = tmp_merged_rule_statistics[-2]

                    new_rules = {}
                    for j, tmp_rule in enumerate(new_rules_list):
                        new_rules[j] = tmp_rule
                    new_rules_encoding_length = tmp_encoding_length
                    # remain_uncovered_positive_samples_id
                    new_rules_uncovered_positive_samples_id = tmp_merged_rule_statistics[-4]
                    # remain_uncovered_negative_samples_id
                    new_rules_uncovered_negative_samples_id = tmp_merged_rule_statistics[-3]
                    new_tmp_rules = Rules(new_rules_uncovered_positive_samples_id,
                                          new_rules_uncovered_negative_samples_id,
                                          new_rules, new_rules_encoding_length)
                    # 将合并得到的意图添加到临时意图列表
                    new_tmp_rules_list.append(new_tmp_rules)
                    # for tmp_rule_id in rules:
                    #     print(rules[tmp_rule_id])
                    # print(min_encoding_length, init_min_encoding_length)
                time06 = time.time()
                time_use_update_rule += time06 - time05
            # 如果当前意图没有合并得到新的意图，则不再尝试对其进行合并，将其放入rules_list等待排序
            if tmp_rules_merge_num == 0:
                rules_list.append(tmp_rules)
        # 根据临时意图列表判断是否继续，如果临时意图列表为空，表明此次随机合并没有找到更好的意图，退出
        if len(new_tmp_rules_list) == 0:
            break
        else:
            # 如果还有需要尝试合并的意图，则最多保留集束宽度个最佳意图`````
            new_tmp_rules_list.sort(key=lambda x: x.total_encoding_length)
            tmp_rules_list = new_tmp_rules_list[:min(len(new_tmp_rules_list), beam_width)]
            # record iteration log
            if Config.TAG_RECORD_MERGE_PROCESS:
                for rules_index, tmp_rules in enumerate(tmp_rules_list):
                    intention_result = rules_to_intention(tmp_rules.rules)
                    covered_positive_sample_rates = []
                    for tmp_rule_id in tmp_rules.rules:
                        tmp_rule = tmp_rules.rules[tmp_rule_id]
                        tmp_rule_covered_positive_sample_rate = len(tmp_rule[1]) / len(positive_samples)
                        covered_positive_sample_rates.append(tmp_rule_covered_positive_sample_rate)
                    tmp_rules_log = {
                        "iteration": iteration_number,
                        "covered_positive_sample_rates": covered_positive_sample_rates,
                        "total_encoding_length": tmp_rules.total_encoding_length,
                        "intention_encoding_length": tmp_rules.intention_encoding_length,
                        "sample_encoding_length": tmp_rules.sample_encoding_length,
                        "encoding_length_compression_rates": tmp_rules.total_encoding_length / init_min_encoding_length,
                        "intention_result": intention_result
                    }
                    tmp_iteration_log.append(tmp_rules_log)
                merge_process_log.append(tmp_iteration_log)
                iteration_number += 1
    rules_list.sort(key=lambda x: x.total_encoding_length)
    best_rules = rules_list[0]
    time07 = time.time()
    time_all = time07 - time00
    # time use and so on
    method_log = {
        "time_use": {
            "time_use_sample_enhancement": time_use_sample_enhancement,
            "time_use_merge": time_use_merge,
            "time_use_others": time_all - time_use_sample_enhancement - time_use_merge
        },
        "merge_process": merge_process_log
    }
    best_rules.rules, best_rules.total_encoding_length = \
        filter_rules(best_rules.rules,
                     rule_covered_positive_sample_rate_threshold,
                     positive_samples, negative_samples,
                     per_positive_sample_times,
                     per_negative_sample_times)
    method_log = filter_method_log(method_log, rule_covered_positive_sample_rate_threshold)
    return best_rules.rules, best_rules.total_encoding_length, init_min_encoding_length, method_log


# only greedy search, without random merge
def get_intention_by_MDL_RM_g(samples, rule_covered_positive_sample_rate_threshold):
    return get_intention_by_method1(samples, "amcl", rule_covered_positive_sample_rate_threshold)


# greedy search and random merge
def get_intention_by_MDL_RM_r(samples, random_merge_number, rule_covered_positive_sample_rate_threshold):
    return get_intention_by_method6(samples, "amcl", random_merge_number, 1,
                                    rule_covered_positive_sample_rate_threshold)
