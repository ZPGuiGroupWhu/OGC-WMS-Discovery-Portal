# 准备样本
# 首先统计SWEET中各概念的下位概念数量和所在深度（以最小的为准）
from MDL_RM.src.main import Intention
from MDL_RM.src.main.util.RetrievalUtil import retrieve_docs, get_intent_key
from MDL_RM.src.main.samples.input import DimensionValues
from MDL_RM.src.main.samples.generation import ConceptIdTransform
from MDL_RM.src.main.util.FileUtil import save_as_json, load_csv, load_json
from MDL_RM.src.main.intention_recognition import Run_MDL_RM
import os.path
import random
import copy
import math
from pandas import DataFrame

sample_version = Intention.__sample_version__
all_samples_path = "../../../../resources/samples/all_samples.json"
intention_path = "../../../../resources/samples/Intention_v2.json"
intention_csv_path = "../../../../resources/samples/各场景具体意图v1.2.csv"
all_output_path_prefix = os.path.join("../../../../resources/samples", "scenes_" + sample_version)
if not os.path.exists(all_output_path_prefix):
    os.mkdir(all_output_path_prefix)

# S:Spatial, T:Theme, M:MapMethod, C:MapContent
intention_dimensions = ['S', 'T', 'M', 'C']
Ontology_Root = {'S': DimensionValues.SpatialValue.Ontology_Root,
                 'T': DimensionValues.ThemeValues.Ontology_Root,
                 'M': DimensionValues.MapMethodValues.Ontology_Root,
                 'C': DimensionValues.MapContentValues.Ontology_Root}
Ontologies = {'S': DimensionValues.SpatialValue.Ontologies,
              'T': DimensionValues.ThemeValues.Ontologies,
              'M': DimensionValues.MapMethodValues.Ontologies,
              'C': DimensionValues.MapContentValues.Ontologies_All_Dimensions}
direct_Ancestor = {'S': DimensionValues.SpatialValue.direct_Ancestor,
                   'T': DimensionValues.ThemeValues.direct_Ancestor,
                   'M': DimensionValues.MapMethodValues.direct_Ancestor,
                   'C': DimensionValues.MapContentValues.direct_Ancestor_All_Dimensions}
concept_information_content = {'S': DimensionValues.SpatialValue.Information_Content,
                               'T': DimensionValues.ThemeValues.Information_Content,
                               'M': DimensionValues.MapMethodValues.Information_Content,
                               'C': DimensionValues.MapContentValues.Information_Content}

use_filtered_concepts = True
map_content_concepts_restriction = [
    "http://sweetontology.net/matr/Substance",
    "http://sweetontology.net/prop/ThermodynamicProperty",
    "http://sweetontology.net/matrBiomass/LivingEntity",
    "http://sweetontology.net/phenSystem/Oscillation",
    "http://sweetontology.net/propQuantity/PhysicalQuantity",
    "http://sweetontology.net/phenAtmo/MeteorologicalPhenomena", ]
map_content_concepts_restriction = [ConceptIdTransform.concept_to_id(x) for x in map_content_concepts_restriction]
map_content_values_set = []
for tmp_concept in map_content_concepts_restriction:
    map_content_values_set.append(tmp_concept)
    map_content_values_set += DimensionValues.MapContentValues.Ontologies_All_Dimensions[tmp_concept]
map_content_values_set = list(set(map_content_values_set))
print(len(map_content_values_set))

min_positive_num = math.inf  # the minimum of the positive samples count in all specific intentions


