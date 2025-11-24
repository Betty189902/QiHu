import React from 'react';
import { CostData } from '../types';
import { Droplets, Zap, User, Beaker, DollarSign, Package, FileText, Layers } from 'lucide-react';

interface Props {
  data: CostData;
  onChange: (key: keyof CostData, value: string | number) => void;
  onCalculate: () => void;
}

const CostInputForm: React.FC<Props> = ({ data, onChange, onCalculate }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    onChange(name as keyof CostData, type === 'number' ? parseFloat(value) || 0 : value);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-blue-600" />
        生产批次录入
      </h2>

      <div className="space-y-6">
        {/* Section 1: Order Info */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">基本信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">批次号/单号</label>
              <input
                type="text"
                name="batchId"
                value={data.batchId}
                onChange={handleChange}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="例如: DY-2023-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">客户名称</label>
              <input
                type="text"
                name="customerName"
                value={data.customerName}
                onChange={handleChange}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">面料类型</label>
              <input
                type="text"
                name="fabricType"
                value={data.fabricType}
                onChange={handleChange}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="例如: 纯棉针织, 涤纶"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">加工数量 (kg)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Layers className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="quantityKg"
                  value={data.quantityKg || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Revenue */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
           <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-3">报价信息</h3>
           <div>
              <label className="block text-sm font-medium text-green-900 mb-1">加工单价 (¥/kg)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <input
                  type="number"
                  name="unitPrice"
                  value={data.unitPrice || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-green-300 pl-10 focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
        </div>

        {/* Section 3: Direct Materials */}
        <div className="bg-white p-0">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">直接材料成本</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">染料总额 (¥)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Beaker className="h-4 w-4 text-indigo-500" />
                </div>
                <input
                  type="number"
                  name="dyesCost"
                  value={data.dyesCost || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">助剂总额 (¥)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Beaker className="h-4 w-4 text-indigo-300" />
                </div>
                <input
                  type="number"
                  name="auxiliariesCost"
                  value={data.auxiliariesCost || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">包装材料 (¥)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Package className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="packagingCost"
                  value={data.packagingCost || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Energy & Water */}
        <div className="bg-white p-0">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">能源与动力</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">水费 (¥)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                </div>
                <input
                  type="number"
                  name="waterCost"
                  value={data.waterCost || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">电费 (¥)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
                <input
                  type="number"
                  name="electricityCost"
                  value={data.electricityCost || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">蒸汽/天然气 (¥)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Zap className="h-4 w-4 text-orange-500" />
                </div>
                <input
                  type="number"
                  name="steamCost"
                  value={data.steamCost || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Labor & Overhead */}
        <div className="bg-white p-0">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">人工与制造费用</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">直接人工 (¥)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="laborCost"
                  value={data.laborCost || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">折旧/管理分摊 (¥)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="overheadCost"
                  value={data.overheadCost || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostInputForm;