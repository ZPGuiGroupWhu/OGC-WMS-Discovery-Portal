# an implementation of RuleGO
# [1] Gruca A ,  Sikora M . Data- and expert-driven rule induction and filtering framework for functional
# interpretation and description of gene sets[J]. Journal of Biomedical Semantics, 2017, 8(1).

from MDL_RM.src.main.intention_recognition import Config, Run_MDL_RM
from MDL_RM.src.main.samples.input import OntologyUtil
from MDL_RM.src.main.samples.input.Data import Data

from scipy.special import comb
import copy

# params
#   rule = {(d1, v1), (d2, v2), ...}
#   terms_covered_samples = {"dim": {"term": {"relevance":set(), "irrelevance":set()}}}
# result
#   result = {("P", 0), ("N", 0), ...}
#   ("P", 0) means the sample in positive samples with index 0


def get_rule_covered_specific_samples_index(rule, terms_covered_samples, sample_category):
    result = set()
    first_term = True
    for tmp_term in rule:
        tmp_dim, tmp_value = tmp_term
        tmp_value_covered_specific_samples = None
        tmp_value_covered_samples = terms_covered_samples[tmp_dim][tmp_value]
        if sample_category == "positive":
            tmp_value_covered_specific_samples = tmp_value_covered_samples["relevance"]
        elif sample_category == "negative":
            tmp_value_covered_specific_samples = tmp_value_covered_samples["irrelevance"]
        if first_term:  # 某个概念可能本来覆盖的负样本就是0，因此不能通过result是否为空来判断
            result = result.union(tmp_value_covered_specific_samples)
            first_term = False
        else:
            result = result.intersection(tmp_value_covered_specific_samples)
    return result


def get_rule_covered_samples(rule, terms_covered_samples):
    result = set()
    for tmp_sample_index in get_rule_covered_specific_samples_index(rule, terms_covered_samples, "positive"):
        result.add(("P", tmp_sample_index))
    for tmp_sample_index in get_rule_covered_specific_samples_index(rule, terms_covered_samples, "negative"):
        result.add(("N", tmp_sample_index))
    return result


# get
def get_p_value(rule, positive_samples, negative_samples, terms_covered_samples):
    rule_covered_samples = get_rule_covered_samples(rule, terms_covered_samples)
    # get rule covered positive samples num, all samples num, positive samples num, rule covered samples num
    rule_covered_samples_num = len(rule_covered_samples)
    rule_covered_positive_samples_num = len(list(filter(lambda x: x[0] == "P", rule_covered_samples)))
    positive_samples_num = len(positive_samples)
    all_samples_num = positive_samples_num + len(negative_samples)
    tmp_value = 0
    N = all_samples_num
    M = rule_covered_samples_num
    n = positive_samples_num
    k = rule_covered_positive_samples_num
    for i in range(k - 1):
        tmp_value += comb(M, i) * comb(N - M, n - i) / comb(N, n)
    p_value = 1 - tmp_value
    return p_value


# params
#   candidate_rules = [rule1, rule2, ...]
#   rule1 = {(d1, v1), (d2, v2), ...}
#   result_rules = [rule1, rule2, ...]
#   terms_covered_samples = {"dim": {"term": {"relevance":set(), "irrelevance":set()}}}
def good_candidates(candidate_rules, positive_samples, negative_samples, terms_covered_samples):
    # before_num = len(candidate_rules)
    index_to_remove = []
    result_rules = []
    for i, tmp_rule in enumerate(candidate_rules):
        # TODO 更改前
        # tmp_rule_p_value = get_p_value(tmp_rule, positive_samples, negative_samples, terms_covered_samples)
        # if tmp_rule_p_value <= Config.RuleGO_statistical_significance_level:
        #     result_rules.append(tmp_rule)
        # # get rule support
        # tmp_rule_support = len(get_rule_covered_specific_samples_index(tmp_rule, terms_covered_samples, "positive"))
        # if tmp_rule_support < Config.RuleGO_min_support:
        #     index_to_remove.append(i)
        # TODO 更改后，先判断支持度，再判断显著性，只有支持度达到要求才考虑显著性，如此可减少多余操作
        # get rule support
        tmp_rule_support = len(get_rule_covered_specific_samples_index(tmp_rule, terms_covered_samples, "positive"))
        if tmp_rule_support < Config.RuleGO_min_support:
            index_to_remove.append(i)
        else:
            tmp_rule_p_value = get_p_value(tmp_rule, positive_samples, negative_samples, terms_covered_samples)
            # print(tmp_rule_p_value, tmp_rule)
            if tmp_rule_p_value <= Config.RuleGO_statistical_significance_level:
                result_rules.append(tmp_rule)
    candidate_rules_result = []
    for i in range(len(candidate_rules)):
        if i not in index_to_remove:
            candidate_rules_result.append(candidate_rules[i])
    # after_num = len(candidate_rules)
    # print(before_num, after_num)
    return candidate_rules_result, result_rules


