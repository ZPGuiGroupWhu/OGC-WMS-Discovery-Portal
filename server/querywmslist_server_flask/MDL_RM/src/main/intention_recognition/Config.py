# for MRIEMR
adjust_sample_ratio = True                      # 是否平衡正负样本比例
adjust_sample_num = True                     # 是否调整正负样本数量
MDL_RM_random_merge_number = 50                    # 随机合并时最大尝试次数
rule_covered_positive_sample_rate_threshold = 0.3
TAG_RECORD_MERGE_PROCESS = False

# for RuleGO
RuleGO_statistical_significance_level = 0.05    # 规则的统计显著性阈值
RuleGO_min_support = 40                         # 最小支持度，调优得到40
RuleGO_max_term_num_in_rule = 4                 # 一个规则包含的词项的最大值
RuleGO_rule_similarity_threshold = 0.5          # 意图的相似度阈值
RuleGO_use_similarity_criteria = False          # 是否基于意图相似度保证意图多样性

# for DTHF
DTHF_min_support = 30                           # 转化为子意图时用于剪枝的最小支持度
DTHF_use_min_support = False                    # 是否基于最小支持度的剪枝策略，DTHF论文默认不支持
