import React, { useState } from 'react';
import { TargetData } from '../types';
import { Users, Plus, Search, Edit, Trash2, Calendar, ArrowRight, User } from 'lucide-react';

interface TargetListProps {
  targets: TargetData[];
  onCreateNew: () => void;
  onEditTarget: (targetId: string) => void;
  onDeleteTarget: (targetId: string) => void;
}

export const TargetList: React.FC<TargetListProps> = ({
  targets,
  onCreateNew,
  onEditTarget,
  onDeleteTarget
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTargets = targets.filter(target => 
    target.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    target.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
    target.jobIndustryCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">ターゲット管理</h2>
            <p className="text-sm text-gray-600">記事の想定読者情報を管理します</p>
          </div>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          新規ターゲットを作成
        </button>
      </div>

      {/* 検索セクション */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ターゲット名、想定読者、職種・業界で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* ターゲット一覧 */}
      {filteredTargets.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <div>
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-600">
                「{searchTerm}」に一致するターゲットがありません。
              </p>
            </div>
          ) : (
            <div>
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ターゲットがまだありません</h3>
              <p className="text-gray-600 mb-6">
                最初のターゲットを作成して、記事の想定読者を設定しましょう。
              </p>
              <button
                onClick={onCreateNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={20} />
                新規ターゲットを作成
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTargets.map((target) => (
            <div
              key={target.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {target.name || '無題のターゲット'}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {target.jobIndustryCategory || '業界未設定'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTarget(target.id)}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                      title="編集"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteTarget(target.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="削除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">想定読者</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {target.targetAudience || '想定読者が未設定です'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">検索意図</p>
                    <p className="text-sm text-gray-700">
                      {target.searchIntent || '未設定'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">知識レベル</p>
                    <p className="text-sm text-gray-700">
                      {target.knowledgeLevel || '未設定'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onEditTarget(target.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors group-hover:bg-green-50 group-hover:text-green-700"
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