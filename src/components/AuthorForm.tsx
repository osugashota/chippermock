import React from 'react';
import { PersonData, QAItem } from '../types';
import { Plus, Minus, User } from 'lucide-react';

interface AuthorFormProps {
  authors: PersonData[];
  productId: string;
  onChange: (authors: PersonData[]) => void;
}

export const AuthorForm: React.FC<AuthorFormProps> = ({ authors, productId, onChange }) => {
  const addAuthor = () => {
    const newAuthor: PersonData = {
      id: Date.now().toString(),
      productId,
      name: '',
      title: '',
      position: '',
      companyName: '',
      companyUrl: '',
      profile: '',
      speechCharacteristics: '',
      vocabularyTendency: '',
      pastArticles: [''],
      expertiseGenre: '',
      importantThinking: '',
      valueSystem: '',
      ngWords: [''],
      authorPageUrl: '',
      qaData: [],
      readerRelationship: ''
    };
    onChange([...authors, newAuthor]);
  };

  const removeAuthor = (index: number) => {
    const newAuthors = authors.filter((_, i) => i !== index);
    onChange(newAuthors);
  };

  const updateAuthor = (index: number, field: keyof PersonData, value: any) => {
    const newAuthors = [...authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    onChange(newAuthors);
  };

  const handleArrayAdd = (authorIndex: number, field: 'pastArticles' | 'ngWords') => {
    const newAuthors = [...authors];
    const currentArray = newAuthors[authorIndex][field] as string[];
    newAuthors[authorIndex] = {
      ...newAuthors[authorIndex],
      [field]: [...currentArray, '']
    };
    onChange(newAuthors);
  };

  const handleArrayRemove = (authorIndex: number, field: 'pastArticles' | 'ngWords', itemIndex: number) => {
    const newAuthors = [...authors];
    const currentArray = newAuthors[authorIndex][field] as string[];
    newAuthors[authorIndex] = {
      ...newAuthors[authorIndex],
      [field]: currentArray.filter((_, i) => i !== itemIndex)
    };
    onChange(newAuthors);
  };

  const handleArrayChange = (authorIndex: number, field: 'pastArticles' | 'ngWords', itemIndex: number, value: string) => {
    const newAuthors = [...authors];
    const currentArray = [...(newAuthors[authorIndex][field] as string[])];
    currentArray[itemIndex] = value;
    newAuthors[authorIndex] = {
      ...newAuthors[authorIndex],
      [field]: currentArray
    };
    onChange(newAuthors);
  };

  const handleQAAdd = (authorIndex: number) => {
    const newAuthors = [...authors];
    const newQA = [...newAuthors[authorIndex].qaData, { question: '', answer: '' }];
    newAuthors[authorIndex] = { ...newAuthors[authorIndex], qaData: newQA };
    onChange(newAuthors);
  };

  const handleQARemove = (authorIndex: number, qaIndex: number) => {
    const newAuthors = [...authors];
    const newQA = newAuthors[authorIndex].qaData.filter((_, i) => i !== qaIndex);
    newAuthors[authorIndex] = { ...newAuthors[authorIndex], qaData: newQA };
    onChange(newAuthors);
  };

  const handleQAChange = (authorIndex: number, qaIndex: number, field: 'question' | 'answer', value: string) => {
    const newAuthors = [...authors];
    const newQA = [...newAuthors[authorIndex].qaData];
    newQA[qaIndex] = { ...newQA[qaIndex], [field]: value };
    newAuthors[authorIndex] = { ...newAuthors[authorIndex], qaData: newQA };
    onChange(newAuthors);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <User className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">著者管理</h2>
          <p className="text-sm text-gray-600">記事執筆者の詳細情報を設定します</p>
        </div>
      </div>

      {authors.map((author, authorIndex) => (
        <div key={author.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              著者 {authorIndex + 1}
            </h3>
            <button
              type="button"
              onClick={() => removeAuthor(authorIndex)}
              className="text-red-600 hover:bg-red-50 p-2 rounded-md"
            >
              <Minus size={16} />
            </button>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                人物名
              </label>
              <input
                type="text"
                value={author.name}
                onChange={(e) => updateAuthor(authorIndex, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="管理用タイトル"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                肩書
              </label>
              <input
                type="text"
                value={author.title}
                onChange={(e) => updateAuthor(authorIndex, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                onChange={(e) => updateAuthor(authorIndex, 'position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                onChange={(e) => updateAuthor(authorIndex, 'companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                onChange={(e) => updateAuthor(authorIndex, 'companyUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://company.example.com"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロフィール
              </label>
              <textarea
                value={author.profile}
                onChange={(e) => updateAuthor(authorIndex, 'profile', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="経歴、専門分野、実績など"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  言い回し・口調の特徴
                </label>
                <textarea
                  value={author.speechCharacteristics}
                  onChange={(e) => updateAuthor(authorIndex, 'speechCharacteristics', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="一人称、二人称、末尾表現など"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  使用語彙の傾向
                </label>
                <textarea
                  value={author.vocabularyTendency}
                  onChange={(e) => updateAuthor(authorIndex, 'vocabularyTendency', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="専門用語の使用度、カタカナ語の許容度など"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  専門ジャンル・領域
                </label>
                <input
                  type="text"
                  value={author.expertiseGenre}
                  onChange={(e) => updateAuthor(authorIndex, 'expertiseGenre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="得意分野・専門領域"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  読者との関係性設定
                </label>
                <select
                  value={author.readerRelationship}
                  onChange={(e) => updateAuthor(authorIndex, 'readerRelationship', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                重要視していること（価値観）
              </label>
              <textarea
                value={author.valueSystem}
                onChange={(e) => updateAuthor(authorIndex, 'valueSystem', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="正確性重視、読者視点、実体験ベースなど"
              />
            </div>

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
                    onChange={(e) => handleArrayChange(authorIndex, 'pastArticles', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="記事URL(例 : https://example.com)"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove(authorIndex, 'pastArticles', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAdd(authorIndex, 'pastArticles')}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus size={16} />
                記事を追加
              </button>
            </div>

            {/* NGワード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NGワード・スタンス
              </label>
              {author.ngWords.map((word, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => handleArrayChange(authorIndex, 'ngWords', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="使用を避けるべき言葉やスタンス"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove(authorIndex, 'ngWords', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAdd(authorIndex, 'ngWords')}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus size={16} />
                NGワードを追加
              </button>
            </div>

            {/* Q&A */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                一問一答型Q&A
              </label>
              {author.qaData.map((qa, qaIndex) => (
                <div key={qaIndex} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Q&A {qaIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleQARemove(authorIndex, qaIndex)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={qa.question}
                      onChange={(e) => handleQAChange(authorIndex, qaIndex, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="質問（例：なぜこの分野に取り組むのか？）"
                    />
                    <textarea
                      value={qa.answer}
                      onChange={(e) => handleQAChange(authorIndex, qaIndex, 'answer', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="回答"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleQAAdd(authorIndex)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus size={16} />
                Q&Aを追加
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">

                著者ページURL
              </label>
              <input
                type="url"
                value={author.authorPageUrl || ''}
                onChange={(e) => updateAuthor(authorIndex, 'authorPageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/author/..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addAuthor}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        <Plus size={20} />
        新しい著者を追加
      </button>
    </div>
  );
};