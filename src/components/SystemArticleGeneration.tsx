import React, { useState, useEffect } from 'react';
import { ProductSummary, TargetData, PersonData } from '../types';
import { 
  FileText, 
  Settings, 
  ChevronDown, 
  Search, 
  Zap, 
  User, 
  Target, 
  Globe, 
  BarChart3, 
  Plus, 
  Minus,
  Upload,
  Link,
  X,
  Loader2,
  Package,
  Eye,
  EyeOff,
  Languages,
  HelpCircle,
  Sparkles,
  Database,
  FileUp,
  MessageSquare,
  UserCheck,
  Edit,
  Save
} from 'lucide-react';

interface SystemArticleGenerationProps {
  products: ProductSummary[];
  targets: TargetData[];
  authors: PersonData[];
}

export const SystemArticleGeneration: React.FC<SystemArticleGenerationProps> = ({
  products,
  targets,
  authors
}) => {
  const [keywords, setKeywords] = useState(['']);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [useTopArticles, setUseTopArticles] = useState(true);
  const [showReferences, setShowReferences] = useState(true);
  const [selectedReferenceDB, setSelectedReferenceDB] = useState('');
  const [selectedWriteDB, setSelectedWriteDB] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [activeTargetTab, setActiveTargetTab] = useState<'basic' | 'detailed'>('basic');
  const [showTargetEdit, setShowTargetEdit] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetData | null>(null);
  const [urls, setUrls] = useState(['']);
  const [files, setFiles] = useState<File[]>([]);
  const [referenceIntent, setReferenceIntent] = useState('');
  const [showFAQ, setShowFAQ] = useState(true);
  const [showAuthorSchema, setShowAuthorSchema] = useState(true);
  const [outputLanguage, setOutputLanguage] = useState('ja');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingDetailedSettings, setIsEditingDetailedSettings] = useState(false);
  const [editedBasicInfo, setEditedBasicInfo] = useState<Partial<TargetData>>({});
  const [editedDetailedSettings, setEditedDetailedSettings] = useState({
    searchIntent: '',
    knowledgeLevel: '',
    benefitsFromArticle: '',
    keywordTrends: '',
    informationStyle: '',
    differenceFromSimilar: '',
    doubtPoints: ''
  });

  const handleKeywordAdd = () => {
    setKeywords(prev => [...prev, '']);
  };

  const handleKeywordChange = (index: number, value: string) => {
    setKeywords(prev => prev.map((keyword, i) => i === index ? value : keyword));
  };

  const handleKeywordRemove = (index: number) => {
    setKeywords(prev => prev.filter((_, i) => i !== index));
  };

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    const validFiles = uploadedFiles.filter(file => file.size <= 15 * 1024 * 1024); // 15MB制限
    setFiles([...files, ...validFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleTargetEdit = () => {
    const target = targets.find(t => t.id === selectedTargetId);
    if (target) {
      setEditingTarget(target);
      setShowTargetEdit(true);
    }
  };

  const handleTargetSave = (updatedTarget: TargetData) => {
    console.log('Updated target:', updatedTarget);
    setShowTargetEdit(false);
    setEditingTarget(null);
  };

  const handleTargetCancel = () => {
    setShowTargetEdit(false);
    setEditingTarget(null);
  };

  const handleBasicInfoEdit = () => {
    if (selectedTarget) {
      setEditedBasicInfo({
        name: selectedTarget.name,
        jobIndustryCategory: selectedTarget.jobIndustryCategory,
        targetAudience: selectedTarget.targetAudience,
        userNeeds: selectedTarget.userNeeds,
        searcherChallenges: selectedTarget.searcherChallenges
      });
      setIsEditingBasicInfo(true);
    }
  };

  const handleBasicInfoSave = () => {
    // ここで実際の保存処理を実装
    console.log('基本情報保存:', editedBasicInfo);
    setIsEditingBasicInfo(false);
    alert('基本情報が保存されました');
  };

  const handleBasicInfoCancel = () => {
    setIsEditingBasicInfo(false);
    setEditedBasicInfo({});
  };

  const handleDetailedSettingsEdit = () => {
    setIsEditingDetailedSettings(true);
  };

  const handleDetailedSettingsSave = () => {
    // ここで実際の保存処理を実装
    console.log('詳細設定保存:', editedDetailedSettings);
    setIsEditingDetailedSettings(false);
    alert('詳細設定が保存されました');
  };

  const handleDetailedSettingsCancel = () => {
    setIsEditingDetailedSettings(false);
    setEditedDetailedSettings({
      searchIntent: '',
      knowledgeLevel: '',
      benefitsFromArticle: '',
      keywordTrends: '',
      informationStyle: '',
      differenceFromSimilar: '',
      doubtPoints: ''
    });
  };

  const handleGenerate = async () => {
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

      const generationData = {
        keywords: keywords.filter(k => k.trim() !== ''),
        model: selectedModel,
        useTopArticles,
        showReferences,
        referenceDB: selectedReferenceDB,
        writeDB: selectedWriteDB,
        authorId: selectedAuthorId,
        targetId: selectedTargetId,
        urls: urls.filter(url => url.trim() !== ''),
        files,
        referenceIntent,
        showFAQ,
        showAuthorSchema,
        outputLanguage
      };
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      console.log('記事生成データ:', generationData);
      alert('記事生成が完了しました！');
    } catch (error) {
      console.error('記事生成エラー:', error);
      alert('記事生成中にエラーが発生しました。');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const selectedAuthor = authors.find(a => a.id === selectedAuthorId);
  const selectedTarget = targets.find(t => t.id === selectedTargetId);

  const languageOptions = [
    { value: 'ja', label: '日本語', flag: '🇯🇵' },
    { value: 'en', label: 'English（英語）', flag: '🇺🇸' },
    { value: 'ko', label: '한국어（韓国語）', flag: '🇰🇷' },
    { value: 'zh-cn', label: '中文简体（簡体字）', flag: '🇨🇳' },
    { value: 'zh-tw', label: '中文繁體（繁體字）', flag: '🇹🇼' },
    { value: 'vi', label: 'tiếng việt（ベトナム語）', flag: '🇻🇳' },
    { value: 'es', label: 'Español（スペイン語）', flag: '🇪🇸' },
    { value: 'ru', label: 'Русский（ロシア語）', flag: '🇷🇺' },
    { value: 'ar', label: 'العربية（アラビア語）', flag: '🇸🇦' },
    { value: 'fr', label: 'Français（フランス語）', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch（ドイツ語）', flag: '🇩🇪' },
    { value: 'pt', label: 'Português（ポルトガル語）', flag: '🇵🇹' },
    { value: 'it', label: 'Italiano（イタリア語）', flag: '🇮🇹' },
    { value: 'hi', label: 'हिन्दी（ヒンディー語）', flag: '🇮🇳' },
    { value: 'id', label: 'Bahasa Indonesia（インドネシア語）', flag: '🇮🇩' }
  ];

  const referenceIntentOptions = [
    { value: 'background', label: '背景情報として参照' },
    { value: 'evidence', label: '根拠・エビデンスとして活用' },
    { value: 'example', label: '具体例として引用' },
    { value: 'comparison', label: '比較対象として使用' },
    { value: 'supplement', label: '補足情報として追加' }
  ];

  // ターゲット編集画面の表示
  if (showTargetEdit && editingTarget) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="relative bg-white/80 backdrop-blur-sm border-b border-green-200 px-6 py-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                ターゲット編集
              </h1>
              <p className="text-sm text-green-600 font-medium">選択したターゲット情報を編集できます</p>
            </div>
          </div>
        </div>

        <div className="relative p-6 max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-green-100 relative overflow-hidden">
            {/* カード内装飾 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-50 -translate-y-16 translate-x-16"></div>
            
            <div className="relative flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{editingTarget.name}</h2>
                  <p className="text-sm text-green-600 font-medium">ターゲット情報の詳細編集</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleTargetCancel}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => handleTargetSave(editingTarget)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  保存して戻る
                </button>
              </div>
            </div>

            <div className="relative space-y-8">
              {/* 基本情報 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  基本情報
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-3">
                      ターゲット名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingTarget.name}
                      onChange={(e) => setEditingTarget(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="ターゲット名を入力"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-3">
                      職種・業界カテゴリ
                    </label>
                    <input
                      type="text"
                      value={editingTarget.jobIndustryCategory}
                      onChange={(e) => setEditingTarget(prev => prev ? { ...prev, jobIndustryCategory: e.target.value } : null)}
                      className="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="例：IT業界、マーケティング職"
                    />
                  </div>
                </div>
              </div>

              {/* 詳細情報 */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  詳細情報
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-3">
                      想定読者 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={editingTarget.targetAudience}
                      onChange={(e) => setEditingTarget(prev => prev ? { ...prev, targetAudience: e.target.value } : null)}
                      rows={3}
                      className="w-full px-4 py-3 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                      placeholder="具体的な想定読者像を入力"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-3">
                      ユーザーニーズ
                    </label>
                    <textarea
                      value={editingTarget.userNeeds}
                      onChange={(e) => setEditingTarget(prev => prev ? { ...prev, userNeeds: e.target.value } : null)}
                      rows={3}
                      className="w-full px-4 py-3 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                      placeholder="ユーザーが求めている情報・解決策"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-3">
                      検索者が持つ課題
                    </label>
                    <textarea
                      value={editingTarget.searcherChallenges}
                      onChange={(e) => setEditingTarget(prev => prev ? { ...prev, searcherChallenges: e.target.value } : null)}
                      rows={3}
                      className="w-full px-4 py-3 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                      placeholder="困っていること、解決したいこと"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-3">
                        検索意図
                      </label>
                      <input
                        type="text"
                        value={editingTarget.searchIntent || ''}
                        onChange={(e) => setEditingTarget(prev => prev ? { ...prev, searchIntent: e.target.value } : null)}
                        className="w-full px-4 py-3 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="情報収集、比較検討など"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-3">
                        知識レベル
                      </label>
                      <input
                        type="text"
                        value={editingTarget.knowledgeLevel || ''}
                        onChange={(e) => setEditingTarget(prev => prev ? { ...prev, knowledgeLevel: e.target.value } : null)}
                        className="w-full px-4 py-3 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="初心者、中級者、上級者など"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 生成中画面
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI記事生成中...</h1>
              <p className="text-sm text-gray-600">高品質な記事を生成しています</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center min-h-[80vh]">
          <div className="bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">生成中</h3>
                  <p className="text-gray-600">AIが記事を作成しています</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>キーワード分析中...</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>コンテンツ構成を作成中...</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>記事本文を生成中...</span>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                通常1-3分程度で完了します
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">システム記事生成</h1>
            <p className="text-sm text-gray-600">AIを活用した高品質な記事を生成します</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* キーワード入力 */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">キーワード設定</h2>
              <p className="text-sm text-gray-600">記事のメインキーワードを設定してください</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {keywords.map((keyword, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => handleKeywordChange(index, e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={`キーワード ${index + 1}`}
                  />
                </div>
                {keywords.length > 1 && (
                  <button
                    onClick={() => handleKeywordRemove(index)}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleKeywordAdd}
              className="flex items-center gap-2 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium"
            >
              <Plus size={18} />
              キーワードを追加
            </button>
          </div>
        </div>

        {/* AI設定セクション */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* モデル選択 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">AIモデル選択</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="model"
                  value="gpt-4o"
                  checked={selectedModel === 'gpt-4o'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mr-3 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">ChatGPT-4o</div>
                  <div className="text-sm text-gray-600">最新の高性能モデル</div>
                </div>
              </label>
              <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="model"
                  value="claude-4-sonnet"
                  checked={selectedModel === 'claude-4-sonnet'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mr-3 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">Claude 4.0 Sonnet</div>
                  <div className="text-sm text-gray-600">高品質な文章生成</div>
                </div>
              </label>
            </div>
          </div>

          {/* 参照設定 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">参照設定</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">上位記事参照</div>
                  <div className="text-sm text-gray-600">検索上位の記事を参考にします</div>
                </div>
                <button
                  onClick={() => setUseTopArticles(!useTopArticles)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useTopArticles ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useTopArticles ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">参照元表示</div>
                  <div className="text-sm text-gray-600">参照した情報源を表示します</div>
                </div>
                <button
                  onClick={() => setShowReferences(!showReferences)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showReferences ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showReferences ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* データベース設定 */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Database className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">データベース設定</h2>
              <p className="text-sm text-gray-600">記事生成に使用するデータベースを選択してください</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 参照DB */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                <Database className="inline w-4 h-4 mr-1" />
                商材DB
              </label>
              <div className="relative">
                <select
                  value={selectedReferenceDB}
                  onChange={(e) => setSelectedReferenceDB(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                >
                  <option value="">商材を選択してください</option>
                  <option value="db1">データベース1</option>
                  <option value="db2">データベース2</option>
                  <option value="db3">データベース3</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 書き込みDB */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                <Database className="inline w-4 h-4 mr-1" />
                著者DB
              </label>
              <div className="relative">
                <select
                  value={selectedWriteDB}
                  onChange={(e) => setSelectedWriteDB(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                >
                  <option value="">著者を選択してください</option>
                  <option value="db1">データベース1</option>
                  <option value="db2">データベース2</option>
                  <option value="db3">データベース3</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ターゲット設定 */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">ターゲット設定</h2>
              <p className="text-sm text-gray-600">記事のターゲット読者を設定してください</p>
            </div>
          </div>

          {/* ターゲットDB選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Target className="inline w-4 h-4 mr-1" />
              ターゲットDB
            </label>
            <div className="relative">
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">ターゲットを選択してください</option>
                {targets.map(target => (
                  <option key={target.id} value={target.id}>
                    {target.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 選択されたターゲットの情報表示 */}
          {selectedTarget && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-green-900">{selectedTarget.name}</h3>
                  <p className="text-sm text-green-700">{selectedTarget.jobIndustryCategory}</p>
                </div>
                <button
                  onClick={handleTargetEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                  編集
                </button>
              </div>

              {/* タブナビゲーション */}
              <div className="flex border-b border-green-200 mb-4">
                <button
                  onClick={() => setActiveTargetTab('basic')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTargetTab === 'basic'
                      ? 'text-green-700 border-b-2 border-green-600'
                      : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  ターゲット基本情報
                </button>
                <button
                  onClick={() => setActiveTargetTab('detailed')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTargetTab === 'detailed'
                      ? 'text-green-700 border-b-2 border-green-600'
                      : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  記事生成詳細設定
                </button>
              </div>

              {/* タブコンテンツ */}
              {activeTargetTab === 'basic' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-green-900">ターゲット基本情報</h4>
                    {!isEditingBasicInfo ? (
                      <button
                        onClick={handleBasicInfoEdit}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                      >
                        <Edit className="w-4 h-4" />
                        編集
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleBasicInfoCancel}
                          className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={handleBasicInfoSave}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          保存
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">名称（管理用タイトル）</p>
                      {isEditingBasicInfo ? (
                        <input
                          type="text"
                          value={editedBasicInfo.name || ''}
                          onChange={(e) => setEditedBasicInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {selectedTarget.name || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">職種／業界カテゴリ</p>
                      {isEditingBasicInfo ? (
                        <input
                          type="text"
                          value={editedBasicInfo.jobIndustryCategory || ''}
                          onChange={(e) => setEditedBasicInfo(prev => ({ ...prev, jobIndustryCategory: e.target.value }))}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {selectedTarget.jobIndustryCategory || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">ターゲット詳細</p>
                      {isEditingBasicInfo ? (
                        <textarea
                          value={editedBasicInfo.targetAudience || ''}
                          onChange={(e) => setEditedBasicInfo(prev => ({ ...prev, targetAudience: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white resize-none"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {selectedTarget.targetAudience || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">ユーザーニーズ</p>
                      {isEditingBasicInfo ? (
                        <textarea
                          value={editedBasicInfo.userNeeds || ''}
                          onChange={(e) => setEditedBasicInfo(prev => ({ ...prev, userNeeds: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white resize-none"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {selectedTarget.userNeeds || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">検索者が持つ課題</p>
                      {isEditingBasicInfo ? (
                        <textarea
                          value={editedBasicInfo.searcherChallenges || ''}
                          onChange={(e) => setEditedBasicInfo(prev => ({ ...prev, searcherChallenges: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white resize-none"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {selectedTarget.searcherChallenges || '未設定'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTargetTab === 'detailed' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-green-900">記事生成詳細設定</h4>
                    {!isEditingDetailedSettings ? (
                      <button
                        onClick={handleDetailedSettingsEdit}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                      >
                        <Edit className="w-4 h-4" />
                        編集
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleDetailedSettingsCancel}
                          className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={handleDetailedSettingsSave}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          保存
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">ユーザーの検索意図</p>
                      {isEditingDetailedSettings ? (
                        <input
                          type="text"
                          value={editedDetailedSettings.searchIntent}
                          onChange={(e) => setEditedDetailedSettings(prev => ({ ...prev, searchIntent: e.target.value }))}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                          placeholder="例：情報収集、比較検討、購入検討"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {editedDetailedSettings.searchIntent || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">読み手の知識レベル・リテラシー</p>
                      {isEditingDetailedSettings ? (
                        <input
                          type="text"
                          value={editedDetailedSettings.knowledgeLevel}
                          onChange={(e) => setEditedDetailedSettings(prev => ({ ...prev, knowledgeLevel: e.target.value }))}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                          placeholder="例：用語は知っているが、実践は少ない"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {editedDetailedSettings.knowledgeLevel || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">記事を通して得られること</p>
                      {isEditingDetailedSettings ? (
                        <textarea
                          value={editedDetailedSettings.benefitsFromArticle}
                          onChange={(e) => setEditedDetailedSettings(prev => ({ ...prev, benefitsFromArticle: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white resize-none"
                          placeholder="読者が記事から得られる価値や知識"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {editedDetailedSettings.benefitsFromArticle || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">優先キーワード／タグの傾向</p>
                      {isEditingDetailedSettings ? (
                        <input
                          type="text"
                          value={editedDetailedSettings.keywordTrends}
                          onChange={(e) => setEditedDetailedSettings(prev => ({ ...prev, keywordTrends: e.target.value }))}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                          placeholder="検索されやすいキーワードの傾向"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {editedDetailedSettings.keywordTrends || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">情報摂取スタイル</p>
                      {isEditingDetailedSettings ? (
                        <select
                          value={editedDetailedSettings.informationStyle}
                          onChange={(e) => setEditedDetailedSettings(prev => ({ ...prev, informationStyle: e.target.value }))}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                        >
                          <option value="">選択してください</option>
                          <option value="能動的">能動的</option>
                          <option value="受動的">受動的</option>
                          <option value="混合">混合</option>
                        </select>
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {editedDetailedSettings.informationStyle || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">同類ターゲットとの差異</p>
                      {isEditingDetailedSettings ? (
                        <textarea
                          value={editedDetailedSettings.differenceFromSimilar}
                          onChange={(e) => setEditedDetailedSettings(prev => ({ ...prev, differenceFromSimilar: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white resize-none"
                          placeholder="他のターゲットとの違いや特徴"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {editedDetailedSettings.differenceFromSimilar || '未設定'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">疑いポイント（不信の壁）</p>
                      {isEditingDetailedSettings ? (
                        <textarea
                          value={editedDetailedSettings.doubtPoints}
                          onChange={(e) => setEditedDetailedSettings(prev => ({ ...prev, doubtPoints: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white resize-none"
                          placeholder="読者が「信じられない／胡散臭い」と感じやすい部分"
                        />
                      ) : (
                        <p className="text-sm text-green-800 bg-white/60 p-3 rounded-lg">
                          {editedDetailedSettings.doubtPoints || '未設定'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 著者設定 */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">著者設定</h2>
              <p className="text-sm text-gray-600">記事の執筆者を選択してください</p>
            </div>
          </div>

          {/* 著者DB選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <User className="inline w-4 h-4 mr-1" />
              著者DB
            </label>
            <div className="relative">
              <select
                value={selectedAuthorId}
                onChange={(e) => setSelectedAuthorId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
              >
                <option value="">著者を選択してください</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 選択された著者の情報表示 */}
          {selectedAuthor && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-900">{selectedAuthor.name}</h3>
                  <p className="text-sm text-purple-700">{selectedAuthor.jobTitle}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">専門分野</p>
                  <p className="text-sm text-purple-800 bg-white/60 p-3 rounded-lg">
                    {selectedAuthor.expertise || '未設定'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">経歴・実績</p>
                  <p className="text-sm text-purple-800 bg-white/60 p-3 rounded-lg">
                    {selectedAuthor.background || '未設定'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 追加リソース */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">追加リソース</h2>
              <p className="text-sm text-gray-600">URLやドキュメントを追加して記事の品質を向上させます</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* URL入力 */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <Link className="inline w-4 h-4 mr-1" />
                参考URL
              </label>
              {urls.map((url, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="https://example.com"
                    />
                  </div>
                  {urls.length > 1 && (
                    <button
                      onClick={() => handleUrlRemove(index)}
                      className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={handleUrlAdd}
                className="flex items-center gap-2 px-4 py-3 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors font-medium"
              >
                <Plus size={18} />
                URLを追加
              </button>
            </div>

            {/* ファイルアップロード */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <Upload className="inline w-4 h-4 mr-1" />
                ドキュメント（15MBまで）
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    ファイルをドラッグ&ドロップするか、下のボタンで選択
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, Word, PowerPoint, Excel, テキストファイルに対応
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  onChange={handleFileUpload}
                  className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">アップロード済みファイル:</p>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
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
          </div>

          {/* 参照意図 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <HelpCircle className="inline w-4 h-4 mr-1" />
              URL／ドキュメントを参照させる意図
            </label>
            <div className="relative">
              <select
                value={referenceIntent}
                onChange={(e) => setReferenceIntent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="">参照意図を選択してください</option>
                {referenceIntentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 出力設定 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 表示設定 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Eye className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">表示設定</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">FAQの表示</div>
                    <div className="text-sm text-gray-600">よくある質問を記事に含めます</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowFAQ(!showFAQ)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showFAQ ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showFAQ ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">著者情報スキーマの表示</div>
                    <div className="text-sm text-gray-600">著者の詳細情報を表示します</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowAuthorSchema(!showAuthorSchema)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showAuthorSchema ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showAuthorSchema ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 出力言語 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Languages className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">出力言語</h3>
            </div>
            <div className="relative">
              <select
                value={outputLanguage}
                onChange={(e) => setOutputLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 appearance-none bg-white"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.flag} {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 生成ボタン */}
        <div className="text-center pt-8">
          <button
            onClick={handleGenerate}
            disabled={keywords.filter(k => k.trim() !== '').length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-12 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <span>AI記事を生成する</span>
            </div>
          </button>
          <p className="text-sm text-gray-500 mt-4">
            キーワードを入力してから生成してください
          </p>
        </div>
      </div>
    </div>
  );
};