import React from 'react';
import { X, Filter } from 'lucide-react';

export interface FilterState {
  contractStatuses: string[];
  subscriptionPlans: string[];
  analyticsFeatures: string[];
  contractDateRange: {
    startFrom: string | null;
    startTo: string | null;
    endFrom: string | null;
    endTo: string | null;
  };
  loginDateRange: {
    from: string | null;
    to: string | null;
  };
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const contractStatusOptions = [
    { value: 'active', label: '契約中' },
    { value: 'inactive', label: '契約終了' },
    { value: 'suspended', label: '停止中' }
  ];

  const subscriptionPlanOptions = [
    { value: 'free', label: 'Free' },
    { value: 'basic', label: 'Basic' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  const analyticsOptions = [
    { value: 'analytics', label: '分析機能' },
    { value: 'heatmap', label: 'ヒートマップ' },
    { value: 'none', label: '無効' }
  ];

  const handleCheckboxChange = (category: 'contractStatuses' | 'subscriptionPlans' | 'analyticsFeatures', value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...filters,
      [category]: newValues
    });
  };

  const handleDateRangeChange = (
    category: 'contractDateRange' | 'loginDateRange',
    field: string,
    value: string
  ) => {
    const dateValue = value === '' ? null : value;
    
    if (category === 'contractDateRange') {
      onFilterChange({
        ...filters,
        contractDateRange: {
          ...filters.contractDateRange,
          [field]: dateValue
        }
      });
    } else {
      onFilterChange({
        ...filters,
        loginDateRange: {
          ...filters.loginDateRange,
          [field]: dateValue
        }
      });
    }
  };

  const clearFilters = () => {
    onFilterChange({
      contractStatuses: [],
      subscriptionPlans: [],
      analyticsFeatures: [],
      contractDateRange: {
        startFrom: null,
        startTo: null,
        endFrom: null,
        endTo: null
      },
      loginDateRange: {
        from: null,
        to: null
      }
    });
  };

  const hasActiveFilters = 
    filters.contractStatuses.length > 0 ||
    filters.subscriptionPlans.length > 0 ||
    filters.analyticsFeatures.length > 0 ||
    filters.contractDateRange.startFrom !== null ||
    filters.contractDateRange.startTo !== null ||
    filters.contractDateRange.endFrom !== null ||
    filters.contractDateRange.endTo !== null ||
    filters.loginDateRange.from !== null ||
    filters.loginDateRange.to !== null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">フィルター設定</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>すべてクリア</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {/* 契約ステータス */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-3">契約ステータス</label>
          <div className="space-y-1">
            {contractStatusOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.contractStatuses.includes(option.value)}
                  onChange={() => handleCheckboxChange('contractStatuses', option.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* サブスクプラン */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-3">サブスクプラン</label>
          <div className="space-y-1">
            {subscriptionPlanOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.subscriptionPlans.includes(option.value)}
                  onChange={() => handleCheckboxChange('subscriptionPlans', option.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 分析機能 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-3">分析機能</label>
          <div className="space-y-1">
            {analyticsOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.analyticsFeatures.includes(option.value)}
                  onChange={() => handleCheckboxChange('analyticsFeatures', option.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 日付フィルター */}
        <div className="bg-gray-50 p-4 rounded-lg col-span-1 lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">日付範囲</label>
          <div className="space-y-4">
            {/* 契約開始日 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">契約開始日</label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={filters.contractDateRange.startFrom || ''}
                  onChange={(e) => handleDateRangeChange('contractDateRange', 'startFrom', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">〜</span>
                <input
                  type="date"
                  value={filters.contractDateRange.startTo || ''}
                  onChange={(e) => handleDateRangeChange('contractDateRange', 'startTo', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* 契約終了日 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">契約終了日</label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={filters.contractDateRange.endFrom || ''}
                  onChange={(e) => handleDateRangeChange('contractDateRange', 'endFrom', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">〜</span>
                <input
                  type="date"
                  value={filters.contractDateRange.endTo || ''}
                  onChange={(e) => handleDateRangeChange('contractDateRange', 'endTo', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* 最終ログイン日 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">最終ログイン日</label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={filters.loginDateRange.from || ''}
                  onChange={(e) => handleDateRangeChange('loginDateRange', 'from', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">〜</span>
                <input
                  type="date"
                  value={filters.loginDateRange.to || ''}
                  onChange={(e) => handleDateRangeChange('loginDateRange', 'to', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};