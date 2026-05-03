#!/usr/bin/env bun
/**
 * Bioinformatics / biomedical AI agent leaderboard generator.
 *
 * Static scientific metadata is manually curated from seed tables, papers,
 * project pages, and GitHub READMEs. GitHub stars/forks/update timestamps are
 * fetched live from the GitHub API when the script runs.
 *
 * Usage:
 *   bun ./bioagent-leaderboard.ts --output bioagent-leaderboard.md
 *   GITHUB_TOKEN=ghp_xxx bun ./bioagent-leaderboard.ts --output bioagent-leaderboard.md --zh-output bioagent-leaderboard.zh-CN.md
 *   bun ./bioagent-leaderboard.ts --offline --output bioagent-leaderboard.md
 */

type AgentSource = "Image Seed" | "Literature/Web" | "GitHub Search" | "Manual";

type Language = "en" | "zh";

interface AgentEntry {
  name: string;
  developers: string;
  release: string;
  venue: string;
  impactFactor: string;
  repo?: string;
  paperUrl?: string;
  projectUrl?: string;
  featuresEn: string;
  featuresZh: string;
  sources: AgentSource[];
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

interface RankedAgent extends AgentEntry {
  stats: RepoStats | null;
}

const SOURCE_INFO: Record<AgentSource, { label: string; zhLabel: string; url?: string }> = {
  "Image Seed": { label: "Image Seed", zhLabel: "图片种子表" },
  "Literature/Web": { label: "Literature/Web", zhLabel: "论文/官网" },
  "GitHub Search": { label: "GitHub Search", zhLabel: "GitHub 检索" },
  Manual: { label: "Manual", zhLabel: "手工维护" },
};

const AGENTS: AgentEntry[] = [
  {
    name: "AutoBA",
    developers: "Juexiao Zhou et al.",
    release: "2024.10",
    venue: "Advanced Science",
    impactFactor: "14.1",
    repo: "JoshuaChou2018/AutoBA",
    featuresEn: "Automated multi-omics workflow, YAML configuration, local LLM support, and code auto-repair modules.",
    featuresZh: "全自动多组学流程、YAML 配置、本地 LLM 支持、代码自动修复模块。",
    sources: ["Image Seed"],
  },
  {
    name: "BIA (BioInformatics Agent)",
    developers: "Qi Xin et al.",
    release: "2025.01",
    venue: "Bioinformatics",
    impactFactor: "5.4",
    repo: "biagent-dev/biagent",
    featuresEn: "Single-cell analysis focus, iterative self-improvement, and multi-database automated integration.",
    featuresZh: "专注单细胞分析、迭代自我完善、多数据库自动集成。",
    sources: ["Image Seed"],
  },
  {
    name: "BioMaster",
    developers: "Houcheng Su et al.",
    release: "2025.01",
    venue: "bioRxiv",
    impactFactor: "N/A (Preprint)",
    repo: "ai4nucleome/BioMaster",
    featuresEn: "Multi-agent role division, RAG-enhanced domain knowledge retrieval, long-context memory, and Check-Agent validation.",
    featuresZh: "多代理角色分工、RAG 增强型知识检索、长程内存管理、Check-Agent 验证。",
    sources: ["Image Seed"],
  },
  {
    name: "CellAgent",
    developers: "Yihang Xiao et al.",
    release: "2024.05",
    venue: "bioRxiv / arXiv",
    impactFactor: "N/A (Preprint)",
    repo: "lsq2wxa/CellAgent",
    featuresEn: "Hierarchical decision mechanism, autonomous hyperparameter optimization, and single-cell expert role simulation.",
    featuresZh: "分级决策机制、自主超参数优化、单细胞专家角色模拟。",
    sources: ["Image Seed"],
  },
  {
    name: "BiOmics",
    developers: "BGI Research",
    release: "2026.01",
    venue: "bioRxiv",
    impactFactor: "N/A (Preprint)",
    repo: "BGIResearch/BiOmics",
    featuresEn: "Dual-track inference and embedding architecture with 3.5B-parameter system knowledge graph and cross-scale interpretation.",
    featuresZh: "双轨架构（推理+嵌入）、3.5 亿关系知识图谱、跨尺度解释。",
    sources: ["Image Seed"],
  },
  {
    name: "ESCARGOT",
    developers: "EpistasisLab",
    release: "2025.01",
    venue: "Bioinformatics",
    impactFactor: "5.4",
    repo: "EpistasisLab/ESCARGOT",
    featuresEn: "Graph-of-thought driven Cypher querying, knowledge graph deep fusion, and transparent reasoning.",
    featuresZh: "思维图（GoT）驱动、Cypher 查询、知识图谱深度融合、透明推理。",
    sources: ["Image Seed"],
  },
  {
    name: "CRISPR-GPT",
    developers: "Kaixuan Huang et al.",
    release: "2025.07",
    venue: "Nature Biomedical Engineering",
    impactFactor: "28.1",
    repo: "cong-lab/crispr-gpt-pub",
    featuresEn: "Fine-tuned GPT for full-cycle gene-editing design, safety/compliance checks, and automated protocol drafting.",
    featuresZh: "微调 GPT，覆盖基因编辑全周期设计、安全性合规检查、自动化协议草拟。",
    sources: ["Image Seed"],
  },
  {
    name: "BioAgents",
    developers: "Nikita Mehandru et al.",
    release: "2025.11",
    venue: "Scientific Reports",
    impactFactor: "3.9",
    repo: "bio-xyz/BioAgents",
    featuresEn: "Phi-3 small-model workflow with Biostars knowledge fine-tuning and nf-core integration.",
    featuresZh: "采用 Phi-3 小模型，针对 Biostars 社区知识精调，并集成 nf-core。",
    sources: ["Image Seed"],
  },
  {
    name: "Biomni",
    developers: "Stanford SNAP / Kexin Huang et al.",
    release: "2025.05",
    venue: "bioRxiv / GitHub",
    impactFactor: "N/A (Preprint / Software)",
    repo: "snap-stanford/Biomni",
    projectUrl: "https://biomni.stanford.edu/",
    featuresEn: "General-purpose biomedical AI agent combining LLM reasoning, retrieval-augmented planning, and code execution across biomedical subfields.",
    featuresZh: "通用生物医学 AI Agent，结合 LLM 推理、检索增强规划和代码执行，覆盖多类生物医学任务。",
    sources: ["Literature/Web", "GitHub Search"],
  },
  {
    name: "BRAD",
    developers: "Jpickard1 / BRAD contributors",
    release: "2025.05",
    venue: "Bioinformatics / GitHub",
    impactFactor: "5.4",
    repo: "jpickard1/brad",
    projectUrl: "https://brad-bioinformatics-retrieval-augmented-data.readthedocs.io/",
    featuresEn: "Bioinformatics Retrieval Augmented Digital assistant for RAG, tool/database integration, code execution, and biomarker discovery workflows.",
    featuresZh: "Bioinformatics Retrieval Augmented Digital 助手，支持 RAG、工具/数据库集成、代码执行和生物标志物发现流程。",
    sources: ["Literature/Web", "GitHub Search"],
  },
  {
    name: "SRAgent",
    developers: "Arc Institute / scBaseCount authors",
    release: "2025.02",
    venue: "bioRxiv / GitHub",
    impactFactor: "N/A (Preprint / Software)",
    repo: "ArcInstitute/SRAgent",
    featuresEn: "LLM agents for obtaining and working with Sequence Read Archive data and related bioinformatics databases.",
    featuresZh: "面向 SRA 和相关生物信息数据库的数据获取与处理 LLM agents。",
    sources: ["Literature/Web", "GitHub Search"],
  },
  {
    name: "ClawBio",
    developers: "Manuel Corpas and community",
    release: "2026.04",
    venue: "GitHub / ClawBio",
    impactFactor: "N/A (Software)",
    repo: "ClawBio/ClawBio",
    projectUrl: "https://clawbio.ai/",
    featuresEn: "Bioinformatics-native AI agent skill library with local-first reproducible workflows and Claude Code plugin support.",
    featuresZh: "生物信息原生 AI Agent 技能库，本地优先、可复现流程，并支持 Claude Code 插件。",
    sources: ["Literature/Web", "GitHub Search"],
  },
  {
    name: "STELLA",
    developers: "Ruofan Jin, Zaixi Zhang et al.",
    release: "2025.07",
    venue: "bioRxiv / arXiv",
    impactFactor: "N/A (Preprint)",
    paperUrl: "https://doi.org/10.1101/2025.07.01.662467",
    featuresEn: "Self-evolving biomedical research agent with multi-agent architecture, evolving template library, and dynamic tool ocean.",
    featuresZh: "自进化生物医学研究 Agent，多代理架构、可演化推理模板库和动态 Tool Ocean。",
    sources: ["Literature/Web", "Manual"],
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

function formatSources(sources: AgentSource[], language: Language): string {
  return sources
    .map((source) => {
      const info = SOURCE_INFO[source];
      return language === "zh" ? info.zhLabel : info.label;
    })
    .join(", ");
}

function repoUrl(agent: AgentEntry): string {
  if (!agent.repo) return agent.paperUrl ? `[paper](${agent.paperUrl})` : "N/A";
  return `[${agent.repo}](https://github.com/${agent.repo})`;
}

function nullableNumber(value: number | null | undefined): string {
  return typeof value === "number" ? NUMBER_FORMAT.format(value) : "N/A";
}

function shortDate(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "N/A";
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

async function collectAgents(offline: boolean, token?: string): Promise<RankedAgent[]> {
  const ranked = await Promise.all(
    AGENTS.map(async (agent) => ({
      ...agent,
      stats: agent.repo && !offline ? await fetchRepoStats(agent.repo, token) : null,
    })),
  );

  const errors = ranked.filter((agent) => agent.repo && agent.stats?.error && agent.stats.error !== "404");
  if (!offline && errors.length === ranked.filter((agent) => agent.repo).length) {
    throw new Error(`All GitHub API requests failed: ${errors[0]?.stats?.error ?? "unknown error"}`);
  }

  return ranked.sort((a, b) => {
    const starDiff = (b.stats?.stars ?? -1) - (a.stats?.stars ?? -1);
    return starDiff || a.name.localeCompare(b.name);
  });
}

function buildEnglishMarkdown(agents: RankedAgent[]): string {
  const date = generatedDate();
  const rows = agents.map((agent, idx) => [
    String(idx + 1),
    agent.name,
    nullableNumber(agent.stats?.stars),
    nullableNumber(agent.stats?.forks),
    shortDate(agent.stats?.pushedAt),
    agent.developers,
    agent.release,
    agent.venue,
    agent.impactFactor,
    repoUrl(agent),
    formatSources(agent.sources, "en"),
    agent.featuresEn,
  ]);

  return [
    "# Bioinformatics AI Agent Leaderboard",
    "",
    `> Generated on ${date}. GitHub stars/forks/last-push fields are fetched from GitHub API when available; publication metadata is manually curated and should be reviewed before formal citation use.`,
    "",
    mdTable(["#", "Project", "Stars", "Forks", "Last Push", "Developers", "Release/Update", "Venue/Platform", "IF", "GitHub / Paper", "Source", "Core technical features"], rows),
    "",
  ].join("\n");
}

function buildChineseMarkdown(agents: RankedAgent[]): string {
  const date = generatedDate();
  const rows = agents.map((agent, idx) => [
    String(idx + 1),
    agent.name,
    nullableNumber(agent.stats?.stars),
    nullableNumber(agent.stats?.forks),
    shortDate(agent.stats?.pushedAt),
    agent.developers,
    agent.release,
    agent.venue,
    agent.impactFactor,
    repoUrl(agent),
    formatSources(agent.sources, "zh"),
    agent.featuresZh,
  ]);

  return [
    "# 生物信息 / 生物医学 AI Agent 榜单",
    "",
    `> 生成日期：${date}。GitHub 星标、fork、最后推送时间在可用时由 GitHub API 自动获取；论文/平台元数据为人工维护，正式引用前建议复核。`,
    "",
    mdTable(["排名", "项目", "Stars", "Forks", "最后推送", "主要开发者", "发布/更新", "期刊/平台", "IF", "GitHub / 论文", "来源", "核心技术特征"], rows),
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

  const agents = await collectAgents(offline, token);

  console.log(`Bioagent leaderboard entries: ${agents.length}`);
  console.log(`Open GitHub repos: ${agents.filter((agent) => agent.repo).length}`);

  if (outputPath) {
    await Bun.write(outputPath, buildEnglishMarkdown(agents));
    console.log(`Markdown written to ${outputPath}`);
  }
  if (zhOutputPath) {
    await Bun.write(zhOutputPath, buildChineseMarkdown(agents));
    console.log(`Markdown written to ${zhOutputPath}`);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
