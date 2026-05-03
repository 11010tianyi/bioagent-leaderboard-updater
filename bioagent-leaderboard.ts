#!/usr/bin/env bun
/**
 * Bioinformatics / biomedical AI agent leaderboard generator.
 *
 * The landscape is split into separate views because GitHub stars behave very
 * differently for paper-backed bioagents, broad scientific-agent platforms,
 * skills libraries, and benchmarks. Static scientific metadata is curated;
 * GitHub stars/forks/update timestamps are fetched live when the script runs.
 *
 * Usage:
 *   bun ./bioagent-leaderboard.ts --output bioagent-leaderboard.md
 *   GITHUB_TOKEN=ghp_xxx bun ./bioagent-leaderboard.ts --output bioagent-leaderboard.md --zh-output bioagent-leaderboard.zh-CN.md
 *   bun ./bioagent-leaderboard.ts --offline --output bioagent-leaderboard.md
 */

type ProjectSource =
  | "Image Seed"
  | "Paper/Page"
  | "GitHub Search"
  | "Benchmark/Source List"
  | "Adjacent Ecosystem"
  | "Manual";

type ProjectCategory =
  | "direct-agent"
  | "platform-framework"
  | "skill-library"
  | "benchmark-source"
  | "adjacent-tool"
  | "watchlist";

type BoardSection = "core" | "ecosystem" | "benchmark" | "watch";
type Language = "en" | "zh";

interface ProjectEntry {
  name: string;
  category: ProjectCategory;
  sections: BoardSection[];
  developers: string;
  release: string;
  venue: string;
  impactFactor: string;
  repo?: string;
  paperUrl?: string;
  projectUrl?: string;
  featuresEn: string;
  featuresZh: string;
  rationaleEn: string;
  rationaleZh: string;
  sources: ProjectSource[];
}

interface RepoStats {
  stars: number | null;
  forks: number | null;
  openIssues: number | null;
  pushedAt: string | null;
  updatedAt: string | null;
  description: string | null;
  htmlUrl: string | null;
  error?: string;
}

interface RankedProject extends ProjectEntry {
  stats: RepoStats | null;
}

const SOURCE_INFO: Record<ProjectSource, { label: string; zhLabel: string }> = {
  "Image Seed": { label: "Image seed table", zhLabel: "图片种子表" },
  "Paper/Page": { label: "Paper/project page", zhLabel: "论文/项目页" },
  "GitHub Search": { label: "GitHub search", zhLabel: "GitHub 检索" },
  "Benchmark/Source List": { label: "Benchmark/source list", zhLabel: "Benchmark/资料源" },
  "Adjacent Ecosystem": { label: "Adjacent ecosystem", zhLabel: "相邻生态" },
  Manual: { label: "Manual curation", zhLabel: "手工维护" },
};

const CATEGORY_INFO: Record<ProjectCategory, { label: string; zhLabel: string }> = {
  "direct-agent": { label: "Direct bioagent", zhLabel: "专业 BioAgent" },
  "platform-framework": { label: "Agent platform/framework", zhLabel: "Agent 平台/框架" },
  "skill-library": { label: "Agent skills library", zhLabel: "Agent 技能库" },
  "benchmark-source": { label: "Benchmark/source", zhLabel: "Benchmark/资料源" },
  "adjacent-tool": { label: "Adjacent bio-AI tool", zhLabel: "相邻 Bio-AI 工具" },
  watchlist: { label: "Emerging/watchlist", zhLabel: "候选观察" },
};

