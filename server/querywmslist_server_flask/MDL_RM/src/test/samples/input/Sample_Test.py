from MDL_RM.src.main.samples.input import Sample

if __name__ == "__main__":
    test_sample_path = "./../../../../resources/samples/scenes_v4_5/Scene11/final_samples.json"
    docs, real_intention = Sample.load_sample_from_file(test_sample_path)
    print(real_intention)
    print(docs)
    print(list(docs["relevance"][0].keys()))