# 随机组合取值生成总样本集并以json形式保存到指定路径
# params
#   intention：具体意图，包括各个维度的值，若在某个维度上没有意图则值为'None'
#   max_label_num：样本上每个维度上最大标签数量
#   all_samples_num：生成的总样本数量
#   output_path：根据具体意图的值生成的所有样本保存的位
# max_label_num = {'S': 2, 'T': 2, 'M': 3, 'C': 4}
# intention = [{'S': 'Ohio', 'T': 'Water', 'M': 'Area Method', 'C': 'Temperature'}, {...}]
def generate_all_samples(max_label_num, all_samples_num, output_path):
    all_samples = []
    result = all_samples
    per_dimension_sample_values = {}
    for tmp_dim in max_label_num.keys():
        tmp_dim_sample_values = None
        if tmp_dim == 'S':
            tmp_dim_sample_values = list(DimensionValues.SpatialValue.Ontologies.keys())
        elif tmp_dim == 'T':
            tmp_dim_sample_values = list(DimensionValues.ThemeValues.Ontologies.keys())
        elif tmp_dim == 'M':
            tmp_dim_sample_values = list(DimensionValues.MapMethodValues.Ontologies.keys())
        elif tmp_dim == 'C':
            if not use_filtered_concepts:
                tmp_dim_sample_values = list(DimensionValues.MapContentValues.Ontologies_All_Dimensions.keys())
            else:
                tmp_dim_sample_values = map_content_values_set
        #  TODO 如果地图内容维度细分，则添加相应的elif分支
        per_dimension_sample_values[tmp_dim] = tmp_dim_sample_values

    tmp_count = 0
    while tmp_count < all_samples_num:
        tmp_sample = {}
        for tmp_dim in intention_dimensions:
            tmp_dim_max_label_num = max_label_num[tmp_dim]
            tmp_dim_label_num = random.randint(1, tmp_dim_max_label_num)
            tmp_dim_sample_values = per_dimension_sample_values[tmp_dim]
            tmp_sample_tmp_dim_sample_values = random.sample(tmp_dim_sample_values, tmp_dim_label_num)

            # if label is the root concept, then only reserve the root concept and take it as 'no label'
            if Ontology_Root[tmp_dim] in tmp_sample_tmp_dim_sample_values:
                tmp_sample_tmp_dim_sample_values = [Ontology_Root[tmp_dim]]
            else:
                tmp_sample_tmp_dim_sample_values = list(set(tmp_sample_tmp_dim_sample_values))
            tmp_sample[tmp_dim] = tmp_sample_tmp_dim_sample_values
        all_None = True
        for tmp_dim in tmp_sample:
            if tmp_sample[tmp_dim] != [Ontology_Root[tmp_dim]]:
                all_None = False
                break
        if all_None:
            continue
        else:
            all_samples.append(tmp_sample)
            tmp_count += 1
    save_as_json(result, output_path)
    return None