const PROJECTS: ProjectEntry[] = [
  {
    name: "Biomni",
    category: "direct-agent",
    sections: ["core"],
    developers: "Stanford SNAP / Kexin Huang et al.",
    release: "2025.05",
    venue: "bioRxiv / GitHub",
    impactFactor: "N/A (Preprint / Software)",
    repo: "snap-stanford/Biomni",
    projectUrl: "https://biomni.stanford.edu/",
    featuresEn: "General-purpose biomedical AI agent combining LLM reasoning, retrieval-augmented planning, and code execution across biomedical subfields.",
    featuresZh: "通用生物医学 AI Agent，结合 LLM 推理、检索增强规划和代码执行，覆盖多类生物医学任务。",
    rationaleEn: "Most visible open-source general biomedical agent in the current GitHub landscape.",
    rationaleZh: "当前 GitHub 上最显眼的通用生物医学 Agent 项目。",
    sources: ["Paper/Page", "GitHub Search"],
  },
  {
    name: "AutoBA",
    category: "direct-agent",
    sections: ["core"],
    developers: "Juexiao Zhou et al.",
    release: "2024.10",
    venue: "Advanced Science",
    impactFactor: "14.1",
    repo: "JoshuaChou2018/AutoBA",
    featuresEn: "Automated multi-omics workflow, YAML configuration, local LLM support, and code auto-repair modules.",
    featuresZh: "全自动多组学流程、YAML 配置、本地 LLM 支持、代码自动修复模块。",
    rationaleEn: "Paper-backed multi-omics bioinformatics agent from the seed table.",
    rationaleZh: "图片种子表中的论文型多组学 bioagent。",
    sources: ["Image Seed", "Paper/Page"],
  },
  {
    name: "SRAgent",
    category: "direct-agent",
    sections: ["core"],
    developers: "Arc Institute / scBaseCount authors",
    release: "2025.02",
    venue: "bioRxiv / GitHub",
    impactFactor: "N/A (Preprint / Software)",
    repo: "ArcInstitute/SRAgent",
    featuresEn: "LLM agents for obtaining and working with Sequence Read Archive data and related bioinformatics databases.",
    featuresZh: "面向 SRA 和相关生物信息数据库的数据获取与处理 LLM agents。",
    rationaleEn: "Narrow but concrete bioinformatics database agent.",
    rationaleZh: "面向 SRA 数据库的具体生物信息 Agent。",
    sources: ["Paper/Page", "GitHub Search"],
  },
  {
    name: "CRISPR-GPT",
    category: "direct-agent",
    sections: ["core"],
    developers: "Kaixuan Huang et al.",
    release: "2025.07",
    venue: "Nature Biomedical Engineering",
    impactFactor: "28.1",
    repo: "cong-lab/crispr-gpt-pub",
    featuresEn: "Fine-tuned GPT for full-cycle gene-editing design, safety/compliance checks, and automated protocol drafting.",
    featuresZh: "微调 GPT，覆盖基因编辑全周期设计、安全性合规检查、自动化协议草拟。",
    rationaleEn: "High-impact gene-editing workflow agent from the seed table.",
    rationaleZh: "图片种子表中的高影响力基因编辑流程 Agent。",
    sources: ["Image Seed", "Paper/Page"],
  },
  {
    name: "BioAgents",
    category: "direct-agent",
    sections: ["core"],
    developers: "Nikita Mehandru et al.",
    release: "2025.11",
    venue: "Scientific Reports",
    impactFactor: "3.9",
    repo: "bio-xyz/BioAgents",
    featuresEn: "Phi-3 small-model workflow with Biostars knowledge fine-tuning and nf-core integration.",
    featuresZh: "采用 Phi-3 小模型，针对 Biostars 社区知识精调，并集成 nf-core。",
    rationaleEn: "Bioinformatics assistant with nf-core/Biostars positioning.",
    rationaleZh: "围绕 nf-core 与 Biostars 的生物信息助手。",
    sources: ["Image Seed", "Paper/Page"],
  },
  {
    name: "NVIDIA Biomedical AI-Q Research Agent",
    category: "direct-agent",
    sections: ["core"],
    developers: "NVIDIA AI Blueprints",
    release: "2025+",
    venue: "GitHub / NVIDIA AI Blueprints",
    impactFactor: "N/A (Software)",
    repo: "NVIDIA-AI-Blueprints/biomedical-aiq-research-agent",
    featuresEn: "Blueprint for a biomedical research agent built around NVIDIA AI-Q style agent orchestration.",
    featuresZh: "基于 NVIDIA AI-Q 风格编排的生物医学研究 Agent 蓝图。",
    rationaleEn: "Vendor-backed biomedical research-agent implementation.",
    rationaleZh: "有厂商背书的生物医学研究 Agent 实现。",
    sources: ["GitHub Search"],
  },
  {
    name: "GenoMAS",
    category: "direct-agent",
    sections: ["core"],
    developers: "Liu-Hy contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "Liu-Hy/GenoMAS",
    featuresEn: "Minimalist multi-agent framework for scientific analysis workflows such as gene-expression analysis.",
    featuresZh: "面向基因表达等科学分析流程的轻量多 Agent 框架。",
    rationaleEn: "Gene-expression-oriented multi-agent analysis framework found by GitHub search.",
    rationaleZh: "GitHub 检索发现的基因表达多 Agent 分析框架。",
    sources: ["GitHub Search"],
  },
  {
    name: "BioMaster",
    category: "direct-agent",
    sections: ["core"],
    developers: "Houcheng Su et al.",
    release: "2025.01",
    venue: "bioRxiv",
    impactFactor: "N/A (Preprint)",
    repo: "ai4nucleome/BioMaster",
    featuresEn: "Multi-agent role division, RAG-enhanced domain knowledge retrieval, long-context memory, and Check-Agent validation.",
    featuresZh: "多代理角色分工、RAG 增强型知识检索、长程内存管理、Check-Agent 验证。",
    rationaleEn: "Paper-backed multi-agent bioinformatics system from the seed table.",
    rationaleZh: "图片种子表中的论文型多 Agent 生物信息系统。",
    sources: ["Image Seed", "Paper/Page"],
  },
  {
    name: "CASSIA",
    category: "direct-agent",
    sections: ["core"],
    developers: "ElliotXie contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "ElliotXie/CASSIA",
    featuresEn: "Multi-agent LLM framework for single-cell cell-type annotation with retrieval-augmented prompting.",
    featuresZh: "面向单细胞细胞类型注释的多 Agent LLM 框架，结合检索增强提示。",
    rationaleEn: "Single-cell multi-agent workflow with clear domain scope.",
    rationaleZh: "领域边界清晰的单细胞多 Agent 工作流。",
    sources: ["GitHub Search"],
  },
  {
    name: "AI Agents for Pharma",
    category: "direct-agent",
    sections: ["core"],
    developers: "Virtual Patient Engine contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "VirtualPatientEngine/AIAgents4Pharma",
    featuresEn: "AI agents for drug discovery, drug development, pharmaceutical R&D, knowledge graphs, and QSP modeling.",
    featuresZh: "面向药物发现、药物开发、制药研发、知识图谱与 QSP 建模的 AI Agents。",
    rationaleEn: "Drug-discovery agent project with explicit pharma R&D scope.",
    rationaleZh: "明确面向制药研发的药物发现 Agent 项目。",
    sources: ["GitHub Search"],
  },
  {
    name: "cellatria",
    category: "direct-agent",
    sections: ["core"],
    developers: "AstraZeneca",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "AstraZeneca/cellatria",
    featuresEn: "Agentic AI framework for ingestion and standardization of single-cell RNA-seq data analysis.",
    featuresZh: "用于单细胞 RNA-seq 数据分析摄取与标准化的 Agentic AI 框架。",
    rationaleEn: "Industry-backed single-cell agentic framework.",
    rationaleZh: "工业界背景的单细胞 Agentic 框架。",
    sources: ["GitHub Search"],
  },
  {
    name: "BioDSA",
    category: "direct-agent",
    sections: ["core"],
    developers: "Keiji-AI contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "Keiji-AI/BioDSA",
    featuresEn: "Framework for rapid prototyping of AI agents for biomedicine and data-science workflows.",
    featuresZh: "用于快速原型化生物医学和数据科学 AI agents 的框架。",
    rationaleEn: "Biomedical agent prototyping framework discovered in GitHub search.",
    rationaleZh: "GitHub 检索发现的生物医学 Agent 原型框架。",
    sources: ["GitHub Search"],
  },
  {
    name: "BRAD",
    category: "direct-agent",
    sections: ["core"],
    developers: "Jpickard1 / BRAD contributors",
    release: "2025.05",
    venue: "Bioinformatics / GitHub",
    impactFactor: "5.4",
    repo: "Jpickard1/BRAD",
    projectUrl: "https://brad-bioinformatics-retrieval-augmented-data.readthedocs.io/",
    featuresEn: "Bioinformatics Retrieval Augmented Digital assistant for RAG, tool/database integration, code execution, and biomarker discovery workflows.",
    featuresZh: "Bioinformatics Retrieval Augmented Digital 助手，支持 RAG、工具/数据库集成、代码执行和生物标志物发现流程。",
    rationaleEn: "Bioinformatics RAG assistant with tool/database integration.",
    rationaleZh: "集成工具与数据库的生物信息 RAG 助手。",
    sources: ["Paper/Page", "GitHub Search"],
  },
  {
    name: "KGARevion",
    category: "direct-agent",
    sections: ["core"],
    developers: "MIMS Harvard contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "mims-harvard/KGARevion",
    featuresEn: "Knowledge-graph assisted AI agent for knowledge-intensive biomedical question answering.",
    featuresZh: "面向知识密集型生物医学问答的知识图谱辅助 AI Agent。",
    rationaleEn: "Biomedical QA agent with explicit knowledge-graph positioning.",
    rationaleZh: "明确定位于知识图谱生物医学问答的 Agent。",
    sources: ["GitHub Search"],
  },
  {
    name: "BIA (BioInformatics Agent)",
    category: "direct-agent",
    sections: ["core"],
    developers: "Qi Xin et al.",
    release: "2025.01",
    venue: "Bioinformatics",
    impactFactor: "5.4",
    repo: "biagent-dev/bia",
    featuresEn: "Single-cell analysis focus, iterative self-improvement, and multi-database automated integration.",
    featuresZh: "专注单细胞分析、迭代自我完善、多数据库自动集成。",
    rationaleEn: "Paper-backed bioinformatics agent from the seed table.",
    rationaleZh: "图片种子表中的论文型生物信息 Agent。",
    sources: ["Image Seed", "Paper/Page"],
  },
  {
    name: "ESCARGOT",
    category: "direct-agent",
    sections: ["core"],
    developers: "EpistasisLab",
    release: "2025.01",
    venue: "Bioinformatics",
    impactFactor: "5.4",
    repo: "EpistasisLab/ESCARGOT",
    featuresEn: "Graph-of-thought driven Cypher querying, knowledge graph deep fusion, and transparent reasoning.",
    featuresZh: "思维图（GoT）驱动、Cypher 查询、知识图谱深度融合、透明推理。",
    rationaleEn: "Paper-backed graph-reasoning biomedical agent.",
    rationaleZh: "论文型图推理生物医学 Agent。",
    sources: ["Image Seed", "Paper/Page"],
  },
  {
    name: "BiOmics",
    category: "direct-agent",
    sections: ["core"],
    developers: "BGI Research",
    release: "2026.01",
    venue: "bioRxiv",
    impactFactor: "N/A (Preprint)",
    repo: "BGIResearch/BiOmics",
    featuresEn: "Dual-track inference and embedding architecture with a 350M-relationship system knowledge graph and cross-scale interpretation.",
    featuresZh: "双轨架构（推理+嵌入）、3.5 亿关系知识图谱、跨尺度解释。",
    rationaleEn: "Recent multi-omics agent from the seed table.",
    rationaleZh: "图片种子表中的新近多组学 Agent。",
    sources: ["Image Seed", "Paper/Page"],
  },
  {
    name: "CellAgent",
    category: "direct-agent",
    sections: ["core"],
    developers: "Yihang Xiao et al.",
    release: "2024.05 / 2026.01",
    venue: "bioRxiv / arXiv / ICLR 2026",
    impactFactor: "N/A (Preprint / Conference)",
    paperUrl: "https://openreview.net/forum?id=BsA2GNkJhz",
    projectUrl: "http://cell.agent4science.cn/",
    featuresEn: "LLM-driven multi-agent framework for natural-language single-cell and spatial transcriptomics analysis.",
    featuresZh: "面向自然语言单细胞与空间转录组分析的 LLM 驱动多 Agent 框架。",
    rationaleEn: "No reliable public GitHub repo found; retained as paper-backed core project.",
    rationaleZh: "未找到可靠公开 GitHub 仓库，作为论文型核心项目保留。",
    sources: ["Image Seed", "Paper/Page", "Manual"],
  },
  {
    name: "STELLA",
    category: "direct-agent",
    sections: ["core"],
    developers: "Ruofan Jin, Zaixi Zhang et al.",
    release: "2025.07",
    venue: "bioRxiv / arXiv",
    impactFactor: "N/A (Preprint)",
    paperUrl: "https://doi.org/10.1101/2025.07.01.662467",
    featuresEn: "Self-evolving biomedical research agent with multi-agent architecture, evolving template library, and dynamic tool ocean.",
    featuresZh: "自进化生物医学研究 Agent，多代理架构、可演化推理模板库和动态 Tool Ocean。",
    rationaleEn: "Paper-only self-evolving biomedical agent; no stable repo identified yet.",
    rationaleZh: "论文型自进化生物医学 Agent，暂未确认稳定公开仓库。",
    sources: ["Paper/Page", "Manual"],
  },
  {
    name: "Scientific Agent Skills",
    category: "skill-library",
    sections: ["ecosystem"],
    developers: "K-Dense AI",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "K-Dense-AI/scientific-agent-skills",
    featuresEn: "Large scientific agent-skills collection spanning research, engineering, analysis, finance, writing, bioinformatics, and drug discovery.",
    featuresZh: "大型科学 Agent 技能集合，覆盖科研、工程、分析、写作、生物信息和药物发现等方向。",
    rationaleEn: "Very high-star skills layer; important ecosystem signal but broader than bioinformatics.",
    rationaleZh: "高星技能层生态信号很强，但范围宽于生物信息。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "ClawBio",
    category: "skill-library",
    sections: ["ecosystem"],
    developers: "Manuel Corpas and community",
    release: "2026.04",
    venue: "GitHub / ClawBio",
    impactFactor: "N/A (Software)",
    repo: "ClawBio/ClawBio",
    projectUrl: "https://clawbio.ai/",
    featuresEn: "Bioinformatics-native AI agent skill library with local-first reproducible workflows and Claude Code plugin support.",
    featuresZh: "生物信息原生 AI Agent 技能库，本地优先、可复现流程，并支持 Claude Code 插件。",
    rationaleEn: "Bioinformatics-native skills library; not a single agent, but central to agent workflows.",
    rationaleZh: "生物信息原生技能库；不是单一 Agent，但对 Agent 工作流很关键。",
    sources: ["Paper/Page", "GitHub Search"],
  },
  {
    name: "K-Dense BYOK",
    category: "platform-framework",
    sections: ["ecosystem"],
    developers: "K-Dense AI",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "K-Dense-AI/k-dense-byok",
    featuresEn: "Desktop AI co-scientist powered by scientific agent skills, with bioinformatics, drug-discovery, MCP, and local-first topics.",
    featuresZh: "桌面 AI co-scientist，基于科学 Agent 技能，包含生物信息、药物发现、MCP 和本地优先等主题。",
    rationaleEn: "High-star scientific agent platform adjacent to bioinformatics workflows.",
    rationaleZh: "高星科学 Agent 平台，与生物信息工作流强相关。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "bioSkills",
    category: "skill-library",
    sections: ["ecosystem"],
    developers: "GPTomics contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "GPTomics/bioSkills",
    featuresEn: "SKILLS.md collection for doing bioinformatics with coding agents such as Claude Code.",
    featuresZh: "面向 Claude Code 等编码 Agent 的生物信息 SKILLS.md 集合。",
    rationaleEn: "High-star bioinformatics skill-pack ecosystem project.",
    rationaleZh: "高星生物信息技能包生态项目。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "Medical Research Skills",
    category: "skill-library",
    sections: ["ecosystem"],
    developers: "aipoch contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "aipoch/medical-research-skills",
    featuresEn: "Agent skills for medical research, protocol design, data analysis, evidence insights, and academic writing.",
    featuresZh: "医疗研究 Agent 技能，覆盖方案设计、数据分析、证据洞察和学术写作。",
    rationaleEn: "Medical-research skills library adjacent to biomedical agent workflows.",
    rationaleZh: "与生物医学 Agent 工作流相邻的医疗研究技能库。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "PantheonOS",
    category: "platform-framework",
    sections: ["ecosystem"],
    developers: "aristoteleo contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "aristoteleo/PantheonOS",
    featuresEn: "General, evolvable, distributed agent framework and harness for data science with biology, single-cell, and spatial-transcriptomics topics.",
    featuresZh: "通用、可演化、分布式数据科学 Agent 框架，带有生物学、单细胞、空间转录组主题。",
    rationaleEn: "Broad platform with explicit biology/single-cell tags; categorized outside the core bioagent table.",
    rationaleZh: "有明确生物/单细胞标签的通用平台，因此放在生态榜而非专业主榜。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "SciAgent-Skills",
    category: "skill-library",
    sections: ["ecosystem"],
    developers: "jaechang-hits contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "jaechang-hits/SciAgent-Skills",
    featuresEn: "Bioinformatics and life-science skills for coding agents, covering RNA-seq, single-cell, drug discovery, and proteomics.",
    featuresZh: "面向编码 Agent 的生物信息和生命科学技能，覆盖 RNA-seq、单细胞、药物发现和蛋白组。",
    rationaleEn: "Domain-specific skills library that can power bioagent workflows.",
    rationaleZh: "可支撑 bioagent 工作流的领域技能库。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "Bioinformatics Agent Skills",
    category: "skill-library",
    sections: ["ecosystem"],
    developers: "Variome Analytics",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "variomeanalytics/bioinformatics-agent-skills",
    featuresEn: "MCP server for querying a knowledge graph of bioinformatics workflows from agentic coding tools.",
    featuresZh: "MCP 服务，可让 Agent 查询生物信息工作流知识图谱。",
    rationaleEn: "Agent-facing workflow knowledge layer for bioinformatics.",
    rationaleZh: "面向 Agent 的生物信息工作流知识层。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "Life Sciences Research MCP",
    category: "skill-library",
    sections: ["ecosystem"],
    developers: "donbr contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "donbr/lifesciences-research",
    featuresEn: "MCP wrappers for Open Targets, ChEMBL, UniProt, and other life-sciences APIs.",
    featuresZh: "面向 Open Targets、ChEMBL、UniProt 等生命科学 API 的 MCP 封装。",
    rationaleEn: "Tool-access layer for life-science agents.",
    rationaleZh: "生命科学 Agent 的工具访问层。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "KG_RAG",
    category: "adjacent-tool",
    sections: ["ecosystem"],
    developers: "Baranzini Lab",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "BaranziniLab/KG_RAG",
    featuresEn: "Biomedical knowledge-graph RAG infrastructure useful for agent grounding, but not itself a full bioagent.",
    featuresZh: "生物医学知识图谱 RAG 基础设施，可用于 Agent grounding，但本身不是完整 bioagent。",
    rationaleEn: "High-star adjacent infrastructure; separated to avoid inflating the core agent ranking.",
    rationaleZh: "高星相邻基础设施，单列以免抬高专业 Agent 主榜。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "mLLMCelltype",
    category: "adjacent-tool",
    sections: ["ecosystem"],
    developers: "cafferychen777 contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "cafferychen777/mLLMCelltype",
    featuresEn: "LLM-powered single-cell cell-type annotation tool; useful adjacent technology, not a general agent system.",
    featuresZh: "LLM 驱动的单细胞细胞类型注释工具；属于有用相邻技术，不是通用 Agent 系统。",
    rationaleEn: "High-star single-cell LLM tool kept as adjacent rather than core.",
    rationaleZh: "高星单细胞 LLM 工具，作为相邻工具而非主榜 Agent。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
  {
    name: "BixBench",
    category: "benchmark-source",
    sections: ["benchmark"],
    developers: "Future House",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Benchmark)",
    repo: "Future-House/BixBench",
    featuresEn: "Benchmark for LLM-based agents in computational biology.",
    featuresZh: "面向计算生物学 LLM Agent 的 Benchmark。",
    rationaleEn: "Useful evaluation reference, not an agent.",
    rationaleZh: "重要评测资料源，不是 Agent。",
    sources: ["Benchmark/Source List", "GitHub Search"],
  },
  {
    name: "ScienceAgentBench",
    category: "benchmark-source",
    sections: ["benchmark"],
    developers: "OSU NLP Group",
    release: "2025",
    venue: "ICLR / GitHub",
    impactFactor: "N/A (Benchmark)",
    repo: "OSU-NLP-Group/ScienceAgentBench",
    featuresEn: "Benchmark for rigorous assessment of language agents in data-driven scientific discovery.",
    featuresZh: "面向数据驱动科学发现中语言 Agent 的严谨评测 Benchmark。",
    rationaleEn: "General science-agent benchmark with bioinformatics tasks.",
    rationaleZh: "包含生物信息任务的通用科学 Agent Benchmark。",
    sources: ["Benchmark/Source List", "GitHub Search"],
  },
  {
    name: "BioKGBench",
    category: "benchmark-source",
    sections: ["benchmark"],
    developers: "Westlake AutoLab",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Benchmark)",
    repo: "westlake-autolab/BioKGBench",
    featuresEn: "Knowledge-graph checking benchmark for AI agents in biomedical science.",
    featuresZh: "面向生物医学科学 AI Agent 的知识图谱检查 Benchmark。",
    rationaleEn: "Benchmark for biomedical KG reasoning.",
    rationaleZh: "面向生物医学知识图谱推理的 Benchmark。",
    sources: ["Benchmark/Source List", "GitHub Search"],
  },
  {
    name: "BioAgent Bench",
    category: "benchmark-source",
    sections: ["benchmark"],
    developers: "bioagent-bench contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Benchmark)",
    repo: "bioagent-bench/bioagent-bench",
    featuresEn: "Benchmark project for bioagent evaluation and task construction.",
    featuresZh: "用于 bioagent 评测和任务构建的 Benchmark 项目。",
    rationaleEn: "Named benchmark for the bioagent space.",
    rationaleZh: "bioagent 领域具名 Benchmark。",
    sources: ["Benchmark/Source List", "GitHub Search"],
  },
  {
    name: "Awesome LLM Agents for Scientific Discovery",
    category: "benchmark-source",
    sections: ["benchmark"],
    developers: "zjlrock777 contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Source List)",
    repo: "zjlrock777/Awesome-LLM-Agents-Scientific-Discovery",
    featuresEn: "Curated list of LLM-powered agents for biomedical research and scientific discovery.",
    featuresZh: "LLM 科学发现/生物医学研究 Agent 资料集合。",
    rationaleEn: "Source list used for discovery, not a ranked agent.",
    rationaleZh: "用于发现候选项目的资料源，不作为 Agent 排名。",
    sources: ["Benchmark/Source List", "GitHub Search"],
  },
  {
    name: "Awesome AI Meets Biology",
    category: "benchmark-source",
    sections: ["benchmark"],
    developers: "Webioinfo01 contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Source List)",
    repo: "Webioinfo01/Awesome-AI-Meets-Biology",
    featuresEn: "Curated collection of LLMs, agents, and tools in biomedical and bioinformatics fields.",
    featuresZh: "生物医学和生物信息方向 LLM、Agent、工具资料集合。",
    rationaleEn: "Discovery source list rather than an implementation.",
    rationaleZh: "候选发现资料源，不是实现项目。",
    sources: ["Benchmark/Source List", "GitHub Search"],
  },
  {
    name: "Nigmat bioagent",
    category: "watchlist",
    sections: ["watch"],
    developers: "Nigmat-future contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "Nigmat-future/bioagent",
    featuresEn: "Autonomous multi-agent system for end-to-end bioinformatics research.",
    featuresZh: "用于端到端生物信息研究的自主多 Agent 系统。",
    rationaleEn: "Promising direct match by name and description, but needs stronger external validation.",
    rationaleZh: "名称和描述高度匹配，但仍需更强外部验证。",
    sources: ["GitHub Search"],
  },
  {
    name: "celltype-agent",
    category: "watchlist",
    sections: ["watch"],
    developers: "plobb contributors",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "plobb/celltype-agent",
    featuresEn: "Agentic AI tool for automated cell-type annotation of single-cell and spatial genomics data.",
    featuresZh: "用于单细胞和空间组学细胞类型自动注释的 Agentic AI 工具。",
    rationaleEn: "Specific single-cell agentic tool with low current GitHub traction.",
    rationaleZh: "具体的单细胞 Agentic 工具，目前 GitHub 热度较低。",
    sources: ["GitHub Search"],
  },
  {
    name: "kai",
    category: "watchlist",
    sections: ["watch"],
    developers: "David Fischer Lab",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "davidfischerlab/kai",
    featuresEn: "Agentic AI for building single-cell omics analyses in Jupyter notebooks, surfaced through a VS Code extension.",
    featuresZh: "通过 VS Code 扩展在 Jupyter 中构建单细胞组学分析的 Agentic AI。",
    rationaleEn: "Interesting notebook-native single-cell agent, still early by stars.",
    rationaleZh: "有意思的 notebook 原生单细胞 Agent，当前仍处早期。",
    sources: ["GitHub Search"],
  },
  {
    name: "Mimosa-AI",
    category: "watchlist",
    sections: ["watch"],
    developers: "HolobiomicsLab",
    release: "2025+",
    venue: "GitHub",
    impactFactor: "N/A (Software)",
    repo: "HolobiomicsLab/Mimosa-AI",
    featuresEn: "Self-evolving framework for autonomous scientific research with multi-agent workflows and MCP tool discovery.",
    featuresZh: "自进化自主科学研究框架，支持多 Agent 工作流和 MCP 工具发现。",
    rationaleEn: "Bioinformatics-tagged autonomous-science framework worth tracking.",
    rationaleZh: "带生物信息标签的自主科学研究框架，值得观察。",
    sources: ["GitHub Search", "Adjacent Ecosystem"],
  },
];

