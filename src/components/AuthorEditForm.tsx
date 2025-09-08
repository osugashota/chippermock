import React from 'react';
import { PersonData, QAItem } from '../types';
import { Plus, Minus, ArrowLeft, Save, User } from 'lucide-react';

interface AuthorEditFormProps {
  author: PersonData;
  onChange: (author: PersonData) => void;
  onBack: () => void;
  onSave: () => void;
  isNew?: boolean;
}

export const AuthorEditForm: React.FC<AuthorEditFormProps> = ({ 
  author, 
  onChange, 
  onBack, 
  onSave,
  isNew = false 
}) => {
  const handleInputChange = (field: keyof PersonData, value: any) => {
    onChange({ ...author, [field]: value });
  };

  const handleArrayAdd = (field: 'pastArticles' | 'ngWords') => {
    const currentArray = author[field] as string[];
    handleInputChange(field, [...currentArray, '']);
  };

  const handleArrayRemove = (field: 'pastArticles' | 'ngWords', index: number) => {
    const currentArray = author[field] as string[];
    handleInputChange(field, currentArray.filter((_, i) => i !== index));
  };

  const handleArrayChange = (field: 'pastArticles' | 'ngWords', index: number, value: string) => {
    const currentArray = [...(author[field] as string[])];
    currentArray[index] = value;
    handleInputChange(field, currentArray);
  };

  const handleQAAdd = () => {
    const newQA = [...author.qaData, { question: '', answer: '' }];
    handleInputChange('qaData', newQA);
  };

  const handleQARemove = (index: number) => {
    const newQA = author.qaData.filter((_, i) => i !== index);
    handleInputChange('qaData', newQA);
  };

  const handleQAChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newQA = [...author.qaData];
    newQA[index] = { ...newQA[index], [field]: value };
    handleInputChange('qaData', newQA);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft size={20} />
            著者一覧に戻る
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isNew ? '新規著者作成' : `${author.name || '著者'}の編集`}
              </h2>
              <p className="text-sm text-gray-600">記事執筆者の詳細情報を設定します</p>
            </div>
          </div>
        </div>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Save size={16} />
          保存
        </button>
      </div>

      {/* 基本情報 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              人物名（管理用タイトル） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="管理用タイトル"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              肩書
            </label>
            <input
              type="text"
              value={author.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="専門家、コンサルタントなど"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              役職
            </label>
            <input
              type="text"
              value={author.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="役職・ポジション"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              会社名
            </label>
            <input
              type="text"
              value={author.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="所属会社名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              会社URL
            </label>
            <input
              type="url"
              value={author.companyUrl}
              onChange={(e) => handleInputChange('companyUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="https://company.example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プロフィール
          </label>
          <textarea
            value={author.profile}
            onChange={(e) => handleInputChange('profile', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="経歴、専門分野、実績など"
          />
        </div>
      </div>

      {/* 文体・専門性 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">文体・専門性</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                言い回し・口調の特徴（一人称表現、二人称表現、末尾表現）
              </label>
              <textarea
                value={author.speechCharacteristics}
                onChange={(e) => handleInputChange('speechCharacteristics', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="例：私、あなた、です・ます調など"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                使用語彙の傾向（専門用語／噛み砕き度／カタカナ語の許容度）
              </label>
              <textarea
                value={author.vocabularyTendency}
                onChange={(e) => handleInputChange('vocabularyTendency', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="専門用語の使用度、わかりやすさ重視度、カタカナ語の使用頻度など"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                著者ページURL
              </label>
              <input
                type="text"
                value={author.expertiseGenre}
                onChange={(e) => handleInputChange('expertiseGenre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="得意分野・専門領域"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                読者との関係性設定（例：同志／先生／友人）
              </label>
              <select
                value={author.readerRelationship}
                onChange={(e) => handleInputChange('readerRelationship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">選択してください</option>
                <option value="同志">同志</option>
                <option value="先生">先生</option>
                <option value="友人">友人</option>
                <option value="メンター">メンター</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              専門ジャンル別の重要視する考え方
            </label>
            <textarea
              value={author.importantThinking}
              onChange={(e) => handleInputChange('importantThinking', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="この分野で特に重要視している考え方やアプローチ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              重要視していること（価値観）（例：正確性重視／読者視点／実体験ベース／バズより信頼性）
            </label>
            <textarea
              value={author.valueSystem}
              onChange={(e) => handleInputChange('valueSystem', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="例：正確性重視、読者の成功を第一に考える、実体験ベースで語る"
            />
          </div>
        </div>
      </div>

      {/* 過去記事・NGワード */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">実績・制約</h3>
        <div className="space-y-6">
          {/* 過去記事 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              過去作成記事URL
            </label>
            {author.pastArticles.map((article, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={article}
                  onChange={(e) => handleArrayChange('pastArticles', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="記事URL(例 : https://example.com)"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('pastArticles', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayAdd('pastArticles')}
              className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md"
            >
              <Plus size={16} />
              記事を追加
            </button>
          </div>

          {/* NGワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NGワード・スタンス（例：「楽して稼ぐ」「スピリチュアル」「バズればいい」など）
            </label>
            {author.ngWords.map((word, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={word}
                  onChange={(e) => handleArrayChange('ngWords', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="例：楽して稼ぐ、絶対、必ず成功など"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('ngWords', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayAdd('ngWords')}
              className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md"
            >
              <Plus size={16} />
              NGワードを追加
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              著者ページURL
            </label>
            <input
              type="url"
              value={author.authorPageUrl || ''}
              onChange={(e) => handleInputChange('authorPageUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="https://example.com/author/..."
            />
          </div>
        </div>
      </div>
      {/* Q&A */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">一問一答型の本人語りQ&A</h3>
        <p className="text-sm text-gray-600 mb-4">
          共感・信頼性UP＋文体の補強データに活用可能（例：「なぜこの分野に取り組むのか？」）
        </p>
        {author.qaData.map((qa, qaIndex) => (
          <div key={qaIndex} className="mb-4 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Q&A {qaIndex + 1}</span>
              <button
                type="button"
                onClick={() => handleQARemove(qaIndex)}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
              >
                <Minus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={qa.question}
                onChange={(e) => handleQAChange(qaIndex, 'question', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="質問（例：なぜこの分野に取り組むのか？）"
              />
              <textarea
                value={qa.answer}
                onChange={(e) => handleQAChange(qaIndex, 'answer', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="回答"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleQAAdd}
          className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md"
        >
          <Plus size={16} />
          Q&Aを追加
        </button>
      </div>
    </div>
  );
};