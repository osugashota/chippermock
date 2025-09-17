import React from 'react';
import { Keyword, KeywordType, ArticleType } from '../types/keyword';
import { X } from 'lucide-react';

interface KeywordEditFormProps {
  keyword: Keyword;
  onChange: (keyword: Keyword) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}

export const KeywordEditForm: React.FC<KeywordEditFormProps> = ({
  keyword,
  onChange,
  onSave,
  onCancel,
  isNew
}) => {
  const keywordTypes: KeywordType[] = ['意思決定KW', '比較KW', '関心KW', '潜在KW'];
  const articleTypes: ArticleType[] = ['比較記事', 'ハウツー記事', '用語解説', 'お役立ち情報', '事例紹介'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isNew ? 'キーワード新規作成' : 'キーワード編集'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* 親キーワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              親キーワード <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={keyword.parentKeyword}
              onChange={(e) => onChange({ ...keyword, parentKeyword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 子キーワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              子キーワード <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={keyword.childKeyword}
              onChange={(e) => onChange({ ...keyword, childKeyword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* KW種別 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              KW種別 <span className="text-red-500">*</span>
            </label>
            <select
              value={keyword.keywordType}
              onChange={(e) => onChange({ ...keyword, keywordType: e.target.value as KeywordType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">選択してください</option>
              {keywordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              意思決定KW: 購入意欲高、比較KW: 比較検討中、関心KW: 興味段階、潜在KW: 潜在顧客
            </p>
          </div>

          {/* ターゲット */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ターゲット <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={keyword.target}
              onChange={(e) => onChange({ ...keyword, target: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="例: マーケティング初心者"
              required
            />
          </div>

          {/* 検索意図 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索意図 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={keyword.searchIntent}
              onChange={(e) => onChange({ ...keyword, searchIntent: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="例: 効率的な記事作成方法を知りたい"
              required
            />
          </div>

          {/* 記事種別 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              記事種別 <span className="text-red-500">*</span>
            </label>
            <select
              value={keyword.articleType}
              onChange={(e) => onChange({ ...keyword, articleType: e.target.value as ArticleType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">選択してください</option>
              {articleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 記事作成状況 */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={keyword.isArticleCreated}
              onChange={(e) => onChange({ ...keyword, isArticleCreated: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">記事作成済み</span>
          </label>
        </div>

        {/* ボタン */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};