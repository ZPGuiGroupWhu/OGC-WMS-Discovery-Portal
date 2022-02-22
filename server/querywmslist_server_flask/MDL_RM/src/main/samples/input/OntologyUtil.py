#

import copy
import math
import time


def get_paths_to_root_help(tmp_paths, direct_ancestor, ontology_root_concept, complete_path):
    if len(tmp_paths) == 0:
        return complete_path
    else:
        new_tmp_paths = []
        for tmp_path in tmp_paths:
            tmp_concept = tmp_path[-1]
            if tmp_concept == ontology_root_concept:
                complete_path.append(tmp_path)
            else:
                tmp_concept_direct_ancestors = direct_ancestor[tmp_concept]
                if len(tmp_concept_direct_ancestors) == 0:
                    complete_path.append(tmp_path)
                else:
                    for tmp_ancestor in tmp_concept_direct_ancestors:
                        if tmp_ancestor in tmp_path:
                            continue
                        else:
                            new_tmp_paths.append(copy.deepcopy(tmp_path) + [tmp_ancestor])
        return get_paths_to_root_help(new_tmp_paths, direct_ancestor, ontology_root_concept, complete_path)


def get_paths_to_root(concept, direct_ancestor, ontology_root_concept):
    paths_to_root = get_paths_to_root_help([[concept]], direct_ancestor, ontology_root_concept, [])
    for tmp_path in paths_to_root:
        if len(tmp_path) >= 100:
            print(tmp_path)
    return paths_to_root


# 获取某个维度的两个概念的最低公共祖先概念
# Bug 修复
#   原因：不应该使用高度判断公共祖先概念的远近，因为对两个叶子概念来说多个直接公共祖先概念具有相同的高度
#   修复方法：使用深度判断
#   修复日期：2021年7月26日16点57分
#   修复版本：20210713
def getLCA(c1, c2, direct_ancestor, ontology_root_concept):
    # 若有概念是根概念，则直接返回根概念
    if c1 == ontology_root_concept or c2 == ontology_root_concept:
        return ontology_root_concept
    # 若两个概念无公共祖先概念，也返回根概念
    concept1_paths = get_paths_to_root(c1, direct_ancestor, ontology_root_concept)
    concept2_paths = get_paths_to_root(c2, direct_ancestor, ontology_root_concept)
    LCAs = []
    for tmp_c1_path in concept1_paths:
        for tmp_c2_path in concept2_paths:
            i = -1
            while tmp_c1_path[i] == tmp_c2_path[i]:
                i -= 1
                if abs(i) > min(len(tmp_c1_path), len(tmp_c2_path)):
                    break
            i += 1
            LCAs.append(tmp_c1_path[i])
    # print(LCAs)
    # LCAs_height = []
    LCAs_depth = []
    for tmp_LCA in LCAs:
        # min_height = math.inf
        max_depth = 0
        for tmp_c1_path in concept1_paths:
            if tmp_LCA not in tmp_c1_path:
                continue
            try:
                # tmp_height = tmp_c1_path.index(tmp_LCA)
                tmp_depth = len(tmp_c1_path) - tmp_c1_path.index(tmp_LCA)
            except ValueError:
                print(c1, c2, concept1_paths, concept2_paths)
                raise ValueError
            # if tmp_height < min_height:
            #     min_height = tmp_height
            if tmp_depth > max_depth:
                max_depth = tmp_depth
        # LCAs_height.append([tmp_LCA, min_height])
        LCAs_depth.append([tmp_LCA, max_depth])
    # LCAs_height.sort(key=lambda x: x[1])
    LCAs_depth.sort(key=lambda x: x[1], reverse=True)
    return LCAs_depth[0][0]


def get_all_leaves_set(ontology):
    return set(list(filter(lambda x: len(ontology[x]) == 0, list(ontology.keys()))))


def get_concept_max_depth(concept, direct_ancestor, ontology_root_concept):
    concept_paths = get_paths_to_root(concept, direct_ancestor, ontology_root_concept)
    return max([len(x) for x in concept_paths])


def get_max_depth(direct_ancestor, ontology, ontology_root_concept):
    all_leaves_list = list(get_all_leaves_set(ontology))
    all_leaves_max_depth = [get_concept_max_depth(x, direct_ancestor, ontology_root_concept) for x in all_leaves_list]
    return max(all_leaves_max_depth)


