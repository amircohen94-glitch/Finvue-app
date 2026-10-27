```react
import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area 
} from 'recharts';
import { 
  Wallet, DollarSign, TrendingUp, TrendingDown, Calendar, Plus, Trash2, 
  Edit2, Search, Download, Sun, Moon, PiggyBank, RefreshCw, CheckCircle2, 
  Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, PieChart as PieIcon,
  List, X, DownloadCloud, UploadCloud, Target, PlusCircle, ArrowUpDown
} from 'lucide-react';

// Default categories with custom colors
const INITIAL_CATEGORIES = [
  { name: 'דיור ומשכנתה/שכירות', color: '#6366F1', type: 'expense' },
  { name: 'מזון וקניות', color: '#F59E0B', type: 'expense' },
  { name: 'תחבורה ודלק', color: '#10B981', type: 'expense' },
  { name: 'חשבונות ופיתוח', color: '#3B82F6', type: 'expense' },
  { name: 'בילויים ופנאי', color: '#EC4899', type: 'expense' },
  { name: 'מנויים ושירותים', color: '#8B5CF6', type: 'expense' },
  { name: 'קניות וביגוד', color: '#14B8A6', type: 'expense' },
  { name: 'בריאות וספורט', color: '#F43F5E', type: 'expense' },
  { name: 'השקעות וחיסכון', color: '#06B6D4', type: 'expense' },
  { name: 'משכורת', color: '#22C55E', type: 'income' },
  { name: 'עבודה עצמאית', color: '#10B981', type: 'income' },
  { name: 'הוצאות שונות', color: '#64748B', type: 'expense' },
];

const INITIAL_BUDGETS = {
  'דיור ומשכנתה/שכירות': 4500,
  'מזון וקניות': 2800,
  'תחבורה ודלק': 1200,
  'חשבונות ופיתוח': 900,
  'בילויים ופנאי': 800,
  'מנויים ושירותים': 400,
  'קניות וביגוד': 800,
  'בריאות וספורט': 500,
  'השקעות וחיסכון': 2000,
  'הוצאות שונות': 500
};

const INITIAL_TRANSACTIONS = [
  { id: '1', title: 'משכורת חודשית', amount: 15500, category: 'משכורת', type: 'income', date: '2026-10-01', paymentMethod: 'העברה בנקאית' },
  { id: '2', title: 'תשלום שכר דירה', amount: 4500, category: 'דיור ומשכנתה/שכירות', type: 'expense', date: '2026-10-02', paymentMethod: 'הוראת קבע' },
  { id: '3', title: 'קניות בשופרסל', amount: 742.50, category: 'מזון וקניות', type: 'expense', date: '2026-10-04', paymentMethod: 'כרטיס אשראי' },
  { id: '4', title: 'חשבון חשמל וגז', amount: 435.20, category: 'חשבונות ופיתוח', type: 'expense', date: '2026-10-05', paymentMethod: 'הוראת קבע' },
  { id: '5', title: 'מנוי נטפליקס וספוטפיי', amount: 95.80, category: 'מנויים ושירותים', type: 'expense', date: '2026-10-08', paymentMethod: 'כרטיס אשראי' },
  { id: '6', title: 'פרויקט ייעוץ פרטי', amount: 3400, category: 'עבודה עצמאית', type: 'income', date: '2026-10-12', paymentMethod: 'ביט / פייבוקס' },
  { id: '7', title: 'תדלוק בתחנת דלק', amount: 285.00, category: 'תחבורה ודלק', type: 'expense', date: '2026-10-14', paymentMethod: 'כרטיס אשראי' },
  { id: '8', title: 'ארוחה במסעדה', amount: 340.00, category: 'בילויים ופנאי', type: 'expense', date: '2026-10-18', paymentMethod: 'כרטיס אשראי' },
  { id: '9', title: 'הפקדה לקופת גמל להשקעה', amount: 2000, category: 'השקעות וחיסכון', type: 'expense', date: '2026-10-20', paymentMethod: 'העברה בנקאית' },
  { id: '10', title: 'ביגוד לחורף', amount: 520.00, category: 'קניות וביגוד', type: 'expense', date: '2026-10-22', paymentMethod: 'כרטיס אשראי' },
  { id: '11', title: 'קניות סוף שבוע', amount: 620.00, category: 'מזון וקניות', type: 'expense', date: '2026-10-25', paymentMethod: 'כרטיס אשראי' },
];

const INITIAL_SUBSCRIPTIONS = [
  { id: 's1', name: 'נטפליקס 4K', amount: 69.90, category: 'מנויים ושירותים', cycle: 'חודשי', dueDate: '15', status: 'שולם', paymentMethod: 'כרטיס אשראי' },
  { id: 's2', name: 'ספוטפיי משפחתי', amount: 35.90, category: 'מנויים ושירותים', cycle: 'חודשי', dueDate: '08', status: 'שולם', paymentMethod: 'כרטיס אשראי' },
  { id: 's3', name: 'מנוי לחדר כושר', amount: 250.00, category: 'בריאות וספורט', cycle: 'חודשי', dueDate: '01', status: 'שולם', paymentMethod: 'הוראת קבע' },
  { id: 's4', name: 'אחסון ענן Google One', amount: 11.90, category: 'מנויים ושירותים', cycle: 'חודשי', dueDate: '25', status: 'ממתין לתשלום', paymentMethod: 'כרטיס אשראי' },
  { id: 's5', name: 'אינטרנט סיבים 1000Mb', amount: 119.00, category: 'חשבונות ופיתוח', cycle: 'חודשי', dueDate: '28', status: 'ממתין לתשלום', paymentMethod: 'הוראת קבע' },
];

const INITIAL_SAVINGS_GOALS = [
  { id: 'g1', name: 'קרן חירום', targetAmount: 30000, currentAmount: 18500, targetDate: '2027-06-30', color: '#10B981' },
  { id: 'g2', name: 'חופשה משפחתית באירופה', targetAmount: 15000, currentAmount: 8200, targetDate: '2027-08-15', color: '#3B82F6' },
  { id: 'g3', name: 'שדרוג רכב', targetAmount: 45000, currentAmount: 14000, targetDate: '2028-01-01', color: '#8B5CF6' }
];

const MONTHLY_TREND_DATA = [
  { month: 'מאי', הכנסות: 14200, הוצאות: 10100, שווי: 41000 },
  { month: 'יוני', הכנסות: 14800, הוצאות: 10800, שווי: 45000 },
  { month: 'יולי', הכנסות: 15000, הוצאות: 11900, שווי: 48100 },
  { month: 'אוגוסט', הכנסות: 16200, הוצאות: 12400, שווי: 51900 },
  { month: 'ספטמבר', הכנסות: 15100, הוצאות: 10400, שווי: 56600 },
  { month: 'אוקטובר', הכנסות: 18900, הוצאות: 11461, שווי: 64039 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  // App Data States
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('finvue_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finvue_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finvue_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('finvue_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('finvue_goals');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  // Filters & Sorting States
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('הכל');
  const [filterType, setFilterType] = useState('הכל');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'מזון וקניות',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'כרטיס אשראי'
  });

  const [newCatData, setNewCatData] = useState({ name: '', color: '#6366F1', type: 'expense' });
  const [newGoalData, setNewGoalData] = useState({ name: '', targetAmount: '', currentAmount: '0', targetDate: '', color: '#10B981' });

  // PWA Prompt
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  // Save changes to localStorage
  useEffect(() => { localStorage.setItem('finvue_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('finvue_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('finvue_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('finvue_subscriptions', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('finvue_goals', JSON.stringify(savingsGoals)); }, [savingsGoals]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Derived Calculations
  const monthTransactions = useMemo(() => {
    return transactions.filter(t => selectedMonth ? t.date.startsWith(selectedMonth) : true);
  }, [transactions, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesMonth = selectedMonth ? t.date.startsWith(selectedMonth) : true;
      const matchesCategory = filterCategory === 'הכל' || t.category === filterCategory;
      const matchesType = filterType === 'הכל' || t.type === filterType;
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMonth && matchesCategory && matchesType && matchesSearch;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'amount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, selectedMonth, filterCategory, filterType, searchTerm, sortField, sortOrder]);

  const summary = useMemo(() => {
    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalSpent = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netSavings = totalIncome - totalSpent;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;
    const totalMonthlyBudget = Object.values(budgets).reduce((a, b) => Number(a) + Number(b), 0);
    const budgetUsedPercentage = totalMonthlyBudget > 0 
      ? Math.min(Math.round((totalSpent / totalMonthlyBudget) * 100), 100) 
      : 0;

    const totalSavingsAccumulated = savingsGoals.reduce((sum, g) => sum + Number(g.currentAmount), 0);

    return {
      totalIncome,
      totalSpent,
      netSavings,
      savingsRate,
      totalMonthlyBudget,
      budgetUsedPercentage,
      totalSavingsAccumulated
    };
  }, [monthTransactions, budgets, savingsGoals]);

  // Budget Alerts Calculation
  const budgetAlerts = useMemo(() => {
    const categoryTotals = {};
    monthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      });

    const alerts = [];
    Object.keys(budgets).forEach(cat => {
      const limit = budgets[cat];
      const spent = categoryTotals[cat] || 0;
      if (limit > 0) {
        const pct = (spent / limit) * 100;
        if (pct >= 100) {
          alerts.push({ category: cat, spent, limit, type: 'danger', text: `חריגה מהתקציב ב-₪${(spent - limit).toFixed(0)}` });
        } else if (pct >= 85) {
          alerts.push({ category: cat, spent, limit, type: 'warning', text: `התקרבות לתקרת התקציב (${pct.toFixed(0)}%)` });
        }
      }
    });
    return alerts;
  }, [monthTransactions, budgets]);

  const categorySpendingData = useMemo(() => {
    const categoryTotals = {};
    monthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      });

    return Object.keys(categoryTotals).map(catName => {
      const catObj = categories.find(c => c.name === catName);
      return {
        name: catName,
        value: categoryTotals[catName],
        color: catObj ? catObj.color : '#94A3B8'
      };
    }).sort((a, b) => b.value - a.value);
  }, [monthTransactions, categories]);

  const budgetVsActualData = useMemo(() => {
    const categoryTotals = {};
    monthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      });

    return Object.keys(budgets).map(cat => ({
      category: cat,
      הוצאות: categoryTotals[cat] || 0,
      תקציב: budgets[cat] || 0
    }));
  }, [monthTransactions, budgets]);

  // Handlers
  const handleSaveTransaction = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? { ...formData, amount: parseFloat(formData.amount), id: t.id } : t
      ));
      setEditingTransaction(null);
    } else {
      const newTx = {
        ...formData,
        id: Date.now().toString(),
        amount: parseFloat(formData.amount)
      };
      setTransactions([newTx, ...transactions]);
    }

    setFormData({
      title: '',
      amount: '',
      category: categories[0]?.name || 'מזון וקניות',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'כרטיס אשראי'
    });
    setIsAddModalOpen(false);
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatData.name) return;
    if (categories.some(c => c.name === newCatData.name)) {
      alert('קטגוריה זו כבר קיימת!');
      return;
    }
    setCategories([...categories, newCatData]);
    if (newCatData.type === 'expense') {
      setBudgets({ ...budgets, [newCatData.name]: 500 });
    }
    setNewCatData({ name: '', color: '#3B82F6', type: 'expense' });
    setIsCategoryModalOpen(false);
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalData.name || !newGoalData.targetAmount) return;
    const newGoal = {
      id: Date.now().toString(),
      name: newGoalData.name,
      targetAmount: parseFloat(newGoalData.targetAmount),
      currentAmount: parseFloat(newGoalData.currentAmount || 0),
      targetDate: newGoalData.targetDate,
      color: newGoalData.color
    };
    setSavingsGoals([...savingsGoals, newGoal]);
    setNewGoalData({ name: '', targetAmount: '', currentAmount: '0', targetDate: '', color: '#10B981' });
    setIsGoalModalOpen(false);
  };

  const handleDepositToGoal = (e) => {
    e.preventDefault();
    if (!depositAmount || !isDepositModalOpen) return;
    const amountNum = parseFloat(depositAmount);
    setSavingsGoals(savingsGoals.map(g => {
      if (g.id === isDepositModalOpen.id) {
        return { ...g, currentAmount: Math.max(0, g.currentAmount + amountNum) };
      }
      return g;
    }));
    setIsDepositModalOpen(null);
    setDepositAmount('');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleBudgetChange = (cat, val) => {
    setBudgets({
      ...budgets,
      [cat]: Math.max(0, parseFloat(val) || 0)
    });
  };

  const toggleSubscriptionStatus = (id) => {
    setSubscriptions(subscriptions.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'שולם' ? 'ממתין לתשלום' : 'שולם' };
      }
      return s;
    }));
  };

  const exportToCSV = () => {
    const headers = ['מזהה,תיאור,סכום,סוג,קטגוריה,תאריך,אמצעי תשלום\n'];
    const rows = filteredTransactions.map(t => 
      `"${t.id}","${t.title}",${t.amount},"${t.type}","${t.category}","${t.date}","${t.paymentMethod}"`
    );
    const blob = new Blob(['\uFEFF' + headers + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `finvue_export_${selectedMonth}.csv`);
    a.click();
  };

  const exportFullBackupJSON = () => {
    const backupData = {
      categories,
      transactions,
      budgets,
      subscriptions,
      savingsGoals,
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `finvue_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackupJSON = (event) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.transactions && parsed.budgets) {
            if (parsed.categories) setCategories(parsed.categories);
            if (parsed.transactions) setTransactions(parsed.transactions);
            if (parsed.budgets) setBudgets(parsed.budgets);
            if (parsed.subscriptions) setSubscriptions(parsed.subscriptions);
            if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals);
            alert('הגיבוי שוחזר בהצלחה!');
          } else {
            alert('קובץ גיבוי לא תקין.');
          }
        } catch (err) {
          alert('שגיאה בטעינת הקובץ.');
        }
      };
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("כדי להתקין כ-App למכשיר: לחץ על 3 הנקודות בדפדפן ובחר 'הוסף למסך הבית' (Add to Home Screen)");
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'סקירה', fullLabel: 'סקירה כללית', icon: PieIcon },
    { id: 'transactions', label: 'תנועות', fullLabel: 'היסטוריית תנועות', icon: List },
    { id: 'budgets', label: 'תקציב', fullLabel: 'תקציב לפי קטגוריה', icon: PiggyBank },
    { id: 'subscriptions', label: 'מנויים', fullLabel: 'חשבונות ומנויים', icon: RefreshCw },
    { id: 'goals', label: 'יעדים', fullLabel: 'יעדי חיסכון', icon: Target },
  ];

  return (
    <div dir="rtl" className={`h-screen w-screen overflow-hidden flex flex-col ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200 font-sans`}>
      
      {/* Top Header */}
      <header className={`border-b flex-shrink-0 z-30 ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-2.5 space-x-reverse">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-xl shadow-md shadow-emerald-500/20 flex-shrink-0">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="truncate">
              <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent truncate">
                FinVue
              </h1>
              <p className="hidden md:block text-xs text-slate-400">ניהול תקציב וחיסכון</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 space-x-reverse">
            
            {/* Install PWA Button */}
            <button
              onClick={handleInstallApp}
              title="התקן כ-App"
              className={`hidden sm:flex items-center space-x-1 space-x-reverse px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                darkMode ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5 ml-1" />
              <span>התקן App</span>
            </button>

            {/* JSON Backup Button */}
            <button
              onClick={exportFullBackupJSON}
              title="גיבוי נתונים (JSON)"
              className={`p-1.5 sm:p-2 rounded-lg border text-xs font-medium transition ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
            </button>

            {/* JSON Restore Button */}
            <label 
              title="שחזור נתונים (JSON)"
              className={`p-1.5 sm:p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Download className="w-4 h-4" />
              <input type="file" accept=".json" onChange={importBackupJSON} className="hidden" />
            </label>

            {/* Month Picker Filter */}
            <div className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs sm:text-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <Calendar className="w-3.5 h-3.5 ml-1 sm:ml-2 text-slate-400 flex-shrink-0" />
              <input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs sm:text-sm focus:outline-none dark:text-slate-200 cursor-pointer w-24 sm:w-auto"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 sm:p-2 rounded-lg border transition ${
                darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Add Transaction Button */}
            <button
              onClick={() => {
                setEditingTransaction(null);
                setFormData({
                  title: '',
                  amount: '',
                  category: categories[0]?.name || 'מזון וקניות',
                  type: 'expense',
                  date: new Date().toISOString().split('T')[0],
                  paymentMethod: 'כרטיס אשראי'
                });
                setIsAddModalOpen(true);
              }}
              className="flex items-center space-x-1 space-x-reverse bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition shadow-md shadow-emerald-600/20 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">חדש</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Workspace */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto px-2 sm:px-6 py-3 sm:py-6 gap-6">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-56 flex-shrink-0 space-y-4">
          <nav className={`p-2 rounded-2xl border space-y-1 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            {navItems.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                      : darkMode 
                        ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.fullLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Budget Widget Sidebar */}
          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/70 border-slate-200'} space-y-3`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ניצול תקציב חודשי
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">הוצאות מתוך תקציב</span>
                <span className="font-semibold">₪{summary.totalSpent.toFixed(0)}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    summary.budgetUsedPercentage > 90 ? 'bg-rose-500' : summary.budgetUsedPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(summary.budgetUsedPercentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">סך נצבר ביעדים</span>
                <span className="font-bold text-emerald-400">₪{summary.totalSavingsAccumulated.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Scrollable Main Workspace with Extra Bottom Padding for Phone Navigation */}
        <main className="flex-1 overflow-y-auto pr-0.5 space-y-5 pb-32 md:pb-6">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              
              {/* Alert Banners */}
              {budgetAlerts.length > 0 && (
                <div className="space-y-2">
                  {budgetAlerts.map((alertItem, i) => (
                    <div 
                      key={i} 
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
                        alertItem.type === 'danger' 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span><strong>{alertItem.category}:</strong> {alertItem.text}</span>
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0">
                        ₪{alertItem.spent.toFixed(0)} / ₪{alertItem.limit}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Top KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                <div className={`p-3.5 sm:p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span className="text-xs sm:text-sm font-medium">הכנסות</span>
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold truncate">₪{summary.totalIncome.toLocaleString()}</div>
                  <div className="mt-1 text-[11px] text-emerald-500 flex items-center">
                    <ArrowUpRight className="w-3 h-3 ml-0.5" /> חודשי
                  </div>
                </div>

                <div className={`p-3.5 sm:p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span className="text-xs sm:text-sm font-medium">הוצאות</span>
                    <div className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg">
                      <TrendingDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold truncate">₪{summary.totalSpent.toLocaleString()}</div>
                  <div className="mt-1 text-[11px] text-slate-400 truncate">
                    תקציב: ₪{summary.totalMonthlyBudget.toLocaleString()}
                  </div>
                </div>

                <div className={`p-3.5 sm:p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span className="text-xs sm:text-sm font-medium">מאזן נטו</span>
                    <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className={`text-lg sm:text-2xl font-bold truncate ${summary.netSavings >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    ₪{summary.netSavings.toLocaleString()}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    הכנסות פחות הוצאות
                  </div>
                </div>

                <div className={`p-3.5 sm:p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span className="text-xs sm:text-sm font-medium">שיעור חיסכון</span>
                    <div className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg">
                      <PiggyBank className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold">{summary.savingsRate}%</div>
                  <div className="mt-1 text-[11px] text-purple-400">
                    אחוז מההכנסה
                  </div>
                </div>

              </div>

              {/* Area Chart: Net Worth & Monthly Trend */}
              <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold">מגמת שווי נקי ותזרים</h3>
                    <p className="text-[11px] text-slate-400">הכנסות, הוצאות ושווי נכסים לאורך זמן</p>
                  </div>
                </div>
                <div className="h-56 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: -10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: darkMode ? '#94A3B8' : '#64748B' }} />
                      <YAxis tick={{ fontSize: 10, fill: darkMode ? '#94A3B8' : '#64748B' }} />
                      <Tooltip 
                        formatter={(val) => `₪${val.toLocaleString()}`}
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#0F172A' : '#FFFFFF', 
                          borderColor: darkMode ? '#334155' : '#E2E8F0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Area type="monotone" dataKey="שווי" stroke="#10B981" fillOpacity={1} fill="url(#colorNetWorth)" />
                      <Bar dataKey="הכנסות" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={10} />
                      <Bar dataKey="הוצאות" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={10} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Interactive Charts: Category Pie & Budget Bar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Donut Chart */}
                <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-sm sm:text-base font-semibold mb-3">התפלגות הוצאות</h3>
                  {categorySpendingData.length > 0 ? (
                    <div className="h-52 sm:h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categorySpendingData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {categorySpendingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`₪${value.toFixed(2)}`, 'הוצאה']}
                            contentStyle={{ 
                              backgroundColor: darkMode ? '#0F172A' : '#FFFFFF', 
                              borderColor: darkMode ? '#334155' : '#E2E8F0',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-52 flex items-center justify-center text-slate-500 text-xs">
                      אין נתוני הוצאות לחודש זה.
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800/40">
                    {categorySpendingData.slice(0, 4).map((cat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 space-x-reverse text-xs">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }}></span>
                        <span className="truncate text-slate-400 text-[11px]">{cat.name}</span>
                        <span className="font-semibold text-[11px] mr-auto">₪{cat.value.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar Chart */}
                <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-sm sm:text-base font-semibold mb-3">ביצוע מול תקציב</h3>
                  <div className="h-52 sm:h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={budgetVsActualData} margin={{ top: 5, right: -15, left: -25, bottom: 0 }}>
                        <XAxis dataKey="category" tick={{ fontSize: 9, fill: darkMode ? '#94A3B8' : '#64748B' }} interval={0} angle={-25} textAnchor="end" height={45} />
                        <YAxis tick={{ fontSize: 9, fill: darkMode ? '#94A3B8' : '#64748B' }} />
                        <Tooltip 
                          formatter={(val) => `₪${val}`}
                          contentStyle={{ 
                            backgroundColor: darkMode ? '#0F172A' : '#FFFFFF', 
                            borderColor: darkMode ? '#334155' : '#E2E8F0',
                            borderRadius: '8px',
                            fontSize: '11px'
                          }}
                        />
                        <Bar dataKey="הוצאות" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="תקציב" fill="#6366F1" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: TRANSACTIONS LIST */}
          {activeTab === 'transactions' && (
            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
              
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
                  {/* Search input */}
                  <div className={`flex items-center px-3 py-1.5 rounded-xl border w-full sm:w-56 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <Search className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0" />
                    <input 
                      type="text"
                      placeholder="חפש תנועה..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm w-full focus:outline-none"
                    />
                  </div>

                  {/* Filter Type */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs focus:outline-none w-full sm:w-auto ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="הכל">כל הסוגים</option>
                    <option value="expense">הוצאה</option>
                    <option value="income">הכנסה</option>
                  </select>

                  {/* Filter Category */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs focus:outline-none w-full sm:w-auto ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="הכל">כל הקטגוריות</option>
                    {categories.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => {
                      if (sortField === 'date') setSortField('amount');
                      else setSortField('date');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className={`flex items-center space-x-1 space-x-reverse px-2.5 py-1.5 rounded-xl border text-xs font-medium transition ${
                      darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 ml-1" />
                    <span>מיון: {sortField === 'date' ? 'תאריך' : 'סכום'}</span>
                  </button>

                  <button
                    onClick={exportToCSV}
                    className={`flex items-center space-x-1 space-x-reverse px-2.5 py-1.5 rounded-xl border text-xs transition ${
                      darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Excel</span>
                  </button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs sm:text-sm">
                  <thead>
                    <tr className={`border-b text-[11px] font-semibold uppercase ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                      <th className="py-2.5 px-2">תיאור</th>
                      <th className="py-2.5 px-2">קטגוריה</th>
                      <th className="py-2.5 px-2">תאריך</th>
                      <th className="py-2.5 px-2 text-left">סכום</th>
                      <th className="py-2.5 px-2 text-center">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="py-2.5 px-2 font-medium truncate max-w-[120px] sm:max-w-none">{tx.title}</td>
                        <td className="py-2.5 px-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-slate-800 text-slate-300 truncate">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-slate-500 text-[11px]">{tx.date}</td>
                        <td className={`py-2.5 px-2 text-left font-bold ${tx.type === 'income' ? 'text-emerald-500' : ''}`}>
                          {tx.type === 'income' ? '+' : '-'}₪{Number(tx.amount).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <div className="flex items-center justify-center space-x-1.5 space-x-reverse">
                            <button onClick={() => { setEditingTransaction(tx); setFormData(tx); setIsAddModalOpen(true); }} className="p-1 hover:text-emerald-500 text-slate-400 transition">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteTransaction(tx.id)} className="p-1 hover:text-rose-500 text-slate-400 transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BUDGETS */}
          {activeTab === 'budgets' && (
            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold">תקציב חודשי לפי קטגוריה</h3>
                  <p className="text-xs text-slate-500">הגדר תקרת הוצאות מתוכננת</p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="flex items-center space-x-1 space-x-reverse px-2.5 py-1.5 rounded-lg border text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 ml-1" />
                  <span>קטגוריה</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(budgets).map(catName => {
                  const allocated = budgets[catName];
                  const catSpent = monthTransactions
                    .filter(t => t.type === 'expense' && t.category === catName)
                    .reduce((s, t) => s + Number(t.amount), 0);
                  
                  const pct = allocated > 0 ? Math.round((catSpent / allocated) * 100) : 0;
                  const isExceeded = pct >= 100;

                  return (
                    <div key={catName} className={`p-3.5 rounded-xl border ${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-2.5`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs sm:text-sm truncate">{catName}</span>
                        <div className="flex items-center space-x-1 space-x-reverse flex-shrink-0">
                          <span className="text-xs text-slate-400">₪</span>
                          <input
                            type="number"
                            value={allocated}
                            onChange={(e) => handleBudgetChange(catName, e.target.value)}
                            className={`w-20 px-2 py-0.5 text-xs rounded border font-semibold text-left ${
                              darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>הוצאה: ₪{catSpent.toFixed(0)}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isExceeded ? 'bg-rose-500' : pct >= 85 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
              <div>
                <h3 className="text-base font-bold">חשבונות ומנויים חודשיים</h3>
                <p className="text-xs text-slate-500">עקוב אחר הוצאות קבועות ומצב התשלום</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {subscriptions.map(sub => (
                  <div 
                    key={sub.id} 
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 ${
                      darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm truncate">{sub.name}</h4>
                        <p className="text-[11px] text-slate-400">חיוב ב-{sub.dueDate} לחודש</p>
                      </div>
                      <span className="font-bold text-sm">₪{sub.amount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        sub.status === 'שולם' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {sub.status === 'שולם' ? <CheckCircle2 className="w-3 h-3 ml-1" /> : <Clock className="w-3 h-3 ml-1" />}
                        {sub.status}
                      </span>

                      <button
                        onClick={() => toggleSubscriptionStatus(sub.id)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition ${
                          darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        סמן כ{sub.status === 'שולם' ? 'ממתין' : 'שולם'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SAVINGS GOALS */}
          {activeTab === 'goals' && (
            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold">מעקב יעדי חיסכון</h3>
                  <p className="text-xs text-slate-500">נהל והגדל את חסכונותיך</p>
                </div>
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="flex items-center space-x-1 space-x-reverse px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-500 transition"
                >
                  <Plus className="w-3.5 h-3.5 ml-1" />
                  <span>יעד חדש</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savingsGoals.map(goal => {
                  const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
                  return (
                    <div 
                      key={goal.id} 
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                        darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm truncate">{goal.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                            {pct}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">תאריך: {goal.targetDate || 'לא נקבע'}</p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>₪{goal.currentAmount.toLocaleString()}</span>
                          <span className="text-slate-400">מתוך ₪{goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: goal.color || '#10B981' }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/40">
                        <button
                          onClick={() => setIsDepositModalOpen(goal)}
                          className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex items-center justify-center space-x-1 space-x-reverse"
                        >
                          <Plus className="w-3 h-3 ml-1" />
                          <span>הפקדה / משיכה</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Fixed Bottom Navigation Bar for Mobile with Safe Area Padding */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-40 pb-[env(safe-area-inset-bottom,12px)] ${
        darkMode ? 'bg-slate-900/95 border-slate-800 backdrop-blur-md' : 'bg-white/95 border-slate-200 backdrop-blur-md'
      }`}>
        <div className="flex justify-around items-center h-16 px-1">
          {navItems.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-medium transition ${
                  isActive ? 'text-emerald-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'text-emerald-500 scale-110' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL: ADD / EDIT TRANSACTION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold">
                {editingTransaction ? 'עריכת תנועה' : 'הוספת תנועה חדשה'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">סוג תנועה</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-1.5 text-xs rounded-lg border font-medium transition ${
                      formData.type === 'expense' 
                        ? 'bg-rose-500 text-white border-rose-500' 
                        : darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    הוצאה
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-1.5 text-xs rounded-lg border font-medium transition ${
                      formData.type === 'income' 
                        ? 'bg-emerald-500 text-white border-emerald-500' 
                        : darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    הכנסה
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">תיאור</label>
                <input
                  type="text"
                  required
                  placeholder="למשל: סופרמרקט, משכורת"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">סכום (₪)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">תאריך</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">קטגוריה</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {categories.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">אמצעי תשלום</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="כרטיס אשראי">כרטיס אשראי</option>
                    <option value="העברה בנקאית">העברה בנקאית</option>
                    <option value="מזומן">מזומן</option>
                    <option value="הוראת קבע">הוראת קבע</option>
                    <option value="ביט / פייבוקס">ביט / פייבוקס</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
                >
                  שמירה
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-xs p-5 rounded-2xl border shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold">קטגוריה חדשה</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">שם הקטגוריה</label>
                <input
                  type="text"
                  required
                  placeholder="חינוך, מתנות..."
                  value={newCatData.name}
                  onChange={(e) => setNewCatData({ ...newCatData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">צבע הקטגוריה</label>
                <input
                  type="color"
                  value={newCatData.color}
                  onChange={(e) => setNewCatData({ ...newCatData, color: e.target.value })}
                  className="w-full h-9 p-1 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-3 py-1.5 bg-slate-800 text-xs rounded-lg">
                  ביטול
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg">
                  אישור
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GOAL */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-5 rounded-2xl border shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold">יעד חיסכון חדש</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">שם היעד</label>
                <input
                  type="text"
                  required
                  placeholder="טיול לחו״ל, קורס..."
                  value={newGoalData.name}
                  onChange={(e) => setNewGoalData({ ...newGoalData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">סכום יעד (₪)</label>
                  <input
                    type="number"
                    required
                    placeholder="10000"
                    value={newGoalData.targetAmount}
                    onChange={(e) => setNewGoalData({ ...newGoalData, targetAmount: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">קיים כעת (₪)</label>
                  <input
                    type="number"
                    value={newGoalData.currentAmount}
                    onChange={(e) => setNewGoalData({ ...newGoalData, currentAmount: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">תאריך יעד</label>
                <input
                  type="date"
                  value={newGoalData.targetDate}
                  onChange={(e) => setNewGoalData({ ...newGoalData, targetDate: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onClick={() => setIsGoalModalOpen(false)} className="px-3 py-1.5 bg-slate-800 text-xs rounded-lg">
                  ביטול
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg">
                  יצירת יעד
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DEPOSIT / WITHDRAW */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-xs p-5 rounded-2xl border shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold">עדכון: {isDepositModalOpen.name}</h3>
              <button onClick={() => setIsDepositModalOpen(null)} className="p-1 text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositToGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">סכום להפקדה/משיכה (₪)</label>
                <p className="text-[11px] text-slate-500 mb-1">למשיכה יש להזין סכום שלילי (-500)</p>
                <input
                  type="number"
                  required
                  placeholder="500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onClick={() => setIsDepositModalOpen(null)} className="px-3 py-1.5 bg-slate-800 text-xs rounded-lg">
                  ביטול
                </button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg">
                  עדכן
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
```
