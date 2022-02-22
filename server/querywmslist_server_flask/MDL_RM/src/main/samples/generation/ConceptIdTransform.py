# from main.samples import DimensionValues
import os

from MDL_RM.src.main.util.FileUtil import load_json

id_concept_dict = {}
# concept_id_dict_path = os.getcwd().split("MDL_RM")[0] + "MDL_RM/resources/samples/concept_id_dict.json"
__dir__ = os.path.dirname(os.path.abspath(__file__))
concept_id_dict_path = os.path.join(os.path.abspath(os.path.join(__dir__, "../../../../")),
                                    "resources/samples/concept_id_dict.json")
# print(concept_id_dict_path)
concept_id_dict = load_json(concept_id_dict_path)
for _tmp_concept in concept_id_dict:
    _tmp_id = concept_id_dict[_tmp_concept]
    id_concept_dict[_tmp_id] = _tmp_concept


def concept_to_id(concept):
    return concept_id_dict[concept]


def id_to_concept(concept_id):
    return id_concept_dict[concept_id]


def Information_Content_concept_to_id(information_content):
    result = {}
    for tmp_concept in information_content:
        tmp_concept_id = concept_to_id(tmp_concept)
        tmp_value = information_content[tmp_concept]
        result[tmp_concept_id] = tmp_value
    return result


# ontologies = {"concept1": ["concept2", "concept3", ...], ...}
def Ontology_concept_to_id(ontology):
    result = {}
    for tmp_concept in ontology:
        tmp_concept_id = concept_to_id(tmp_concept)
        tmp_values = ontology[tmp_concept]
        tmp_values_id_result = []
        for tmp_value in tmp_values:
            tmp_value_id = concept_to_id(tmp_value)
            tmp_values_id_result.append(tmp_value_id)
        result[tmp_concept_id] = tmp_values_id_result
    return result


def list_concept_to_id(concept_list):
    return [concept_to_id(x) for x in concept_list]


# sample = {"dim1":["concept1", "concept2", ...], ...}
def sample_concept_to_id(sample):
    result = {}
    for tmp_dim in sample.keys():
        if tmp_dim == "note":
            result[tmp_dim] = sample[tmp_dim]
            continue
        tmp_dim_concepts = sample[tmp_dim]
        tmp_dim_concepts_id = []
        for tmp_concept in tmp_dim_concepts:
            tmp_concept_id = concept_to_id(tmp_concept)
            tmp_dim_concepts_id.append(tmp_concept_id)
        result[tmp_dim] = tmp_dim_concepts_id
    return result


# intention = [{"dim1":"concept1", ...}, ...]
def intention_concept_to_id(intention, ontology_root):
    result = []
    for tmp_sub_intention in intention:
        tmp_sub_intention_result = {}
        for tmp_dim in tmp_sub_intention.keys():
            tmp_dim_concept = tmp_sub_intention[tmp_dim]
            # change None which means no intention to ontologies root concept
            if tmp_dim_concept == "None":
                tmp_dim_concept_id = ontology_root[tmp_dim]
            else:
                tmp_dim_concept_id = concept_to_id(tmp_dim_concept)
            tmp_sub_intention_result[tmp_dim] = tmp_dim_concept_id
        result.append(tmp_sub_intention_result)
    return result


# sample = {"dim1":["id1", "id2", ...], ...}
def sample_id_to_concept(sample):
    result = {}
    for tmp_dim in sample.keys():
        if tmp_dim == "note":
            result[tmp_dim] = sample[tmp_dim]
            continue
        tmp_dim_ids = sample[tmp_dim]
        tmp_dim_ids_concept = []
        for tmp_id in tmp_dim_ids:
            tmp_id_concept = id_to_concept(tmp_id)
            tmp_dim_ids_concept.append(tmp_id_concept)
        result[tmp_dim] = tmp_dim_ids_concept
    return result


# intention = [{"dim1":"id1", ...}, ...]
def intention_id_to_concept(intention):
    result = []
    for tmp_sub_intention in intention:
        tmp_sub_intention_result = {}
        for tmp_dim in tmp_sub_intention.keys():
            tmp_dim_id = tmp_sub_intention[tmp_dim]
            tmp_dim_id_concept = id_to_concept(tmp_dim_id)
            tmp_sub_intention_result[tmp_dim] = tmp_dim_id_concept
        result.append(tmp_sub_intention_result)
    return result


if __name__ == "__main__":
    print('http://sweetontology.net/human/SocialActivity' in concept_id_dict)
    print('ThemeRoot' in concept_id_dict)
