import React, { useState, useEffect } from 'react';
import { X, FileText, User, Loader2, CheckCircle } from 'lucide-react';
import { Keyword } from '../types/keyword';
import { PersonData } from '../types';
import { generateArticle, generateBulkArticles, Article } from '../utils/articleGenerator';

interface ArticleGenerationModalProps {
  keywords: Keyword[];
  authors: PersonData[];
  mode: 'single' | 'bulk';
  onClose: () => void;
  onComplete: (articles: Article[]) => void;
}

export const ArticleGenerationModal: React.FC<ArticleGenerationModalProps> = ({
  keywords,
  authors,
  mode,
  onClose,
  onComplete
}) => {
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [generatedArticles, setGeneratedArticles] = useState<Article[]>([]);

  const selectedAuthor = authors.find(a => a.id === selectedAuthorId);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress({ completed: 0, total: keywords.length });

    try {
      if (mode === 'single') {
        const article = await generateArticle(keywords[0], selectedAuthor);
        setGeneratedArticles([article]);
        onComplete([article]);
      } else {
        const articles = await generateBulkArticles(
          keywords,
          selectedAuthor,
          (completed, total) => setProgress({ completed, total })
        );
        setGeneratedArticles(articles);
        onComplete(articles);
      }

      // 生成完了後、少し待ってからモーダルを閉じる
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Article generation failed:', error);
      alert('記事生成中にエラーが発生しました');
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="text-purple-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'single' ? '記事生成' : 'バルク記事生成'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isGenerating}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
          {!isGenerating ? (
            <>
              {/* 対象キーワード */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  生成対象キーワード ({keywords.length}件)
                </h3>
                <div className="border border-gray-200 rounded-md p-4 max-h-48 overflow-y-auto">
                  {keywords.map(kw => (
                    <div key={kw.id} className="py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{kw.parentKeyword}</span>
                          <span className="text-gray-500"> / </span>
                          <span>{kw.childKeyword}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          kw.keywordType === '意思決定KW' ? 'bg-red-100 text-red-800' :
                          kw.keywordType === '比較KW' ? 'bg-orange-100 text-orange-800' :
                          kw.keywordType === '関心KW' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {kw.keywordType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 著者選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline mr-1" size={16} />
                  著者を選択（任意）
                </label>
                <select
                  value={selectedAuthorId}
                  onChange={(e) => setSelectedAuthorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">著者なし（デフォルトスタイル）</option>
                  {authors.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.name} - {author.position}
                    </option>
                  ))}
                </select>
                {selectedAuthor && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                    <p className="text-gray-700">{selectedAuthor.profile}</p>
                    <p className="text-gray-500 mt-1">
                      専門分野: {selectedAuthor.expertiseGenre}
                    </p>
                  </div>
                )}
              </div>

              {/* 生成設定の説明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium text-blue-900 mb-2">記事生成について</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• キーワードの種別に応じた記事構成を自動生成</li>
                  <li>• h2見出し構成に基づいてコンテンツを作成</li>
                  <li>• 著者を選択すると、その人物の特徴を反映した文体で生成</li>
                  {mode === 'bulk' && (
                    <li>• 複数記事を順次生成（1記事あたり約2秒）</li>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* 生成中の表示 */}
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto mb-4 text-purple-600" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  記事を生成中...
                </h3>
                {mode === 'bulk' && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">
                      {progress.completed} / {progress.total} 件完了
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(progress.completed / progress.total) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-4">
                  しばらくお待ちください...
                </p>
              </div>

              {/* 生成済み記事のリスト */}
              {generatedArticles.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    生成完了した記事
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {generatedArticles.map(article => (
                      <div
                        key={article.id}
                        className="flex items-center gap-2 p-2 bg-green-50 rounded-md"
                      >
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-sm text-gray-700">
                          {article.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          {!isGenerating ? (
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
              >
                <FileText size={16} />
                {mode === 'single' ? '記事を生成' : `${keywords.length}件の記事を生成`}
              </button>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500">
              生成中はこのウィンドウを閉じないでください
            </div>
          )}
        </div>
      </div>
    </div>
  );
};