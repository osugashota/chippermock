export type KeywordType = '意思決定KW' | '比較KW' | '関心KW' | '潜在KW';
export type ArticleType = '比較記事' | 'ハウツー記事' | '用語解説' | 'お役立ち情報' | '事例紹介';

export interface Keyword {
  id: string;
  parentKeyword: string;
  childKeyword: string;
  keywordType: KeywordType;
  target: string;
  searchIntent: string;
  articleType: ArticleType;
  h2Structure: string[];
  currentRank?: number;
  cvContribution?: number;
  isArticleCreated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KeywordGenerationInput {
  productId: string;
  targetId: string;
}

export interface ArticleGenerationRequest {
  keywordId: string;
  authorId?: string;
}

export interface BulkArticleGenerationRequest {
  keywordIds: string[];
  authorId?: string;
}