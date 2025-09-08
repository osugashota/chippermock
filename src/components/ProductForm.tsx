import React from 'react';
import { ProductData, FAQ } from '../types';
import { ArrowLeft, Save, Package, Sparkles, Upload, Link, X, Loader2, Plus, Minus, TrendingUp, Building2, HelpCircle, Users } from 'lucide-react';

interface ProductFormProps {
  data: ProductData;
  onChange: (data: ProductData) => void;
  onBack: () => void;
  onSave: () => void;
  isNew?: boolean;
}

interface CompetitorData {
  id: string;
  service_name: string;
  service_url: string;
  differentiation: string;
  price: string;
}

interface CaseStudyData {
  id: string;
  case_name: string;
  background: string;
  outcome: string;
}

interface IndustryData {
  id: string;
  industry_name: string;
  industry_challenges: string;
  target_size: string;
  solution_features?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ data, onChange, onBack, onSave, isNew = false }) => {
  const [registrationMethod, setRegistrationMethod] = React.useState<'manual' | 'ai'>('manual');
  const [urls, setUrls] = React.useState<string[]>(['']);
  const [files, setFiles] = React.useState<File[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationProgress, setGenerationProgress] = React.useState(0);
  const [showPreview, setShowPreview] = React.useState(false);
  const [generatedData, setGeneratedData] = React.useState<ProductData | null>(null);

  const handleInputChange = (field: keyof ProductData, value: any) => {
    onChange({ ...data, [field]: value });
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

  // AI生成
  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // プログレスバーのアニメーション
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // 実際のAI生成処理（モック）
      await new Promise(resolve => setTimeout(resolve, 5000));

      // 生成されたデータ（モック）
      const mockGeneratedData: ProductData = {
        ...data,
        serviceName: 'AI記事生成プラットフォーム',
        serviceOverview: 'AIを活用して高品質なSEO記事を自動生成するクラウドサービス。企業のコンテンツマーケティングを効率化し、検索エンジンでの上位表示を実現します。',
        excludeUrls: ['https://example.com/admin', 'https://example.com/test'],
        usp: '業界最高水準のAI技術により、人間が書いたような自然で読みやすい記事を大量生成。SEO最適化機能により検索上位表示率90%を実現。',
        problemToSolve: 'コンテンツマーケティングにおける記事作成の時間とコストの課題、SEO知識不足による検索順位の低迷、継続的なコンテンツ更新の困難さを解決します。',
        userPainPoints: '記事作成に膨大な時間がかかる、SEOライティングの専門知識が不足している、外注費用が高額、品質にばらつきがある、継続的な更新が困難',
        differentiationPoints: '他社AI記事生成ツールと比較して、日本語の自然さが圧倒的に優秀。業界特化型のテンプレート機能により専門性の高い記事を生成可能。リアルタイムSEO分析機能を標準搭載。',
        advantagePoints: '月間1000記事の大量生成が可能、人件費を80%削減、SEO順位向上率90%、24時間365日稼働、多言語対応、既存CMSとの連携機能',
        commoditizationPoints: '基本的な記事生成機能、SEO基礎対応、WordPress連携、基本的なテンプレート機能、標準的なサポート体制',
        dropoutPoints: '価格競争力の不足、カスタマイズ性の低さ、サポート体制の弱さ、生成速度の遅さ、他ツールとの連携不足',
        competitorInfo: [
          'ChatGPT - 汎用性は高いがSEO特化機能なし、日本語品質にばらつき',
          'Jasper AI - 英語圏向け、日本語対応が不十分、価格が高額',
          'Copy.ai - テンプレート豊富だが記事の専門性が低い'
        ],
        pricing: '月額19,800円（スタンダードプラン）、月額49,800円（プロプラン）、月額98,000円（エンタープライズプラン）。初期費用無料、14日間無料トライアル付き。',
        solutionOffered: 'AI技術による高速記事生成、SEO最適化の自動化、コンテンツ品質の標準化、運用工数の大幅削減を実現。専門知識不要で誰でも高品質な記事を作成可能。',
        caseStudies: [
          'A社（IT企業）：月間記事数を10倍に増加、オーガニック流入が300%向上',
          'B社（不動産）：記事作成コストを70%削減、問い合わせ数が2倍に増加',
          'C社（美容）：SEO順位1位獲得キーワードが50個から200個に増加'
        ],
        implementationEffects: '導入後3ヶ月でオーガニック検索流入が平均250%向上、記事作成時間を90%短縮、コンテンツマーケティングROIが400%改善',
        beforeSituation: '記事作成に1本あたり8時間、外注費用月50万円、SEO順位が低迷、コンテンツ更新が月2-3本程度、専門ライターの確保が困難',
        afterSituation: '記事作成が1本あたり30分、運用費用月5万円、検索上位表示率90%、月間50本の継続更新、社内リソースのみで運用可能',
        mainIndustries: [
          'IT・SaaS業界',
          '不動産業界', 
          '美容・健康業界',
          'BtoB製造業',
          'コンサルティング業界'
        ],
        solutionFeatures: 'AI記事生成エンジン、SEO自動最適化、競合分析機能、コンテンツ管理システム、パフォーマンス分析ダッシュボード、多言語対応、API連携機能',
        implementationBarriers: '既存ワークフローの変更、社内教育の必要性、初期設定の複雑さ、品質管理体制の構築、効果測定指標の設定',
        faq: [
          { 
            question: '生成される記事の品質はどの程度ですか？', 
            answer: '人間のライターが書いた記事と遜色ない品質を実現しています。独自のAI学習モデルにより、自然で読みやすい日本語記事を生成します。'
          },
          { 
            question: 'SEO効果は本当に期待できますか？', 
            answer: '導入企業の90%で検索順位向上を確認しています。最新のSEOアルゴリズムに対応した最適化機能により、検索エンジンに評価される記事を生成します。'
          },
          { 
            question: '既存のCMSとの連携は可能ですか？', 
            answer: 'WordPress、Drupal、MovableTypeなど主要CMSとの連携が可能です。APIを通じて直接投稿することも可能です。'
          },
          { 
            question: '導入までにどの程度の期間が必要ですか？', 
            answer: '最短1週間で導入可能です。専任のサポートチームが初期設定から運用開始まで全面的にサポートいたします。'
          },
          { 
            question: '月間の記事生成数に制限はありますか？', 
            answer: 'プランに応じて制限があります。スタンダードプランは月100記事、プロプランは月500記事、エンタープライズプランは無制限です。'
          }
        ]
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

  const handlePreviewChange = (field: keyof ProductData, value: any) => {
    if (generatedData) {
      setGeneratedData({ ...generatedData, [field]: value });
    }
  };

  const handlePreviewArrayAdd = (field: 'excludeUrls' | 'competitorInfo' | 'caseStudies' | 'mainIndustries') => {
    if (generatedData) {
      const newArray = [...(generatedData[field] as string[]), ''];
      setGeneratedData({ ...generatedData, [field]: newArray });
    }
  };

  const handlePreviewArrayRemove = (field: 'excludeUrls' | 'competitorInfo' | 'caseStudies' | 'mainIndustries', index: number) => {
    if (generatedData) {
      const newArray = (generatedData[field] as string[]).filter((_, i) => i !== index);
      setGeneratedData({ ...generatedData, [field]: newArray });
    }
  };

  const handlePreviewArrayChange = (field: 'excludeUrls' | 'competitorInfo' | 'caseStudies' | 'mainIndustries', index: number, value: string) => {
    if (generatedData) {
      const newArray = [...(generatedData[field] as string[])];
      newArray[index] = value;
      setGeneratedData({ ...generatedData, [field]: newArray });
    }
  };

  const handlePreviewFAQAdd = () => {
    if (generatedData) {
      const newFAQ = [...generatedData.faq, { question: '', answer: '' }];
      setGeneratedData({ ...generatedData, faq: newFAQ });
    }
  };

  const handlePreviewFAQRemove = (index: number) => {
    if (generatedData) {
      const newFAQ = generatedData.faq.filter((_, i) => i !== index);
      setGeneratedData({ ...generatedData, faq: newFAQ });
    }
  };

  const handlePreviewFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    if (generatedData) {
      const newFAQ = [...generatedData.faq];
      newFAQ[index] = { ...newFAQ[index], [field]: value };
      setGeneratedData({ ...generatedData, faq: newFAQ });
    }
  };

  const handleGenerationCancel = () => {
    setIsGenerating(false);
    setGenerationProgress(0);
  };

  const handleArrayAdd = (field: 'excludeUrls') => {
    const newArray = [...(data[field] as string[]), ''];
    handleInputChange(field, newArray);
  };

  const handleArrayRemove = (field: 'excludeUrls', index: number) => {
    const newArray = (data[field] as string[]).filter((_, i) => i !== index);
    handleInputChange(field, newArray);
  };

  const handleArrayChange = (field: 'excludeUrls', index: number, value: string) => {
    const newArray = [...(data[field] as string[])];
    newArray[index] = value;
    handleInputChange(field, newArray);
  };

  // 競合サービス管理
  const [competitors, setCompetitors] = React.useState<CompetitorData[]>([
    { id: '1', service_name: '', service_url: '', differentiation: '', price: '' }
  ]);

  const handleCompetitorAdd = () => {
    const newCompetitor: CompetitorData = {
      id: Date.now().toString(),
      service_name: '',
      service_url: '',
      differentiation: '',
      price: ''
    };
    setCompetitors([...competitors, newCompetitor]);
  };

  const handleCompetitorRemove = (id: string) => {
    setCompetitors(competitors.filter(c => c.id !== id));
  };

  const handleCompetitorChange = (id: string, field: keyof CompetitorData, value: string) => {
    setCompetitors(competitors.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // 導入事例管理
  const [caseStudies, setCaseStudies] = React.useState<CaseStudyData[]>([
    { id: '1', case_name: '', background: '', outcome: '' }
  ]);

  const handleCaseStudyAdd = () => {
    const newCaseStudy: CaseStudyData = {
      id: Date.now().toString(),
      case_name: '',
      background: '',
      outcome: ''
    };
    setCaseStudies([...caseStudies, newCaseStudy]);
  };

  const handleCaseStudyRemove = (id: string) => {
    setCaseStudies(caseStudies.filter(c => c.id !== id));
  };

  const handleCaseStudyChange = (id: string, field: keyof CaseStudyData, value: string) => {
    setCaseStudies(caseStudies.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // 業界管理
  const [industries, setIndustries] = React.useState<IndustryData[]>([
    { id: '1', industry_name: '', industry_challenges: '', target_size: '' }
  ]);

  const handleIndustryAdd = () => {
    const newIndustry: IndustryData = {
      id: Date.now().toString(),
      industry_name: '',
      industry_challenges: '',
      target_size: ''
    };
    setIndustries([...industries, newIndustry]);
  };

  const handleIndustryRemove = (id: string) => {
    setIndustries(industries.filter(i => i.id !== id));
  };

  const handleIndustryChange = (id: string, field: keyof IndustryData, value: string) => {
    setIndustries(industries.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const handleFAQAdd = () => {
    const newFAQ = [...data.faq, { question: '', answer: '' }];
    handleInputChange('faq', newFAQ);
  };

  const handleFAQRemove = (index: number) => {
    const newFAQ = data.faq.filter((_, i) => i !== index);
    handleInputChange('faq', newFAQ);
  };

  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFAQ = [...data.faq];
    newFAQ[index] = { ...newFAQ[index], [field]: value };
    handleInputChange('faq', newFAQ);
  };

  const targetSizeOptions = [
    'スタートアップ',
    '50人規模の中小企業',
    '主婦',
    '個人事業主',
    '1000人規模の大企業'
  ];

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
            商材一覧に戻る
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isNew ? '新規商材作成' : (data.serviceName || '商材編集')}
            </h2>
            <p className="text-sm text-gray-600">商材の基本情報を設定します</p>
          </div>
        </div>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save size={16} />
          保存
        </button>
      </div>

      {/* 登録方法選択（新規作成時のみ） */}
      {isNew && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">登録方法を選択</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setRegistrationMethod('ai')}
              className={`p-6 rounded-lg border-2 transition-all ${
                registrationMethod === 'ai'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  registrationMethod === 'ai' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Sparkles className={`w-6 h-6 ${
                    registrationMethod === 'ai' ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">AI自動生成</h4>
                  <p className="text-sm text-gray-600">URLや資料からAIが自動生成</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 text-left space-y-1">
                <li>• 複数のURLを同時に解析</li>
                <li>• 資料アップロードに対応</li>
                <li>• 自動で商材情報を生成</li>
              </ul>
            </button>

            <button
              onClick={() => setRegistrationMethod('manual')}
              className={`p-6 rounded-lg border-2 transition-all ${
                registrationMethod === 'manual'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  registrationMethod === 'manual' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Building2 className={`w-6 h-6 ${
                    registrationMethod === 'manual' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">手動入力</h4>
                  <p className="text-sm text-gray-600">全ての情報を手動で入力</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 text-left space-y-1">
                <li>• 詳細な情報を直接入力</li>
                <li>• 完全にカスタマイズ可能</li>
                <li>• 既存の情報を活用</li>
              </ul>
            </button>
          </div>
        </div>
      )}

      {/* AI生成入力画面 */}
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
                  ファイルをドラッグ&ドロップするか、クリックして選択
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
              AIで商材情報を生成
            </button>
            <p className="text-xs text-gray-500 mt-2">
              URLまたは資料を追加してから生成してください
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
              <p className="text-sm text-gray-600">商材情報を解析・生成しています</p>
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
            <p>📄 資料を解析中...</p>
            <p>🔍 商材情報を抽出中...</p>
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
          {/* ヘッダー（保存ボタンなし） */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI生成結果の確認・編集</h2>
              <p className="text-sm text-gray-600">内容を確認して、必要に応じて編集してください</p>
            </div>
          </div>

          {/* 基本情報・概要 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              基本情報・概要
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サービス名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={generatedData.serviceName}
                  onChange={(e) => handlePreviewChange('serviceName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="サービス名を入力"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サービス概要 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={generatedData.serviceOverview}
                  onChange={(e) => handlePreviewChange('serviceOverview', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="サービスの概要を入力"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ユーザーのペインポイント
                </label>
                <textarea
                  value={generatedData.userPainPoints}
                  onChange={(e) => handlePreviewChange('userPainPoints', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ユーザーが抱える痛み・不満"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  解決したい課題
                </label>
                <textarea
                  value={generatedData.problemToSolve}
                  onChange={(e) => handlePreviewChange('problemToSolve', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="このサービスが解決する課題"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  解決方法
                </label>
                <textarea
                  value={generatedData.solutionFeatures}
                  onChange={(e) => handlePreviewChange('solutionFeatures', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="どのように解決するか、どのような課題解決ができるか"
                />
              </div>
            </div>
          </div>

          {/* 参照除外URL */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Link className="w-5 h-5 text-red-600" />
              参照除外URL
            </h3>
            <div className="space-y-2">
              {generatedData.excludeUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handlePreviewArrayChange('excludeUrls', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="参照から除外するURLを入力"
                  />
                  <button
                    type="button"
                    onClick={() => handlePreviewArrayRemove('excludeUrls', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handlePreviewArrayAdd('excludeUrls')}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus size={16} />
                除外URLを追加
              </button>
            </div>
          </div>

          {/* 競合 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              競合
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サービス1
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={generatedData.competitorInfo[0] || ''}
                    onChange={(e) => handlePreviewArrayChange('competitorInfo', 0, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="サービス名を入力"
                  />
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="競合サービスとの差別化のポイントを記載"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例：¥10,000/月"
                  />
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus size={16} />
                サービスを追加
              </button>
            </div>
          </div>

          {/* 導入事例 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-600" />
              導入事例
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  事例1
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="導入企業の業界名/企業名"
                  />
                  <textarea
                    value={generatedData.caseStudies[0] || ''}
                    onChange={(e) => handlePreviewArrayChange('caseStudies', 0, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="導入前の課題や導入後の効果を記載"
                  />
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="導入前の課題や導入後の効果を記載"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handlePreviewArrayAdd('caseStudies')}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus size={16} />
                導入事例を追加
              </button>
            </div>
          </div>

          {/* 業界 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              業界
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  業界1
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={generatedData.mainIndustries[0] || ''}
                    onChange={(e) => handlePreviewArrayChange('mainIndustries', 0, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="業界名を入力"
                  />
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="この業界の課題や特徴を記載"
                  />
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="この業界に対してどのような解決策を提供するか"
                  />
                  <textarea
                    value={generatedData.implementationBarriers}
                    onChange={(e) => handlePreviewChange('implementationBarriers', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="対象となるマーケットの規模（100万人規模の大企業、スタートアップ企業、上場企業）"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handlePreviewArrayAdd('mainIndustries')}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus size={16} />
                業界を追加
              </button>
            </div>
          </div>

          {/* FAQ / よくある質問と回答 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              FAQ / よくある質問と回答
            </h3>
            <div className="space-y-4">
              {generatedData.faq.map((faqItem, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">質問 {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handlePreviewFAQRemove(index)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={faqItem.question}
                      onChange={(e) => handlePreviewFAQChange(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="質問を入力"
                    />
                    <textarea
                      value={faqItem.answer}
                      onChange={(e) => handlePreviewFAQChange(index, 'answer', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="回答を入力"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handlePreviewFAQAdd}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus size={16} />
                FAQを追加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 基本情報（手動入力時） */}
      {registrationMethod === 'manual' && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サービス/商品名
              </label>
              <input
                type="text"
                value={data.serviceName}
                onChange={(e) => handleInputChange('serviceName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="管理用タイトルを入力"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サービス概要
            </label>
            <textarea
              value={data.serviceOverview}
              onChange={(e) => handleInputChange('serviceOverview', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="サービス・商品の概要を詳しく記入"
            />
          </div>
        </div>
      )}

      {/* 価値提案・差別化（手動入力時） */}
      {registrationMethod === 'manual' && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">価値提案・差別化</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USP (ユニークセールスプロポジション)
              </label>
              <textarea
                value={data.usp}
                onChange={(e) => handleInputChange('usp', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="独自の価値提案を記入"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  差別化ポイント
                </label>
                <textarea
                  value={data.differentiationPoints}
                  onChange={(e) => handleInputChange('differentiationPoints', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="差別化ポイント、選ばれる理由はなんですか？"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  優位ポイント
                </label>
                <textarea
                  value={data.advantagePoints}
                  onChange={(e) => handleInputChange('advantagePoints', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="優位ポイント、選ばれやすくなる理由はなんですか？"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 課題・解決策 */}
      {registrationMethod === 'manual' && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">課題・解決策</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サービス・商品を通し解決したい課題
              </label>
              <textarea
                value={data.problemToSolve}
                onChange={(e) => handleInputChange('problemToSolve', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="サービス・商品を通して解決したい課題"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ユーザーのペインポイント
              </label>
              <textarea
                value={data.userPainPoints}
                onChange={(e) => handleInputChange('userPainPoints', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ユーザーが抱えている痛み・不満"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                課題に対して提供する解決策
              </label>
              <textarea
                value={data.solutionOffered}
                onChange={(e) => handleInputChange('solutionOffered', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="課題に対して提供する解決策"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                解決方法
              </label>
              <textarea
                value={data.solutionFeatures}
                onChange={(e) => handleInputChange('solutionFeatures', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="提供サービスを供給することで、どのように課題解決できるか？"
              />
            </div>
          </div>
        </div>
      )}

      {/* 参照除外URL */}
      {registrationMethod === 'manual' && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">参照除外URL</h3>
          {data.excludeUrls.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleArrayChange('excludeUrls', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="参照から除外するURL"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove('excludeUrls', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Minus size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayAdd('excludeUrls')}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Plus size={16} />
            除外URLを追加
          </button>
        </div>
      )}

      {/* 競合サービス */}
      {registrationMethod === 'manual' && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">競合</h3>
          </div>
          
          {competitors.map((competitor, index) => (
            <div key={competitor.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">サービス {index + 1}</h4>
                {competitors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleCompetitorRemove(competitor.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-md"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    サービス名
                  </label>
                  <input
                    type="text"
                    value={competitor.service_name}
                    onChange={(e) => handleCompetitorChange(competitor.id, 'service_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="サービス名を入力"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    サービスURL
                  </label>
                  <input
                    type="url"
                    value={competitor.service_url}
                    onChange={(e) => handleCompetitorChange(competitor.id, 'service_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    競合サービスとの差別化ポイント/優位ポイント
                  </label>
                  <textarea
                    value={competitor.differentiation}
                    onChange={(e) => handleCompetitorChange(competitor.id, 'differentiation', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="競合を比較した際の自社の差別化ポイントを記載"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提供価格
                  </label>
                  <input
                    type="text"
                    value={competitor.price}
                    onChange={(e) => handleCompetitorChange(competitor.id, 'price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例：¥10,000／月"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleCompetitorAdd}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <Plus size={20} />
            ＋サービスを追加
          </button>
        </div>
      )}

      {/* 導入事例 */}
      {registrationMethod === 'manual' && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">導入事例</h3>
          </div>
          
          {caseStudies.map((caseStudy, index) => (
            <div key={caseStudy.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">事例 {index + 1}</h4>
                {caseStudies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleCaseStudyRemove(caseStudy.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-md"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    導入先名／企業名
                  </label>
                  <input
                    type="text"
                    value={caseStudy.case_name}
                    onChange={(e) => handleCaseStudyChange(caseStudy.id, 'case_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="導入先の企業名を入力"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    導入の背景・課題
                  </label>
                  <textarea
                    value={caseStudy.background}
                    onChange={(e) => handleCaseStudyChange(caseStudy.id, 'background', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="導入に至った背景や抱えていた課題を入力"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    成果・効果（定量／定性）
                  </label>
                  <textarea
                    value={caseStudy.outcome}
                    onChange={(e) => handleCaseStudyChange(caseStudy.id, 'outcome', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="導入後の具体的な成果や効果を入力"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleCaseStudyAdd}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <Plus size={20} />
            ＋導入事例を追加
          </button>
        </div>
      )}

      {/* 業界 */}
      {registrationMethod === 'manual' && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">業界</h3>
          </div>
          
          {industries.map((industry, index) => (
            <div key={industry.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">業界 {index + 1}</h4>
                {industries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleIndustryRemove(industry.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-md"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    業界名
                  </label>
                  <input
                    type="text"
                    value={industry.industry_name}
                    onChange={(e) => handleIndustryChange(industry.id, 'industry_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="業界名を入力"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    解決策の特徴（手段／形式）
                  </label>
                  <textarea
                    value={industry.solution_features || ''}
                    onChange={(e) => handleIndustryChange(industry.id, 'solution_features', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="この業界向けの解決策の特徴や手段を入力"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    業種・業界が抱えている課題
                  </label>
                  <textarea
                    value={industry.industry_challenges}
                    onChange={(e) => handleIndustryChange(industry.id, 'industry_challenges', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="その業種・業界では、どのような課題を抱えているか？"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ターゲットの規模感
                  </label>
                  <input
                    type="text"
                    value={industry.target_size}
                    onChange={(e) => handleIndustryChange(industry.id, 'target_size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="対象とするターゲットの規模感 (例:1000人規模の大企業,スタートアップ,個人事業主,主婦)"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleIndustryAdd}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <Plus size={20} />
            ＋業界を追加
          </button>
        </div>
      )}

      {/* FAQ */}
      {registrationMethod === 'manual' && !showPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">FAQ／よくある質問と回答</h3>
          {data.faq.map((faq, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">FAQ {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleFAQRemove(index)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <Minus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="よくある質問を入力"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="質問に対する回答を入力（AI執筆時に自然な文脈で挿入可能）"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleFAQAdd}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Plus size={16} />
            FAQを追加
          </button>
        </div>
      )}
    </div>
  );
};