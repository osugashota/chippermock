// 商材データベースの型定義
export interface ProductData {
  id: string;
  serviceName: string;
  serviceOverview: string;
  excludeUrls: string[];
  usp: string;
  problemToSolve: string;
  userPainPoints: string;
  differentiationPoints: string;
  advantagePoints: string;
  commoditizationPoints: string;
  dropoutPoints: string;
  competitorInfo: string[];
  pricing: string;
  solutionOffered: string;
  caseStudies: string[];
  implementationEffects: string;
  beforeSituation: string;
  afterSituation: string;
  mainIndustries: string[];
  solutionFeatures: string;
  implementationBarriers: string;
  faq: FAQ[];
}

export interface FAQ {
  question: string;
  answer: string;
}

// ターゲットデータベースの型定義
export interface TargetData {
  id: string;
  productId: string;
  name: string;
  targetAudience: string;
  jobIndustryCategory: string;
  userNeeds: string;
  searcherChallenges: string;
  searchIntent?: string;
  knowledgeLevel?: string;
  benefitsFromArticle?: string;
  keywordTrends?: string;
  informationStyle?: string;
  doubtPoints?: string;
  differenceFromSimilar?: string;
}

// 記事生成用のターゲット情報
export interface ArticleTargetData {
  searchIntent: string;
  knowledgeLevel: string;
  benefitsFromArticle: string;
  keywordTrends: string;
  informationStyle: string;
  differenceFromSimilar: string;
  doubtPoints: string;
}

// 人物データベースの型定義
export interface PersonData {
  id: string;
  productId: string;
  name: string;
  title: string;
  position: string;
  companyName: string;
  companyUrl: string;
  profile: string;
  speechCharacteristics: string;
  vocabularyTendency: string;
  pastArticles: string[];
  expertiseGenre: string;
  importantThinking: string;
  valueSystem: string;
  ngWords: string[];
  authorPageUrl?: string;
  qaData: QAItem[];
  readerRelationship: string;
}

export interface QAItem {
  question: string;
  answer: string;
}

export interface FormData {
  product: ProductData;
  targets: TargetData[];
  authors: PersonData[];
}

export interface ProductSummary {
  id: string;
  serviceName: string;
  serviceOverview: string;
  createdAt: string;
  updatedAt: string;
  targetsCount: number;
  authorsCount: number;
}

interface IndustryData {
  id: string;
  industry_name: string;
  solution_features: string;
  industry_challenges: string;
  target_size: string;
}