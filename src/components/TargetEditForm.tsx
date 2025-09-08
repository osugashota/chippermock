import React from 'react';
import { TargetData } from '../types';
import { ArrowLeft, Save, Users, Sparkles, Upload, Link, X, Loader2, Package, Plus } from 'lucide-react';

interface TargetEditFormProps {
  target: TargetData;
  onChange: (target: TargetData) => void;
  onBack: () => void;
  onSave: () => void;
  isNew?: boolean;
  products?: Array<{ id: string; serviceName: string; serviceOverview: string }>;
}

export const TargetEditForm: React.FC<TargetEditFormProps> = ({
  target, 
  onChange, 
  onBack, 
  onSave,
  isNew = false,
  products = []
}) => {
  const [registrationMethod, setRegistrationMethod] = React.useState<'manual' | 'ai' | 'product-ai' | 'select'>('select');
  const [urls, setUrls] = React.useState<string[]>(['']);
  const [files, setFiles] = React.useState<File[]>([]);
  const [selectedProductId, setSelectedProductId] = React.useState<string>('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationProgress, setGenerationProgress] = React.useState(0);
  const [showPreview, setShowPreview] = React.useState(false);
  const [generatedData, setGeneratedData] = React.useState<TargetData | null>(null);

  // 既存のターゲット編集の場合は直接手動入力モードに
  React.useEffect(() => {
    if (!isNew) {
      setRegistrationMethod('manual');
    }
  }, [isNew]);

  const handleInputChange = (field: keyof TargetData, value: string) => {
    onChange({ ...target, [field]: value });
  };

  // URL管理
  const handleUrlAdd = () => {
    setUrls([...urls, '']);
  };

  const handleUrlRemove = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // ファイル管理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles([...files, ...uploadedFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // AI生成（URL・資料から）
  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      await new Promise(resolve => setTimeout(resolve, 5000));

      const mockGeneratedData: TargetData = {
        ...target,
        name: 'AI生成されたターゲット名',
        targetAudience: 'AIが解析した想定読者像です。提供されたURLや資料から自動的に生成されました。',
        jobIndustryCategory: 'AI解析による業界カテゴリ',
        userNeeds: 'AI解析によるユーザーニーズ',
        searcherChallenges: 'AI解析による検索者の課題',
        searchIntent: 'AI解析による検索意図',
        knowledgeLevel: 'AI解析による知識レベル',
        benefitsFromArticle: 'AI解析による記事から得られること',
        keywordTrends: 'AI解析によるキーワード傾向',
        informationStyle: '能動的',
        doubtPoints: 'AI解析による疑いポイント',
        differenceFromSimilar: 'AI解析による差異'
      };

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGeneratedData(mockGeneratedData);
      setShowPreview(true);
    } catch (error) {
      console.error('AI生成エラー:', error);
      alert('AI生成中にエラーが発生しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  // AI生成（商材から）
  const handleProductAIGenerate = async () => {
    if (!selectedProductId) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      await new Promise(resolve => setTimeout(resolve, 4000));

      const selectedProduct = products.find(p => p.id === selectedProductId);
      const mockGeneratedData: TargetData = {
        ...target,
        name: `${selectedProduct?.serviceName}のターゲット`,
        targetAudience: `${selectedProduct?.serviceName}を必要とする想定読者像をAIが分析しました。`,
        jobIndustryCategory: 'AI解析による業界カテゴリ',
        userNeeds: `${selectedProduct?.serviceName}に関連するユーザーニーズ`,
        searcherChallenges: `${selectedProduct?.serviceName}に関連する課題`,
        searchIntent: '情報収集',
        knowledgeLevel: '中級者',
        benefitsFromArticle: `${selectedProduct?.serviceName}の理解促進`,
        keywordTrends: `${selectedProduct?.serviceName}関連キーワード`,
        informationStyle: '能動的',
        doubtPoints: 'サービスの信頼性に関する疑問',
        differenceFromSimilar: '実用性重視'
      };

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGeneratedData(mockGeneratedData);
      setShowPreview(true);
    } catch (error) {
      console.error('AI生成エラー:', error);
      alert('AI生成中にエラーが発生しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewAccept = () => {
    if (generatedData) {
      onChange(generatedData);
      // 即座に保存処理を実行
      onSave();
      // UI状態をリセット
      setTimeout(() => {
        setShowPreview(false);
        setRegistrationMethod('manual');
      }, 200);
    }
    setShowPreview(false);
    setGeneratedData(null);
  };

  const handlePreviewCancel = () => {
    setShowPreview(false);
    setGeneratedData(null);
  };

  const handleGenerationCancel = () => {
    setIsGenerating(false);
    setGenerationProgress(0);
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
            ターゲット一覧に戻る
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isNew ? '新規ターゲット作成' : `${target.name || 'ターゲット'}の編集`}
              </h2>
              <p className="text-sm text-gray-600">記事の想定読者情報を設定します</p>
            </div>
          </div>
        </div>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Save size={16} />
          保存
        </button>
      </div>

      {/* 登録方法選択（新規作成時のみ） */}
      {isNew && registrationMethod === 'select' && !showPreview && !isGenerating && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">登録方法を選択</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setRegistrationMethod('ai')}
              className="p-6 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AI自動生成</h4>
                  <p className="text-sm text-gray-600">URLや資料からAIが自動生成</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 複数のURLを同時に解析</li>
                <li>• 資料アップロードに対応</li>
                <li>• 自動でターゲット情報を生成</li>
              </ul>
            </button>

            <button
              onClick={() => setRegistrationMethod('product-ai')}
              className="p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">商材からAI生成</h4>
                  <p className="text-sm text-gray-600">登録済み商材からAIが提案</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 既存商材情報を活用</li>
                <li>• 適切なターゲット像を提案</li>
                <li>• 商材との整合性を保証</li>
              </ul>
            </button>

            <button
              onClick={() => setRegistrationMethod('manual')}
              className="p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">手動入力</h4>
                  <p className="text-sm text-gray-600">全ての情報を手動で入力</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 詳細な情報を直接入力</li>
                <li>• 完全にカスタマイズ可能</li>
                <li>• 既存の情報を活用</li>
              </ul>
            </button>
          </div>
        </div>
      )}


      {/* AI生成入力画面（URL・資料から） */}
      {registrationMethod === 'ai' && !isGenerating && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI自動生成</h3>
              <p className="text-sm text-gray-600">URLや資料を追加してAIに解析させます</p>
            </div>
          </div>

          {/* URL入力 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Link className="inline w-4 h-4 mr-1" />
              参考URL
            </label>
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://example.com"
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleUrlRemove(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleUrlAdd}
              className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md"
            >
              <Plus size={16} />
              URLを追加
            </button>
          </div>

          {/* ファイルアップロード */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Upload className="inline w-4 h-4 mr-1" />
              資料アップロード
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  ファイルをドラッグ&ドロップするか、下のボタンで選択
                </p>
                <p className="text-xs text-gray-500">
                  PDF, Word, PowerPoint, Excel, テキストファイルに対応
                </p>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              onChange={handleFileUpload}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />

            {/* アップロード済みファイル一覧 */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">アップロード済みファイル:</p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={() => handleFileRemove(index)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 生成ボタン */}
          <div className="text-center">
            <button
              onClick={handleAIGenerate}
              disabled={urls.every(url => !url.trim()) && files.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Sparkles size={20} />
              AIでターゲット情報を生成
            </button>
            <p className="text-xs text-gray-500 mt-2">
              URLまたは資料を追加してから生成してください
            </p>
          </div>
        </div>
      )}

      {/* 商材からAI生成入力画面 */}
      {registrationMethod === 'product-ai' && !isGenerating && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">登録済み商材からAI生成</h3>
              <p className="text-sm text-gray-600">既存の商材情報を基にAIが適切なターゲット像を提案します</p>
            </div>
          </div>

          {/* 商材選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Package className="inline w-4 h-4 mr-1" />
              商材を選択
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">商材を選択してください</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.serviceName}
                </option>
              ))}
            </select>
            
            {selectedProductId && (
              <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                {(() => {
                  const selectedProduct = products.find(p => p.id === selectedProductId);
                  return selectedProduct ? (
                    <div>
                      <p className="font-medium text-orange-900 text-sm">{selectedProduct.serviceName}</p>
                      <p className="text-xs text-orange-700 mt-1">{selectedProduct.serviceOverview}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* 生成ボタン */}
          <div className="text-center">
            <button
              onClick={handleProductAIGenerate}
              disabled={!selectedProductId}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Sparkles size={20} />
              商材からターゲット情報を生成
            </button>
            <p className="text-xs text-gray-500 mt-2">
              商材を選択してから生成してください
            </p>
          </div>
        </div>
      )}

      {/* 生成中画面 */}
      {isGenerating && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI生成中...</h3>
              <p className="text-sm text-gray-600">ターゲット情報を解析・生成しています</p>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p>📄 情報を解析中...</p>
            <p>🎯 ターゲット像を抽出中...</p>
            <p>✨ 最適化された内容を生成中...</p>
          </div>

          <button
            onClick={handleGenerationCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
        </div>
      )}

      {/* プレビュー・確認画面 */}
      {showPreview && generatedData && (
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">AI生成結果の確認・編集</h2>
                  <p className="text-sm text-gray-600">内容を確認して、必要に応じて編集してください</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePreviewCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                やり直し
              </button>
              <button
                onClick={handlePreviewAccept}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save size={16} />
                この内容で登録
              </button>
            </div>
          </div>

          {/* 編集可能なフォーム（手動入力画面と完全同一） */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  名称（管理用タイトル） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={generatedData.name}
                  onChange={(e) => setGeneratedData(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="管理用タイトル"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  職種／業界カテゴリ（商材と業種を紐づけやすくなる）
                </label>
                <input
                  type="text"
                  value={generatedData.jobIndustryCategory}
                  onChange={(e) => setGeneratedData(prev => prev ? { ...prev, jobIndustryCategory: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="例：IT業界、マーケティング職"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ターゲット・想定読者 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={generatedData.targetAudience}
                  onChange={(e) => setGeneratedData(prev => prev ? { ...prev, targetAudience: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="具体的な想定読者像"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ユーザーニーズ
                </label>
                <textarea
                  value={generatedData.userNeeds}
                  onChange={(e) => setGeneratedData(prev => prev ? { ...prev, userNeeds: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="ユーザーが求めている情報・解決策"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  検索者が持つ課題（困っていること、解決したいこと、ターゲットが抱えている課題）
                </label>
                <textarea
                  value={generatedData.searcherChallenges}
                  onChange={(e) => setGeneratedData(prev => prev ? { ...prev, searcherChallenges: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="困っていること、解決したいこと"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フォーム */}
      {registrationMethod === 'manual' && !showPreview && (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名称（管理用タイトル） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={target.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="管理用タイトル"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              職種／業界カテゴリ（商材と業種を紐づけやすくなる）
            </label>
            <input
              type="text"
              value={target.jobIndustryCategory}
              onChange={(e) => handleInputChange('jobIndustryCategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="例：IT業界、マーケティング職"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ターゲット・想定読者 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={target.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="具体的な想定読者像"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ユーザーニーズ
            </label>
            <textarea
              value={target.userNeeds}
              onChange={(e) => handleInputChange('userNeeds', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="ユーザーが求めている情報・解決策"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索者が持つ課題（困っていること、解決したいこと、ターゲットが抱えている課題）
            </label>
            <textarea
              value={target.searcherChallenges}
              onChange={(e) => handleInputChange('searcherChallenges', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="困っていること、解決したいこと"
            />
          </div>

        </div>
      </div>
      )}
    </div>
  );
};