const DEFAULT_OUTPUT = "bioagent-leaderboard.md";
const DEFAULT_ZH_OUTPUT = "bioagent-leaderboard.zh-CN.md";
const NUMBER_FORMAT = new Intl.NumberFormat("en-US");

function getFlagValue(flag: string, fallback: string): string | null {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? fallback;
}

function generatedDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.TZ || "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function escapeMarkdownCell(cell: string): string {
  return cell.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function mdTable(headers: string[], rows: string[][]): string {
  const header = `| ${headers.map(escapeMarkdownCell).join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(escapeMarkdownCell).join(" | ")} |`).join("\n");
  return [header, sep, body].join("\n");
}

function categoryLabel(category: ProjectCategory, language: Language): string {
  const info = CATEGORY_INFO[category];
  return language === "zh" ? info.zhLabel : info.label;
}

function formatSources(sources: ProjectSource[], language: Language): string {
  return sources
    .map((source) => {
      const info = SOURCE_INFO[source];
      return language === "zh" ? info.zhLabel : info.label;
    })
    .join(", ");
}

function repoOrPaper(project: ProjectEntry): string {
  if (project.repo) return `[${project.repo}](https://github.com/${project.repo})`;
  if (project.paperUrl) return `[paper](${project.paperUrl})`;
  if (project.projectUrl) return `[project](${project.projectUrl})`;
  return "N/A";
}

