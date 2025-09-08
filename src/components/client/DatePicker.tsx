import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = '日付を選択',
  minDate,
  maxDate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });

  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = formatDate(selectedDate);
    
    if (minDate && dateString < minDate) return;
    if (maxDate && dateString > maxDate) return;
    
    onChange(dateString);
    setIsOpen(false);
  };

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = formatDate(date);
    
    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;
    
    return false;
  };

  const isDateSelected = (day: number): boolean => {
    if (!value) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return formatDate(date) === value;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // 空白のセル
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-8"></div>
      );
    }

    // 日付のセル
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day);
      const isSelected = isDateSelected(day);
      
      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateClick(day)}
          disabled={isDisabled}
          className={`
            h-8 w-8 rounded-full text-sm transition-colors
            ${isSelected 
              ? 'bg-blue-600 text-white font-bold' 
              : isDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100 text-gray-700'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <div className="flex items-center justify-between">
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px]">
            {/* カレンダーヘッダー */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="font-bold text-gray-900">
                {currentMonth.getFullYear()}年 {months[currentMonth.getMonth()]}
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* カレンダー本体 */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            {/* クリアボタン */}
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                クリア
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                閉じる
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};