# 从总正样本集中分离出正负样本并保存
# params
#   all_samples_path：保存意图及其对应的所有样本的文件的路径
#   positive_negative_samples_path：结果路径
# result = {"relevance": [], "irrelevance": []}
def get_positive_negative_samples_by_intention(intention, all_samples, ontologies, direct_ancestors,
                                               ontology_root, concept_information_content_yuan2013s,
                                               dimensions_weight, positive_negative_samples_path=None):
    global min_positive_num
    # if there are more than 1000 positive samples, just use 1000 samples for sample generating
    selected_positive_negative_samples_num = 2_000
    samples = all_samples
    positive_samples = []
    negative_samples = []
    result = {"intention": intention, "positive_samples": positive_samples, "negative_samples": negative_samples}

    # if every dimension of intention has value 'None', split all samples into positive and negative randomly
    is_all_dimension_none = True
    for sub_intention in intention:
        for tmp_dim in sub_intention:
            if sub_intention[tmp_dim] != Ontology_Root[tmp_dim]:
                is_all_dimension_none = False
                break
    selected_positive_samples_index = set()
    all_positive_sample_index = set()
    random.shuffle(samples)
    if is_all_dimension_none:
        positive_samples = random.sample(samples, selected_positive_negative_samples_num)
        negative_samples = random.sample(samples, selected_positive_negative_samples_num)
    else:
        # otherwise for every sub intention, get some positive samples
        per_sub_intention_cover_samples_num = selected_positive_negative_samples_num // len(intention)
        sub_intention_covered_samples_index = {}
        for sub_intention in intention:
            tmp_sub_intention_key = get_intent_key([sub_intention])
            tmp_sub_intention_retrieved_docs_index = retrieve_docs(sub_intention, samples, ontologies, Ontology_Root)
            all_positive_sample_index = all_positive_sample_index.union(tmp_sub_intention_retrieved_docs_index)
            sub_intention_covered_samples_index[tmp_sub_intention_key] = tmp_sub_intention_retrieved_docs_index
        min_sub_intention_covered_samples_num = min([len(x) for x in sub_intention_covered_samples_index.values()])
        for sub_intention_key in sub_intention_covered_samples_index:
            sub_intention_covered_samples_index_selected = \
                random.sample(list(sub_intention_covered_samples_index[sub_intention_key]),
                              min_sub_intention_covered_samples_num)
            selected_positive_samples_index = \
                selected_positive_samples_index.union(set(sub_intention_covered_samples_index_selected))

        print("all_positive_sample_index_num:", len(all_positive_sample_index))
        print("selected_positive_samples_index_num:", len(selected_positive_samples_index))

        # when sampling negative samples, for every sub intention,
        #   sample selected_positive_negative_samples_num * 10 negative samples first,
        #   and then calculate the similarity of every negative sample with the sub intention,
        #   and select top (selected_positive_negative_samples_num / len(intention)) samples as the result
        negative_samples_index = []
        all_negative_samples_index = list(set(range(len(samples))) - all_positive_sample_index)
        for tmp_sub_intention in intention:
            tmp_sub_intention_negative_samples_num = selected_positive_negative_samples_num * 1000
            tmp_sub_intention_negative_samples_index = \
                random.sample(all_negative_samples_index, min(tmp_sub_intention_negative_samples_num,
                                                              len(all_negative_samples_index)))
            tmp_sub_intention_negative_samples_similarity = []
            for tmp_negative_sample_index in tmp_sub_intention_negative_samples_index:
                tmp_negative_sample = samples[tmp_negative_sample_index]
                tmp_similarity = Run_MDL_RM.similarity_of_sub_intention_and_sample(tmp_sub_intention, tmp_negative_sample,
                                                                               ontologies, direct_ancestors,
                                                                               ontology_root,
                                                                               concept_information_content_yuan2013s,
                                                                               dimensions_weight)
                tmp_sub_intention_negative_samples_similarity.append((tmp_negative_sample_index, tmp_similarity))
            # sort and get top (selected_positive_negative_samples_num / len(intention))
            tmp_sub_intention_negative_samples_similarity.sort(key=lambda x: x[1], reverse=True)
            tmp_sub_intention_negative_samples_index_sorted = \
                [x[0] for x in tmp_sub_intention_negative_samples_similarity]

            # just get 70% most similar negative samples to guarantee constraint
            #   and 30% randomly selected to keep diversity
            most_similar_negative_samples_num = int(per_sub_intention_cover_samples_num * 0.7)
            randomly_selected_negative_samples_num = \
                per_sub_intention_cover_samples_num - most_similar_negative_samples_num
            tmp_sub_intention_negative_samples_index_most_similar = \
                tmp_sub_intention_negative_samples_index_sorted[:most_similar_negative_samples_num]
            tmp_sub_intention_negative_samples_index_randomly_selected = \
                random.sample(
                    tmp_sub_intention_negative_samples_index_sorted[most_similar_negative_samples_num:],
                    randomly_selected_negative_samples_num)
            negative_samples_index += tmp_sub_intention_negative_samples_index_most_similar
            negative_samples_index += tmp_sub_intention_negative_samples_index_randomly_selected

        positive_samples_index = list(selected_positive_samples_index)

        # if size of positive_samples_index or negative_samples_index is smaller than specific num,
        #   then take all positive_samples_index or negative_samples_index as result
        for i in random.sample(positive_samples_index,
                               min(selected_positive_negative_samples_num, len(positive_samples_index))):
            positive_samples.append(samples[i])
        for i in random.sample(negative_samples_index,
                               min(selected_positive_negative_samples_num, len(negative_samples_index))):
            negative_samples.append(samples[i])
    if positive_negative_samples_path is not None:
        save_as_json(result, positive_negative_samples_path)
    # print("positive:", len(positive_samples_index))
    # print("negative:", len(negative_samples_index))
    if len(positive_samples) < min_positive_num:
        min_positive_num = len(positive_samples)
    return positive_samples, negative_samples


# params form:
#   final_samples = {"intention": intention_concept_form, "positive_samples": final_positive_samples_concept_form,
#               "negative_samples": final_negative_samples_concept_form}
#   final_samples_paths：最终样本保存路径list
def export_final_samples(final_samples, final_samples_paths):
    result = final_samples
    intention = final_samples["intention"]
    for final_samples_path in final_samples_paths:
        if final_samples_path.endswith('json'):
            # remove 'note'
            result_copy = copy.deepcopy(result)
            all_samples_copy = result_copy["positive_samples"] + result_copy["negative_samples"]
            for tmp_sample in all_samples_copy:
                if 'note' in tmp_sample:
                    tmp_sample.pop("note")
            save_as_json(result_copy, final_samples_path)

        elif final_samples_path.endswith('xlsx') or final_samples_path.endswith(".xls"):
            result_copy = copy.deepcopy(result)
            all_samples_copy = result_copy["positive_samples"] + result_copy["negative_samples"]
            for tmp_sample in all_samples_copy:
                if 'C' in tmp_sample:
                    tmp_sample['C'] = [x.replace("http://sweetontology.net", "") for x in
                                       tmp_sample['C']]

            # 制作DataFrame
            df_data = []
            dims = ['note']
            dims += list(intention[0].keys())

            # 输出各个子意图
            for sub_intention in intention:
                df_sub_intention = []
                for tmp_dim in dims:
                    if tmp_dim == 'note':
                        df_sub_intention.append('sub_intention')
                    else:
                        df_sub_intention.append(sub_intention[tmp_dim])
                df_data.append(df_sub_intention)
            df_data.append([""] * len(dims))

            for tmp_sample in all_samples_copy:
                df_tmp_sample = []
                for tmp_dim in dims:
                    df_tmp_sample.append(tmp_sample[tmp_dim])
                df_data.append(df_tmp_sample)
            df = DataFrame(df_data, columns=dims)
            df.to_excel(final_samples_path, encoding='utf-8', index=False)


