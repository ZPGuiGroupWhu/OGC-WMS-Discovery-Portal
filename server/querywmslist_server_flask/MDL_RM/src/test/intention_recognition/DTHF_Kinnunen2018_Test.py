import time

from MDL_RM.src.main.experience import EvaluationIndex
from MDL_RM.src.main.samples.input import Sample
from MDL_RM.src.main.samples.input.Data import Data
from MDL_RM.src.main.intention_recognition import DTHF_Kinnunen2018


def _test_get_optimal_split_rule():
    # load samples
    test_scene = "11"
    test_sample_path = "./../../../resources/samples/scenes_v4_5/Scene" + test_scene + "/final_samples.json"
    docs, real_intention = Sample.load_sample_from_file(test_sample_path)
    test_real_intention = real_intention
    test_samples = docs
    test_positive_samples = test_samples["relevance"]
    test_negative_samples = test_samples["irrelevance"]
    test_ancestors = Data.Ancestor
    test_ontologies = Data.Ontologies
    test_ontology_root = Data.Ontology_Root
    test_direct_ancestors = Data.direct_Ancestor
    test_information_content = Data.concept_information_content

    transformed_positive_samples = DTHF_Kinnunen2018.transform_data(test_positive_samples, Data.direct_Ancestor,
                                                                    Data.Ontology_Root)
    transformed_negative_samples = DTHF_Kinnunen2018.transform_data(test_negative_samples, Data.direct_Ancestor,
                                                                    Data.Ontology_Root)
    rule_root = {}
    for tmp_dim in Data.dimensions:
        rule_root[tmp_dim] = []
    time0 = time.time()
    root_node = DTHF_Kinnunen2018.Node(rule_root, transformed_positive_samples, transformed_negative_samples)
    DTHF_Kinnunen2018.grow(root_node)
    time1 = time.time()
    print("time used", time1 - time0)
    intention = DTHF_Kinnunen2018.DT_to_intention(root_node, test_ancestors, test_ontology_root)
    for sub_intention in intention:
        print(sub_intention)
    jaccard_score = EvaluationIndex.get_jaccard_index(test_samples, test_real_intention,
                                                      intention, test_ontologies, test_ontology_root)
    intention_similarity = EvaluationIndex.get_intention_similarity(test_real_intention, intention,
                                                                    test_direct_ancestors, test_ontology_root,
                                                                    test_information_content)
    print(jaccard_score)
    print(intention_similarity)
    # intention_result = DTHF_Kinnunen2018.DTHF(test_positive_samples, test_negative_samples,
    #                                           test_direct_ancestors, test_ancestors, test_ontology_root)


if __name__ == "__main__":
    _test_get_optimal_split_rule()
    print("Aye")
