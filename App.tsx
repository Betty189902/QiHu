import React, { useState, useEffect, useCallback } from 'react';
import CostInputForm from './components/CostInputForm';
import ResultsDashboard from './components/ResultsDashboard';
import AIAdvisor from './components/AIAdvisor';
import { CostData, CalculationResult, AIAnalysisResult } from './types';
import { analyzeProfitability } from './services/geminiService';
import { Settings, RefreshCw, Trash2 } from 'lucide-react';

// Initial empty state
const initialData: CostData = {
  batchId: '',
  customerName: '',
  fabricType: '',
  quantityKg: 0,
  unitPrice: 0,
  dyesCost: 0,
  auxiliariesCost: 0,
  waterCost: 0,
  electricityCost: 0,
  steamCost: 0,
  packagingCost: 0,
  laborCost: 0,
  overheadCost: 0,
};

const initialResults: CalculationResult = {
  totalRevenue: 0,
  totalVariableCost: 0,
  totalFixedCost: 0,
  totalCost: 0,
  netProfit: 0,
  profitMargin: 0,
  costPerKg: 0,
  breakdown: [],
};

const STORAGE_KEY = 'textile-cost-pro-data';

const App: React.FC = () => {
  const [formData, setFormData] = useState<CostData>(initialData);
  const [results, setResults] = useState<CalculationResult>(initialResults);
  const [aiState, setAiState] = useState<AIAnalysisResult>({
    analysis: '',
    isLoading: false,
    error: null
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on Mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData({ ...initialData, ...parsed }); // Merge with initial to ensure all keys exist
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage on Change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

  const handleInputChange = (key: keyof CostData, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    if (window.confirm('确定要清空所有数据重新开始吗？')) {
      setFormData(initialData);
      setAiState({ analysis: '', isLoading: false, error: null });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Calculation Logic
  const calculateResults = useCallback(() => {
    const {
      quantityKg, unitPrice,
      dyesCost, auxiliariesCost, packagingCost,
      waterCost, electricityCost, steamCost,
      laborCost, overheadCost
    } = formData;

    const totalRevenue = quantityKg * unitPrice;
    
    const totalVariableCost = dyesCost + auxiliariesCost + packagingCost + waterCost + electricityCost + steamCost;
    const totalFixedCost = laborCost + overheadCost;
    const totalCost = totalVariableCost + totalFixedCost;
    
    const netProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const costPerKg = quantityKg > 0 ? totalCost / quantityKg : 0;

    // Prepare Breakdown for Charts
    const breakdown = [
      { name: '染料', value: dyesCost, color: '#6366f1' }, // Indigo 500
      { name: '助剂', value: auxiliariesCost, color: '#818cf8' }, // Indigo 400
      { name: '包装', value: packagingCost, color: '#94a3b8' }, // Slate 400
      { name: '水费', value: waterCost, color: '#06b6d4' }, // Cyan 500
      { name: '电费', value: electricityCost, color: '#eab308' }, // Yellow 500
      { name: '蒸汽', value: steamCost, color: '#f97316' }, // Orange 500
      { name: '人工', value: laborCost, color: '#64748b' }, // Slate 500
      { name: '管理/折旧', value: overheadCost, color: '#475569' }, // Slate 600
    ].filter(item => item.value > 0);

    setResults({
      totalRevenue,
      totalVariableCost,
      totalFixedCost,
      totalCost,
      netProfit,
      profitMargin,
      costPerKg,
      breakdown
    });
  }, [formData]);

  // Auto-calculate when form data changes
  useEffect(() => {
    calculateResults();
  }, [formData, calculateResults]);

  const handleAIAnalyze = async () => {
    if (results.totalCost === 0 || formData.quantityKg === 0) return;

    setAiState({ analysis: '', isLoading: true, error: null });
    
    try {
      const analysis = await analyzeProfitability(formData, results);
      setAiState({ analysis, isLoading: false, error: null });
    } catch (err) {
      setAiState({ 
        analysis: '', 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Unknown error occurred' 
      });
    }
  };

  if (!isLoaded) return null; // Prevent flash of empty state

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
               <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">TextileCost Pro</h1>
              <p className="text-xs text-slate-500">染厂智算系统 <span className="text-blue-600 bg-blue-50 px-1 rounded ml-1">自动保存中</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleReset}
              className="flex items-center space-x-1 text-slate-500 hover:text-red-600 transition text-sm px-3 py-1.5 rounded-md hover:bg-slate-50"
              title="清空当前所有数据"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">重置数据</span>
            </button>
            <div className="text-sm text-slate-500 hidden md:block border-l pl-4 border-slate-200">
              高效 • 精准 • 智能
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Left Column: Input (4/12) - Hidden when printing to focus on report */}
          <div className="lg:col-span-4 xl:col-span-3 print:hidden">
            <CostInputForm 
              data={formData} 
              onChange={handleInputChange} 
              onCalculate={calculateResults} 
            />
          </div>

          {/* Right Column: Dashboard & AI (8/12) - Expands to full width when printing */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6 print:col-span-12 print:w-full">
            
            {/* AI Advisor Section */}
            <AIAdvisor 
              aiState={aiState} 
              onAnalyze={handleAIAnalyze} 
              canAnalyze={results.totalCost > 0 && formData.quantityKg > 0}
            />

            {/* Results Visualization */}
            <ResultsDashboard results={results} data={formData} />

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;