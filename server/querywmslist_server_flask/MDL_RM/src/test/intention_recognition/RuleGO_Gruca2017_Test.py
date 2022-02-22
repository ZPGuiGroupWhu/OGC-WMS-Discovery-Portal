import time

from MDL_RM.src.main.experience import EvaluationIndex
from MDL_RM.src.main.samples.input import OntologyUtil, Sample
from MDL_RM.src.main.samples.input.Data import Data
from MDL_RM.src.main.intention_recognition import RuleGO_Gruca2017


def _test_rule_filtering():
    # load samples
    scene = "11"
    test_sample_path = "./../../../resources/samples/scenes_v4_5/Scene" + scene + "/noise_samples_S0p1_L1.json"
    docs, real_intention = Sample.load_sample_from_file(test_sample_path)
    data = Data(docs)
    test_real_intention = real_intention
    test_samples = docs
    test_positive_samples = test_samples["relevance"]
    test_negative_samples = test_samples["irrelevance"]
    # terms, positive_samples, negative_samples, terms_covered_samples, ancestors, ontologies
    test_terms = data.all_relevance_concepts
    test_terms_covered_samples = data.all_relevance_concepts_retrieved_docs
    test_ancestors = Data.Ancestor
    test_ontologies = Data.Ontologies
    test_ontology_root = Data.Ontology_Root
    test_direct_ancestors = Data.direct_Ancestor
    test_information_content = Data.concept_information_content
    time0 = time.time()
    test_max_depths = {}
    for tmp_dim in Data.dimensions:
        test_max_depths[tmp_dim] = OntologyUtil.get_max_depth(test_direct_ancestors[tmp_dim],
                                                              test_ontologies[tmp_dim], test_ontology_root[tmp_dim])
    test_result_rules = RuleGO_Gruca2017.rule_induction(test_terms, test_positive_samples, test_negative_samples,
                                                        test_terms_covered_samples, test_max_depths,
                                                        test_direct_ancestors,
                                                        test_ancestors, test_ontologies, test_ontology_root)
    # 根据有趣度降序排序
    test_result_rules.sort(
        key=lambda x: RuleGO_Gruca2017.get_rule_interestingness_measure(x, test_max_depths, test_direct_ancestors,
                                                                        test_ontology_root,
                                                                        test_positive_samples,
                                                                        test_terms_covered_samples),
        reverse=True)
    print("before filtering", len(test_result_rules))
    for tmp_rule in test_result_rules:
        print("\t", tmp_rule)
    # 第一层过滤
    test_result_rules = RuleGO_Gruca2017.rule_filtering_level_1(test_result_rules, test_terms_covered_samples,
                                                                test_ontologies)
    print("after filter level 1：", len(test_result_rules))
    for tmp_rule in test_result_rules:
        print("\t", tmp_rule)
    # 第二层过滤
    test_result_rules = RuleGO_Gruca2017.rule_filtering_level_2(test_result_rules, test_terms_covered_samples,
                                                                test_ontologies)
    time1 = time.time()
    print("after filter level 2：", len(test_result_rules))
    for tmp_rule in test_result_rules:
        print("\t", tmp_rule)
    test_intention = RuleGO_Gruca2017.result_rules_to_intention(test_result_rules, test_ancestors, test_ontology_root)
    print("final result: ", len(test_intention))
    for tmp_sub_intention in test_intention:
        print("\t", tmp_sub_intention)
    jaccard_score = EvaluationIndex.get_jaccard_index(test_samples, test_real_intention,
                                                      test_intention, test_ontologies, test_ontology_root)
    intention_similarity = EvaluationIndex.get_intention_similarity(test_real_intention, test_intention,
                                                                    test_direct_ancestors, test_ontology_root,
                                                                    test_information_content)
    print(jaccard_score)
    print(intention_similarity)
    print("time used", time1 - time0)


def check_bugs():
    test_scene = "151"
    test_sample_path = "./../../../resources/samples/scenes_v4_5/Scene" + test_scene + "/noise_samples_S0p2_L0p8.json"
    docs, real_intention = Sample.load_sample_from_file(test_sample_path)
    data = Data(docs)
    test_samples = docs
    test_positive_samples = test_samples["relevance"]
    test_terms = data.all_relevance_concepts
    print(test_terms)
    print(len([x for y in list(test_terms.values()) for x in y]))
    test_terms_covered_samples = data.all_relevance_concepts_retrieved_docs
    # test_ancestors = Data.Ancestor
    test_ontologies = Data.Ontologies
    test_ontology_root = Data.Ontology_Root
    test_direct_ancestors = Data.direct_Ancestor
    # time0 = time.time()
    test_max_depths = {}
    for tmp_dim in Data.dimensions:
        test_max_depths[tmp_dim] = OntologyUtil.get_max_depth(test_direct_ancestors[tmp_dim],
                                                              test_ontologies[tmp_dim], test_ontology_root[tmp_dim])

    test_rule = {('MapContent', 'http://sweetontology.net/matrRockIgneous/ExtrusiveRock')}
    # test_rule2 = {('MapContent', 'http://sweetontology.net/matrRockIgneous/VolcanicRock')}
    test_rule2 = {('Spatial', 'South America')}

    test_rule_covered_positive_samples = \
        RuleGO_Gruca2017.get_rule_covered_specific_samples_index(test_rule, test_terms_covered_samples, "positive")
    test_rule_covered_negative_samples = \
        RuleGO_Gruca2017.get_rule_covered_specific_samples_index(test_rule, test_terms_covered_samples, "negative")
    test_rule2_covered_positive_samples = \
        RuleGO_Gruca2017.get_rule_covered_specific_samples_index(test_rule2, test_terms_covered_samples, "positive")
    test_rule2_covered_negative_samples = \
        RuleGO_Gruca2017.get_rule_covered_specific_samples_index(test_rule2, test_terms_covered_samples, "negative")
    print(len(test_rule_covered_positive_samples), len(test_rule_covered_negative_samples))
    print(len(test_rule2_covered_positive_samples), len(test_rule2_covered_negative_samples))
    print(RuleGO_Gruca2017.get_rule_interestingness_measure(test_rule, test_max_depths, test_direct_ancestors,
                                                            test_ontology_root, test_positive_samples,
                                                            test_terms_covered_samples))
    print(RuleGO_Gruca2017.get_rule_interestingness_measure(test_rule2, test_max_depths, test_direct_ancestors,
                                                            test_ontology_root, test_positive_samples,
                                                            test_terms_covered_samples))


if __name__ == "__main__":
    _test_rule_filtering()
    check_bugs()
    print("Aye")
