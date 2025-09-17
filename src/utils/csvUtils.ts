import { Keyword } from '../types/keyword';

export function exportKeywordsToCSV(keywords: Keyword[]): string {
  const headers = [
    '親KW',
    '子KW',
    'KW種別',
    'ターゲット',
    '検索意図',
    '記事種別',
    'h2見出し構成',
    '現在順位',
    'CV貢献度',
    '記事作成済み',
    '作成日時',
    '更新日時'
  ];

  const rows = keywords.map(kw => [
    kw.parentKeyword,
    kw.childKeyword,
    kw.keywordType,
    kw.target,
    kw.searchIntent,
    kw.articleType,
    kw.h2Structure.join(' / '),
    kw.currentRank?.toString() || '',
    kw.cvContribution?.toString() || '',
    kw.isArticleCreated ? '済' : '未',
    kw.createdAt,
    kw.updatedAt
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSV(csvText: string): Keyword[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

  const keywords: Keyword[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
    const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());

    if (cleanValues.length >= 7) {
      keywords.push({
        id: `imported-${Date.now()}-${i}`,
        parentKeyword: cleanValues[0],
        childKeyword: cleanValues[1],
        keywordType: cleanValues[2] as any,
        target: cleanValues[3],
        searchIntent: cleanValues[4],
        articleType: cleanValues[5] as any,
        h2Structure: cleanValues[6].split(' / '),
        currentRank: cleanValues[7] ? parseInt(cleanValues[7]) : undefined,
        cvContribution: cleanValues[8] ? parseFloat(cleanValues[8]) : undefined,
        isArticleCreated: cleanValues[9] === '済',
        createdAt: cleanValues[10] || new Date().toISOString(),
        updatedAt: cleanValues[11] || new Date().toISOString()
      });
    }
  }

  return keywords;
}