# params
#   rule = {(d1, v1), (d2, v2), ...}
def extend_rule(rule, current_candidate_rules, candidate_terms, ancestors, ontologies):
    extension_rules = []
    if len(rule) == Config.RuleGO_max_term_num_in_rule:
        return extension_rules
    rule_term_in_candidate_rules_level_1_max_index = 0
    for tmp_term in rule:
        tmp_term_index = candidate_terms.index(tmp_term)
        if tmp_term_index > rule_term_in_candidate_rules_level_1_max_index:
            rule_term_in_candidate_rules_level_1_max_index = tmp_term_index
    # print(rule, rule_term_in_candidate_rules_level_1_max_index)
    for i in range(rule_term_in_candidate_rules_level_1_max_index + 1, len(candidate_terms)):
        tmp_term_to_add = candidate_terms[i]
        # check condition 1
        can_add = True
        for tmp_term_to_pop in rule:
            tmp_sub_rule_with_term_to_add = copy.deepcopy(rule)
            tmp_sub_rule_with_term_to_add.remove(tmp_term_to_pop)
            tmp_sub_rule_with_term_to_add.add(tmp_term_to_add)
            if tmp_sub_rule_with_term_to_add not in current_candidate_rules:
                can_add = False
                break
        if not can_add:
            continue
        # check condition 2, tmp_term_to_add is not located on the same path (from the root to the leaf in the GO graph)
        #   as any of the GO terms from the rule premise r
        tmp_dim_to_add, tmp_value_to_add = tmp_term_to_add
        for tmp_term in rule:
            tmp_dim, tmp_value = tmp_term
            if tmp_dim != tmp_dim_to_add or tmp_value == tmp_value_to_add:
                continue
            tmp_value_to_add_hypernyms = ancestors[tmp_dim_to_add][tmp_value_to_add]
            tmp_value_to_add_hyponyms = ontologies[tmp_dim_to_add][tmp_value_to_add]
            if tmp_value in tmp_value_to_add_hyponyms or tmp_value in tmp_value_to_add_hypernyms:
                can_add = False
                break
        if not can_add:
            continue
        else:
            extended_rule = copy.deepcopy(rule)
            extended_rule.add(tmp_term_to_add)
            extension_rules.append(extended_rule)
    return extension_rules


# terms = {"dim1": [term1, term2, ...], "dim2": [...], ...}
def rule_induction(terms, positive_samples, negative_samples, terms_covered_samples,
                   max_depths, direct_ancestors, ancestors, ontologies, ontology_root):
    result_rules = []  # result
    candidate_terms = []  # [(d1, v1), (d2, v2), ...]
    candidate_rules_level_1 = []  # [{(d1, v1)}, {(d2, v2)}, ...]
    for tmp_dim in terms:
        tmp_dim_terms = terms[tmp_dim]
        for tmp_term in tmp_dim_terms:
            if ontology_root[tmp_dim] == tmp_term:
                continue
            candidate_rules_level_1.append({(tmp_dim, tmp_term)})
    # candidate_rules_level_1 = eliminate(candidate_rules_level_1, ontology_root)
    candidate_rules_level_1, tmp_result_rules = \
        good_candidates(candidate_rules_level_1, positive_samples, negative_samples, terms_covered_samples)
    result_rules += tmp_result_rules
    for tmp_rule in candidate_rules_level_1:
        for tmp_term in tmp_rule:
            candidate_terms.append(tmp_term)
    current_candidate_rules = copy.deepcopy(candidate_rules_level_1)
    # print(result_rules)
    # print(len(candidate_terms), candidate_terms)
    # print(len(candidate_rules_level_1), candidate_rules_level_1)
    # print(current_candidate_rules)
    while len(current_candidate_rules) > 0:
        tmp_rule = current_candidate_rules[0]
        current_candidate_rules = current_candidate_rules[1:]
        tmp_extension_rules = extend_rule(tmp_rule, current_candidate_rules, candidate_terms, ancestors, ontologies)
        # print(tmp_extension_rules)

        tmp_extension_rules, tmp_result_rules = good_candidates(tmp_extension_rules, positive_samples,
                                                                negative_samples, terms_covered_samples)
        # print("tmp_result_rules", tmp_result_rules)
        # print("tmp_extension_rules", tmp_extension_rules)
        result_rules += tmp_result_rules
        # print(tmp_extension_rules)
        # print("result", result_rules)
        current_candidate_rules += tmp_extension_rules
    return result_rules