function nullableNumber(value: number | null | undefined): string {
  return typeof value === "number" ? NUMBER_FORMAT.format(value) : "N/A";
}

function shortDate(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "N/A";
}

function starsValue(project: RankedProject): number {
  return project.stats?.stars ?? -1;
}

function sortByStarsThenName(a: RankedProject, b: RankedProject): number {
  const starDiff = starsValue(b) - starsValue(a);
  return starDiff || a.name.localeCompare(b.name);
}

async function fetchRepoStats(repo: string, token?: string): Promise<RepoStats> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "bioagent-leaderboard",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (res.status === 404) {
      return { stars: null, forks: null, openIssues: null, pushedAt: null, updatedAt: null, description: null, htmlUrl: null, error: "404" };
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as {
      stargazers_count: number;
      forks_count: number;
      open_issues_count: number;
      pushed_at: string | null;
      updated_at: string | null;
      description: string | null;
      html_url: string;
    };
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      pushedAt: data.pushed_at,
      updatedAt: data.updated_at,
      description: data.description,
      htmlUrl: data.html_url,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { stars: null, forks: null, openIssues: null, pushedAt: null, updatedAt: null, description: null, htmlUrl: null, error: message };
  }
}

async function collectProjects(offline: boolean, token?: string): Promise<RankedProject[]> {
  const ranked = await Promise.all(
    PROJECTS.map(async (project) => ({
      ...project,
      stats: project.repo && !offline ? await fetchRepoStats(project.repo, token) : null,
    })),
  );

  const repoProjects = ranked.filter((project) => project.repo);
  const hardErrors = repoProjects.filter((project) => project.stats?.error && project.stats.error !== "404");
  if (!offline && hardErrors.length === repoProjects.length) {
    throw new Error(`All GitHub API requests failed: ${hardErrors[0]?.stats?.error ?? "unknown error"}`);
  }

  return ranked;
}

