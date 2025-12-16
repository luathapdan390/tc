import React, { useState, useEffect } from 'react';
import { TransactionPayload } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Send, Loader2 } from 'lucide-react';

interface TransactionFormProps {
  initialData?: TransactionPayload | null;
  onSubmit: (data: TransactionPayload) => void;
  isSubmitting: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.lydo);
      if (initialData.thu > 0) {
        setType('income');
        setAmount(initialData.thu.toString());
      } else {
        setType('expense');
        setAmount(initialData.chi.toString());
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const numAmount = parseFloat(amount);
    const payload: TransactionPayload = {
      lydo: description,
      thu: type === 'income' ? numAmount : 0,
      chi: type === 'expense' ? numAmount : 0
    };
    
    console.log("Sending transaction to GAS:", payload);
    onSubmit(payload);
    
    // Clear form if not currently submitting (optimistic clear or if parent handles state async)
    if (!isSubmitting) {
        setDescription('');
        setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${
            type === 'expense' 
              ? 'bg-white text-rose-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ArrowDownCircle size={18} />
          Chi Tiêu
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${
            type === 'income' 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ArrowUpCircle size={18} />
          Thu Nhập
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Số tiền (VNĐ)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
              className={`block w-full rounded-lg border-slate-200 pl-4 pr-12 py-3 text-lg font-semibold focus:ring-2 focus:outline-none transition-colors ${
                type === 'expense' 
                    ? 'focus:border-rose-500 focus:ring-rose-200 text-rose-600' 
                    : 'focus:border-emerald-500 focus:ring-emerald-200 text-emerald-600'
              }`}
            />
            <span className="absolute right-4 top-3.5 text-slate-400 font-medium">₫</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Lý do / Mô tả
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={type === 'expense' ? "Vd: Ăn sáng, Mua xăng..." : "Vd: Lương tháng 12..."}
            required
            className="block w-full rounded-lg border-slate-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg text-white font-medium text-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] ${
            isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Send size={20} />
            Lưu Giao Dịch
          </>
        )}
      </button>
    </form>
  );
};

export default TransactionForm;