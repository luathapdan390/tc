import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mic, MicOff, Loader2 } from 'lucide-react';
import { parseTransactionIntent } from '../services/gemini';
import { TransactionPayload } from '../types';

interface SmartEntryProps {
  onParseSuccess: (data: TransactionPayload) => void;
}

const SmartEntry: React.FC<SmartEntryProps> = ({ onParseSuccess }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await parseTransactionIntent(text);
      onParseSuccess(result);
      setText(''); // Clear input on success
    } catch (err) {
      setError("Không thể hiểu giao dịch này. Vui lòng thử lại chi tiết hơn.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-indigo-900">Nhập liệu Thông minh</h3>
            <p className="text-sm text-indigo-700 mt-1">
              Nhập tự nhiên như: "Ăn sáng 35k", "Lương 20 triệu", hoặc "Siêu thị 1tr5".
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập giao dịch của bạn tại đây..."
          className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 resize-none transition-all text-base"
        />
        {/* Placeholder for Mic button if we add Speech-to-Text later. 
            For now, let's keep it simple text. 
        */}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !text.trim()}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
            isAnalyzing || !text.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Đang phân tích...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Phân tích & Điền form
          </>
        )}
      </button>
    </div>
  );
};

export default SmartEntry;