function githubRows(projects: RankedProject[], language: Language): string[][] {
  return projects
    .filter((project) => project.repo)
    .sort(sortByStarsThenName)
    .map((project, idx) => [
      String(idx + 1),
      project.name,
      categoryLabel(project.category, language),
      nullableNumber(project.stats?.stars),
      nullableNumber(project.stats?.forks),
      shortDate(project.stats?.pushedAt),
      repoOrPaper(project),
      language === "zh" ? project.rationaleZh : project.rationaleEn,
    ]);
}

function sectionRows(projects: RankedProject[], section: BoardSection, language: Language): string[][] {
  return projects
    .filter((project) => project.sections.includes(section))
    .sort(sortByStarsThenName)
    .map((project, idx) => [
      String(idx + 1),
      project.name,
      nullableNumber(project.stats?.stars),
      nullableNumber(project.stats?.forks),
      shortDate(project.stats?.pushedAt),
      project.release,
      project.venue,
      project.impactFactor,
      repoOrPaper(project),
      formatSources(project.sources, language),
      language === "zh" ? project.featuresZh : project.featuresEn,
    ]);
}

function ecosystemRows(projects: RankedProject[], language: Language): string[][] {
  return projects
    .filter((project) => project.sections.includes("ecosystem"))
    .sort(sortByStarsThenName)
    .map((project, idx) => [
      String(idx + 1),
      project.name,
      categoryLabel(project.category, language),
      nullableNumber(project.stats?.stars),
      nullableNumber(project.stats?.forks),
      shortDate(project.stats?.pushedAt),
      repoOrPaper(project),
      language === "zh" ? project.rationaleZh : project.rationaleEn,
    ]);
}