# 并从正负样本中随机选择指定数量的正负样本作为最终的正负样本，
# params
#   positive_samples
#   negative_samples
#   intention
#   positive_sample_num：最终正样本数量
#   negative_sample_num：最终负样本数量
#   final_samples_paths：最终样本保存路径list
def get_final_samples_by_intention(intention, positive_samples, negative_samples,
                                   positive_sample_num, negative_sample_num,
                                   final_samples_paths):
    add_note = True  # ：输出文件中是否要包含样本的备注

    # 将正样本分为含有标签级别的噪声与不含标签级别的噪声两组
    #   判断标准是如果样本在任意某个维度含有除当前概念及当前概念的所有下位概念之外的概念，则含有标签级别的噪声

    final_positive_samples = []
    final_negative_samples = []

    # if every dimension of intention has value 'None', split all samples into positive and negative randomly
    for i in range(positive_sample_num):
        tmp_sample = random.choice(positive_samples)
        tmp_sample = ConceptIdTransform.sample_id_to_concept(tmp_sample)
        if add_note:
            tmp_sample['note'] = 'true_positive_sample'
        final_positive_samples.append(tmp_sample)
    for i in range(negative_sample_num):
        tmp_sample = random.choice(negative_samples)
        tmp_sample = ConceptIdTransform.sample_id_to_concept(tmp_sample)
        if add_note:
            tmp_sample['note'] = 'true_negative_samples'
        final_negative_samples.append(tmp_sample)
    print(intention)
    intention = ConceptIdTransform.intention_id_to_concept(intention)
    result = {"intention": intention, "positive_samples": final_positive_samples,
              "negative_samples": final_negative_samples}
    export_final_samples(result, final_samples_paths)
    return positive_samples, negative_samples


# 从正负样本文件中采样得到最终正负样本
def get_final_samples_by_intention2(positive_negative_samples_path,
                                    positive_sample_num, negative_sample_num,
                                    final_samples_paths):
    positive_negative_samples = load_json(positive_negative_samples_path)
    intention = positive_negative_samples["intention"]
    positive_samples = positive_negative_samples["positive_samples"]
    negative_samples = positive_negative_samples["negative_samples"]
    return get_final_samples_by_intention(intention, positive_samples, negative_samples,
                                          positive_sample_num, negative_sample_num,
                                          final_samples_paths)


# 只生成纯净（无标签噪声和样本噪声）的样本组
def get_final_samples_by_intention3(intention, all_samples, positive_sample_num, negative_sample_num,
                                    ontologies, direct_ancestors, ontology_root,
                                    concept_information_content_yuan2013s, dimensions_weight,
                                    final_samples_paths):
    positive_samples, negative_samples = \
        get_positive_negative_samples_by_intention(intention, all_samples, ontologies, direct_ancestors, ontology_root,
                                                   concept_information_content_yuan2013s, dimensions_weight)
    return get_final_samples_by_intention(intention, positive_samples, negative_samples,
                                          positive_sample_num, negative_sample_num,
                                          final_samples_paths)


