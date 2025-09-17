import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { ProductSummary } from '../types';
import { TargetData } from '../types';

interface KeywordGenerateModalProps {
  products: ProductSummary[];
  targets: TargetData[];
  onGenerate: (productId: string, targetId: string) => void;
  onClose: () => void;
}

export const KeywordGenerateModal: React.FC<KeywordGenerateModalProps> = ({
  products,
  targets,
  onGenerate,
  onClose
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');

  const availableTargets = selectedProductId
    ? targets.filter(t => t.productId === selectedProductId)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductId && selectedTargetId) {
      onGenerate(selectedProductId, selectedTargetId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">
                キーワード自動生成
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商材を選択 <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setSelectedTargetId('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">選択してください</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.serviceName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ターゲットを選択 <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedProductId}
              required
            >
              <option value="">選択してください</option>
              {availableTargets.map(target => (
                <option key={target.id} value={target.id}>
                  {target.name} - {target.targetAudience}
                </option>
              ))}
            </select>
            {selectedProductId && availableTargets.length === 0 && (
              <p className="mt-1 text-sm text-red-600">
                この商材にはターゲットが設定されていません
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              選択した商材とターゲットの情報を基に、以下のキーワードが自動生成されます：
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>意思決定KW（購入・申込関連）</li>
              <li>比較KW（競合比較・評判）</li>
              <li>関心KW（使い方・機能）</li>
              <li>潜在KW（課題解決・業務改善）</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!selectedProductId || !selectedTargetId}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Sparkles size={16} />
              生成開始
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};