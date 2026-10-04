import { RiskScoreResult, RiskFactor, SeverityLevel } from "../types";

export interface RiskEvaluationInputs {
  mutationMismatchPct: number;
  boundaryMismatchMeters: number;
  builtUpChangePct: number;
  waterbodyOverlapPct: number;
  isEcoSensitiveOrForest: boolean;
  fieldDiscrepancyReported: boolean;
  historicalAnomalyCount: number;
}

export interface RiskWeightsConfig {
  builtUpWeight: number; // default 25
  mutationWeight: number; // default 20
  boundaryWeight: number; // default 15
  waterbodyWeight: number; // default 20
  ecoSensitiveWeight: number; // default 10
  fieldDiscrepancyWeight: number; // default 10
}

export const DEFAULT_RISK_WEIGHTS: RiskWeightsConfig = {
  builtUpWeight: 25,
  mutationWeight: 20,
  boundaryWeight: 15,
  waterbodyWeight: 20,
  ecoSensitiveWeight: 10,
  fieldDiscrepancyWeight: 10,
};

export class RiskScoringService {
  /**
   * Evaluates composite risk score 0 - 100 based on multi-disciplinary indicators.
   */
  static evaluate(
    inputs: RiskEvaluationInputs,
    weights: RiskWeightsConfig = DEFAULT_RISK_WEIGHTS
  ): RiskScoreResult {
    const factors: RiskFactor[] = [];
    let totalScore = 0;

    // 1. Built-up expansion on non-permitted land
    const builtUpNorm = Math.min(1.0, Math.max(0, inputs.builtUpChangePct / 50));
    const builtUpScore = Math.round(builtUpNorm * weights.builtUpWeight);
    totalScore += builtUpScore;
    factors.push({
      name: "Built-up expansion",
      weight: weights.builtUpWeight,
      value: inputs.builtUpChangePct,
      scoreContribution: builtUpScore,
      evidence: `${inputs.builtUpChangePct}% surface expansion detected by NDBI telemetry`,
    });

    // 2. Mutation & area mismatch
    const mutNorm = Math.min(1.0, Math.max(0, inputs.mutationMismatchPct / 30));
    const mutScore = Math.round(mutNorm * weights.mutationWeight);
    totalScore += mutScore;
    factors.push({
      name: "Mutation record mismatch",
      weight: weights.mutationWeight,
      value: inputs.mutationMismatchPct,
      scoreContribution: mutScore,
      evidence: `${inputs.mutationMismatchPct}% area divergence between physical cadastre and revenue master`,
    });

    // 3. Boundary drift / Cadastral displacement
    const boundaryNorm = Math.min(1.0, Math.max(0, inputs.boundaryMismatchMeters / 10));
    const boundaryScore = Math.round(boundaryNorm * weights.boundaryWeight);
    totalScore += boundaryScore;
    factors.push({
      name: "Boundary vector drift",
      weight: weights.boundaryWeight,
      value: inputs.boundaryMismatchMeters,
      scoreContribution: boundaryScore,
      evidence: `${inputs.boundaryMismatchMeters}m displacement against state cadastre shapefile`,
    });

    // 4. Waterbody overlap / wetland encroachment
    const waterNorm = Math.min(1.0, Math.max(0, inputs.waterbodyOverlapPct / 25));
    const waterScore = Math.round(waterNorm * weights.waterbodyWeight);
    totalScore += waterScore;
    factors.push({
      name: "Waterbody / Wetland overlap",
      weight: weights.waterbodyWeight,
      value: inputs.waterbodyOverlapPct,
      scoreContribution: waterScore,
      evidence: `${inputs.waterbodyOverlapPct}% potential encroachment into waterbody catchment`,
    });

    // 5. Environmental overlay / protected forest
    const ecoScore = inputs.isEcoSensitiveOrForest ? weights.ecoSensitiveWeight : 0;
    totalScore += ecoScore;
    factors.push({
      name: "Environmental / Forest overlay",
      weight: weights.ecoSensitiveWeight,
      value: inputs.isEcoSensitiveOrForest ? 1 : 0,
      scoreContribution: ecoScore,
      evidence: inputs.isEcoSensitiveOrForest
        ? "Parcel falls within protected ESZ / Forest Conservation Act jurisdiction"
        : "Standard non-restricted classification",
    });

    // 6. Ground field discrepancy
    const fieldScore = inputs.fieldDiscrepancyReported ? weights.fieldDiscrepancyWeight : 0;
    totalScore += fieldScore;
    factors.push({
      name: "Field inspection discrepancy",
      weight: weights.fieldDiscrepancyWeight,
      value: inputs.fieldDiscrepancyReported ? 1 : 0,
      scoreContribution: fieldScore,
      evidence: inputs.fieldDiscrepancyReported
        ? "Ground Patwari report verified ongoing unapproved excavation or construction"
        : "No adverse ground verification reports",
    });

    totalScore = Math.min(100, Math.max(0, totalScore));

    let severity: SeverityLevel = "LOW";
    if (totalScore >= 75) severity = "CRITICAL";
    else if (totalScore >= 50) severity = "HIGH";
    else if (totalScore >= 25) severity = "MEDIUM";

    let recommendedAction = "Continue routine quarterly satellite surveillance.";
    if (severity === "CRITICAL") {
      recommendedAction = "Issue immediate stop-work notice; dispatch Revenue Inspector and police team for site seal.";
    } else if (severity === "HIGH") {
      recommendedAction = "Order Bhu-Mitra field verification and summon owner for Section 95 KLR hearing.";
    } else if (severity === "MEDIUM") {
      recommendedAction = "Review latest sub-division partition mutation with Taluk revenue officer.";
    }

    const explanation = `Composite sovereign risk evaluated at ${totalScore}/100 (${severity}). Top driver: ${
      factors.sort((a, b) => b.scoreContribution - a.scoreContribution)[0]?.name
    }.`;

    return {
      score: totalScore,
      severity,
      factors,
      explanation,
      recommendedAction,
    };
  }
}