# add noise to sample and export
# params
#   noise_config = {"label_noise": label_noise_rate, "feedback_noise": feedback_noise_rate}
#   label_noise_rate：标签级别的噪声比例，表示有多少正样本是有噪声标签的
#   feedback_noise_rate：噪声比例，取值为0-1，表示正样本与负样本中的样本级别的噪声的比例
#   sample_path: the path of sample need to add noise
#   export_path: the path to export samples with noise
def add_noise_to_sample(sample_path, noise_config, ontologies, ontology_root, export_paths):
    # load samples and intention
    samples = load_json(sample_path)
    intention_concept_form = samples["intention"]
    positive_samples = samples["positive_samples"]
    negative_samples = samples["negative_samples"]

    # transform concept to id
    intention_id_form = ConceptIdTransform.intention_concept_to_id(intention_concept_form, ontology_root)
    positive_samples_id_form = [ConceptIdTransform.sample_concept_to_id(x) for x in positive_samples]
    negative_samples_id_form = [ConceptIdTransform.sample_concept_to_id(x) for x in negative_samples]
    for tmp_sample in positive_samples_id_form:
        tmp_sample['note'] = 'true_positive_sample'
    for tmp_sample in negative_samples_id_form:
        tmp_sample['note'] = 'true_negative_samples'
    # first add sample level noise if needed
    if "feedback_noise" in noise_config:
        feedback_noise_rate = noise_config["feedback_noise"]
        random.shuffle(positive_samples_id_form)
        random.shuffle(negative_samples_id_form)
        # exchange positive samples and negative samples
        positive_to_negative_samples_num = int(len(positive_samples_id_form) * feedback_noise_rate)
        negative_to_positive_samples_num = int(len(negative_samples_id_form) * feedback_noise_rate)
        positive_to_negative_samples_id_form = positive_samples_id_form[:positive_to_negative_samples_num]
        negative_to_positive_samples_id_form = negative_samples_id_form[:negative_to_positive_samples_num]
        positive_samples_id_form = positive_samples_id_form[positive_to_negative_samples_num:]
        negative_samples_id_form = negative_samples_id_form[negative_to_positive_samples_num:]
        # add negative samples to positive samples until number of positive sample do not change
        for i in range(positive_to_negative_samples_num):
            tmp_sample = random.choice(negative_to_positive_samples_id_form)
            tmp_sample = copy.deepcopy(tmp_sample)
            tmp_sample['note'] = 'feedback_noise_in_positive'
            positive_samples_id_form.append(tmp_sample)
        # so do to negative samples
        for i in range(negative_to_positive_samples_num):
            tmp_sample = random.choice(positive_to_negative_samples_id_form)
            tmp_sample = copy.deepcopy(tmp_sample)
            tmp_sample['note'] = 'feedback_noise_in_negative'
            negative_samples_id_form.append(tmp_sample)
    # second add label level noise if needed
    if "label_noise" in noise_config:
        label_noise_rate = noise_config["label_noise"]
        max_label_num = noise_config["max_label_num"]
        random.shuffle(positive_samples_id_form)
        # only add label level noise to positive samples
        positive_samples_to_add_label_noise_num = int(len(positive_samples_id_form) * label_noise_rate)

        positive_samples_to_add_label_noise_id_form = \
            random.sample(positive_samples_id_form, positive_samples_to_add_label_noise_num)

        # get concepts that can be take as noise of every dimension for every sub intention
        dimension_label_noise_id_form = {}
        for tmp_sub_intention in intention_id_form:
            tmp_sub_intention_key = get_intent_key([tmp_sub_intention])
            tmp_sub_intention_label_noise_id_form = {}
            dimension_label_noise_id_form[tmp_sub_intention_key] = tmp_sub_intention_label_noise_id_form
            for tmp_dim in intention_dimensions:
                tmp_sub_intention_tmp_dim_value = tmp_sub_intention[tmp_dim]
                tmp_sub_intention_label_noise_id_form[tmp_dim] = set(ontologies[tmp_dim].keys())
                tmp_sub_intention_label_noise_id_form[tmp_dim].remove(ontology_root[tmp_dim])
                # if the tmp_sub_intention_tmp_dim_value is not root concept, then all concept can be label noise
                if tmp_sub_intention_tmp_dim_value != Ontology_Root[tmp_dim]:
                    tmp_sub_intention_label_noise_id_form[tmp_dim] -= \
                        set(ontologies[tmp_dim][tmp_sub_intention_tmp_dim_value])
                if tmp_sub_intention_tmp_dim_value in tmp_sub_intention_label_noise_id_form[tmp_dim]:
                    tmp_sub_intention_label_noise_id_form[tmp_dim].remove(tmp_sub_intention_tmp_dim_value)

        for tmp_sample in positive_samples_to_add_label_noise_id_form:
            # add label level noise to every dimension according to max_label_num
            is_feedback_noise = True
            for tmp_sub_intention in intention_id_form:
                tmp_sub_intention_key = get_intent_key([tmp_sub_intention])
                if len(retrieve_docs(tmp_sub_intention, [tmp_sample], Ontologies, Ontology_Root)) > 0:
                    for tmp_dim in intention_dimensions:
                        label_num_to_add = random.randint(2, max_label_num[tmp_dim]) - 1

                        if len(tmp_sample[tmp_dim]) > 1:
                            print(len(tmp_sample[tmp_dim]), label_num_to_add)
                            print(positive_samples_to_add_label_noise_id_form.count(tmp_sample))
                        labels_to_add = random.sample(dimension_label_noise_id_form[tmp_sub_intention_key][tmp_dim],
                                                      label_num_to_add)
                        for tmp_label in labels_to_add:
                            tmp_sample[tmp_dim].append(tmp_label)

                        if Ontology_Root[tmp_dim] in tmp_sample[tmp_dim]:
                            tmp_sample[tmp_dim].remove(Ontology_Root[tmp_dim])
                    tmp_sample['note'] = 'label_noise'
                    is_feedback_noise = False
                    break
            if is_feedback_noise:
                for tmp_dim in intention_dimensions:
                    label_num_to_add = random.randint(2, max_label_num[tmp_dim]) - 1
                    if len(tmp_sample[tmp_dim]) > 1:
                        print(len(tmp_sample[tmp_dim]), label_num_to_add)
                        print(positive_samples_to_add_label_noise_id_form.count(tmp_sample))
                    labels_to_add = random.sample(set(ontologies[tmp_dim].keys()),
                                                  label_num_to_add)
                    for tmp_label in labels_to_add:
                        tmp_sample[tmp_dim].append(tmp_label)

                    if Ontology_Root[tmp_dim] in tmp_sample[tmp_dim]:
                        tmp_sample[tmp_dim].remove(Ontology_Root[tmp_dim])
                tmp_sample['note'] = "feedback_noise_in_positive, label_noise"

    # transform id to concept
    final_positive_samples = []
    final_negative_samples = []

    for tmp_sample in positive_samples_id_form:
        tmp_sample = ConceptIdTransform.sample_id_to_concept(tmp_sample)
        final_positive_samples.append(tmp_sample)
    for tmp_sample in negative_samples_id_form:
        tmp_sample = ConceptIdTransform.sample_id_to_concept(tmp_sample)
        final_negative_samples.append(tmp_sample)
    final_samples = {"intention": intention_concept_form, "positive_samples": final_positive_samples,
                     "negative_samples": final_negative_samples}
    # export
    export_final_samples(final_samples, export_paths)


