import React from 'react';
import { X, Filter } from 'lucide-react';

export interface FilterState {
  clientTypes: string[];
  companyStatuses: string[];
  subscriptionPlans: string[];
  proxyLogin: 'any' | 'enabled' | 'disabled';
  usageLimits: {
    sites: { min: number | null; max: number | null };
    points: { min: number | null; max: number | null };
  };
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const clientTypeOptions = [
    { value: 'direct', label: 'ダイレクト' }
  ];

  const companyStatusOptions = [
    { value: 'active', label: 'アクティブ' },
    { value: 'inactive', label: '非アクティブ' },
    { value: 'suspended', label: '停止中' }
  ];

  const subscriptionPlanOptions = [
    { value: 'free', label: 'Free' },
    { value: 'basic', label: 'Basic' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' }
  ];


  const handleCheckboxChange = (category: 'clientTypes' | 'companyStatuses' | 'subscriptionPlans', value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...filters,
      [category]: newValues
    });
  };

  const handleProxyLoginChange = (value: 'any' | 'enabled' | 'disabled') => {
    onFilterChange({
      ...filters,
      proxyLogin: value
    });
  };

  const handleUsageLimitChange = (
    metric: 'sites' | 'points' | 'users',
    type: 'min' | 'max',
    value: string
  ) => {
    const numValue = value === '' ? null : Number(value);
    
    onFilterChange({
      ...filters,
      usageLimits: {
        ...filters.usageLimits,
        [metric]: {
          ...filters.usageLimits[metric],
          [type]: numValue
        }
      }
    });
  };

  const clearFilters = () => {
    onFilterChange({
      clientTypes: [],
      companyStatuses: [],
      subscriptionPlans: [],
      proxyLogin: 'any',
      usageLimits: {
        sites: { min: null, max: null },
        points: { min: null, max: null }
      }
    });
  };

  const hasActiveFilters = 
    filters.clientTypes.length > 0 ||
    filters.companyStatuses.length > 0 ||
    filters.subscriptionPlans.length > 0 ||
    filters.proxyLogin !== 'any' ||
    filters.usageLimits.sites.min !== null ||
    filters.usageLimits.sites.max !== null ||
    filters.usageLimits.points.min !== null ||
    filters.usageLimits.points.max !== null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-bold text-gray-900">フィルター</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>条件クリア</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="min-w-[160px]">
          <label className="block text-xs font-medium text-gray-700 mb-2">クライアント種別</label>
          <div className="space-y-1">
            {clientTypeOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.clientTypes.includes(option.value)}
                  onChange={() => handleCheckboxChange('clientTypes', option.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="min-w-[160px]">
          <label className="block text-xs font-medium text-gray-700 mb-2">会社ステータス</label>
          <div className="space-y-1">
            {companyStatusOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.companyStatuses.includes(option.value)}
                  onChange={() => handleCheckboxChange('companyStatuses', option.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="min-w-[160px]">
          <label className="block text-xs font-medium text-gray-700 mb-2">サブスクプラン</label>
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

        <div className="min-w-[160px]">
          <label className="block text-xs font-medium text-gray-700 mb-2">代理ログイン可否</label>
          <select
            value={filters.proxyLogin}
            onChange={(e) => handleProxyLoginChange(e.target.value as 'any' | 'enabled' | 'disabled')}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="any">すべて</option>
            <option value="enabled">有効</option>
            <option value="disabled">無効</option>
          </select>
        </div>

        <div className="min-w-[200px]">
          <label className="block text-xs font-medium text-gray-700 mb-2">使用率しきい値（%）</label>
          <div className="space-y-2">
            {(['sites', 'points'] as const).map(metric => (
              <div key={metric} className="flex items-center space-x-2">
                <span className="text-xs text-gray-600 w-12">
                  {metric === 'sites' ? 'サイト' : 'ポイント'}
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min"
                  value={filters.usageLimits[metric].min ?? ''}
                  onChange={(e) => handleUsageLimitChange(metric, 'min', e.target.value)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max"
                  value={filters.usageLimits[metric].max ?? ''}
                  onChange={(e) => handleUsageLimitChange(metric, 'max', e.target.value)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};