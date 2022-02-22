import sys

from MDL_RM.src.main.util.FileUtil import load_json
from MDL_RM.src.main.samples.generation.ConceptIdTransform import Ontology_concept_to_id, \
    concept_to_id, Information_Content_concept_to_id
import os.path

# file_path_prefix = os.getcwd().split("MDL_RM")[0] + "MDL_RM/resources/ontologies/sweet"
__dir__ = os.path.dirname(os.path.abspath(__file__))
file_path_prefix = os.path.join(os.path.abspath(os.path.join(__dir__, "../../../../")),
                                    "resources/ontologies/sweet")

Ontologies = load_json(os.path.join(file_path_prefix, "all_hyponyms_dimension_divided.json"))
Ancestor = load_json(os.path.join(file_path_prefix, "all_ancestors_dimension_divided.json"))
Neighborhood = load_json(os.path.join(file_path_prefix, "neighbors_dimension_divided.json"))
direct_Ancestor = load_json(os.path.join(file_path_prefix, "direct_ancestors_dimension_divided.json"))

direct_Ancestor_All_Dimensions = load_json(os.path.join(file_path_prefix, "direct_ancestors.json"))
Ontologies_All_Dimensions = load_json(os.path.join(file_path_prefix, "all_hyponyms.json"))
Ancestor_All_Dimensions = load_json(os.path.join(file_path_prefix, "ancestors.json"))
Neighborhood_All_Dimensions = load_json(os.path.join(file_path_prefix, "neighbors.json"))
Information_Content = load_json(os.path.join(file_path_prefix, "concept_information_content_yuan2013.json"))
Ontology_Root = "Thing"

top_concepts = list(filter(lambda x: len(Ancestor_All_Dimensions[x]) == 0, list(Ancestor_All_Dimensions.keys())))
for tmp_top_concept in top_concepts:
    direct_Ancestor_All_Dimensions[tmp_top_concept] = [Ontology_Root]
    Neighborhood_All_Dimensions[tmp_top_concept].append(Ontology_Root)
for tmp_concept in Ancestor_All_Dimensions:
    Ancestor_All_Dimensions[tmp_concept].append(Ontology_Root)
all_concepts = list(Ontologies_All_Dimensions.keys())
Ontologies_All_Dimensions[Ontology_Root] = all_concepts
Neighborhood_All_Dimensions[Ontology_Root] = top_concepts
direct_Ancestor_All_Dimensions[Ontology_Root] = []
Ancestor_All_Dimensions[Ontology_Root] = []
Information_Content[Ontology_Root] = 0.0

# 如果是生成样本集，为了减少总样本集文件的大小，所有概念使用数字代替
if os.path.basename(sys.argv[0]) == "GenerateSamples.py":
    direct_Ancestor_All_Dimensions = Ontology_concept_to_id(direct_Ancestor_All_Dimensions)
    Ontologies_All_Dimensions = Ontology_concept_to_id(Ontologies_All_Dimensions)
    Ancestor_All_Dimensions = Ontology_concept_to_id(Ancestor_All_Dimensions)
    Neighborhood_All_Dimensions = Ontology_concept_to_id(Neighborhood_All_Dimensions)
    Ontology_Root = concept_to_id(Ontology_Root)
    Information_Content = Information_Content_concept_to_id(Information_Content)
# print('None' in direct_Ancestor_All_Dimensions)
# print('None' in Ontologies_All_Dimensions)
# print(Ontologies_All_Dimensions['http://sweetontology.net/matrElement/TransitionMetal'])
# print(Ontologies_All_Dimensions['http://sweetontology.net/matrRocklgneous/VolcanicRock'])
# print(Ontologies_All_Dimensions['http://sweetontology.net/matrRockIgneous/VolcanicRock'])
# print(Ontologies_All_Dimensions['http://sweetontology.net/matrCompound/IronOxide'])
# print(len(Ontologies_All_Dimensions))