def get_concept_leaves_num(concept, ontology):
    concept_hyponyms_set = set(ontology[concept])
    ontology_leaves = get_all_leaves_set(ontology)
    concept_leaves = concept_hyponyms_set.intersection(ontology_leaves)
    return len(concept_leaves)


# Yuan 2013
def get_information_content(concept_depth, max_depth, hypernyms_num, max_nodes, leaves_num, max_leaves_num):
    f_depth = math.log2(concept_depth) / math.log2(max_depth)
    f_hypernyms = math.log2(hypernyms_num + 1) / math.log2(max_nodes)
    f_leaves = math.log2(leaves_num + 1) / math.log2(max_leaves_num + 1)
    return f_depth * (1 - f_leaves) + f_hypernyms


# calculate similarity
# Lin
def get_similarity_Lin(c1, c2, direct_ancestor, ontology_root_concept, concept_information_content_yuan2013):
    if c1 == c2:
        return c1, 1
    if c1 == ontology_root_concept or c2 == ontology_root_concept:
        return ontology_root_concept, 0
    concept1_ic = concept_information_content_yuan2013[c1]
    concept2_ic = concept_information_content_yuan2013[c2]
    max_depth_LCA = getLCA(c1, c2, direct_ancestor, ontology_root_concept)
    max_depth_LCA_ic = concept_information_content_yuan2013[max_depth_LCA]
    if max_depth_LCA_ic == 0:
        return max_depth_LCA, 0
    if concept1_ic + concept2_ic == 0:
        print(c1, c2)
        raise
    similarity_Lin = 2 * max_depth_LCA_ic / (concept1_ic + concept2_ic)
    return max_depth_LCA, similarity_Lin


def get_balance(ontology, ancestor):
    root_concept = list(filter(lambda x: ancestor[x] == [], list(ancestor.keys())))[0]
    top_concepts = list(filter(lambda x: ancestor[x] == [root_concept], list(ancestor.keys())))
    top_concepts_hyponyms_count = []
    for tmp_concept in top_concepts:
        top_concepts_hyponyms_count.append(len(ontology[tmp_concept]))
    print(top_concepts_hyponyms_count)
    sum_hyponyms = sum(top_concepts_hyponyms_count) + len(top_concepts_hyponyms_count)
    top_concepts_hyponyms_probabilities = [(x + 1) / sum_hyponyms for x in top_concepts_hyponyms_count]
    print(top_concepts_hyponyms_probabilities)
    result = 0
    from math import log2
    print(log2(len(top_concepts_hyponyms_probabilities)))
    for tmp_value in top_concepts_hyponyms_probabilities:
        result += -tmp_value * log2(tmp_value)
    return result


if __name__ == "__main__":
    import SWEET

    test_concept_1 = "http://sweetontology.net/propTemperature/IonTemperature"
    test_concept_2 = "http://sweetontology.net/propTemperature/MeanAnnualTemperature"
    test_concept_3 = "http://sweetontology.net/propTemperature/Temperature"
    test_concept_4 = "http://sweetontology.net/matrElement/Mercury"
    test_concept_5 = "http://sweetontology.net/matrElement/Zinc"
    # print(get_similarity_Lin(test_concept_1, test_concept_2, SWEET.direct_Ancestor_All_Dimensions,
    #                          SWEET.Ontology_Root,
    #                          SWEET.Information_Content))
    # print(get_similarity_Lin(test_concept_1, test_concept_3, SWEET.direct_Ancestor_All_Dimensions,
    #                          SWEET.Ontology_Root,
    #                          SWEET.Information_Content))
    # print(get_balance(GeoNamesAmerica.Ontologies, GeoNamesAmerica.Ancestors))
    # print(get_balance(SWEET.Ontologies_All_Dimensions, SWEET.Ancestor_All_Dimensions))
    # print(get_paths_to_root(test_concept_1, SWEET.direct_Ancestor_All_Dimensions,  SWEET.Ontology_Root))
    time0 = time.time()
    print(getLCA(test_concept_4, test_concept_5, SWEET.direct_Ancestor_All_Dimensions, SWEET.Ontology_Root))
    time1 = time.time()
    print(time1 - time0)
    print("Aye")
