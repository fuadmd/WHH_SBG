
import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_REPORTS } from '../mockData';
import { UI_STRINGS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Monitoring: React.FC<{ user: User, language: 'EN' | 'AR' }> = ({ user, language }) => {
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [challenges, setChallenges] = useState('');
  const [requests, setRequests] = useState('');
  const t = UI_STRINGS[language];

  const chartData = MOCK_REPORTS.filter(r => r.beneficiaryId === user.beneficiaryId).map(r => ({
    month: r.month,
    sales: r.sales,
    expenses: r.expenses
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(language === 'EN' ? 'Report submitted successfully!' : 'تم إرسال التقرير بنجاح!');
    setSales(0);
    setExpenses(0);
    setChallenges('');
    setRequests('');
  };

  const labelClass = "block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-12 transition-colors">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t.monitoringSingular}</h1>
        <p className="text-gray-500 dark:text-gray-400">{language === 'EN' ? 'Track your business health and submit monthly progress reports.' : 'تتبع صحة عملك وقدم تقارير التقدم الشهرية.'}</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border dark:border-gray-800 shadow-sm transition-colors">
             <h2 className="text-xl font-bold mb-6 dark:text-white">{language === 'EN' ? 'Submit Monthly Report' : 'تقديم التقرير الشهري'}</h2>
             <form onSubmit={handleSubmit} className="space-y-5">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass} htmlFor="mon-sales">{t.sales} ($)</label>
                    <input id="mon-sales" type="number" className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white transition-colors" value={sales} onChange={e => setSales(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass} htmlFor="mon-expenses">Expenses ($)</label>
                    <input id="mon-expenses" type="number" className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white transition-colors" value={expenses} onChange={e => setExpenses(Number(e.target.value))} />
                  </div>
               </div>
               <div className="space-y-1">
                  <label className={labelClass} htmlFor="mon-challenges">{t.challenges}</label>
                  <textarea id="mon-challenges" className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl min-h-[100px] bg-white dark:bg-gray-800 text-black dark:text-white transition-colors" value={challenges} onChange={e => setChallenges(e.target.value)} placeholder={language === 'EN' ? "Describe any roadblocks..." : "صف أي عقبات..."}></textarea>
               </div>
               <div className="space-y-1">
                  <label className={labelClass} htmlFor="mon-requests">Requests</label>
                  <textarea id="mon-requests" className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl min-h-[100px] bg-white dark:bg-gray-800 text-black dark:text-white transition-colors" value={requests} onChange={e => setRequests(e.target.value)} placeholder={language === 'EN' ? "What help do you need from the team?" : "ما المساعدة التي تحتاجها من الفريق؟"}></textarea>
               </div>
               <button type="submit" className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all">Submit Report</button>
             </form>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border dark:border-gray-800 shadow-sm h-full transition-colors">
             <h2 className="text-xl font-bold mb-6 dark:text-white">Performance Trends</h2>
             <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                   <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                   <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t.sales} />
                   <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
