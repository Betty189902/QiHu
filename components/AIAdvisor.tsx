import React from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { AIAnalysisResult } from '../types';

interface Props {
  aiState: AIAnalysisResult;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

const AIAdvisor: React.FC<Props> = ({ aiState, onAnalyze, canAnalyze }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-md text-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-yellow-300" />
          <h3 className="text-xl font-bold">AI 智能顾问 (Gemini)</h3>
        </div>
        {!aiState.analysis && (
           <button
           onClick={onAnalyze}
           disabled={!canAnalyze || aiState.isLoading}
           className="bg-white text-indigo-600 hover:bg-indigo-50 disabled:bg-indigo-400 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm flex items-center"
         >
           {aiState.isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
           {aiState.isLoading ? "分析中..." : "生成诊断报告"}
         </button>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-h-[100px] border border-white/10">
        {aiState.isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-indigo-100">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>正在分析成本结构和行业数据...</p>
          </div>
        ) : aiState.error ? (
          <div className="flex items-center text-red-200">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{aiState.error}</p>
          </div>
        ) : aiState.analysis ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="whitespace-pre-line leading-relaxed text-indigo-50">
              {aiState.analysis}
            </div>
            <div className="mt-4 flex justify-end">
               <button 
                 onClick={onAnalyze}
                 className="text-xs text-indigo-200 hover:text-white underline"
               >
                 重新分析
               </button>
            </div>
          </div>
        ) : (
          <div className="text-indigo-200 text-sm italic text-center py-4">
            {canAnalyze 
              ? "点击上方按钮，获取针对当前批次的成本优化与利润分析建议。" 
              : "请先在左侧输入完整的生产数据以获取AI建议。"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
