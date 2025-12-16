import React, { useState } from 'react';
import { Tab, TransactionPayload, LoggedTransaction } from './types';
import { submitTransaction } from './services/api';
import TransactionForm from './components/TransactionForm';
import SmartEntry from './components/SmartEntry';
import History from './components/History';
import { PenLine, Sparkles, History as HistoryIcon, Wallet, Check } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MANUAL);
  const [transactions, setTransactions] = useState<LoggedTransaction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to hold data parsed from AI to pre-fill the manual form
  const [stagedData, setStagedData] = useState<TransactionPayload | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const handleTransactionSubmit = async (payload: TransactionPayload) => {
    setIsSubmitting(true);
    setNotification(null);
    
    // Create optimistic record
    const newTx: LoggedTransaction = {
        ...payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        status: 'pending'
    };

    setTransactions(prev => [...prev, newTx]);

    try {
      await submitTransaction(payload);
      
      // Update status to success
      setTransactions(prev => prev.map(tx => tx.id === newTx.id ? { ...tx, status: 'success' } : tx));
      setNotification({ msg: 'Giao dịch đã được lưu thành công!', type: 'success' });
      
      // Clear staged data if it was used
      setStagedData(null);
      
    } catch (error) {
      setTransactions(prev => prev.map(tx => tx.id === newTx.id ? { ...tx, status: 'error' } : tx));
      setNotification({ msg: 'Có lỗi xảy ra khi lưu giao dịch. Vui lòng kiểm tra kết nối.', type: 'error' });
    } finally {
      setIsSubmitting(false);
      // Auto dismiss notification
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSmartParseSuccess = (data: TransactionPayload) => {
    setStagedData(data);
    setActiveTab(Tab.MANUAL); // Switch to manual tab to review/edit/submit
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[85vh] md:h-auto md:min-h-[600px]">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <Wallet className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">Sổ Thu Chi AI</h1>
            <p className="text-indigo-100 text-sm mt-1">Quản lý tài chính cá nhân thông minh</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab(Tab.MANUAL)}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${
              activeTab === Tab.MANUAL ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <PenLine size={18} />
            Nhập liệu
            {activeTab === Tab.MANUAL && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab(Tab.AI)}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${
              activeTab === Tab.AI ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles size={18} />
            AI Chat
            {activeTab === Tab.AI && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab(Tab.HISTORY)}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${
              activeTab === Tab.HISTORY ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <HistoryIcon size={18} />
            Lịch sử
            {activeTab === Tab.HISTORY && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
            <div className={`mx-4 mt-4 p-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in ${
                notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
                {notification.type === 'success' && <Check size={16} />}
                {notification.msg}
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {activeTab === Tab.MANUAL && (
            <div className="animate-fade-in">
              <TransactionForm 
                initialData={stagedData} 
                onSubmit={handleTransactionSubmit} 
                isSubmitting={isSubmitting}
              />
            </div>
          )}
          
          {activeTab === Tab.AI && (
            <div className="animate-fade-in">
              <SmartEntry onParseSuccess={handleSmartParseSuccess} />
            </div>
          )}

          {activeTab === Tab.HISTORY && (
            <div className="animate-fade-in">
                <History transactions={transactions} />
            </div>
          )}
        </div>

        {/* Footer info (optional) */}
        <div className="p-4 border-t border-slate-100 text-center text-xs text-slate-400 bg-slate-50">
          Kết nối với Google Apps Script
        </div>
      </div>
    </div>
  );
};

export default App;