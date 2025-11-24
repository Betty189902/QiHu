import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

const SummaryCard: React.FC<Props> = ({ title, value, subValue, icon: Icon, colorClass, bgClass }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between transition hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${colorClass}`}>{value}</h3>
        {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-lg ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
  );
};

export default SummaryCard;
