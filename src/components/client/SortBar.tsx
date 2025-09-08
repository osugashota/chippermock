import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

export type SortDirection = 'asc' | 'desc';

export interface TableSortState {
  sortKey: string;
  sortDirection: SortDirection;
}

interface SortBarProps {
  viewMode?: 'hierarchy' | 'table';
  tableSortState?: TableSortState;
  onTableSortChange?: (state: TableSortState) => void;
}

export const SortBar: React.FC<SortBarProps> = ({
  viewMode = 'table',
  tableSortState,
  onTableSortChange
}) => {
  // テーブル表示用のソートオプション
  const tableSortOptions = [
    { value: 'companyName', label: '会社名' },
    { value: 'clientName', label: 'クライアント' },
    { value: 'status', label: 'ステータス' },
    { value: 'subscription', label: 'プラン' },
    { value: 'usageSitesPct', label: 'サイト使用率' },
    { value: 'usagePointsPct', label: 'ポイント使用率' },
    { value: 'proxyLogin', label: '代理ログイン' },
    { value: 'lastLoginDate', label: '最終ログイン日時' },
    { value: 'createdDate', label: '作成日' },
    { value: 'lastUpdatedDate', label: '最終更新日' }
  ];

  const handleTableReset = () => {
    if (onTableSortChange) {
      onTableSortChange({
        sortKey: 'companyName',
        sortDirection: 'asc'
      });
    }
  };

  const toggleDirection = (current: SortDirection): SortDirection => {
    return current === 'asc' ? 'desc' : 'asc';
  };

  if (tableSortState && onTableSortChange) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-5 h-5 text-gray-500" />
            <h3 className="font-bold text-gray-900">並び替え</h3>
          </div>
          <button
            onClick={handleTableReset}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>並び順リセット</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] max-w-md">
            <label className="block text-xs font-medium text-gray-700 mb-2">テーブルの並び順</label>
            <div className="flex space-x-2">
              <select
                value={tableSortState.sortKey}
                onChange={(e) => onTableSortChange({
                  ...tableSortState,
                  sortKey: e.target.value
                })}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tableSortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onTableSortChange({
                  ...tableSortState,
                  sortDirection: toggleDirection(tableSortState.sortDirection)
                })}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  tableSortState.sortDirection === 'asc'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-orange-50 border-orange-200 text-orange-600'
                }`}
                title={tableSortState.sortDirection === 'asc' ? '昇順' : '降順'}
              >
                {tableSortState.sortDirection === 'asc' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};