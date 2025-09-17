import { Keyword } from '../types/keyword';
import { PersonData } from '../types';

export interface Article {
  id: string;
  keywordId: string;
  title: string;
  content: string;
  authorId?: string;
  status: 'generating' | 'completed' | 'failed';
  createdAt: string;
}

export async function generateArticle(
  keyword: Keyword,
  author?: PersonData
): Promise<Article> {
  // 実際の実装では、ここでDify APIを呼び出します
  // 現在はモック実装として、シミュレートされた記事を返します

  const article: Article = {
    id: `article-${Date.now()}`,
    keywordId: keyword.id,
    title: generateTitle(keyword),
    content: generateContent(keyword, author),
    authorId: author?.id,
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  // 実際のAPIコールをシミュレート
  await new Promise(resolve => setTimeout(resolve, 2000));

  return article;
}

export async function generateBulkArticles(
  keywords: Keyword[],
  author?: PersonData,
  onProgress?: (completed: number, total: number) => void
): Promise<Article[]> {
  const articles: Article[] = [];
  const total = keywords.length;

  for (let i = 0; i < keywords.length; i++) {
    const article = await generateArticle(keywords[i], author);
    articles.push(article);

    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  return articles;
}

function generateTitle(keyword: Keyword): string {
  const templates = {
    '意思決定KW': [
      `${keyword.childKeyword}完全ガイド｜今すぐ始める方法`,
      `【2024年版】${keyword.childKeyword}の手順と注意点`,
      `${keyword.parentKeyword}を始めるなら今！${keyword.childKeyword}まとめ`
    ],
    '比較KW': [
      `${keyword.childKeyword}徹底比較｜おすすめサービスTOP5`,
      `${keyword.parentKeyword}の選び方｜${keyword.childKeyword}を解説`,
      `【2024年最新】${keyword.childKeyword}ランキング`
    ],
    '関心KW': [
      `${keyword.childKeyword}とは？基本から応用まで徹底解説`,
      `${keyword.parentKeyword}の活用法｜${keyword.childKeyword}`,
      `初心者でもわかる${keyword.childKeyword}入門`
    ],
    '潜在KW': [
      `${keyword.childKeyword}で業務効率化を実現する方法`,
      `${keyword.parentKeyword}の課題を解決｜${keyword.childKeyword}`,
      `知らないと損する${keyword.childKeyword}のポイント`
    ]
  };

  const titleTemplates = templates[keyword.keywordType] || templates['関心KW'];
  return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
}

function generateContent(keyword: Keyword, author?: PersonData): string {
  let content = `# ${generateTitle(keyword)}\n\n`;

  // 導入文
  content += generateIntroduction(keyword, author);
  content += '\n\n';

  // h2見出しに基づいてコンテンツを生成
  keyword.h2Structure.forEach((h2, index) => {
    content += `## ${h2}\n\n`;
    content += generateSection(keyword, h2, author);
    content += '\n\n';
  });

  // まとめ
  content += '## まとめ\n\n';
  content += generateConclusion(keyword, author);

  return content;
}

function generateIntroduction(keyword: Keyword, author?: PersonData): string {
  const searchIntent = keyword.searchIntent;
  const target = keyword.target;

  let intro = `この記事では、${target}の皆様に向けて、${keyword.childKeyword}について詳しく解説します。\n\n`;

  if (keyword.keywordType === '意思決定KW') {
    intro += `「${searchIntent}」という悩みをお持ちの方に、具体的な手順と実践的なアドバイスをお届けします。`;
  } else if (keyword.keywordType === '比較KW') {
    intro += `${searchIntent}とお考えの方に、各サービスの特徴や選び方のポイントをわかりやすく比較してご紹介します。`;
  } else if (keyword.keywordType === '関心KW') {
    intro += `${searchIntent}という疑問に対して、基本的な知識から実践的な活用方法まで幅広くカバーしています。`;
  } else {
    intro += `${searchIntent}という課題に対して、効果的な解決策と成功事例をご紹介します。`;
  }

  if (author) {
    intro += `\n\n執筆者の${author.name}（${author.position}）が、${author.expertiseGenre}の専門知識を活かして解説いたします。`;
  }

  return intro;
}

function generateSection(keyword: Keyword, h2Title: string, author?: PersonData): string {
  let section = '';

  // h2タイトルに応じた内容を生成
  if (h2Title.includes('手順') || h2Title.includes('ステップ')) {
    section += generateStepByStep(keyword);
  } else if (h2Title.includes('比較') || h2Title.includes('違い')) {
    section += generateComparison(keyword);
  } else if (h2Title.includes('メリット') || h2Title.includes('効果')) {
    section += generateBenefits(keyword);
  } else if (h2Title.includes('注意') || h2Title.includes('デメリット')) {
    section += generateCautions(keyword);
  } else if (h2Title.includes('事例') || h2Title.includes('成功')) {
    section += generateCaseStudy(keyword);
  } else if (h2Title.includes('FAQ') || h2Title.includes('よくある質問')) {
    section += generateFAQ(keyword);
  } else {
    section += generateGenericSection(keyword, h2Title);
  }

  // 著者の特徴を反映
  if (author && author.speechCharacteristics) {
    section = applyAuthorStyle(section, author);
  }

  return section;
}

function generateStepByStep(keyword: Keyword): string {
  return `以下の手順で${keyword.childKeyword}を進めていきましょう。

### ステップ1: 事前準備
まず必要な情報を整理し、準備を整えます。

### ステップ2: 基本設定
アカウント作成や初期設定を行います。

### ステップ3: 実践
実際に${keyword.parentKeyword}を活用していきます。

### ステップ4: 効果測定
導入効果を確認し、改善点を見つけます。`;
}

function generateComparison(keyword: Keyword): string {
  return `${keyword.parentKeyword}に関連する主要なサービスを比較してみましょう。

| 項目 | サービスA | サービスB | サービスC |
|------|----------|----------|----------|
| 料金 | 月額1万円〜 | 月額2万円〜 | 月額1.5万円〜 |
| 機能 | 基本機能のみ | 高度な分析機能付き | カスタマイズ可能 |
| サポート | メールのみ | 電話・メール | 24時間対応 |
| 導入実績 | 1000社以上 | 500社以上 | 2000社以上 |

それぞれの特徴を理解した上で、${keyword.target}のニーズに最適なサービスを選びましょう。`;
}

function generateBenefits(keyword: Keyword): string {
  return `${keyword.childKeyword}を導入することで、以下のようなメリットが期待できます。

- **業務効率の大幅な改善**：作業時間を約50%削減
- **コスト削減**：年間で数百万円のコスト削減効果
- **品質向上**：ミスの削減と成果物の質の向上
- **スケーラビリティ**：事業拡大に柔軟に対応可能

これらのメリットは、${keyword.target}にとって特に重要な要素となるでしょう。`;
}

function generateCautions(keyword: Keyword): string {
  return `${keyword.childKeyword}を検討する際は、以下の点にご注意ください。

- 初期導入コストが発生する場合があります
- 社内での教育・研修期間が必要です
- 既存システムとの連携に制限がある可能性があります
- 定期的なメンテナンスが必要となります

これらの課題を事前に把握し、適切な対策を講じることが成功の鍵となります。`;
}

function generateCaseStudy(keyword: Keyword): string {
  return `### 導入事例1: A社の成功事例
${keyword.target}と同じ業界のA社では、${keyword.parentKeyword}を導入して3ヶ月で売上が20%向上しました。

### 導入事例2: B社の改善事例
B社では、${keyword.childKeyword}により業務効率が大幅に改善され、残業時間が月平均30時間削減されました。

### 導入事例3: C社の変革事例
C社は${keyword.parentKeyword}を活用することで、新しいビジネスモデルの構築に成功しました。`;
}

function generateFAQ(keyword: Keyword): string {
  return `### Q1: ${keyword.childKeyword}の導入期間はどのくらいですか？
A: 通常、準備から本格運用まで1〜3ヶ月程度を見込んでください。

### Q2: 費用はどのくらいかかりますか？
A: 規模や要件により異なりますが、初期費用10万円〜、月額1万円〜が目安です。

### Q3: サポート体制はどうなっていますか？
A: メール、電話、チャットでのサポートを提供しています。

### Q4: 他のツールとの連携は可能ですか？
A: 主要なツールとはAPIで連携可能です。詳細はお問い合わせください。`;
}

function generateGenericSection(keyword: Keyword, h2Title: string): string {
  return `${h2Title}について、${keyword.target}の観点から詳しく見ていきましょう。

${keyword.searchIntent}という目的を達成するためには、以下のポイントが重要です。

1. 現状の課題を正確に把握する
2. 目標を明確に設定する
3. 適切なツールやサービスを選定する
4. 段階的に導入を進める
5. 効果を測定し、改善を続ける

これらのステップを着実に進めることで、${keyword.parentKeyword}の効果を最大化できます。`;
}

function generateConclusion(keyword: Keyword, author?: PersonData): string {
  let conclusion = `本記事では、${keyword.childKeyword}について詳しく解説してきました。\n\n`;

  if (keyword.keywordType === '意思決定KW') {
    conclusion += `${keyword.target}の皆様が、スムーズに${keyword.parentKeyword}を始められるよう、具体的な手順と注意点をご紹介しました。`;
  } else if (keyword.keywordType === '比較KW') {
    conclusion += `各サービスの特徴を比較検討し、${keyword.target}に最適な選択ができるよう、詳細な情報をお届けしました。`;
  } else {
    conclusion += `${keyword.searchIntent}という課題に対して、実践的な解決策をご提案しました。`;
  }

  conclusion += `\n\nぜひこの記事を参考に、${keyword.parentKeyword}の導入・活用を検討してみてください。`;

  if (author) {
    conclusion += `\n\nご不明な点がございましたら、お気軽にお問い合わせください。`;
  }

  return conclusion;
}

function applyAuthorStyle(content: string, author: PersonData): string {
  // 著者のスタイルを適用（簡易版）
  if (author.speechCharacteristics.includes('丁寧')) {
    content = content.replace(/です。/g, 'でございます。');
    content = content.replace(/ます。/g, 'ます。');
  }

  if (author.vocabularyTendency.includes('専門用語')) {
    // 専門用語を追加する処理（実際の実装では辞書を使用）
  }

  // NGワードの除去
  if (author.ngWords && author.ngWords.length > 0) {
    author.ngWords.forEach(word => {
      if (word) {
        content = content.replace(new RegExp(word, 'g'), '');
      }
    });
  }

  return content;
}