# QCompound(r) = Lenght(r)∗GO_Depth(r)∗mYAILS(r)
#   mYAILS(r) = (0.5 + 0.25prec(r))prec(r) + (0.5 − 0.25cov(r))cov(r)
def get_rule_interestingness_measure(rule, max_depth, direct_ancestors, ontology_root, positive_samples,
                                     terms_covered_samples):
    length = len(rule)
    # 计算depth时，原论文只用到GO一个本体，本研究用到多个本体，因此需要先在各个本体内部归一化，再将和归一化
    depth = 0
    for tmp_term in rule:
        tmp_dim, tmp_value = tmp_term
        tmp_level = OntologyUtil.get_concept_max_depth(tmp_value, direct_ancestors[tmp_dim], ontology_root[tmp_dim]) - 1
        # print("\t", tmp_level)
        tmp_dim_max_level = max_depth[tmp_dim] - 1
        tmp_term_normalized_level = tmp_level / tmp_dim_max_level
        depth += tmp_term_normalized_level
    depth /= len(rule)
    rule_covered_samples = get_rule_covered_samples(rule, terms_covered_samples)
    # get rule covered positive samples num, all samples num, positive samples num, rule covered samples num
    rule_covered_samples_num = len(rule_covered_samples)
    rule_covered_positive_samples_num = len(list(filter(lambda x: x[0] == "P", rule_covered_samples)))
    positive_samples_num = len(positive_samples)
    precision = rule_covered_positive_samples_num / rule_covered_samples_num
    cover = rule_covered_positive_samples_num / positive_samples_num
    mYAILS = (0.5 + 0.25 * precision) * precision + (0.5 + 0.25 * cover) * cover
    # print(depth, mYAILS)
    return length * depth * mYAILS


def get_unique_terms_num(rule_a, rule_b, ontologies):
    result = 0
    for tmp_term in rule_a:
        tmp_dim, tmp_value = tmp_term
        is_unique = True
        for tmp_term_in_rule_b in rule_b:
            tmp_dim_rule_b, tmp_value_rule_b = tmp_term_in_rule_b
            if tmp_dim_rule_b != tmp_dim:
                continue
            if tmp_value == tmp_value_rule_b:
                is_unique = False
                break
            if tmp_value in ontologies[tmp_dim][tmp_value_rule_b] or tmp_value_rule_b in ontologies[tmp_dim][tmp_value]:
                is_unique = False
                break
        if is_unique:
            result += 1
    return result


# sim(ri, rj) = 1 − (?uGOterms(ri, rj) + ?uGOterms(rj, ri))  / (?GOterms(ri) + ?GOterms(rj))
def get_similarity_of_rules(rule_a, rule_b, ontologies):
    unique_terms_in_rule_a_num = get_unique_terms_num(rule_a, rule_b, ontologies)
    unique_terms_in_rule_b_num = get_unique_terms_num(rule_b, rule_a, ontologies)
    terms_in_rule_a_num = len(rule_a)
    terms_in_rule_b_num = len(rule_b)
    return 1 - (unique_terms_in_rule_a_num + unique_terms_in_rule_b_num) / (terms_in_rule_a_num + terms_in_rule_b_num)


# 在保证对正样本的覆盖的情况下，去除那些被更有趣的规则覆盖且与之相似度在阈值之下的规则
# params
#   sorted_rules: the rules sorted by rule_interestingness_measure
def rule_filtering_level_1(sorted_rules, terms_covered_samples, ontologies):
    result_rules = []
    tmp_sorted_rules = copy.deepcopy(sorted_rules)
    while len(tmp_sorted_rules) > 0:
        tmp_rule = tmp_sorted_rules.pop(0)
        tmp_rule_covered_positive_samples_index = \
            get_rule_covered_specific_samples_index(tmp_rule, terms_covered_samples, "positive")
        result_rules.append(tmp_rule)
        rule_to_keep_indexed = []
        for i in range(len(tmp_sorted_rules)):
            tmp_remain_rule = tmp_sorted_rules[i]
            tmp_remain_rule_covered_positive_samples_index = \
                get_rule_covered_specific_samples_index(tmp_remain_rule, terms_covered_samples, "positive")
            if tmp_remain_rule_covered_positive_samples_index.issubset(tmp_rule_covered_positive_samples_index):
                if Config.RuleGO_use_similarity_criteria:
                    if get_similarity_of_rules(tmp_rule, tmp_remain_rule,
                                               ontologies) < Config.RuleGO_rule_similarity_threshold:
                        # result_rules.append(tmp_remain_rule)
                        rule_to_keep_indexed.append(i)
                        # result_rules = sorted_rules.append(tmp_remain_rule)
            else:
                rule_to_keep_indexed.append(i)
        new_tmp_sorted_rules = []
        for i in rule_to_keep_indexed:
            new_tmp_sorted_rules.append(tmp_sorted_rules[i])
        tmp_sorted_rules = new_tmp_sorted_rules
    return result_rules


