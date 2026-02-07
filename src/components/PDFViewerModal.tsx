import React from 'react';
import { X, FileText, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfData: string | null;
  title?: string;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  onClose,
  pdfData,
  title
}) => {
  const { t } = useTranslation();

  if (!isOpen || !pdfData) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">{title || t('loanDetails.viewReceipt')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={pdfData} 
              download="receipt.pdf"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 bg-gray-100 p-1 relative">
          <object 
            data={pdfData} 
            type="application/pdf"
            className="w-full h-full rounded-md border border-gray-300 bg-white"
          >
            <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white">
                <p>لا يمكن عرض ملف PDF داخل المتصفح.</p>
                <a 
                    href={pdfData} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-600 underline mt-2 font-medium"
                >
                    اضغط هنا لفتح الملف في نافذة جديدة
                </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
};