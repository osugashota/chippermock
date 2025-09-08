import React from 'react';
import { TargetData } from '../types';
import { Plus, Minus, Users } from 'lucide-react';

interface TargetFormProps {
  targets: TargetData[];
  productId: string;
  onChange: (targets: TargetData[]) => void;
}

export const TargetForm: React.FC<TargetFormProps> = ({ targets, productId, onChange }) => {
  const addTarget = () => {
    const newTarget: TargetData = {
      id: Date.now().toString(),
      productId,
      name: '',
      targetAudience: '',
      jobIndustryCategory: '',
      userNeeds: '',
      searcherChallenges: '',
      searchIntent: '',
      knowledgeLevel: '',
      benefitsFromArticle: '',
      keywordTrends: '',
      informationStyle: '',
      doubtPoints: '',
      differenceFromSimilar: ''
    };
    onChange([...targets, newTarget]);
  };

  const removeTarget = (index: number) => {
    const newTargets = targets.filter((_, i) => i !== index);
    onChange(newTargets);
  };

  const updateTarget = (index: number, field: keyof TargetData, value: string) => {
    const newTargets = [...targets];
    newTargets[index] = { ...newTargets[index], [field]: value };
    onChange(newTargets);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Users className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">ターゲット管理</h2>
          <p className="text-sm text-gray-600">記事の想定読者情報を設定します</p>
        </div>
      </div>

      {targets.map((target, index) => (
        <div key={target.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ターゲット {index + 1}
            </h3>
            <button
              type="button"
              onClick={() => removeTarget(index)}
              className="text-red-600 hover:bg-red-50 p-2 rounded-md"
            >
              <Minus size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                名称（管理用）
              </label>
              <input
                type="text"
                value={target.name}
                onChange={(e) => updateTarget(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="管理用タイトル"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                職種／業界カテゴリ
              </label>
              <input
                type="text"
                value={target.jobIndustryCategory}
                onChange={(e) => updateTarget(index, 'jobIndustryCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例：IT業界、マーケティング職"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ターゲット・想定読者
              </label>
              <textarea
                value={target.targetAudience}
                onChange={(e) => updateTarget(index, 'targetAudience', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="具体的な想定読者像"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ユーザーニーズ
              </label>
              <textarea
                value={target.userNeeds}
                onChange={(e) => updateTarget(index, 'userNeeds', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ユーザーが求めている情報・解決策"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                検索者が持つ課題
              </label>
              <textarea
                value={target.searcherChallenges}
                onChange={(e) => updateTarget(index, 'searcherChallenges', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="困っていること、解決したいこと"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  検索意図
                </label>
                <input
                  type="text"
                  value={target.searchIntent}
                  onChange={(e) => updateTarget(index, 'searchIntent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="情報収集、比較検討など"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  知識レベル・リテラシー
                </label>
                <input
                  type="text"
                  value={target.knowledgeLevel}
                  onChange={(e) => updateTarget(index, 'knowledgeLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="初心者、中級者、上級者など"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                記事を通して得られること
              </label>
              <textarea
                value={target.benefitsFromArticle}
                onChange={(e) => updateTarget(index, 'benefitsFromArticle', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="読者が記事から得られる価値"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                優先キーワード／タグの傾向
              </label>
              <input
                type="text"
                value={target.keywordTrends}
                onChange={(e) => updateTarget(index, 'keywordTrends', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="検索されやすいキーワード"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  情報摂取スタイル
                </label>
                <select
                  value={target.informationStyle}
                  onChange={(e) => updateTarget(index, 'informationStyle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">選択してください</option>
                  <option value="能動的">能動的</option>
                  <option value="受動的">受動的</option>
                  <option value="混合">混合</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  同類ターゲットとの差異
                </label>
                <input
                  type="text"
                  value={target.differenceFromSimilar}
                  onChange={(e) => updateTarget(index, 'differenceFromSimilar', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="他のターゲットとの違い"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                疑いポイント（不信の壁）
              </label>
              <textarea
                value={target.doubtPoints}
                onChange={(e) => updateTarget(index, 'doubtPoints', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="読者が疑問に思いやすい部分"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addTarget}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        <Plus size={20} />
        新しいターゲットを追加
      </button>
    </div>
  );
};