def generate_final_samples():
    all_samples = load_json(all_samples_path)
    test_positive_sample_num = 100
    test_negative_sample_num = 100
    test_ontologies = Ontologies
    test_direct_ancestors = direct_Ancestor
    test_ontology_root = Ontology_Root
    test_concept_information_content = concept_information_content
    # 计算样本相似度时各维度的权重
    test_dimensions_weight = {'S': 0.25,
                              'T': 0.2,
                              'M': 0.2,
                              'C': 0.35}

    intentions = load_json(intention_path)
    for scene_name in intentions.keys():
        tmp_scene_path = os.path.join(all_output_path_prefix, scene_name)
        if not os.path.exists(tmp_scene_path):
            os.mkdir(tmp_scene_path)
        tmp_intention = intentions[scene_name]
        tmp_intention_id_form = ConceptIdTransform.intention_concept_to_id(tmp_intention, Ontology_Root)
        print("generating", scene_name)
        tmp_intention_final_samples_paths = [os.path.join(tmp_scene_path, "final_samples.json"),
                                             os.path.join(tmp_scene_path, "final_samples.xlsx")]

        get_final_samples_by_intention3(tmp_intention_id_form, all_samples,
                                        test_positive_sample_num, test_negative_sample_num,
                                        test_ontologies, test_direct_ancestors, test_ontology_root,
                                        test_concept_information_content, test_dimensions_weight,
                                        tmp_intention_final_samples_paths)


def get_export_paths_by_noise_config(dirname, noise_config):
    export_file_name = "noise_samples"
    if "feedback_noise" in noise_config:
        feedback_noise_rate = noise_config["feedback_noise"]
        feedback_noise_rate_str = str(feedback_noise_rate).replace(".", "p")
        export_file_name += "_S" + feedback_noise_rate_str
    if "label_noise" in noise_config:
        label_noise_rate = noise_config["label_noise"]
        label_noise_rate_str = str(label_noise_rate).replace(".", "p")
        export_file_name += "_L" + label_noise_rate_str
    export_paths = [os.path.join(dirname, export_file_name + ".json"),
                    os.path.join(dirname, export_file_name + ".xlsx")]
    return export_paths