function compactRows(projects: RankedProject[], section: BoardSection, language: Language): string[][] {
  return projects
    .filter((project) => project.sections.includes(section))
    .sort(sortByStarsThenName)
    .map((project, idx) => [
      String(idx + 1),
      project.name,
      categoryLabel(project.category, language),
      nullableNumber(project.stats?.stars),
      repoOrPaper(project),
      language === "zh" ? project.rationaleZh : project.rationaleEn,
    ]);
}

function buildEnglishMarkdown(projects: RankedProject[]): string {
  const date = generatedDate();
  return [
    "# Bioinformatics / Biomedical AI Agent Leaderboard",
    "",
    `> Generated on ${date}. GitHub stars/forks/last-push fields are fetched from the GitHub API when available. Stars are popularity signals, not scientific-quality scores: paper-backed bioagents are often much smaller than broad scientific-agent platforms and skills libraries, so this file separates the views.`,
    "",
    "## GitHub Popularity View",
    "",
    mdTable(["#", "Project", "Category", "Stars", "Forks", "Last Push", "GitHub / Paper", "Why included"], githubRows(projects, "en")),
    "",
    "## Research BioAgent Core Tracker",
    "",
    mdTable(
      ["#", "Project", "Stars", "Forks", "Last Push", "Release/Update", "Venue/Platform", "IF", "GitHub / Paper", "Source", "Core technical features"],
      sectionRows(projects, "core", "en"),
    ),
    "",
    "## Platforms, Skills, And Adjacent Infrastructure",
    "",
    mdTable(["#", "Project", "Category", "Stars", "Forks", "Last Push", "GitHub / Paper", "Role in the landscape"], ecosystemRows(projects, "en")),
    "",
    "## Benchmarks And Source Lists",
    "",
    mdTable(["#", "Project", "Category", "Stars", "GitHub / Paper", "Role"], compactRows(projects, "benchmark", "en")),
    "",
    "## Watchlist",
    "",
    mdTable(["#", "Project", "Category", "Stars", "GitHub / Paper", "Why watch"], compactRows(projects, "watch", "en")),
    "",
  ].join("\n");
}

