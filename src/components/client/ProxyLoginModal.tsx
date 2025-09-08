import React, { useState } from 'react';
import { Company } from '../../types/client';
import { X, LogIn, Shield, Clock, User } from 'lucide-react';

interface ProxyLoginModalProps {
  company: Company;
  onSave: (enabled: boolean) => void;
  onClose: () => void;
}

export const ProxyLoginModal: React.FC<ProxyLoginModalProps> = ({ company, onSave, onClose }) => {
  const [proxyLoginEnabled, setProxyLoginEnabled] = useState(company.proxyLoginEnabled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(proxyLoginEnabled);
  };

  const handleProxyLogin = (userId: string) => {
    // 実際の代理ログイン処理をここに実装
    console.log(`Proxy login for user: ${userId} in company: ${company.name}`);
    // セッション作成、リダイレクトなどの処理
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <LogIn className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">代理ログイン設定</h2>
              <p className="text-sm text-gray-600">{company.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 代理ログイン有効/無効 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Shield className="inline w-4 h-4 mr-1" />
              代理ログイン機能
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="proxyLogin"
                  value="enabled"
                  checked={proxyLoginEnabled}
                  onChange={() => setProxyLoginEnabled(true)}
                  className="mr-2"
                />
                <span className="text-sm">有効 - 管理者が代理でログイン可能</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="proxyLogin"
                  value="disabled"
                  checked={!proxyLoginEnabled}
                  onChange={() => setProxyLoginEnabled(false)}
                  className="mr-2"
                />
                <span className="text-sm">無効 - 代理ログインを禁止</span>
              </label>
            </div>
          </div>

          {/* 代理ログインが有効な場合の説明 */}
          {proxyLoginEnabled && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-900 mb-2">代理ログイン機能について</h3>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• 管理者がユーザーに代わってシステムにログインできます</li>
                <li>• セッションは24時間で自動的に期限切れになります</li>
                <li>• 代理ログインの履歴は記録され、監査可能です</li>
                <li>• ユーザーには代理ログインが行われたことが通知されます</li>
              </ul>
            </div>
          )}

          {/* アクティブなセッション */}
          {company.proxyLoginSessions && company.proxyLoginSessions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                アクティブなセッション
              </h3>
              <div className="space-y-2">
                {company.proxyLoginSessions.map(session => (
                  <div key={session.sessionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">セッション: {session.sessionId.slice(0, 8)}...</div>
                        <div className="text-xs text-gray-500">
                          開始: {new Date(session.createdAt).toLocaleString('ja-JP')}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:text-red-800"
                      onClick={() => {
                        // セッション終了処理
                        console.log(`Terminating session: ${session.sessionId}`);
                      }}
                    >
                      終了
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* セキュリティ注意事項 */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">セキュリティ注意事項</h3>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• 代理ログインは必要最小限の使用に留めてください</li>
              <li>• 機密情報へのアクセスには十分注意してください</li>
              <li>• 使用後は必ずセッションを終了してください</li>
              <li>• 不正使用を防ぐため、定期的に設定を見直してください</li>
            </ul>
          </div>

          {/* 会社情報 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">対象会社情報</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>会社名: {company.name}</p>
              <p>タイプ: {company.type === 'project' ? 'プロジェクト' : '会社'}</p>
              <p>現在の設定: {company.proxyLoginEnabled ? '有効' : '無効'}</p>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              設定を保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};