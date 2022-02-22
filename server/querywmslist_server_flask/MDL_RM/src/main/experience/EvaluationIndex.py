# the evaluation index of the methods
from MDL_RM.src.main.util.RetrievalUtil import retrieve_docs_by_complete_intention
import copy
from itertools import permutations

# the Jaccard Distance
from MDL_RM.src.main.samples.input import OntologyUtil


def get_jaccard_index(samples, real_intention, extracted_intention, ontologies, ontology_root):
    # retrieve the samples
    positive_samples = samples["relevance"]
    negative_samples = samples["irrelevance"]
    real_intention_retrieved_positive_samples_index = \
        retrieve_docs_by_complete_intention(real_intention, positive_samples, ontologies, ontology_root)
    real_intention_retrieved_negative_samples_index = \
        retrieve_docs_by_complete_intention(real_intention, negative_samples, ontologies, ontology_root)

    extracted_intention_retrieved_positive_samples_index = \
        retrieve_docs_by_complete_intention(extracted_intention, positive_samples, ontologies, ontology_root)
    extracted_intention_retrieved_negative_samples_index = \
        retrieve_docs_by_complete_intention(extracted_intention, negative_samples, ontologies, ontology_root)

    tmp_value1_positive_samples = len(real_intention_retrieved_positive_samples_index.intersection(
        extracted_intention_retrieved_positive_samples_index))
    tmp_value2_positive_samples = len(real_intention_retrieved_positive_samples_index.union(
        extracted_intention_retrieved_positive_samples_index))
    tmp_value1_negative_samples = len(real_intention_retrieved_negative_samples_index.intersection(
        extracted_intention_retrieved_negative_samples_index))
    tmp_value2_negative_samples = len(real_intention_retrieved_negative_samples_index.union(
        extracted_intention_retrieved_negative_samples_index))
    tmp_value1 = tmp_value1_positive_samples + tmp_value1_negative_samples
    tmp_value2 = tmp_value2_positive_samples + tmp_value2_negative_samples
    return tmp_value1 / tmp_value2


# 这里的实现与MDL_RM不同，包括：只针对子意图；不考虑取值全为根节点的维度
def similarity_of_sub_intentions(sub_intention1, sub_intention2, direct_ancestors, ontology_root,
                                 concept_information_content_yuan2013):
    if sub_intention2 is None or sub_intention1 is None:
        return 0
    considered_dimension_num = 0
    sum_similarity = 0
    for tmp_dim in sub_intention1:
        sub_intention1_tmp_dim_value = sub_intention1[tmp_dim]
        sub_intention2_tmp_dim_value = sub_intention2[tmp_dim]
        considered_dimension_num += 1
        _, tmp_similarity = OntologyUtil.get_similarity_Lin(sub_intention1_tmp_dim_value,
                                                            sub_intention2_tmp_dim_value,
                                                            direct_ancestors[tmp_dim], ontology_root[tmp_dim],
                                                            concept_information_content_yuan2013[tmp_dim])
        sum_similarity += tmp_similarity
    if considered_dimension_num == 0:
        return 0
    return sum_similarity / considered_dimension_num


# 计算补空意图后最佳映射平均相似度BMASS
#   1.将子意图数量较少的意图添加空子意图使两个意图子意图数量相等
#   2.得到两个意图间所有的一对一映射，定义所有具有映射关系的子意图的语义相似度之和取平均作为两个意图的相似度
#   3.将最大相似度作为两个意图的最终相似度
def get_intention_similarity(intention_a, intention_b, direct_ancestors, ontology_root,
                             concept_information_content_yuan2013):
    # if
    intention_a_copy = copy.deepcopy(intention_a)
    intention_b_copy = copy.deepcopy(intention_b)
    # 以None代表空子意图
    min_length_intention = intention_a_copy if len(intention_a_copy) <= len(intention_b_copy) else intention_b_copy
    max_length_intention = intention_a_copy if len(intention_a_copy) > len(intention_b_copy) else intention_b_copy

    # 得到所有映射, 固定一个意图的子意图顺序不变，求另一个意图所有的子意图排列情况
    # 固定min_length_intention, 排列max_length_intention，排列通过索引实现
    maps = permutations(range(len(max_length_intention)), len(min_length_intention))
    max_similarity = 0
    for tmp_max_length_intention_index in maps:
        # 对于每一种映射，求取其相似度
        tmp_similarity = 0
        for i in range(len(tmp_max_length_intention_index)):
            tmp_min_length_sub_intention_index = i
            tmp_max_length_sub_intention_index = tmp_max_length_intention_index[i]
            tmp_min_length_sub_intention = min_length_intention[tmp_min_length_sub_intention_index]
            tmp_max_length_sub_intention = max_length_intention[tmp_max_length_sub_intention_index]
            tmp_sub_intention_similarity = similarity_of_sub_intentions(tmp_min_length_sub_intention,
                                                                        tmp_max_length_sub_intention,
                                                                        direct_ancestors, ontology_root,
                                                                        concept_information_content_yuan2013)
            tmp_similarity += tmp_sub_intention_similarity
        tmp_similarity /= len(max_length_intention)  # 平均相似度
        if max_similarity < tmp_similarity:
            max_similarity = tmp_similarity
    return max_similarity  # 以最佳映射作为最终相似度结果


def get_precision(test_samples, real_intention, extracted_intention, ontologies, ontology_root):
    positive_samples = test_samples["relevance"]
    negative_samples = test_samples["irrelevance"]
    all_samples = positive_samples + negative_samples
    real_intention_retrieved_all_samples_index = \
        retrieve_docs_by_complete_intention(real_intention, all_samples, ontologies, ontology_root)
    extracted_intention_retrieved_all_samples_index = \
        retrieve_docs_by_complete_intention(extracted_intention, all_samples, ontologies, ontology_root)
    true_positive_num = \
        len(real_intention_retrieved_all_samples_index & extracted_intention_retrieved_all_samples_index)
    result = 0 if true_positive_num == 0 else true_positive_num / len(extracted_intention_retrieved_all_samples_index)
    return result


def get_recall(test_samples, real_intention, extracted_intention, ontologies, ontology_root):
    positive_samples = test_samples["relevance"]
    negative_samples = test_samples["irrelevance"]
    all_samples = positive_samples + negative_samples
    real_intention_retrieved_all_samples_index = \
        retrieve_docs_by_complete_intention(real_intention, all_samples, ontologies, ontology_root)
    extracted_intention_retrieved_all_samples_index = \
        retrieve_docs_by_complete_intention(extracted_intention, all_samples, ontologies, ontology_root)
    true_positive_num = \
        len(real_intention_retrieved_all_samples_index & extracted_intention_retrieved_all_samples_index)
    result = true_positive_num / len(real_intention_retrieved_all_samples_index)
    return result


def get_F1_score(test_samples, real_intention, extracted_intention, ontologies, ontology_root):
    precision = get_precision(test_samples, real_intention, extracted_intention, ontologies, ontology_root)
    recall = get_recall(test_samples, real_intention, extracted_intention, ontologies, ontology_root)
    result = 2 * precision * recall / (recall + precision)
    return result