function buildChineseMarkdown(projects: RankedProject[]): string {
  const date = generatedDate();
  return [
    "# 生物信息 / 生物医学 AI Agent 榜单",
    "",
    `> 生成日期：${date}。GitHub 星标、fork、最后推送时间在可用时由 GitHub API 自动获取。Stars 只代表 GitHub 热度，不等于科学质量：论文型专业 bioagent 往往比通用科学 Agent 平台和技能库小很多，所以这里拆成多个视角。`,
    "",
    "## GitHub 热度总览",
    "",
    mdTable(["排名", "项目", "类别", "Stars", "Forks", "最后推送", "GitHub / 论文", "收录理由"], githubRows(projects, "zh")),
    "",
    "## 论文 / 专业 BioAgent 主榜",
    "",
    mdTable(
      ["排名", "项目", "Stars", "Forks", "最后推送", "发布/更新", "期刊/平台", "IF", "GitHub / 论文", "来源", "核心技术特征"],
      sectionRows(projects, "core", "zh"),
    ),
    "",
    "## 平台、技能库与相邻基础设施",
    "",
    mdTable(["排名", "项目", "类别", "Stars", "Forks", "最后推送", "GitHub / 论文", "生态定位"], ecosystemRows(projects, "zh")),
    "",
    "## Benchmark 与资料源",
    "",
    mdTable(["排名", "项目", "类别", "Stars", "GitHub / 论文", "定位"], compactRows(projects, "benchmark", "zh")),
    "",
    "## 候选观察",
    "",
    mdTable(["排名", "项目", "类别", "Stars", "GitHub / 论文", "观察理由"], compactRows(projects, "watch", "zh")),
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  const offline = process.argv.includes("--offline");
  const token = process.env.GITHUB_TOKEN;
  const outputPath = getFlagValue("--output", DEFAULT_OUTPUT);
  const explicitZhOutputPath = getFlagValue("--zh-output", DEFAULT_ZH_OUTPUT);
  const zhOutputPath = explicitZhOutputPath ?? (outputPath ? DEFAULT_ZH_OUTPUT : null);

  if (!token && !offline) console.log("Tip: set GITHUB_TOKEN to avoid GitHub API rate limiting\n");

  const projects = await collectProjects(offline, token);
  const repoProjects = projects.filter((project) => project.repo);

  console.log(`Bioagent landscape entries: ${projects.length}`);
  console.log(`Open GitHub repos tracked: ${repoProjects.length}`);

  if (outputPath) {
    await Bun.write(outputPath, buildEnglishMarkdown(projects));
    console.log(`Markdown written to ${outputPath}`);
  }
  if (zhOutputPath) {
    await Bun.write(zhOutputPath, buildChineseMarkdown(projects));
    console.log(`Markdown written to ${zhOutputPath}`);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
