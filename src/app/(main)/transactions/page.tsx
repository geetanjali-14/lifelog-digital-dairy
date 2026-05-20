"use client";

import { useEffect, useState } from "react";
import { 
  CreditCard, Plus, ArrowUpRight, ArrowDownRight, 
  Search, Calendar, Trash2, 
  TrendingUp, TrendingDown, Wallet, PieChart as PieChartIcon
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggeredList, StaggeredItem } from "@/components/motion/StaggeredList";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { format } from "date-fns";
import clsx from "clsx";
import { useCallback } from "react";

interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string | null;
  transactionDate: string;
  createdAt: string;
}

interface DailyChartData {
  name: string;
  income: number;
  expense: number;
}

interface CategoryChartData {
  name: string;
  value: number;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "EXPENSE" as 'INCOME' | 'EXPENSE',
    category: "",
    description: "",
    transactionDate: format(new Date(), "yyyy-MM-dd")
  });

  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });

  const [chartData, setChartData] = useState<DailyChartData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryChartData[]>([]);

  const calculateStats = (data: Transaction[]) => {
    const income = data
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = data
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    setStats({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    });
  };

  const prepareChartData = (data: Transaction[]) => {
    const daily: Record<string, { income: number, expense: number }> = {};
    const categories: Record<string, number> = {};

    data.forEach(t => {
      const date = format(new Date(t.transactionDate), "MMM dd");
      if (!daily[date]) daily[date] = { income: 0, expense: 0 };
      
      if (t.type === 'INCOME') {
        daily[date].income += Number(t.amount);
      } else {
        daily[date].expense += Number(t.amount);
        categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
      }
    });

    setChartData(Object.entries(daily).map(([name, values]) => ({ name, ...values })).reverse().slice(-7));
    setCategoryData(Object.entries(categories).map(([name, value]) => ({ name, value })));
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
        calculateStats(data);
        prepareChartData(data);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          amount: "",
          type: "EXPENSE",
          category: "",
          description: "",
          transactionDate: format(new Date(), "yyyy-MM-dd")
        });
        fetchTransactions();
      }
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) fetchTransactions();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const COLORS = ['#5A52FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="flex flex-col min-h-full pb-20 px-4 pt-6 overflow-y-auto w-full lg:px-8 lg:pt-10 lg:max-w-6xl lg:mx-auto">
      {/* Header */}
      <FadeIn className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight">Money Tracker</h1>
          <p className="text-text-muted text-base">Track your income, expenses and financial health.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-2xl font-bold shadow-lg shadow-brand/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Add Transaction</span>
        </button>
      </FadeIn>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeIn delay={0.1} className="bg-surface border border-border p-6 rounded-3xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-text-subtle text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                   <Wallet size={14} className="text-brand" /> Total Balance
                </div>
                <div className={clsx(
                  "text-3xl font-black",
                  stats.balance >= 0 ? "text-foreground" : "text-red-500"
                )}>
                  ${stats.balance.toLocaleString()}
                </div>
                <div className="text-text-muted text-sm font-medium">Net available</div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-3xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                   <TrendingUp size={14} /> Total Income
                </div>
                <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                  +${stats.totalIncome.toLocaleString()}
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                 <ArrowUpRight size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            </FadeIn>

            <FadeIn delay={0.3} className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-6 rounded-3xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                   <TrendingDown size={14} /> Total Expenses
                </div>
                <div className="text-3xl font-black text-red-700 dark:text-red-300">
                  -${stats.totalExpenses.toLocaleString()}
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                 <ArrowDownRight size={24} className="text-red-600 dark:text-red-400" />
              </div>
            </FadeIn>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn delay={0.4} className="bg-surface p-6 lg:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <TrendingUp className="w-5 h-5 text-brand" />
                <h3 className="text-lg font-bold text-foreground">Cash Flow</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </FadeIn>

            <FadeIn delay={0.5} className="bg-surface p-6 lg:p-8 rounded-3xl border border-border shadow-sm flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <PieChartIcon className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold text-foreground">Spending by Category</h3>
              </div>
              <div className="h-64 w-full">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-muted italic">
                    No expense data to display
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Recent Transactions</h3>
              <div className="flex gap-2">
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                   <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all w-32 md:w-64"
                   />
                </div>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="bg-surface border border-dashed border-border rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CreditCard className="text-gray-300" size={32} />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">No transactions yet</h4>
                <p className="text-text-muted mb-6">Start tracking your money to see detailed analytics.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-brand font-bold hover:underline"
                >
                  Add your first transaction
                </button>
              </div>
            ) : (
              <StaggeredList className="space-y-3">
                {transactions.map((t) => (
                  <StaggeredItem key={t.id}>
                    <div className="group bg-surface border border-border p-4 rounded-2xl flex items-center justify-between hover:border-brand/30 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-4">
                        <div className={clsx(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          t.type === 'INCOME' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}>
                          {t.type === 'INCOME' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{t.category}</div>
                          <div className="text-xs text-text-muted flex items-center gap-2">
                            <Calendar size={12} /> {format(new Date(t.transactionDate), "MMM dd, yyyy")}
                            {t.description && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[150px]">{t.description}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={clsx(
                          "text-lg font-bold",
                          t.type === 'INCOME' ? "text-emerald-600" : "text-foreground"
                        )}>
                          {t.type === 'INCOME' ? "+" : "-"}${Number(t.amount).toLocaleString()}
                        </div>
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="p-2 text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </StaggeredItem>
                ))}
              </StaggeredList>
            )}
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <FadeIn className="bg-surface w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden">
            <div className="px-6 py-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Add Transaction</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-foreground">
                 <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex p-1 bg-surface-variant border border-border rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                  className={clsx(
                    "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                    formData.type === 'EXPENSE' ? "bg-red-500 text-white shadow-md" : "text-text-muted hover:text-foreground"
                  )}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                  className={clsx(
                    "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                    formData.type === 'INCOME' ? "bg-emerald-500 text-white shadow-md" : "text-text-muted hover:text-foreground"
                  )}
                >
                  Income
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-subtle uppercase tracking-wider">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 bg-surface border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-bold text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-subtle uppercase tracking-wider">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all appearance-none"
                  >
                    <option value="">Select...</option>
                    {formData.type === 'EXPENSE' ? (
                      <>
                        <option value="Food">Food & Dining</option>
                        <option value="Transport">Transport</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Bills">Bills & Utilities</option>
                        <option value="Health">Health & Wellness</option>
                        <option value="Other">Other</option>
                      </>
                    ) : (
                      <>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Investment">Investment</option>
                        <option value="Gift">Gift</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-subtle uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-subtle uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none h-20"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-text-muted font-bold hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
