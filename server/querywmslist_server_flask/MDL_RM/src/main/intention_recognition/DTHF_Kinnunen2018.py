# an implementation of DTHF
# [1] Kinnunen N . Decision tree learning with hierarchical features.  2018.


from MDL_RM.src.main.intention_recognition import Config, Run_MDL_RM
from MDL_RM.src.main.samples.input import OntologyUtil
from MDL_RM.src.main.samples.input.Data import Data
from math import log2, inf
import copy


# params
#   samples = [{"dim1": [value1, value2, ...], "dim2":[...], ...}, ...]
#   direct_ancestors: the direct ancestors for every dim
#   ontology_root: ontologies root concept for every dim
# return
#   result_samples = [{"d1":[[concept_depth_2, concept_depth_3, ...], [concept_depth_2, ...]], "d2":[], ...}]
def transform_data(samples, direct_ancestors, ontology_root):
    result_samples = []
    for tmp_sample in samples:
        tmp_result_sample = {}
        for tmp_dim in tmp_sample:
            tmp_dim_values = tmp_sample[tmp_dim]
            tmp_result_sample_tmp_dim_values = []
            if ontology_root[tmp_dim] not in tmp_dim_values:  # which means this dimension has value
                # for every value generate a list indicate the path to the root concept
                for tmp_value in tmp_dim_values:
                    tmp_value_paths_to_root = \
                        OntologyUtil.get_paths_to_root(tmp_value, direct_ancestors[tmp_dim], ontology_root[tmp_dim])
                    for tmp_path_to_root in tmp_value_paths_to_root:  # a concept may have many paths to root
                        tmp_path_to_root.reverse()
                        tmp_path_to_root.pop(0)  # remove the root concept
                        tmp_result_sample_tmp_dim_values.append(tmp_path_to_root)
            tmp_result_sample[tmp_dim] = tmp_result_sample_tmp_dim_values
        result_samples.append(tmp_result_sample)
    return result_samples


class Node:
    """the node of the decision tree"""

    def __init__(self, rule, positive_samples, negative_samples):
        self.rule = rule
        self.positive_samples = positive_samples
        self.negative_samples = negative_samples
        self.optimal_node = None
        self.different_node = None
        self.missing_node = None


def get_entropy(positive_samples_num, negative_samples_num):
    if positive_samples_num == 0 or negative_samples_num == 0:
        return 0
    p = positive_samples_num / (positive_samples_num + negative_samples_num)
    return - p * log2(p) - (1 - p) * log2(1 - p)


# 获取根据分裂值对应的规则产生的满足规则的样本、不满足规则的样本与在分裂值所在维度缺失值的样本
def get_optimal_different_missing_samples(split_value, samples):
    dim, value = split_value
    optimal_samples = []
    different_samples = []
    missing_samples = []
    for tmp_sample in samples:
        tmp_dim_hierarchical_values_list = tmp_sample[dim]
        if len(tmp_dim_hierarchical_values_list) == 0:  # 如果当前样本在此维度没有值，则跳过
            missing_samples.append(tmp_sample)
            continue
        cover = False
        for tmp_hierarchical_values in tmp_dim_hierarchical_values_list:
            if value in tmp_hierarchical_values:
                cover = True
                break
        if cover:
            optimal_samples.append(tmp_sample)
        else:
            different_samples.append(tmp_sample)
    return optimal_samples, different_samples, missing_samples


# params
#   split_value = (dim, value)
def get_information_gain(split_value, positive_samples, negative_samples):
    # get E(S)
    E_s = get_entropy(len(positive_samples), len(negative_samples))
    # split samples
    optimal_positive_samples, different_positive_samples, missing_positive_samples = \
        get_optimal_different_missing_samples(split_value, positive_samples)
    optimal_negative_samples, different_negative_samples, missing_negative_samples = \
        get_optimal_different_missing_samples(split_value, negative_samples)
    optimal_positive_sample_nums = len(optimal_positive_samples)
    different_positive_sample_nums = len(different_positive_samples)
    optimal_negative_sample_nums = len(optimal_negative_samples)
    different_negative_sample_nums = len(different_negative_samples)
    all_samples_num = optimal_positive_sample_nums + different_positive_sample_nums \
                      + optimal_negative_sample_nums + different_negative_sample_nums
    optimal_samples_probability = (optimal_positive_sample_nums + optimal_negative_sample_nums) / all_samples_num
    different_samples_probability = (different_positive_sample_nums + different_negative_sample_nums) / all_samples_num
    E_s_given_x = optimal_samples_probability * get_entropy(optimal_positive_sample_nums, optimal_negative_sample_nums) \
                  + different_samples_probability * get_entropy(different_positive_sample_nums,
                                                                different_negative_sample_nums)
    information_gain = E_s - E_s_given_x
    return information_gain


