import React, { useState } from 'react';
import { Keyword } from '../types/keyword';
import { PersonData } from '../types';
import { KeywordList } from './KeywordList';
import { KeywordEditForm } from './KeywordEditForm';
import { KeywordGenerateModal } from './KeywordGenerateModal';
import { ArticleGenerationModal } from './ArticleGenerationModal';
import { Sparkles } from 'lucide-react';
import { generateKeywords } from '../utils/keywordGenerator';
import { parseCSV } from '../utils/csvUtils';
import { Article } from '../utils/articleGenerator';

interface KeywordManagementProps {
  products: any[];
  targets: any[];
  authors: any[];
}

export const KeywordManagement: React.FC<KeywordManagementProps> = ({ products, targets, authors }) => {
  const [keywordView, setKeywordView] = useState<'list' | 'edit'>('list');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [showKeywordGenerateModal, setShowKeywordGenerateModal] = useState(false);
  const [articleGenerationMode, setArticleGenerationMode] = useState<'single' | 'bulk' | null>(null);
  const [selectedKeywordsForArticle, setSelectedKeywordsForArticle] = useState<Keyword[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const handleCreateNewKeyword = () => {
    const newKeyword: Keyword = {
      id: Date.now().toString(),
      parentKeyword: '',
      childKeyword: '',
      keywordType: '関心KW',
      target: '',
      searchIntent: '',
      articleType: 'お役立ち情報',
      h2Structure: [],
      currentRank: undefined,
      cvContribution: undefined,
      isArticleCreated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingKeyword(newKeyword);
    setKeywordView('edit');
  };

  const handleEditKeyword = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setKeywordView('edit');
  };

  const handleDeleteKeyword = (keywordId: string) => {
    if (confirm('このキーワードを削除してもよろしいですか？')) {
      setKeywords(prev => prev.filter(k => k.id !== keywordId));
    }
  };

  const handleDuplicateKeyword = (keyword: Keyword) => {
    const duplicated: Keyword = {
      ...keyword,
      id: Date.now().toString(),
      childKeyword: keyword.childKeyword + ' (コピー)',
      isArticleCreated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setKeywords(prev => [...prev, duplicated]);
  };

  const handleKeywordSave = () => {
    if (editingKeyword) {
      const existingIndex = keywords.findIndex(k => k.id === editingKeyword.id);
      if (existingIndex >= 0) {
        setKeywords(prev => {
          const updated = [...prev];
          updated[existingIndex] = {
            ...editingKeyword,
            updatedAt: new Date().toISOString()
          };
          return updated;
        });
      } else {
        setKeywords(prev => [...prev, editingKeyword]);
      }
    }
    setKeywordView('list');
    setEditingKeyword(null);
  };

  const handleKeywordCancel = () => {
    setKeywordView('list');
    setEditingKeyword(null);
  };

  const handleGenerateKeywords = (productId: string, targetId: string) => {
    const product = products.find(p => p.id === productId);
    const target = targets.find(t => t.id === targetId);

    if (product && target) {
      const productData = {
        id: product.id,
        serviceName: product.serviceName,
        serviceOverview: product.serviceOverview,
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
      };

      const generatedKeywords = generateKeywords(productData, target);
      setKeywords(prev => [...prev, ...generatedKeywords]);
      setShowKeywordGenerateModal(false);
      alert(`${generatedKeywords.length}件のキーワードを生成しました`);
    }
  };

  const handleGenerateArticle = (keywordId: string) => {
    const keyword = keywords.find(k => k.id === keywordId);
    if (keyword) {
      setSelectedKeywordsForArticle([keyword]);
      setArticleGenerationMode('single');
    }
  };

  const handleBulkGenerateArticles = (keywordIds: string[]) => {
    const selectedKeywords = keywords.filter(k => keywordIds.includes(k.id));
    setSelectedKeywordsForArticle(selectedKeywords);
    setArticleGenerationMode('bulk');
  };

  const handleArticleGenerationComplete = (generatedArticles: Article[]) => {
    setArticles(prev => [...prev, ...generatedArticles]);

    const articleKeywordIds = generatedArticles.map(a => a.keywordId);
    setKeywords(prev => prev.map(k =>
      articleKeywordIds.includes(k.id)
        ? { ...k, isArticleCreated: true, updatedAt: new Date().toISOString() }
        : k
    ));

    alert(`${generatedArticles.length}件の記事を生成しました`);
    setArticleGenerationMode(null);
    setSelectedKeywordsForArticle([]);
  };

  const handleImportCSV = async (file: File) => {
    try {
      const text = await file.text();
      const importedKeywords = parseCSV(text);
      setKeywords(prev => [...prev, ...importedKeywords]);
      alert(`${importedKeywords.length}件のキーワードをインポートしました`);
    } catch (error) {
      console.error('CSV import failed:', error);
      alert('CSVのインポートに失敗しました');
    }
  };

  return (
    <>
      {keywordView === 'list' ? (
        <>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowKeywordGenerateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Sparkles size={16} />
              AIでキーワード生成
            </button>
          </div>
          <KeywordList
            keywords={keywords}
            onCreateNew={handleCreateNewKeyword}
            onEdit={handleEditKeyword}
            onDelete={handleDeleteKeyword}
            onDuplicate={handleDuplicateKeyword}
            onGenerateArticle={handleGenerateArticle}
            onBulkGenerateArticles={handleBulkGenerateArticles}
            onImportCSV={handleImportCSV}
          />
        </>
      ) : (
        <KeywordEditForm
          keyword={editingKeyword!}
          onChange={setEditingKeyword}
          onSave={handleKeywordSave}
          onCancel={handleKeywordCancel}
          isNew={!keywords.find(k => k.id === editingKeyword?.id)}
        />
      )}

      {showKeywordGenerateModal && (
        <KeywordGenerateModal
          products={products}
          targets={targets}
          onGenerate={handleGenerateKeywords}
          onClose={() => setShowKeywordGenerateModal(false)}
        />
      )}

      {articleGenerationMode && (
        <ArticleGenerationModal
          keywords={selectedKeywordsForArticle}
          authors={authors}
          mode={articleGenerationMode}
          onClose={() => {
            setArticleGenerationMode(null);
            setSelectedKeywordsForArticle([]);
          }}
          onComplete={handleArticleGenerationComplete}
        />
      )}
    </>
  );
};