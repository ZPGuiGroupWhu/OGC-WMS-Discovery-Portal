# 试验用样本
from MDL_RM.src.main.samples.input import DimensionValues
from MDL_RM.src.main.util.FileUtil import load_json

Ontology_Root = {'Spatial': DimensionValues.SpatialValue.Ontology_Root,
                 'Theme': DimensionValues.ThemeValues.Ontology_Root,
                 'MapMethod': DimensionValues.MapMethodValues.Ontology_Root,
                 'MapContent': DimensionValues.MapContentValues.Ontology_Root}


def transform_sample(relevance_feedback_samples):
    # transform S,C,M,T to Spatial,MapContent,MapMethod,Theme
    positive_samples = []
    negative_samples = []
    positive_sample_key = "positive_samples" if "positive_samples" in relevance_feedback_samples else "relevance"
    negative_sample_key = "negative_samples" if "negative_samples" in relevance_feedback_samples else "irrelevance"
    for tmp_sample in relevance_feedback_samples[positive_sample_key]:
        tmp_sample_copy = {"Spatial": tmp_sample["S"] if "S" in tmp_sample else tmp_sample["Spatial"],
                           "MapContent": tmp_sample["C"] if "C" in tmp_sample else tmp_sample["MapContent"],
                           "MapMethod": tmp_sample["M"] if "M" in tmp_sample else tmp_sample["MapMethod"],
                           "Theme": tmp_sample["T"] if "T" in tmp_sample else tmp_sample["Theme"]}
        positive_samples.append(tmp_sample_copy)
    for tmp_sample in relevance_feedback_samples[negative_sample_key]:
        tmp_sample_copy = {"Spatial": tmp_sample["S"] if "S" in tmp_sample else tmp_sample["Spatial"],
                           "MapContent": tmp_sample["C"] if "C" in tmp_sample else tmp_sample["MapContent"],
                           "MapMethod": tmp_sample["M"] if "M" in tmp_sample else tmp_sample["MapMethod"],
                           "Theme": tmp_sample["T"] if "T" in tmp_sample else tmp_sample["Theme"]}
        negative_samples.append(tmp_sample_copy)

    # change None to root concept
    for tmp_sample in positive_samples:
        for tmp_dim in tmp_sample:
            if tmp_sample[tmp_dim] == ["None"]:
                tmp_sample[tmp_dim] = [Ontology_Root[tmp_dim]]
    for tmp_sample in negative_samples:
        for tmp_dim in tmp_sample:
            if tmp_sample[tmp_dim] == ["None"]:
                tmp_sample[tmp_dim] = [Ontology_Root[tmp_dim]]
    result = {"relevance": positive_samples, "irrelevance": negative_samples}
    return result


def load_sample_from_file(sample_path):
    tmp_samples = load_json(sample_path)
    tmp_intention = tmp_samples["intention"]
    tmp_intention_copy = []
    for sub_intention in tmp_intention:
        tmp_intention_copy.append({"Spatial": sub_intention["S"] if "S" in sub_intention else sub_intention["Spatial"],
                                   "MapContent": sub_intention["C"] if "C" in sub_intention else sub_intention[
                                       "MapContent"],
                                   "MapMethod": sub_intention["M"] if "M" in sub_intention else sub_intention[
                                       "MapMethod"],
                                   "Theme": sub_intention["T"] if "T" in sub_intention else sub_intention["Theme"]})
    real_intention = tmp_intention_copy

    # change None to root concept
    for sub_intention in real_intention:
        for tmp_dim in sub_intention:
            if sub_intention[tmp_dim] == "None":
                sub_intention[tmp_dim] = Ontology_Root[tmp_dim]
    docs = transform_sample(tmp_samples)
    return docs, real_intention