def generate_noise_samples():
    max_label_num = {'S': 2, 'T': 2, 'M': 3, 'C': 4}
    noise_configs = [
        {"feedback_noise": 0.1},
        {"feedback_noise": 0.2},
        {"feedback_noise": 0.3},
        {"feedback_noise": 0.4},
        {"feedback_noise": 0.5},
        {"label_noise": 0.2, "max_label_num": max_label_num},
        {"label_noise": 0.4, "max_label_num": max_label_num},
        {"label_noise": 0.6, "max_label_num": max_label_num},
        {"label_noise": 0.8, "max_label_num": max_label_num},
        {"label_noise": 1, "max_label_num": max_label_num},
        {"feedback_noise": 0.1, "label_noise": 0.2, "max_label_num": max_label_num},
        {"feedback_noise": 0.1, "label_noise": 0.4, "max_label_num": max_label_num},
        {"feedback_noise": 0.1, "label_noise": 0.6, "max_label_num": max_label_num},
        {"feedback_noise": 0.1, "label_noise": 0.8, "max_label_num": max_label_num},
        {"feedback_noise": 0.1, "label_noise": 1, "max_label_num": max_label_num},
        {"feedback_noise": 0.2, "label_noise": 0.2, "max_label_num": max_label_num},
        {"feedback_noise": 0.2, "label_noise": 0.4, "max_label_num": max_label_num},
        {"feedback_noise": 0.2, "label_noise": 0.6, "max_label_num": max_label_num},
        {"feedback_noise": 0.2, "label_noise": 0.8, "max_label_num": max_label_num},
        {"feedback_noise": 0.2, "label_noise": 1, "max_label_num": max_label_num},
        {"feedback_noise": 0.3, "label_noise": 0.2, "max_label_num": max_label_num},
        {"feedback_noise": 0.3, "label_noise": 0.4, "max_label_num": max_label_num},
        {"feedback_noise": 0.3, "label_noise": 0.6, "max_label_num": max_label_num},
        {"feedback_noise": 0.3, "label_noise": 0.8, "max_label_num": max_label_num},
        {"feedback_noise": 0.3, "label_noise": 1, "max_label_num": max_label_num},
    ]

    scenes_dir = all_output_path_prefix
    scenes_name = os.listdir(scenes_dir)
    for tmp_scene_name in scenes_name:
        tmp_sample_dir = os.path.join(scenes_dir, tmp_scene_name)
        tmp_sample_path = os.path.join(tmp_sample_dir, "final_samples.json")
        for tmp_noise_config in noise_configs:
            print("adding noise to ", tmp_sample_dir, "with noise config", tmp_noise_config)
            tmp_export_paths = get_export_paths_by_noise_config(tmp_sample_dir, tmp_noise_config)
            add_noise_to_sample(tmp_sample_path, tmp_noise_config, Ontologies, Ontology_Root, tmp_export_paths)


# 生成各种样本总数的样本集，每个样本集正负样本数量相同
def generate_samples_with_various_sample_num():
    # all_sample_nums = [10, 20, 50, 100, 150, 200]  # 样本总数
    all_sample_nums = [10, 20, 40, 60, 80, 100, 150, 200, 250, 300]  # 样本总数

    intentions = load_json(intention_path)
    print(len(intentions.keys()))

    for tmp_intention_name in intentions:
        tmp_intention = intentions[tmp_intention_name]
        tmp_intention_path = os.path.join(all_output_path_prefix, tmp_intention_name)
        print("generating", tmp_intention_name)
        if not os.path.exists(tmp_intention_path):
            raise Exception(f"{tmp_intention_name} not found")
        tmp_intention_final_samples_path = os.path.join(tmp_intention_path, f"final_samples.json")
        tmp_intention_final_samples = load_json(tmp_intention_final_samples_path)
        tmp_source_intention = tmp_intention_final_samples["intention"]
        tmp_source_intention_id_form = ConceptIdTransform.intention_concept_to_id(tmp_source_intention,
                                                                                  Ontology_Root)
        tmp_source_positive_samples = tmp_intention_final_samples["positive_samples"]
        tmp_source_positive_samples_id_form = \
            [ConceptIdTransform.sample_concept_to_id(x) for x in tmp_source_positive_samples]
        tmp_source_negative_samples = tmp_intention_final_samples["negative_samples"]
        tmp_source_negative_samples_id_form = \
            [ConceptIdTransform.sample_concept_to_id(x) for x in tmp_source_negative_samples]
        for tmp_all_sample_num in all_sample_nums:
            tmp_positive_num = int(tmp_all_sample_num / 2)
            tmp_negative_num = tmp_all_sample_num - tmp_positive_num
            per_sub_intention_positive_num = int(tmp_positive_num / len(tmp_intention))
            per_sub_intention_negative_num = int(tmp_negative_num / len(tmp_intention))
            tmp_positive_samples = []
            tmp_negative_samples = []
            for j, tmp_sub_intention in enumerate(tmp_source_intention_id_form):
                if tmp_source_intention == [{"T": "ThemeRoot", "C": "Thing", "S": "America", "M": "MapMethodRoot"}]:
                    tmp_sub_intention_source_positive_samples_id = set(range(len(tmp_source_positive_samples)))
                    tmp_sub_intention_source_negative_samples_id = set(range(len(tmp_source_negative_samples)))
                else:
                    tmp_sub_intention_source_positive_samples_id = \
                        retrieve_docs(tmp_sub_intention, tmp_source_positive_samples_id_form,
                                      Ontologies, Ontology_Root)
                    tmp_sub_intention_source_negative_samples_id = \
                        set(range(len(tmp_source_negative_samples_id_form))) - retrieve_docs(
                            tmp_sub_intention,
                            tmp_source_negative_samples_id_form,
                            Ontologies,
                            Ontology_Root)
                # 由于tmp_source_positive_samples与tmp_source_positive_samples_id_form各样本的顺序一样，因此不用再转换
                tmp_sub_intention_source_positive_samples = \
                    [tmp_source_positive_samples[x] for x in tmp_sub_intention_source_positive_samples_id]
                tmp_sub_intention_source_negative_samples = \
                    [tmp_source_negative_samples[x] for x in tmp_sub_intention_source_negative_samples_id]
                if j == len(tmp_source_intention) - 1:
                    tmp_sub_intention_positive_num = tmp_positive_num - j * per_sub_intention_positive_num
                    tmp_sub_intention_negative_num = tmp_negative_num - j * per_sub_intention_negative_num
                else:
                    tmp_sub_intention_positive_num = (j + 1) * per_sub_intention_positive_num
                    tmp_sub_intention_negative_num = (j + 1) * per_sub_intention_negative_num
                for k in range(tmp_sub_intention_positive_num):
                    tmp_selected_positive_sample = random.choice(tmp_sub_intention_source_positive_samples)
                    tmp_positive_samples.append(copy.deepcopy(tmp_selected_positive_sample))
                for k in range(tmp_sub_intention_negative_num):
                    tmp_selected_negative_sample = random.choice(tmp_sub_intention_source_negative_samples)
                    tmp_negative_samples.append(copy.deepcopy(tmp_selected_negative_sample))
            tmp_output_path = os.path.join(tmp_intention_path,
                                           f"final_samples_PN{tmp_positive_num}_NN{tmp_negative_num}.json")
            tmp_result = {"intention": copy.deepcopy(tmp_source_intention),
                          "positive_samples": tmp_positive_samples,
                          "negative_samples": tmp_negative_samples}
            save_as_json(tmp_result, tmp_output_path)


