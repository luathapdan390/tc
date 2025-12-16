import React from 'react';
import { LoggedTransaction } from '../types';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface HistoryProps {
  transactions: LoggedTransaction[];
}

const History: React.FC<HistoryProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        <p>Chưa có giao dịch nào trong phiên này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.slice().reverse().map((tx) => (
        <div key={tx.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
                {tx.status === 'success' && <CheckCircle2 className="text-emerald-500" size={20} />}
                {tx.status === 'pending' && <Clock className="text-amber-500" size={20} />}
                {tx.status === 'error' && <XCircle className="text-rose-500" size={20} />}
                
                <div>
                    <p className="font-medium text-slate-900">{tx.lydo}</p>
                    <p className="text-xs text-slate-400">{tx.timestamp.toLocaleTimeString()}</p>
                </div>
            </div>
            
            <div className={`font-semibold ${tx.thu > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tx.thu > 0 ? '+' : '-'}{new Intl.NumberFormat('vi-VN').format(tx.thu > 0 ? tx.thu : tx.chi)} ₫
            </div>
        </div>
      ))}
    </div>
  );
};

export default History;