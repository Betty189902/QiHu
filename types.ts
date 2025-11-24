export interface CostData {
  batchId: string;
  customerName: string;
  fabricType: string;
  quantityKg: number; // 生产数量 (kg)
  unitPrice: number; // 单价 (CNY/kg)
  
  // Variable Costs (Variable per batch/weight)
  dyesCost: number; // 染料总成本
  auxiliariesCost: number; // 助剂总成本
  waterCost: number; // 水费
  electricityCost: number; // 电费
  steamCost: number; // 蒸汽/天然气费用
  packagingCost: number; // 包装材料费
  
  // Fixed/Labor Costs allocated to this batch
  laborCost: number; // 直接人工
  overheadCost: number; // 厂房折旧/管理分摊
}

export interface CalculationResult {
  totalRevenue: number;
  totalVariableCost: number;
  totalFixedCost: number;
  totalCost: number;
  netProfit: number;
  profitMargin: number; // Percentage
  costPerKg: number;
  breakdown: {
    name: string;
    value: number;
    color: string;
  }[];
}

export interface AIAnalysisResult {
  analysis: string;
  isLoading: boolean;
  error: string | null;
}