# 在保证对正样本的覆盖的情况下，去除那些与更有趣的规则的相似度在阈值之下的规则
# params
#   sorted_rules: the rules sorted by rule_interestingness_measure
def rule_filtering_level_2(sorted_rules, terms_covered_samples, ontologies):
    result_rules = []
    sorted_rules_covered_positive_samples_index = set()
    for tmp_rule in sorted_rules:
        sorted_rules_covered_positive_samples_index = \
            sorted_rules_covered_positive_samples_index.union(
                get_rule_covered_specific_samples_index(tmp_rule, terms_covered_samples, "positive"))

    current_rules_covered_positive_samples_index = set()
    for tmp_rule in sorted_rules:
        tmp_rule_covered_positive_samples_index = \
            get_rule_covered_specific_samples_index(tmp_rule, terms_covered_samples, "positive")
        # 如果当前规则能够增加整个规则集对样本的覆盖，则需要保留
        current_rules_covered_positive_samples_num = len(current_rules_covered_positive_samples_index)
        rules_covered_positive_samples_index_added_tmp_rule = \
            current_rules_covered_positive_samples_index.union(tmp_rule_covered_positive_samples_index)
        rules_covered_positive_samples_num_added_tmp_rule = len(rules_covered_positive_samples_index_added_tmp_rule)
        if current_rules_covered_positive_samples_num < rules_covered_positive_samples_num_added_tmp_rule:
            result_rules.append(tmp_rule)
            current_rules_covered_positive_samples_index = rules_covered_positive_samples_index_added_tmp_rule
        else:
            if Config.RuleGO_use_similarity_criteria:
                # 如果没有增加整个规则集对样本的覆盖，则查看是否当前规则与已存在的所有规则的相似度都小于阈值
                #   如果都小于阈值，则保留。即是说如果和任意一个已存在的规则的相似度大于阈值的话，就不能保留
                can_keep = True
                for tmp_result_rule in result_rules:
                    if get_similarity_of_rules(tmp_rule, tmp_result_rule,
                                               ontologies) >= Config.RuleGO_rule_similarity_threshold:
                        can_keep = False
                        break
                if can_keep:
                    result_rules.append(tmp_rule)
    return result_rules


# 将提取的规则转化为意图
# TODO 这里的规则允许一个维度包含多个取值，如何转化呢？
#   先认为不会出现这种情况
def result_rules_to_intention(result_rules, ancestors, ontology_root):
    intention = []
    for tmp_rule in result_rules:
        tmp_sub_intention = {}
        for tmp_dim_value in tmp_rule:
            tmp_dim, tmp_value = tmp_dim_value
            tmp_sub_intention[tmp_dim] = tmp_value
        for tmp_dim in ontology_root:
            if tmp_dim not in tmp_sub_intention:
                tmp_sub_intention[tmp_dim] = ontology_root[tmp_dim]
        intention.append(tmp_sub_intention)
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


def RuleGo(terms, positive_samples, negative_samples, terms_covered_samples,
           direct_ancestors, ancestors, ontologies, ontology_root):
    max_depths = {}
    dimensions = list(positive_samples[0].keys())
    for tmp_dim in dimensions:
        max_depths[tmp_dim] = OntologyUtil.get_max_depth(direct_ancestors[tmp_dim],
                                                         ontologies[tmp_dim], ontology_root[tmp_dim])
    # 获取候选规则
    result_rules = rule_induction(terms, positive_samples, negative_samples, terms_covered_samples,
                                  max_depths, direct_ancestors, ancestors, ontologies, ontology_root)
    # 根据有趣度降序排序
    result_rules.sort(key=lambda x: get_rule_interestingness_measure(x, max_depths, direct_ancestors, ontology_root,
                                                                     positive_samples, terms_covered_samples),
                      reverse=True)
    # 第一层过滤
    result_rules = rule_filtering_level_1(result_rules, terms_covered_samples, ontologies)
    # 第二层过滤
    result_rules = rule_filtering_level_2(result_rules, terms_covered_samples, ontologies)
    result_intention = result_rules_to_intention(result_rules, ancestors, ontology_root)
    return result_intention


