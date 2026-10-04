import { Router } from "express";
import { EvidenceController } from "../controllers/evidenceController";
import { authMiddleware } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { auditMiddleware } from "../middleware/auditLogger";

const router = Router();

// Public verification endpoint
router.get("/verify/:caseId", EvidenceController.verify);

// Protected generation endpoint
router.post(
  "/generate/:caseId",
  authMiddleware,
  requirePermission("evidence:write"),
  auditMiddleware("GENERATE_EVIDENCE_DOSSIER", "evidence"),
  EvidenceController.generate
);

export default router;
