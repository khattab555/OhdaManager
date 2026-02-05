import React, { useState } from 'react';
import { FileBarChart, X, Download, Calendar, User, FileText } from 'lucide-react';
import { useOhdaStore } from '../store/useOhdaStore';
import { exportToExcel } from '../utils/excelExport';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose }) => {
  const { loans, logs } = useOhdaStore();
  const [reportType, setReportType] = useState<'general' | 'employee'>('general');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employeeName, setEmployeeName] = useState('');

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('الرجاء تحديد الفترة الزمنية');
      return;
    }

    if (startDate > endDate) {
      alert('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
      return;
    }

    if (reportType === 'employee' && !employeeName) {
        alert('الرجاء إدخال اسم الموظف');
        return;
    }

    exportToExcel(loans, logs, reportType, startDate, endDate, employeeName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-green-600" />
            استخراج التقارير
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleExport} className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">نوع التقرير</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReportType('general')}
                className={`p-3 rounded-lg border text-center transition-all ${
                  reportType === 'general'
                    ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1" />
                تقرير عام
              </button>
              <button
                type="button"
                onClick={() => setReportType('employee')}
                className={`p-3 rounded-lg border text-center transition-all ${
                  reportType === 'employee'
                    ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <User className="w-5 h-5 mx-auto mb-1" />
                تقرير مستلف
              </button>
            </div>
          </div>

          {/* Employee Name Selection */}
          {reportType === 'employee' && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-medium text-gray-700 block mb-2">اسم الموظف</label>
              <select
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required={reportType === 'employee'}
              >
                <option value="">اختر الموظف...</option>
                {/* Get unique employee names from loans */}
                {Array.from(new Set(loans.map(loan => loan.employeeName))).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">من تاريخ</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  max={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">إلى تاريخ</label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  max={today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              <Download className="w-5 h-5" />
              تصدير إلى Excel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};