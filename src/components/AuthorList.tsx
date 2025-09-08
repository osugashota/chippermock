import React, { useState } from 'react';
import { PersonData } from '../types';
import { User, Plus, Search, Edit, Trash2, Calendar, ArrowRight, Users } from 'lucide-react';

interface AuthorListProps {
  authors: PersonData[];
  onCreateNew: () => void;
  onEditAuthor: (authorId: string) => void;
  onDeleteAuthor: (authorId: string) => void;
}

export const AuthorList: React.FC<AuthorListProps> = ({
  authors,
  onCreateNew,
  onEditAuthor,
  onDeleteAuthor
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.expertiseGenre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">著者管理</h2>
            <p className="text-sm text-gray-600">記事執筆者の詳細情報を管理します</p>
          </div>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          新規著者を作成
        </button>
      </div>

      {/* 検索セクション */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="著者名、肩書、専門分野で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* 著者一覧 */}
      {filteredAuthors.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <div>
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-600">
                「{searchTerm}」に一致する著者がありません。
              </p>
            </div>
          ) : (
            <div>
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">著者がまだありません</h3>
              <p className="text-gray-600 mb-6">
                最初の著者を作成して、記事執筆者の情報を設定しましょう。
              </p>
              <button
                onClick={onCreateNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                新規著者を作成
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => (
            <div
              key={author.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {author.name || '無題の著者'}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {author.title || '肩書未設定'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditAuthor(author.id)}
                      className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                      title="編集"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteAuthor(author.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="削除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">役職</p>
                    <p className="text-sm text-gray-700">
                      {author.position || '未設定'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">専門分野</p>
                    <p className="text-sm text-gray-700">
                      {author.expertiseGenre || '未設定'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">読者との関係性</p>
                    <p className="text-sm text-gray-700">
                      {author.readerRelationship || '未設定'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">プロフィール</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {author.profile || 'プロフィールが未設定です'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{author.qaData.length}個のQ&A</span>
                  </div>
                </div>

                <button
                  onClick={() => onEditAuthor(author.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors group-hover:bg-purple-50 group-hover:text-purple-700"
                >
                  <span>詳細編集</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};