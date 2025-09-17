import { Keyword, KeywordType, ArticleType } from '../types/keyword';
import { ProductData, TargetData } from '../types';

export function generateKeywords(
  product: ProductData,
  target: TargetData
): Keyword[] {
  const keywords: Keyword[] = [];
  const timestamp = new Date().toISOString();
  const parentKw = product.serviceName; // 親KWは商材名

  // 意思決定KW
  keywords.push({
    id: `kw-${Date.now()}-1`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} 申込方法`,
    keywordType: '意思決定KW' as KeywordType,
    target: target.name,
    searchIntent: '購入・申込を検討',
    articleType: 'ハウツー記事' as ArticleType,
    h2Structure: [
      `${product.serviceName}の申込手順`,
      '必要な書類・準備',
      '申込後の流れ',
      'よくある質問'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  keywords.push({
    id: `kw-${Date.now()}-2`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} 料金`,
    keywordType: '意思決定KW' as KeywordType,
    target: target.name,
    searchIntent: '価格を確認',
    articleType: '比較記事' as ArticleType,
    h2Structure: [
      '料金プラン一覧',
      'プラン別の機能比較',
      'おすすめプランの選び方',
      '他社サービスとの料金比較'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  // 比較KW
  keywords.push({
    id: `kw-${Date.now()}-3`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} 比較`,
    keywordType: '比較KW' as KeywordType,
    target: target.name,
    searchIntent: 'サービス比較検討',
    articleType: '比較記事' as ArticleType,
    h2Structure: [
      '主要サービスの比較表',
      `${product.serviceName}の強み`,
      '他社サービスの特徴',
      'ユースケース別のおすすめ'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  keywords.push({
    id: `kw-${Date.now()}-4`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} 評判`,
    keywordType: '比較KW' as KeywordType,
    target: target.name,
    searchIntent: '利用者の声を確認',
    articleType: '事例紹介' as ArticleType,
    h2Structure: [
      'ユーザーの評価まとめ',
      '良い評判・口コミ',
      '改善要望・課題点',
      '総合評価'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  // 関心KW
  keywords.push({
    id: `kw-${Date.now()}-5`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} 使い方`,
    keywordType: '関心KW' as KeywordType,
    target: target.name,
    searchIntent: '導入方法を知る',
    articleType: 'ハウツー記事' as ArticleType,
    h2Structure: [
      'アカウント作成手順',
      '初期設定の流れ',
      '基本機能の使い方',
      'トラブルシューティング'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  keywords.push({
    id: `kw-${Date.now()}-6`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} 機能`,
    keywordType: '関心KW' as KeywordType,
    target: target.name,
    searchIntent: '機能を詳しく知る',
    articleType: 'お役立ち情報' as ArticleType,
    h2Structure: [
      '主要機能の紹介',
      '活用シーン別の使い方',
      '便利な機能TOP5',
      '今後のアップデート予定'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  // 潜在KW
  keywords.push({
    id: `kw-${Date.now()}-7`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} メリット`,
    keywordType: '潜在KW' as KeywordType,
    target: target.name,
    searchIntent: 'メリットを知りたい',
    articleType: 'お役立ち情報' as ArticleType,
    h2Structure: [
      `${product.serviceName}のメリット`,
      '導入効果',
      '他サービスとの違い',
      '導入事例'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  keywords.push({
    id: `kw-${Date.now()}-8`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} デメリット`,
    keywordType: '潜在KW' as KeywordType,
    target: target.name,
    searchIntent: 'デメリットを知りたい',
    articleType: 'お役立ち情報' as ArticleType,
    h2Structure: [
      `${product.serviceName}のデメリット`,
      '注意点',
      '対処法',
      '代替手段'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  // 追加の関心KW
  keywords.push({
    id: `kw-${Date.now()}-9`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} 初期設定`,
    keywordType: '関心KW' as KeywordType,
    target: target.name,
    searchIntent: '初期設定方法を知りたい',
    articleType: 'ハウツー記事' as ArticleType,
    h2Structure: [
      'アカウント作成手順',
      '初期設定の流れ',
      '基本機能の設定',
      'トラブルシューティング'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  keywords.push({
    id: `kw-${Date.now()}-10`,
    parentKeyword: parentKw,
    childKeyword: `${product.serviceName} 口コミ`,
    keywordType: '比較KW' as KeywordType,
    target: target.name,
    searchIntent: '利用者の声を確認',
    articleType: '事例紹介' as ArticleType,
    h2Structure: [
      'ユーザーの評価まとめ',
      '良い評判・口コミ',
      '改善要望・課題点',
      '総合評価'
    ],
    currentRank: null,
    cvContribution: null,
    isArticleCreated: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  return keywords;
}