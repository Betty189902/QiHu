import React from 'react';
import { CalculationResult, CostData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import SummaryCard from './SummaryCard';
import { DollarSign, TrendingUp, Activity, Scale, Download, Printer } from 'lucide-react';

interface Props {
  results: CalculationResult;
  data: CostData;
}

const ResultsDashboard: React.FC<Props> = ({ results, data }) => {
  
  // Format currency
  const formatCNY = (val: number) => `¥${val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatPercent = (val: number) => `${val.toFixed(2)}%`;

  const isProfitable = results.netProfit > 0;

  // Handle CSV Export
  const handleExportCSV = () => {
    // BOM for Excel Chinese character support
    const BOM = "\uFEFF";
    
    const headers = [
      "批次号", "客户名称", "面料类型", "数量(kg)", "单价(元/kg)",
      "总收入", "总成本", "净利润", "利润率(%)", "公斤成本",
      "染料", "助剂", "包装", "水费", "电费", "蒸汽", "人工", "折旧/管理"
    ];

    const row = [
      data.batchId, data.customerName, data.fabricType, data.quantityKg, data.unitPrice,
      results.totalRevenue.toFixed(2), results.totalCost.toFixed(2), results.netProfit.toFixed(2), results.profitMargin.toFixed(2), results.costPerKg.toFixed(2),
      data.dyesCost, data.auxiliariesCost, data.packagingCost, data.waterCost, data.electricityCost, data.steamCost, data.laborCost, data.overheadCost
    ];

    const csvContent = BOM + headers.join(",") + "\n" + row.join(",");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `染厂成本分析_${data.batchId || '未命名'}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2">
      
      {/* Actions Toolbar */}
      <div className="flex justify-between items-center mb-2 print:hidden">
         <h2 className="text-lg font-bold text-slate-700">分析报表</h2>
         <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>打印 / 存为PDF</span>
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>导出 Excel</span>
            </button>
         </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard 
          title="总收入" 
          value={formatCNY(results.totalRevenue)} 
          icon={DollarSign} 
          colorClass="text-blue-600" 
          bgClass="bg-blue-50"
        />
        <SummaryCard 
          title="净利润" 
          value={formatCNY(results.netProfit)} 
          icon={TrendingUp} 
          colorClass={isProfitable ? "text-emerald-600" : "text-red-600"} 
          bgClass={isProfitable ? "bg-emerald-50" : "bg-red-50"}
        />
        <SummaryCard 
          title="利润率" 
          value={formatPercent(results.profitMargin)} 
          icon={Activity} 
          colorClass={results.profitMargin > 15 ? "text-purple-600" : results.profitMargin > 0 ? "text-emerald-600" : "text-red-600"} 
          bgClass="bg-purple-50"
        />
        <SummaryCard 
          title="公斤成本" 
          value={formatCNY(results.costPerKg)} 
          subValue="含固定分摊"
          icon={Scale} 
          colorClass="text-orange-600" 
          bgClass="bg-orange-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:space-y-6">
        
        {/* Cost Structure Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 mb-4">成本构成分析</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={results.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {results.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCNY(value)} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Simple Bar Chart comparison */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 mb-4">收支对比</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: '总成本', amount: results.totalCost, fill: '#ef4444' },
                  { name: '总收入', amount: results.totalRevenue, fill: '#3b82f6' },
                  { name: '净利润', amount: results.netProfit, fill: isProfitable ? '#10b981' : '#f59e0b' },
                ]}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={60} tick={{fontSize: 12}} />
                <Tooltip formatter={(value: number) => formatCNY(value)} cursor={{fill: 'transparent'}} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={30}>
                  {
                    [
                      { fill: '#94a3b8' }, // Cost (slate-400)
                      { fill: '#3b82f6' }, // Revenue (blue-500)
                      { fill: isProfitable ? '#10b981' : '#ef4444' } // Profit
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-slate-500 text-center">
            变动成本占比: <span className="font-bold text-slate-700">{results.totalCost > 0 ? ((results.totalVariableCost / results.totalCost) * 100).toFixed(1) : 0}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard;