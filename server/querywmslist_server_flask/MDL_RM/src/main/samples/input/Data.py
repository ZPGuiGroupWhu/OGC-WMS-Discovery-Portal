from MDL_RM.src.main.samples.input import DimensionValues
from MDL_RM.src.main.util import RetrievalUtil


class Data:
    Ontologies = {'Spatial': DimensionValues.SpatialValue.Ontologies,
                  'Theme': DimensionValues.ThemeValues.Ontologies,
                  'MapMethod': DimensionValues.MapMethodValues.Ontologies,
                  'MapContent': DimensionValues.MapContentValues.Ontologies_All_Dimensions}
    Ancestor = {'Spatial': DimensionValues.SpatialValue.Ancestors,
                'Theme': DimensionValues.ThemeValues.Ancestors,
                'MapMethod': DimensionValues.MapMethodValues.Ancestors,
                'MapContent': DimensionValues.MapContentValues.Ancestor_All_Dimensions}
    Neighborhood = {'Spatial': DimensionValues.SpatialValue.Neighborhood,
                    'Theme': DimensionValues.ThemeValues.Neighborhood,
                    'MapMethod': DimensionValues.MapMethodValues.Neighborhood,
                    'MapContent': DimensionValues.MapContentValues.Neighborhood_All_Dimensions}
    direct_Ancestor = {'Spatial': DimensionValues.SpatialValue.direct_Ancestor,
                       'Theme': DimensionValues.ThemeValues.direct_Ancestor,
                       'MapMethod': DimensionValues.MapMethodValues.direct_Ancestor,
                       'MapContent': DimensionValues.MapContentValues.direct_Ancestor_All_Dimensions}
    concept_information_content = {'Spatial': DimensionValues.SpatialValue.Information_Content,
                                   'Theme': DimensionValues.ThemeValues.Information_Content,
                                   'MapMethod': DimensionValues.MapMethodValues.Information_Content,
                                   'MapContent': DimensionValues.MapContentValues.Information_Content}
    Ontology_Root = {'Spatial': DimensionValues.SpatialValue.Ontology_Root,
                     'Theme': DimensionValues.ThemeValues.Ontology_Root,
                     'MapMethod': DimensionValues.MapMethodValues.Ontology_Root,
                     'MapContent': DimensionValues.MapContentValues.Ontology_Root}
    dimensions = list(Ontology_Root.keys())

    def __init__(self, relevance_feedback_samples, real_intention=None):
        self.real_intention = real_intention
        self.docs = relevance_feedback_samples
        self.real_intention_key = None
        if real_intention is not None:
            self.real_intention_key = RetrievalUtil.get_intent_key(real_intention)

        self.dimensions = list(relevance_feedback_samples["relevance"][0].keys())  # 涉及到的意图维度

        self.all_relevance_concepts = {}    # 所有正样本中出现的概念及其所有祖先概念
        for dim in self.dimensions:
            self.all_relevance_concepts[dim] = self.get_all_relevance_concepts(dim)

        self.all_relevance_concepts_retrieved_docs = {}   # 所有正样本中出现的概念及其所有祖先概念能够检索到的文档
        relevance_docs = self.docs["relevance"]
        irrelevance_docs = self.docs["irrelevance"]

        for tmp_dim in self.all_relevance_concepts.keys():
            tmp_dim_all_relevance_concepts = self.all_relevance_concepts[tmp_dim]
            tmp_dim_all_relevance_concepts_retrieved_docs = {}
            for tmp_concept in tmp_dim_all_relevance_concepts:
                tmp_concept_retrieved_relevance_docs = \
                    self.get_concept_retrieved_docs(tmp_dim, tmp_concept, relevance_docs, Data.Ontology_Root[tmp_dim])
                tmp_concept_retrieved_irrelevance_docs = self.get_concept_retrieved_docs(tmp_dim, tmp_concept,
                                                                                         irrelevance_docs,
                                                                                         Data.Ontology_Root[tmp_dim])
                tmp_concept_retrieved_docs = {"relevance": tmp_concept_retrieved_relevance_docs,
                                              "irrelevance": tmp_concept_retrieved_irrelevance_docs}
                tmp_dim_all_relevance_concepts_retrieved_docs[tmp_concept] = tmp_concept_retrieved_docs
            tmp_dim_all_relevance_concepts_retrieved_docs[Data.Ontology_Root[tmp_dim]] = \
                {"relevance": set(range(len(relevance_docs))),
                 "irrelevance": set(range(len(irrelevance_docs)))}
            self.all_relevance_concepts_retrieved_docs[tmp_dim] = tmp_dim_all_relevance_concepts_retrieved_docs

    # 获得某个维度在相关文档中出现的概念
    def get_doc_concepts(self, dim_name):
        relevance_docs = self.docs["relevance"]
        result = set()
        for doc in relevance_docs:
            if dim_name in doc:
                for tmp_concept in doc[dim_name]:
                    result.add(tmp_concept)
        result = list(result)
        return result

    # 获取某个维度所有相关概念，包括在相关文档中出现的概念及这些概念的所有祖先概念
    # result = [concept1, concept2, ...]
    def get_all_relevance_concepts(self, dim_name):
        result = self.get_doc_concepts(dim_name)
        # 如果当前维度取值为枚举类型，则不存在上位概念，此维度的相关概念只包括相关文档中出现的概念
        if Data.Ancestor[dim_name] is None:
            return result

        # 获取文档中出现的概念的上位概念
        hypernyms = []
        for concept in result:
            # print(dim_name, concept,)
            hypernyms += Data.Ancestor[dim_name][concept]

        result = result + hypernyms
        result = list(set(result))
        return result

    # 获取某个维度的某个概念的所有相关文档的索引
    # result = {doc1_index, doc2_index, ...}
    def get_concept_retrieved_docs(self, param_dim, param_concept, param_docs, ontology_root_concept):
        tmp_concept_all_relevance_concepts = [param_concept]
        # 取值为枚举类型的维度的取值没有下位概念
        if Data.Ontologies[param_dim] is not None:
            tmp_concept_all_relevance_concepts += Data.Ontologies[param_dim][param_concept]
        tmp_concept_retrieved_tmp_docs = set()
        for i, tmp_doc in enumerate(param_docs):
            if param_dim not in tmp_doc.keys():
                continue
            else:
                tmp_dim_doc_values = tmp_doc[param_dim]
                tmp_can_be_retrieved = False
                if param_concept == ontology_root_concept:
                    tmp_can_be_retrieved = True
                else:
                    for tmp_dim_doc_value in tmp_dim_doc_values:
                        if tmp_dim_doc_value in tmp_concept_all_relevance_concepts:
                            tmp_can_be_retrieved = True
                            break
                if tmp_can_be_retrieved:
                    tmp_concept_retrieved_tmp_docs.add(i)
        # if param_concept == 'None':
        #     print(param_dim, param_concept, tmp_concept_all_relevance_concepts, tmp_concept_retrieved_tmp_docs)
        return tmp_concept_retrieved_tmp_docs



