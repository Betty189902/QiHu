import { GoogleGenAI } from "@google/genai";
import { CostData, CalculationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProfitability = async (
  data: CostData,
  result: CalculationResult
): Promise<string> => {
  try {
    const prompt = `
      作为一个专业的纺织印染行业高级顾问，请分析以下染厂生产批次的成本和利润数据，并给出具体的优化建议（中文回答）。
      
      **生产数据:**
      - 客户: ${data.customerName}
      - 面料类型: ${data.fabricType}
      - 数量: ${data.quantityKg} kg
      - 报价: ¥${data.unitPrice}/kg
      
      **财务分析:**
      - 总收入: ¥${result.totalRevenue.toFixed(2)}
      - 总成本: ¥${result.totalCost.toFixed(2)}
      - 净利润: ¥${result.netProfit.toFixed(2)}
      - 利润率: ${result.profitMargin.toFixed(2)}%
      - 每公斤成本: ¥${result.costPerKg.toFixed(2)}
      
      **成本明细 (总额):**
      - 染料: ¥${data.dyesCost}
      - 助剂: ¥${data.auxiliariesCost}
      - 水费: ¥${data.waterCost}
      - 电费: ¥${data.electricityCost}
      - 蒸汽/能源: ¥${data.steamCost}
      - 人工: ¥${data.laborCost}
      - 管理/折旧: ¥${data.overheadCost}
      
      请提供简明扼要的分析：
      1. **盈利能力评价**: 这个订单的利润率在行业内处于什么水平？
      2. **成本热点**: 哪个部分的成本占比过高？(例如：如果能源占比超过30%，请特别指出)。
      3. **改进建议**: 针对该面料类型和成本结构，提出1-2条具体的降本增效建议（例如：关于浴比控制、一次成功率RFT、染料选型或能源回收）。
      
      请保持语气专业、客观、鼓励性。不要使用Markdown标题，直接分点回答。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "无法生成分析报告。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("AI分析服务暂时不可用，请检查网络或API Key。");
  }
};