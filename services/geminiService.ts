// services/geminiService.ts
// 先用“本地分析”，不用真正连接 Gemini，这样不用 API Key，网站也不会白屏

import { CostData, CalculationResult } from "../types";

export async function analyzeProfitability(
  data: CostData,
  result: CalculationResult
): Promise<string> {
  const {
    totalRevenue,
    totalCost,
    netProfit,
    profitMargin,
    costPerKg,
    totalVariableCost,
    totalFixedCost,
  } = result;

  const profitLevel =
    netProfit > 0
      ? profitMargin > 20
        ? "利润率非常理想，可以作为重点客户和主打产品。"
        : profitMargin > 10
        ? "利润率还不错，但可以继续优化成本结构。"
        : "虽然不亏，但利润率偏低，需要重点关注成本或提价空间。"
      : "当前是亏损批次，需要马上复盘定价和成本。";

  const variableRatio =
    totalCost > 0 ? (totalVariableCost / totalCost) * 100 : 0;
  const fixedRatio =
    totalCost > 0 ? (totalFixedCost / totalCost) * 100 : 0;

  const suggestions: string[] = [];

  if (variableRatio > 60) {
    suggestions.push(
      "本批次的**变动成本占比较高**，可以从染料、助剂、水电蒸汽等环节入手，逐项核算单耗是否偏高。"
    );
  } else {
    suggestions.push(
      "本批次的变动成本占比相对合理，可以进一步关注人工和管理费用的摊销策略。"
    );
  }

  if (fixedRatio > 40) {
    suggestions.push(
      "固定成本（人工 + 管理/折旧）占比偏高，建议检查人员配置、班次安排，以及折旧分摊口径是否需要优化。"
    );
  }

  if (costPerKg > 0 && data.unitPrice > 0) {
    const diff = data.unitPrice - costPerKg;
    if (diff < 0) {
      suggestions.push(
        `当前染费单价为 ¥${data.unitPrice.toFixed(
          2
        )}/kg，单位成本约 ¥${costPerKg.toFixed(
          2
        )}/kg，**已经出现倒挂**，建议及时与业务/客户沟通，评估是否需要调价或优化工艺。`
      );
    } else if (diff < costPerKg * 0.1) {
      suggestions.push(
        `染费单价与单位成本之间的差额只有约 ¥${diff.toFixed(
          2
        )}/kg，安全垫较薄，可以通过提高平均单价或降低单耗来提升利润空间。`
      );
    } else {
      suggestions.push(
        "染费单价与单位成本之间有一定差额，目前利润空间尚可，可以在不影响品质的前提下继续优化水电蒸汽等能耗。"
      );
    }
  }

  return [
    `### 批次盈利总体评价`,
    `本批次客户：${data.customerName || "（未填写）"}；布种：${
      data.fabricType || "（未填写）"
    }；数量：${data.quantityKg || 0} kg。`,
    `总收入约 **¥${totalRevenue.toFixed(
      2
    )}**，总成本约 **¥${totalCost.toFixed(
      2
    )}**，净利润约 **¥${netProfit.toFixed(2)}**，利润率约 **${profitMargin.toFixed(
      2
    )}%**。`,
    "",
    profitLevel,
    "",
    `### 成本结构观察`,
    `- 变动成本约占总成本 **${variableRatio.toFixed(1)}%**；`,
    `- 固定成本约占总成本 **${fixedRatio.toFixed(1)}%**；`,
    "",
    `单位成本约 **¥${costPerKg.toFixed(
      3
    )}/kg**，当前染费单价为 **¥${data.unitPrice.toFixed(
      3
    )}/kg**。`,
    "",
    `### 优化建议（本地规则引擎给出的建议，并非真正 AI 模型）`,
    ...suggestions.map((s, i) => `${i + 1}. ${s}`),
  ].join("\n");
}
