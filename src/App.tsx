import React, { useState } from 'react';
import { ProductData, TargetData, PersonData, ProductSummary } from './types';
import { ProductForm } from './components/ProductForm';
import { TargetList } from './components/TargetList';
import { TargetEditForm } from './components/TargetEditForm';
import { AuthorList } from './components/AuthorList';
import { AuthorEditForm } from './components/AuthorEditForm';
import { ProductList } from './components/ProductList';
import { Package, Users, User, Database } from 'lucide-react';

type MainView = 'products' | 'targets' | 'authors' | 'settings';
type SubView = 'list' | 'edit';

function App() {
  const [mainView, setMainView] = useState<MainView>('products');
  const [productView, setProductView] = useState<SubView>('list');
  const [targetView, setTargetView] = useState<SubView>('list');
  const [authorView, setAuthorView] = useState<SubView>('list');
  
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
  
  // サンプルデータ
  const [products, setProducts] = useState<ProductSummary[]>([
    {
      id: '1',
      serviceName: 'AI記事作成ツール',
      serviceOverview: 'AIを活用した高品質な記事作成支援ツール。SEO最適化機能付き。',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z',
      targetsCount: 3,
      authorsCount: 2
    },
    {
      id: '2',
      serviceName: 'クラウド会計ソフト',
      serviceOverview: '中小企業向けのクラウド型会計管理システム。自動仕訳機能搭載。',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T11:20:00Z',
      targetsCount: 2,
      authorsCount: 1
    }
  ]);

  const [targets, setTargets] = useState<TargetData[]>([
    {
      id: '1',
      productId: '1',
      name: 'マーケティング初心者',
      targetAudience: '記事作成に悩むマーケティング担当者',
      jobIndustryCategory: 'IT・マーケティング',
      userNeeds: '効率的な記事作成方法を知りたい',
      searcherChallenges: '記事作成に時間がかかりすぎる',
      searchIntent: '情報収集',
      knowledgeLevel: '初心者',
      benefitsFromArticle: 'AI活用による効率化手法',
      keywordTrends: 'AI記事作成、マーケティング自動化',
      informationStyle: '能動的',
      doubtPoints: 'AIで本当に良い記事が書けるのか',
      differenceFromSimilar: '実践重視'
    },
    {
      id: '2',
      productId: '2',
      name: '中小企業経営者',
      targetAudience: '会計業務を効率化したい経営者',
      jobIndustryCategory: '経営・管理',
      userNeeds: '会計業務の自動化',
      searcherChallenges: '手作業による会計処理の負担',
      searchIntent: '比較検討',
      knowledgeLevel: '中級者',
      benefitsFromArticle: 'クラウド会計の導入メリット',
      keywordTrends: 'クラウド会計、自動仕訳',
      informationStyle: '受動的',
      doubtPoints: 'セキュリティ面での不安',
      differenceFromSimilar: 'コスト重視'
    }
  ]);

  const [authors, setAuthors] = useState<PersonData[]>([
    {
      id: '1',
      productId: '1',
      name: '田中太郎',
      title: 'マーケティング専門家',
      position: 'シニアマーケター',
      companyName: 'Creative Drive株式会社',
      companyUrl: 'https://creativedrive.jp',
      profile: '10年以上のマーケティング経験を持つ専門家',
      speechCharacteristics: '丁寧語、読者目線',
      vocabularyTendency: '専門用語を適度に使用',
      pastArticles: ['https://creative-drive.jp/column/653/'],
      expertiseGenre: 'デジタルマーケティング',
      importantThinking: '実践的なアプローチ',
      valueSystem: '読者の成功を第一に考える',
      ngWords: ['絶対', '必ず'],
      authorPageUrl: '',
      qaData: [],
      readerRelationship: 'メンター'
    }
  ]);

  const [currentProduct, setCurrentProduct] = useState<ProductData>({
    id: '',
    serviceName: '',
    serviceOverview: '',
    excludeUrls: [''],
    usp: '',
    problemToSolve: '',
    userPainPoints: '',
    differentiationPoints: '',
    advantagePoints: '',
    commoditizationPoints: '',
    dropoutPoints: '',
    competitorInfo: [''],
    pricing: '',
    solutionOffered: '',
    caseStudies: [''],
    implementationEffects: '',
    beforeSituation: '',
    afterSituation: '',
    mainIndustries: [''],
    solutionFeatures: '',
    implementationBarriers: '',
    faq: []
  });

  // 商材管理
  const handleCreateNewProduct = () => {
    const newId = Date.now().toString();
    setCurrentProduct({
      id: newId,
      serviceName: '',
      target: '',
      serviceOverview: '',
      excludeUrls: [''],
      usp: '',
      problemToSolve: '',
      userPainPoints: '',
      differentiationPoints: '',
      advantagePoints: '',
      commoditizationPoints: '',
      dropoutPoints: '',
      competitorInfo: [''],
      pricing: '',
      solutionOffered: '',
      caseStudies: [''],
      implementationEffects: '',
      beforeSituation: '',
      afterSituation: '',
      mainIndustries: [''],
      solutionFeatures: '',
      implementationBarriers: '',
      faq: []
    });
    setEditingProductId(newId);
    setProductView('edit');
  };

  const handleEditProduct = (productId: string) => {
    const existingProduct = products.find(p => p.id === productId);
    if (existingProduct) {
      setCurrentProduct({
        id: existingProduct.id,
        serviceName: existingProduct.serviceName,
        serviceOverview: existingProduct.serviceOverview,
        excludeUrls: [''],
        usp: '',
        problemToSolve: '',
        userPainPoints: '',
        differentiationPoints: '',
        advantagePoints: '',
        commoditizationPoints: '',
        dropoutPoints: '',
        competitorInfo: [''],
        pricing: '',
        solutionOffered: '',
        caseStudies: [''],
        implementationEffects: '',
        beforeSituation: '',
        afterSituation: '',
        mainIndustries: [''],
        solutionFeatures: '',
        implementationBarriers: '',
        faq: []
      });
    }
    setEditingProductId(productId);
    setProductView('edit');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('この商材を削除してもよろしいですか？')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleProductSave = () => {
    const updatedProduct: ProductSummary = {
      id: currentProduct.id,
      serviceName: currentProduct.serviceName,
      serviceOverview: currentProduct.serviceOverview,
      createdAt: editingProductId && products.find(p => p.id === editingProductId)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetsCount: targets.filter(t => t.productId === currentProduct.id).length,
      authorsCount: authors.filter(a => a.productId === currentProduct.id).length
    };

    setProducts(prev => {
      const existing = prev.find(p => p.id === currentProduct.id);
      if (existing) {
        return prev.map(p => p.id === currentProduct.id ? updatedProduct : p);
      } else {
        return [...prev, updatedProduct];
      }
    });

    console.log('保存データ:', currentProduct);
    alert('データが保存されました');
    setProductView('list');
    setEditingProductId(null);
  };

  const handleProductBack = () => {
    setProductView('list');
    setEditingProductId(null);
  };

  // ターゲット管理
  const handleCreateNewTarget = () => {
    const newTarget: TargetData = {
      id: Date.now().toString(),
      productId: '',
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
    setTargets(prev => [...prev, newTarget]);
    setEditingTargetId(newTarget.id);
    setTargetView('edit');
  };

  const handleEditTarget = (targetId: string) => {
    setEditingTargetId(targetId);
    setTargetView('edit');
  };

  const handleDeleteTarget = (targetId: string) => {
    if (confirm('このターゲットを削除してもよろしいですか？')) {
      setTargets(prev => prev.filter(t => t.id !== targetId));
    }
  };

  const handleTargetSave = () => {
    setTargetView('list');
    setEditingTargetId(null);
    alert('ターゲット情報が保存されました');
  };

  const handleTargetBack = () => {
    setTargetView('list');
    setEditingTargetId(null);
  };

  // 著者管理
  const handleCreateNewAuthor = () => {
    const newAuthor: PersonData = {
      id: Date.now().toString(),
      productId: '', // 独立したので空文字
      name: '',
      title: '',
      position: '',
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
    setAuthors(prev => [...prev, newAuthor]);
    setEditingAuthorId(newAuthor.id);
    setAuthorView('edit');
  };

  const handleEditAuthor = (authorId: string) => {
    setEditingAuthorId(authorId);
    setAuthorView('edit');
  };

  const handleDeleteAuthor = (authorId: string) => {
    if (confirm('この著者を削除してもよろしいですか？')) {
      setAuthors(prev => prev.filter(a => a.id !== authorId));
    }
  };

  const handleAuthorSave = () => {
    setAuthorView('list');
    setEditingAuthorId(null);
    alert('著者情報が保存されました');
  };

  const handleAuthorBack = () => {
    setAuthorView('list');
    setEditingAuthorId(null);
  };

  // メインナビゲーション
  const mainNavItems = [
    { id: 'products', label: '商材管理', icon: Package, count: products.length },
    { id: 'targets', label: 'ターゲット管理', icon: Users, count: targets.length },
    { id: 'authors', label: '著者管理', icon: User, count: authors.length }
  ] as const;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
        {/* メインナビゲーション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setMainView(item.id)}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors relative ${
                      mainView === item.id
                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {item.count > 0 && item.id !== 'settings' && (
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                        mainView === item.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="transition-all duration-300">
          {/* 商材管理 */}
          {mainView === 'products' && (
            <>
              {productView === 'list' ? (
                <ProductList
                  products={products}
                  onCreateNew={handleCreateNewProduct}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              ) : (
                <ProductForm
                  data={currentProduct}
                  onChange={setCurrentProduct}
                  onBack={handleProductBack}
                  onSave={handleProductSave}
                  isNew={editingProductId === currentProduct.id && !products.find(p => p.id === currentProduct.id)}
                />
              )}
            </>
          )}

          {/* ターゲット管理 */}
          {mainView === 'targets' && (
            <>
              {targetView === 'list' ? (
                <TargetList
                  targets={targets}
                  onCreateNew={handleCreateNewTarget}
                  onEditTarget={handleEditTarget}
                  onDeleteTarget={handleDeleteTarget}
                />
              ) : (
                <TargetEditForm
                  target={targets.find(t => t.id === editingTargetId) || targets[0]}
                  products={products}
                  onChange={(target) => {
                    setTargets(prev => prev.map(t => t.id === target.id ? target : t));
                  }}
                  onBack={handleTargetBack}
                  onSave={handleTargetSave}
                  isNew={editingTargetId ? !targets.some(t => t.id === editingTargetId && t.name !== '') : false}
                />
              )}
            </>
          )}

          {/* 著者管理 */}
          {mainView === 'authors' && (
            <>
              {authorView === 'list' ? (
                <AuthorList
                  authors={authors}
                  onCreateNew={handleCreateNewAuthor}
                  onEditAuthor={handleEditAuthor}
                  onDeleteAuthor={handleDeleteAuthor}
                />
              ) : (
                <AuthorEditForm
                  author={authors.find(a => a.id === editingAuthorId) || authors[0]}
                  onChange={(author) => {
                    setAuthors(prev => prev.map(a => a.id === author.id ? author : a));
                  }}
                  onBack={handleAuthorBack}
                  onSave={handleAuthorSave}
                  isNew={!authors.find(a => a.id === editingAuthorId)}
                />
              )}
            </>
          )}
        </div>
    </div>
  );
}

export default App;