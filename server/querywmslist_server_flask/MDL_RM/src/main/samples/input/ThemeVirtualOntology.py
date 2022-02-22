# the virtual ontologies for dimension theme which has enumerate value
import os
import sys

from MDL_RM.src.main.samples.generation.ConceptIdTransform import Ontology_concept_to_id, \
    concept_to_id, Information_Content_concept_to_id
from MDL_RM.src.main.samples.input import OntologyUtil

ThemeValues = ['Agriculture', 'Biodiversity', 'Climate', 'Disaster',
               'Ecosystem', 'Energy', 'Geology', 'Health', 'Water', 'Weather']
Ontologies = {}
Ancestors = {}
direct_Ancestor = {}
Neighborhood = {}
Information_Content = {}
Ontology_Root = "ThemeRoot"

root_hyponyms = []
root_neighborhood = []
root_ancestors = []
root_direct_ancestor = []

for tmp_concept in ThemeValues:
    Ontologies[tmp_concept] = []
    Ancestors[tmp_concept] = [Ontology_Root]
    direct_Ancestor[tmp_concept] = [Ontology_Root]
    Neighborhood[tmp_concept] = [Ontology_Root]
    root_hyponyms.append(tmp_concept)
    root_neighborhood.append(tmp_concept)
Ontologies[Ontology_Root] = root_hyponyms
Ancestors[Ontology_Root] = root_ancestors
direct_Ancestor[Ontology_Root] = root_direct_ancestor
Neighborhood[Ontology_Root] = root_neighborhood

max_nodes = len(Ancestors)
max_leaves_num = len(OntologyUtil.get_all_leaves_set(Ontologies))
for tmp_concept in Ontologies.keys():
    tmp_concept_depth = OntologyUtil.get_concept_max_depth(tmp_concept, direct_Ancestor, Ontology_Root)
    tmp_max_depth = OntologyUtil.get_max_depth(direct_Ancestor, Ontologies, Ontology_Root)
    tmp_hypernyms_num = len(Ancestors[tmp_concept])
    tmp_concept_leaves_num = OntologyUtil.get_concept_leaves_num(tmp_concept, Ontologies)
    tmp_concept_information_content = OntologyUtil.get_information_content(tmp_concept_depth, tmp_max_depth,
                                                                           tmp_hypernyms_num, max_nodes,
                                                                           tmp_concept_leaves_num, max_leaves_num)
    Information_Content[tmp_concept] = tmp_concept_information_content

# print(Information_Content)

if os.path.basename(sys.argv[0]) == "GenerateSamples.py":
    Ontologies = Ontology_concept_to_id(Ontologies)
    Ancestors = Ontology_concept_to_id(Ancestors)
    direct_Ancestor = Ontology_concept_to_id(direct_Ancestor)
    Neighborhood = Ontology_concept_to_id(Neighborhood)
    Ontology_Root = concept_to_id(Ontology_Root)
    Information_Content = Information_Content_concept_to_id(Information_Content)
