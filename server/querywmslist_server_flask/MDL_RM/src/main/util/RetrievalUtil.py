

def get_term_document_count(x, dim, docs, ancestor):
    num = 0
    for tmp_doc in docs:
        found_x = False
        for tmp_term in tmp_doc[dim]:
            # print(dim, tmp_term)
            # 若维度dim的取值是枚举类型，则不存在上位概念
            tmp_hypernyms = []
            if ancestor[dim] is not None:
                tmp_hypernyms = ancestor[dim][tmp_term]

            if tmp_term == x or x in tmp_hypernyms:
                found_x = True
                break
        if found_x:
            num += 1
    return num


# 查询文档
# 输出的是能查询到的文档的索引
def retrieve_docs(sub_intent, docs, ontologies, ontology_root):
    sub_intent_dim_values = {}
    for tmp_dim in sub_intent:
        tmp_dim_value = sub_intent[tmp_dim]
        tmp_dim_values = [tmp_dim_value]
        if ontologies[tmp_dim] is not None:
            tmp_dim_values += ontologies[tmp_dim][tmp_dim_value]
        tmp_dim_values = list(set(tmp_dim_values))
        sub_intent_dim_values[tmp_dim] = tmp_dim_values
        # print(tmp_dim, "None ", concept_None_id in tmp_dim_values)
        # print("\t", tmp_dim_values)
    retrieved_docs = set()
    for i in range(len(docs)):
        # print(i / len(docs))
        tmp_doc = docs[i]
        can_retrieve_tmp_doc = True
        for tmp_dim in sub_intent.keys():
            tmp_dim_value = sub_intent[tmp_dim]
            if tmp_dim_value == ontology_root[tmp_dim]:
                continue
            else:
                tmp_dim_values = sub_intent_dim_values[tmp_dim]

                tmp_dim_can_retrieve = False
                for tmp_label in tmp_doc[tmp_dim]:
                    if tmp_label in tmp_dim_values:
                        tmp_dim_can_retrieve = True
                        break
                if not tmp_dim_can_retrieve:
                    can_retrieve_tmp_doc = False
                    break
        if can_retrieve_tmp_doc:
            retrieved_docs.add(i)
    return retrieved_docs


def retrieve_docs_based_on_terms_covered_samples(sub_intention, terms_covered_samples, sample_category):
    result = set()
    first_term = True
    for tmp_dim in sub_intention:
        tmp_value = sub_intention[tmp_dim]
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


def retrieve_docs_by_complete_intention(intention, docs, ontologies, ontology_root):
    result = set()
    for sub_intention in intention:
        result = result.union(retrieve_docs(sub_intention, docs, ontologies, ontology_root))
    return result


def retrieve_docs_by_complete_intention_based_on_terms_covered_samples(intention,
                                                                       terms_covered_samples, sample_category):
    result = set()
    for sub_intention in intention:
        result = result.union(retrieve_docs_based_on_terms_covered_samples(sub_intention,
                                                                           terms_covered_samples, sample_category))
    return result


# 得到意图的键形式
# 这里的intent是全意图
def get_intent_key(intent):
    intent = [list(x.items()) for x in intent]
    for sub_intent in intent:
        sub_intent.sort()
    intent.sort()
    intent = str(intent)
    return intent


if __name__ == "__main__":
    test_intents = [[{'d1': 'C27', 'd2': None}, {'d1': 'C26', 'd2': None}],
                    [{'d2': None, 'd1': 'C27'}, {'d1': 'C26', 'd2': None}],
                    [{'d1': 'C26', 'd2': None}, {'d1': 'C27', 'd2': None}],
                    [{'d1': 'C26', 'd2': None}, {'d2': None, 'd1': 'C27'}]]
    for test_intent in test_intents:
        print(get_intent_key(test_intent))
        print("[[('d1', 'C26'), ('d2', None)], [('d1', 'C27'), ('d2', None)]]" == get_intent_key(test_intent))
    print("Aye")
