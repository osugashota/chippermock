import React, { useState } from 'react';
import { ProductSummary } from '../types';
import { Package, Users, User, Plus, Search, Edit, Trash2, Calendar, ArrowRight } from 'lucide-react';

interface ProductListProps {
  products: ProductSummary[];
  onCreateNew: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onCreateNew,
  onEditProduct,
  onDeleteProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'created'>('updated');

  const filteredProducts = products
    .filter(product => 
      product.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.serviceOverview.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.serviceName.localeCompare(b.serviceName);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商材管理</h1>
          <p className="text-gray-600 mt-1">
            登録済みの商材一覧です。編集や新規作成ができます。
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          新規商材を作成
        </button>
      </div>

      {/* 検索・フィルターセクション */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="商材名やサービス概要で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'updated' | 'created')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="updated">更新日順</option>
              <option value="created">作成日順</option>
              <option value="name">名前順</option>
            </select>
          </div>
        </div>
      </div>

      {/* 商材一覧 */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <div>
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-600">
                「{searchTerm}」に一致する商材がありません。
              </p>
            </div>
          ) : (
            <div>
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">商材がまだありません</h3>
              <p className="text-gray-600 mb-6">
                最初の商材を作成して、記事作成の準備を始めましょう。
              </p>
              <button
                onClick={onCreateNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                新規商材を作成
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {product.serviceName || '無題の商材'}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditProduct(product.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="編集"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="削除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.serviceOverview || 'サービス概要が未入力です'}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{product.targetsCount}ターゲット</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{product.authorsCount}著者</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>更新: {formatDate(product.updatedAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => onEditProduct(product.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700"
                >
                  <span>編集・管理</span>
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