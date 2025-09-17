import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SettingsLayout } from '../settings/SettingsLayout';
import { SiteManagement } from '../settings/SiteManagement';
import { ClientManagement } from '../client/ClientManagement';
import { ProductManagement } from '../settings/ProductManagement';
import { KeywordManagement } from '../KeywordManagement';
import App from '../../App';
import { SystemArticleGeneration } from '../SystemArticleGeneration';
import { ErrorBoundary } from '../ErrorBoundary';

export const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // サンプルデータ（実際の実装では適切なデータソースから取得）
  const sampleProducts = [
    {
      id: '1',
      serviceName: 'AI記事作成ツール',
      target: 'マーケティング担当者',
      serviceOverview: 'AIを活用した高品質な記事作成支援ツール',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z',
      targetsCount: 3,
      authorsCount: 2
    }
  ];
  
  const sampleTargets = [
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
  ];
  
  const sampleAuthors = [
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
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'keyword-analysis':
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <KeywordManagement
              products={sampleProducts}
              targets={sampleTargets}
              authors={sampleAuthors}
            />
          </div>
        );
      case 'settings':
        return <SettingsLayout onNavigate={setCurrentView} />;
      case 'settings-sites':
        return <SiteManagement />;
      case 'settings-clients':
        return (
          <ErrorBoundary>
            <ClientManagement />
          </ErrorBoundary>
        );
      case 'settings-products':
        return <ProductManagement />;
      case 'system-prompt':
        return (
          <SystemArticleGeneration
            products={sampleProducts}
            targets={sampleTargets}
            authors={sampleAuthors}
          />
        );
      case 'product-management':
        return <App />;
      default:
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {getViewTitle(currentView)}
              </h2>
              <p className="text-gray-600">
                この機能は現在開発中です。商材登録システムは「システム記事生成」からアクセスできます。
              </p>
            </div>
          </div>
        );
    }
  };

  const getViewTitle = (view: string) => {
    const titles: { [key: string]: string } = {
      'dashboard': 'ダッシュボード',
      'keyword-analysis': 'キーワード分析',
      'competition-analysis': 'コンペティション分析',
      'performance': '記事一覧',
      'system-prompt': 'システム記事生成',
      'workshop': 'ワンショップ記事',
      'settings': '設定'
    };
    return titles[view] || view;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
        
        {/* フッター */}
        <footer className="bg-gray-900 text-white py-6">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-gray-900 font-bold text-xs">CD</span>
              </div>
              <span className="text-lg font-semibold">Creative Drive</span>
            </div>
            <div className="flex justify-center gap-6 text-sm text-gray-400 mb-3">
              <a href="#" className="hover:text-white transition-colors">コンテンツポリシー</a>
              <a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a>
              <a href="#" className="hover:text-white transition-colors">特定商取引法に基づく表記</a>
            </div>
            <p className="text-xs text-gray-500">
              Copyright (C) 2024 Chipper, Inc. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};