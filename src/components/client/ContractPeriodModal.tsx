import React, { useState } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { DatePicker } from './DatePicker';

interface ContractPeriod {
  startDate: string | null;
  endDate: string | null;
  status?: 'active' | 'inactive' | 'suspended';
}

interface ContractPeriodModalProps {
  companyId: string;
  companyName: string;
  currentPeriod: ContractPeriod;
  currentStatus?: 'active' | 'inactive' | 'suspended';
  onClose: () => void;
  onSave: (period: ContractPeriod) => void;
}

export const ContractPeriodModal: React.FC<ContractPeriodModalProps> = ({
  companyId,
  companyName,
  currentPeriod,
  currentStatus = 'active',
  onClose,
  onSave
}) => {
  const [startDate, setStartDate] = useState<string | null>(currentPeriod.startDate);
  const [endDate, setEndDate] = useState<string | null>(currentPeriod.endDate);
  const [status, setStatus] = useState<'active' | 'inactive' | 'suspended'>(currentPeriod.status || currentStatus);
  const [error, setError] = useState<string>('');

  const handleSave = () => {
    setError('');
    
    // バリデーション
    if (startDate && endDate && startDate > endDate) {
      setError('契約終了日は開始日より後の日付を選択してください');
      return;
    }

    onSave({
      startDate,
      endDate,
      status
    });
  };

  const formatDateForDisplay = (dateString: string | null): string => {
    if (!dateString) return '未設定';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  const getContractStatus = (): { text: string; color: string; bgColor: string } => {
    // 手動設定されたステータスを優先
    switch (status) {
      case 'active':
        return { text: '契約中', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'inactive':
        return { text: '契約終了', color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'suspended':
        return { text: '停止中', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      default:
        return { text: '未設定', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };
  
  const getStatusOptions = () => [
    { value: 'active', label: '契約中', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'inactive', label: '契約終了', color: 'text-red-600', bgColor: 'bg-red-100' },
    { value: 'suspended', label: '停止中', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
  ];

  const contractStatus = getContractStatus();

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">契約期間の設定</h2>
            <p className="mt-1 text-sm text-gray-600">{companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ボディ */}
        <div className="p-6 space-y-6">
          {/* 現在のステータス */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">現在のステータス</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${contractStatus.color} ${contractStatus.bgColor}`}>
                {contractStatus.text}
              </span>
            </div>
          </div>
          
          {/* ステータス選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              契約ステータス <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {getStatusOptions().map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value as 'active' | 'inactive' | 'suspended')}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    status === option.value
                      ? `border-blue-500 ${option.bgColor} ${option.color}`
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 契約開始日 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              契約開始日
            </label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="開始日を選択"
              maxDate={endDate || undefined}
            />
            <p className="mt-1 text-xs text-gray-500">
              現在: {formatDateForDisplay(startDate)}
            </p>
          </div>

          {/* 契約終了日 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              契約終了日
            </label>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="終了日を選択（無期限の場合は空欄）"
              minDate={startDate || undefined}
            />
            <p className="mt-1 text-xs text-gray-500">
              現在: {formatDateForDisplay(endDate)}
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 注意事項 */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>ご注意:</strong><br />
              • 契約終了日を空欄にすると無期限契約となります<br />
              • 契約期間の変更は即座に反映されます<br />
              • 過去の日付も設定可能です（履歴管理用）
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};