# find the optimal split rule
# params
#   rule = {"dim": [value1, value2, ...], ...}
#   positive_samples: the positive samples
#   negative_samples: the negative samples
# return
#   result = (dim, split_value)
# 如果rule中所有维度的概念都是叶子概念，则此规则将无法再被分割
def get_optimal_split_rule(rule, positive_samples, negative_samples):
    # get all possible (dim, value) pairs of the samples
    # TODO here just considering the value from the positive samples
    #  but in standard DT, the value can come from negative sample
    possible_values_parent_values = {}
    dim_will_not_use = []  # 由于在此维度上有数据缺失而不被使用的维度
    for tmp_dim in rule:
        if "END" in rule[tmp_dim]:
            dim_will_not_use.append(tmp_dim)
        else:  # 如果此维度可以使用
            # 如果此维度已经被使用过，则将最后一个概念（最具体）作为概念抽象度限制，否则使用此维度名称代表此维度没有被使用过
            possible_values_parent_values[tmp_dim] = rule[tmp_dim][-1] if len(rule[tmp_dim]) > 0 else tmp_dim
    possible_split_values = []
    for tmp_sample in positive_samples:
        for tmp_dim in tmp_sample:
            if tmp_dim in dim_will_not_use:
                continue
            tmp_dim_hierarchical_values_list = tmp_sample[tmp_dim]
            if len(tmp_dim_hierarchical_values_list) == 0:  # 如果当前样本在当前维度没有值
                continue
            for tmp_hierarchical_values in tmp_dim_hierarchical_values_list:
                if possible_values_parent_values[tmp_dim] not in tmp_hierarchical_values:
                    # 如果此路径中的概念没有被作为分裂规则，则将此路径中的第一个概念作为分裂规则概念
                    tmp_split_value = tmp_hierarchical_values[0]
                    possible_split_values.append((tmp_dim, tmp_split_value))
                else:
                    # 如果此路径中的第i个概念已经是规则中的概念，则将第i+1个概念作为分裂规则候选概念
                    # 如果第i个概念刚好是此路径中的最后一个概念，则此路径没有规则候选概念
                    if tmp_hierarchical_values[-1] == possible_values_parent_values[tmp_dim]:
                        continue
                    else:
                        tmp_dim_possible_values_parent_values_index = \
                            tmp_hierarchical_values.index(possible_values_parent_values[tmp_dim])
                        # 未更改的版本
                        # tmp_split_value = tmp_hierarchical_values[tmp_dim_possible_values_parent_values_index + 1]
                        # possible_split_values.append((tmp_dim, tmp_split_value))
                        # TODO 更改0：能够作为分类规则备选值的概念不一定是已有规则的直接子概念，而是所有下位概念
                        #   这样虽然增加了计算量，但能避免贪心算法陷入局部最优解
                        for i in range(tmp_dim_possible_values_parent_values_index + 1, len(tmp_hierarchical_values)):
                            tmp_split_value = tmp_hierarchical_values[i]
                            possible_split_values.append((tmp_dim, tmp_split_value))
    # print(possible_split_values)
    # find the best split value, use the information gain
    max_information_gain = -inf
    best_split_value = None
    tmp_cache = []
    for tmp_split_value in possible_split_values:
        tmp_split_value_information_gain = get_information_gain(tmp_split_value, positive_samples, negative_samples)
        tmp_cache.append((tmp_split_value, tmp_split_value_information_gain))
        if tmp_split_value_information_gain > max_information_gain:
            best_split_value = tmp_split_value
            max_information_gain = tmp_split_value_information_gain
    tmp_cache.sort(key=lambda x: x[1], reverse=True)
    return best_split_value


