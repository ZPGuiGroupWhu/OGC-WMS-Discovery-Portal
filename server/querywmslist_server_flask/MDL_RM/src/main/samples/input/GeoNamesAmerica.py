import sys

from MDL_RM.src.main.util.FileUtil import load_json
from MDL_RM.src.main.samples.generation.ConceptIdTransform import Ontology_concept_to_id, \
    concept_to_id, Information_Content_concept_to_id
import os.path

# __dir__ = os.path.dirname(os.path.abspath(__file__))
# file_path_prefix = os.path.join(os.path.abspath(os.path.join(__dir__, "../../../../")),
#                                     "resources/ontologies/geonames_america")
#
# Ontologies_path = os.path.join(file_path_prefix, "Ontologies.json")
# direct_Ancestor_path = os.path.join(file_path_prefix, "direct_Ancestor.json")
# Ancestors_path = os.path.join(file_path_prefix, "Ancestors.json")
# Neighborhood_path = os.path.join(file_path_prefix, "neighbors.json")
# Information_Content_Path = os.path.join(file_path_prefix, "concept_information_content_yuan2013.json")

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

Ontologies_path = resource_path("Lontologies.json")
direct_Ancestor_path = resource_path("Ldirect_Ancestor.json")
Ancestors_path = resource_path("Lancestors.json")
Neighborhood_path =  resource_path("Lneighbors.json")
Information_Content_Path = resource_path("Lconcept_information_content_yuan2013.json")

Ontologies = load_json(Ontologies_path)        # 空间实体区域内的所有级别的所有空间实体，最小级别为一级行政区
Ancestors = load_json(Ancestors_path)           #
direct_Ancestor = load_json(direct_Ancestor_path)        # 包含某个空间实体的上一级空间实体，最上级为美洲（America）
Neighborhood = load_json(Neighborhood_path)     # 包含某个空间实体E的上一级实体和E包含的下一级空间实体
Information_Content = load_json(Information_Content_Path)

Ontology_Root = "Global"

if os.path.basename(sys.argv[0]) == "GenerateSamples.py":
    # print(len(Ontologies["United States"]))
    Ontologies = Ontology_concept_to_id(Ontologies)
    Ancestors = Ontology_concept_to_id(Ancestors)
    direct_Ancestor = Ontology_concept_to_id(direct_Ancestor)
    Neighborhood = Ontology_concept_to_id(Neighborhood)
    Ontology_Root = concept_to_id(Ontology_Root)
    Information_Content = Information_Content_concept_to_id(Information_Content)