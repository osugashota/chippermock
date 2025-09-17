import React, { useState } from 'react';
import { Keyword } from '../types/keyword';
import {
  Search,
  Plus,
  Download,
  Upload,
  Edit,
  Copy,
  Trash2,
  FileText,
  CheckCircle,
  Circle,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { exportKeywordsToCSV, downloadCSV } from '../utils/csvUtils';

interface KeywordListProps {
  keywords: Keyword[];
  onCreateNew: () => void;
  onEdit: (keyword: Keyword) => void;
  onDelete: (keywordId: string) => void;
  onDuplicate: (keyword: Keyword) => void;
  onGenerateArticle: (keywordId: string) => void;
  onBulkGenerateArticles: (keywordIds: string[]) => void;
  onImportCSV: (file: File) => void;
}

export const KeywordList: React.FC<KeywordListProps> = ({
  keywords,
  onCreateNew,
  onEdit,
  onDelete,
  onDuplicate,
  onGenerateArticle,
  onBulkGenerateArticles,
  onImportCSV
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterArticleStatus, setFilterArticleStatus] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredKeywords = keywords.filter(kw => {
    const matchesSearch =
      kw.parentKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kw.childKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kw.target.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || kw.keywordType === filterType;
    const matchesArticleStatus =
      filterArticleStatus === 'all' ||
      (filterArticleStatus === 'created' && kw.isArticleCreated) ||
      (filterArticleStatus === 'notCreated' && !kw.isArticleCreated);

    return matchesSearch && matchesType && matchesArticleStatus;
  });

  const handleSelectAll = () => {
    if (selectedKeywords.length === filteredKeywords.length) {
      setSelectedKeywords([]);
    } else {
      setSelectedKeywords(filteredKeywords.map(kw => kw.id));
    }
  };

  const handleSelectKeyword = (keywordId: string) => {
    if (selectedKeywords.includes(keywordId)) {
      setSelectedKeywords(selectedKeywords.filter(id => id !== keywordId));
    } else {
      setSelectedKeywords([...selectedKeywords, keywordId]);
    }
  };

  const handleExportCSV = () => {
    const dataToExport = selectedKeywords.length > 0
      ? keywords.filter(kw => selectedKeywords.includes(kw.id))
      : keywords;

    const csv = exportKeywordsToCSV(dataToExport);
    downloadCSV(csv, `keywords_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportCSV(file);
    }
  };

  const handleBulkGenerate = () => {
    if (selectedKeywords.length > 0) {
      onBulkGenerateArticles(selectedKeywords);
    }
  };

  const toggleGroup = (parentKeyword: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(parentKeyword)) {
      newExpanded.delete(parentKeyword);
    } else {
      newExpanded.add(parentKeyword);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleAllGroups = () => {
    const allParentKeywords = [...new Set(filteredKeywords.map(kw => kw.parentKeyword))];
    if (expandedGroups.size === allParentKeywords.length) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(allParentKeywords));
    }
  };

  // 親キーワードでグループ化
  const groupedKeywords = filteredKeywords.reduce((acc, kw) => {
    if (!acc[kw.parentKeyword]) {
      acc[kw.parentKeyword] = [];
    }
    acc[kw.parentKeyword].push(kw);
    return acc;
  }, {} as Record<string, Keyword[]>);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">キーワード管理</h2>
          <div className="flex gap-2">
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={16} />
              新規追加
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
              <Upload size={16} />
              CSVインポート
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <Download size={16} />
              CSVエクスポート
            </button>
          </div>
        </div>

        {/* フィルター */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="キーワードを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">すべての種別</option>
            <option value="意思決定KW">意思決定KW</option>
            <option value="比較KW">比較KW</option>
            <option value="関心KW">関心KW</option>
            <option value="潜在KW">潜在KW</option>
          </select>

          <select
            value={filterArticleStatus}
            onChange={(e) => setFilterArticleStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">すべて</option>
            <option value="created">記事作成済み</option>
            <option value="notCreated">記事未作成</option>
          </select>
        </div>

        {/* 一括操作 */}
        {selectedKeywords.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
            <span className="text-sm text-blue-700">
              {selectedKeywords.length}件選択中
            </span>
            <button
              onClick={handleBulkGenerate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <FileText size={16} />
              選択したキーワードで記事生成
            </button>
          </div>
        )}

        {/* アコーディオン展開/折りたたみボタン */}
        <div className="flex justify-end">
          <button
            onClick={toggleAllGroups}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {expandedGroups.size === Object.keys(groupedKeywords).length ? '全て折りたたむ' : '全て展開'}
          </button>
        </div>
      </div>

      {/* キーワードリスト */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selectedKeywords.length === filteredKeywords.length && filteredKeywords.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  {/* 展開アイコン用 */}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  親KW
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  子KW
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KW種別
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ターゲット
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  検索意図
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  記事種別
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  順位
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CV貢献
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  記事
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(groupedKeywords).map(([parentKw, kwList]) => {
                const isExpanded = expandedGroups.has(parentKw);
                const parentKeywordStats = {
                  totalKeywords: kwList.length,
                  articlesCreated: kwList.filter(kw => kw.isArticleCreated).length,
                  avgRank: kwList.filter(kw => kw.currentRank).reduce((sum, kw) => sum + (kw.currentRank || 0), 0) / kwList.filter(kw => kw.currentRank).length || 0,
                  totalCV: kwList.reduce((sum, kw) => sum + (kw.cvContribution || 0), 0)
                };

                return (
                  <React.Fragment key={parentKw}>
                    {/* 親キーワード行（グループヘッダー） */}
                    <tr className="bg-gray-50 hover:bg-gray-100 font-medium">
                      <td className="px-2 py-3">
                        <input
                          type="checkbox"
                          checked={kwList.every(kw => selectedKeywords.includes(kw.id))}
                          onChange={() => {
                            const allSelected = kwList.every(kw => selectedKeywords.includes(kw.id));
                            if (allSelected) {
                              setSelectedKeywords(prev => prev.filter(id => !kwList.some(kw => kw.id === id)));
                            } else {
                              setSelectedKeywords(prev => [...new Set([...prev, ...kwList.map(kw => kw.id)])]);
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-2 py-3">
                        <button
                          onClick={() => toggleGroup(parentKw)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900" colSpan={2}>
                        {parentKw}
                        <span className="ml-2 text-xs text-gray-500">
                          ({parentKeywordStats.totalKeywords}件)
                        </span>
                      </td>
                      <td className="px-4 py-3" colSpan={8}>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>記事作成: {parentKeywordStats.articlesCreated}/{parentKeywordStats.totalKeywords}</span>
                          {parentKeywordStats.avgRank > 0 && (
                            <span>平均順位: {parentKeywordStats.avgRank.toFixed(1)}位</span>
                          )}
                          {parentKeywordStats.totalCV > 0 && (
                            <span>CV貢献計: {parentKeywordStats.totalCV.toFixed(1)}%</span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* 子キーワード行（展開時のみ表示） */}
                    {isExpanded && kwList.map((keyword) => (
                      <tr key={keyword.id} className="hover:bg-gray-50">
                        <td className="px-2 py-3">
                          <input
                            type="checkbox"
                            checked={selectedKeywords.includes(keyword.id)}
                            onChange={() => handleSelectKeyword(keyword.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-2 py-3">
                          {/* 空セル（インデント用） */}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {/* 親キーワード列は空 */}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {keyword.childKeyword}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            keyword.keywordType === '意思決定KW' ? 'bg-red-100 text-red-800' :
                            keyword.keywordType === '比較KW' ? 'bg-orange-100 text-orange-800' :
                            keyword.keywordType === '関心KW' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {keyword.keywordType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{keyword.target}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{keyword.searchIntent}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{keyword.articleType}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {keyword.currentRank ? `${keyword.currentRank}位` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {keyword.cvContribution ? `${keyword.cvContribution}%` : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {keyword.isArticleCreated ? (
                            <CheckCircle className="text-green-600" size={20} />
                          ) : (
                            <Circle className="text-gray-400" size={20} />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => onEdit(keyword)}
                              className="p-1 text-gray-600 hover:text-blue-600"
                              title="編集"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => onDuplicate(keyword)}
                              className="p-1 text-gray-600 hover:text-green-600"
                              title="複製"
                            >
                              <Copy size={16} />
                            </button>
                            {!keyword.isArticleCreated && (
                              <button
                                onClick={() => onGenerateArticle(keyword.id)}
                                className="p-1 text-gray-600 hover:text-purple-600"
                                title="記事生成"
                              >
                                <FileText size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => onDelete(keyword.id)}
                              className="p-1 text-gray-600 hover:text-red-600"
                              title="削除"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {filteredKeywords.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">キーワードが見つかりません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};