def get_intention_v2_file():
    content_concept = {"TransitionMetal": "http://sweetontology.net/matrElement/TransitionMetal",
                       "ExtrusiveRock": "http://sweetontology.net/matrRockIgneous/ExtrusiveRock",
                       "Temperature": "http://sweetontology.net/propTemperature/Temperature",
                       "VolcanicRock": "http://sweetontology.net/matrRockIgneous/VolcanicRock",
                       "Wave": "http://sweetontology.net/phenWave/Wave",
                       "Wind": "http://sweetontology.net/phenAtmoWind/Wind",
                       "Rock": "http://sweetontology.net/matrRock/Rock",
                       "Animal": "http://sweetontology.net/matrAnimal/Animal",
                       "None": "None"}
    intention_v2_csv = load_csv(intention_csv_path)
    tmp_intention = []
    tmp_intention_name = None
    intentions = {}
    for tmp_line in intention_v2_csv:
        if len(tmp_line[0]) > 0:
            # 如果已经开始下一个意图，则将意图放入意图哈希表
            intentions[copy.deepcopy(tmp_intention_name)] = copy.deepcopy(tmp_intention)
            tmp_intention_name = tmp_line[0].replace("场景", "Scene")
            tmp_intention = [{"T": tmp_line[1], "C": content_concept[tmp_line[2]], "S": tmp_line[3], "M": tmp_line[4]}]
        else:
            # 当前意图还有其他的子意图，先把当前子意图放入临时意图
            tmp_intention.append(
                {"T": tmp_line[1], "C": content_concept[tmp_line[2]], "S": tmp_line[3], "M": tmp_line[4]})
    intentions[copy.deepcopy(tmp_intention_name)] = copy.deepcopy(tmp_intention)
    save_as_json(intentions, intention_path)


if __name__ == "__main__":
    # 生成总样本集，设置为单标签
    test_max_label_num = {'S': 1, 'T': 1, 'M': 1, 'C': 1}
    # 数量为一千万
    test_all_samples_num = 10_000_000
    generate_all_samples(test_max_label_num, test_all_samples_num,
                         all_samples_path)

    # 根据预定义意图与总样本集生成无噪声反馈样本集
    generate_final_samples()
    # 查看每个样本集中有多少互不相同的正样本
    print(min_positive_num)
    # 为无噪声反馈样本集添加噪声
    generate_noise_samples()
    # 采样生成不同规模的反馈样本集
    generate_samples_with_various_sample_num()
    # 将预定义意图文件从csv格式转为json
    # get_intention_v2_file()
    print("test finished")
    print("以上")