def grow(node):
    if node is None:
        return
    rule = node.rule
    positive_samples = node.positive_samples
    negative_samples = node.negative_samples
    # 如果达到停止条件，则设置为叶子节点，不继续划分
    if len(positive_samples) == 0 or len(negative_samples) == 0:
        return
    else:
        # find the best split value
        optimal_split_value = get_optimal_split_rule(rule, positive_samples, negative_samples)
        if optimal_split_value is None:  # 如果rule中所有维度的概念都是叶子概念，则此规则将无法再被分割
            return
        split_dim, split_value = optimal_split_value
        # split
        optimal_positive_samples, different_positive_samples, missing_positive_samples = \
            get_optimal_different_missing_samples(optimal_split_value, positive_samples)
        optimal_negative_samples, different_negative_samples, missing_negative_samples = \
            get_optimal_different_missing_samples(optimal_split_value, negative_samples)
        # create children nodes
        rule_optimal = copy.deepcopy(rule)
        rule_optimal[split_dim].append(split_value)
        optimal_node = Node(rule_optimal, optimal_positive_samples, optimal_negative_samples)
        node.optimal_node = optimal_node
        rule_different = copy.deepcopy(rule)
        different_node = Node(rule_different, different_positive_samples, different_negative_samples)
        node.different_node = different_node
        # 未更改
        # if len(missing_negative_samples) + len(missing_positive_samples) > 0:
        #     rule_missing = copy.deepcopy(rule)
        #     rule_missing[split_dim].append("END")  # END means this dimension will not be used
        #     missing_node = Node(rule_missing, positive_samples, negative_samples)
        #     node.missing_node = missing_node

        # # TODO 更改1：如果缺失值的样本只属于某一维度，则直接作为子节点
        if len(missing_negative_samples) + len(missing_positive_samples) > 0:
            rule_missing = copy.deepcopy(rule)
            rule_missing[split_dim].append("END")  # END means this dimension will not be used
            missing_node = Node(rule_missing, missing_positive_samples, missing_negative_samples)  # 这里通过只传递缺失样本实现
            node.missing_node = missing_node
        # print(rule, len(positive_samples), len(negative_samples))
        # if node.optimal_node is not None:
        #     print("\t", node.optimal_node.rule, len(node.optimal_node.positive_samples),
        #           len(node.optimal_node.negative_samples))
        # if node.different_node is not None:
        #     print("\t", node.different_node.rule, len(node.different_node.positive_samples),
        #           len(node.different_node.negative_samples))
        # if node.missing_node is not None:
        #     print("\t", node.missing_node.rule, len(node.missing_node.positive_samples),
        #           len(node.missing_node.negative_samples))
        grow(node.optimal_node)
        grow(node.different_node)
        grow(node.missing_node)


def DT2intentionHelp(node, intention, ontology_root):
    if node is None:
        return
    # find all leaf nodes
    # 只选择那些正样本数量大于负样本数量的节点
    # TODO 更改：增加基于最小支持度的剪枝策略
    if node.optimal_node is None and node.different_node is None and node.missing_node is None \
            and len(node.positive_samples) > len(node.negative_samples) \
            and (True if not Config.DTHF_use_min_support else (len(node.positive_samples) > Config.DTHF_min_support)):

        tmp_rule = node.rule
        tmp_sub_intention = {}
        for tmp_dim in tmp_rule:
            tmp_dim_values = tmp_rule[tmp_dim]
            if len(tmp_dim_values) == 0:
                tmp_dim_intention_value = ontology_root[tmp_dim]
            else:
                tmp_dim_intention_value = tmp_dim_values[-1]
                if tmp_dim_intention_value == "END":
                    tmp_dim_intention_value = ontology_root[tmp_dim]
            tmp_sub_intention[tmp_dim] = tmp_dim_intention_value
        intention.append(tmp_sub_intention)
    else:
        DT2intentionHelp(node.optimal_node, intention, ontology_root)
        DT2intentionHelp(node.different_node, intention, ontology_root)
        DT2intentionHelp(node.missing_node, intention, ontology_root)


# 将决策树结果转换为意图的形式
def DT_to_intention(node, ancestors, ontology_root):
    intention = []
    # 将每条规则转化为子意图
    DT2intentionHelp(node, intention, ontology_root)
    # 去除相互覆盖的子意图，对于一个子意图，若找不到覆盖其的子意图，则视为需要保留的子意图
    result = []
    for i, tmp_sub_intention in enumerate(intention):
        keep = True
        for j, other_tmp_sub_intention in enumerate(intention):
            if i == j:
                continue
            if Run_MDL_RM.is_intention_cover(other_tmp_sub_intention, tmp_sub_intention, ancestors, ontology_root):
                keep = False
                break
        if keep:
            result.append(tmp_sub_intention)
    if len(result) == 0:
        tmp_sub_intention = {}
        for tmp_dim in Data.Ontology_Root:
            tmp_sub_intention[tmp_dim] = Data.Ontology_Root[tmp_dim]
        result.append(tmp_sub_intention)
    return result


def DTHF(positive_samples, negative_samples, direct_ancestors, ancestors, ontology_root):
    transformed_positive_samples = transform_data(positive_samples, direct_ancestors, ontology_root)
    transformed_negative_samples = transform_data(negative_samples, direct_ancestors, ontology_root)
    rule_root = {}
    dimensions = list(positive_samples[0].keys())
    for tmp_dim in dimensions:
        rule_root[tmp_dim] = []
    root_node = Node(rule_root, transformed_positive_samples, transformed_negative_samples)
    grow(root_node)
    intention = DT_to_intention(root_node, ancestors, ontology_root)
    return intention
