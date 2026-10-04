import { Mutation, Parcel } from "../types";

export interface MutationComparisonInput {
  registeredAreaHa: number;
  observedAreaHa: number;
  surveyNumber: string;
  mutationDate?: string;
  isSplitOrMerge?: boolean;
  boundaryDriftMeters?: number;
}

export interface MutationComparisonResult {
  discrepancyScore: number; // 0 - 100
  areaMismatchPct: number;
  isAreaSignificant: boolean;
  boundaryDriftMeters: number;
  splitMergeAnomaly: boolean;
  summary: string;
  reconciliationRequired: boolean;
}

export class MutationEngine {
  /**
   * Compares registered revenue record attributes against observed/physical spatial realities.
   */
  static compare(input: MutationComparisonInput): MutationComparisonResult {
    const areaDiff = Math.abs(input.observedAreaHa - input.registeredAreaHa);
    const areaMismatchPct = Number(
      ((areaDiff / (input.registeredAreaHa || 1)) * 100).toFixed(2)
    );

    const isAreaSignificant = areaMismatchPct > 5.0; // Over 5% threshold
    const boundaryDriftMeters = input.boundaryDriftMeters || (isAreaSignificant ? 4.2 : 0.6);
    const splitMergeAnomaly = Boolean(input.isSplitOrMerge && areaMismatchPct > 2.0);

    // Compute discrepancy score
    let score = 0;
    if (areaMismatchPct > 20) score += 40;
    else if (areaMismatchPct > 5) score += 25;
    else score += 5;

    if (boundaryDriftMeters > 5.0) score += 35;
    else if (boundaryDriftMeters > 2.0) score += 20;
    else score += 5;

    if (splitMergeAnomaly) score += 25;

    const discrepancyScore = Math.min(100, Math.max(0, score));
    const reconciliationRequired = discrepancyScore >= 35;

    let summary = "Revenue records and physical cadastral boundary are largely consistent.";
    if (discrepancyScore >= 65) {
      summary = `Severe discrepancy detected: ${areaMismatchPct}% area divergence and ${boundaryDriftMeters}m boundary drift indicate unrecorded partition or encroachment.`;
    } else if (discrepancyScore >= 35) {
      summary = `Moderate mismatch: Observed area (${input.observedAreaHa} Ha) differs by ${areaMismatchPct}% from registered area (${input.registeredAreaHa} Ha).`;
    }

    return {
      discrepancyScore,
      areaMismatchPct,
      isAreaSignificant,
      boundaryDriftMeters,
      splitMergeAnomaly,
      summary,
      reconciliationRequired,
    };
  }
}
