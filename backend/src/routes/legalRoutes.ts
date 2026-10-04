import { Router } from "express";
import { LegalController } from "../controllers/legalController";
import { authMiddleware } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { auditMiddleware } from "../middleware/auditLogger";

const router = Router();

router.use(authMiddleware);

router.get("/acts", requirePermission("legal:read"), LegalController.listActs);
router.get("/acts/:id", requirePermission("legal:read"), LegalController.getActById);
router.get("/search", requirePermission("legal:read"), LegalController.search);
router.post(
  "/analyze-parcel",
  requirePermission("legal:read"),
  auditMiddleware("ANALYZE_LEGAL_PARCEL", "parcel"),
  LegalController.analyzeParcel
);
router.post(
  "/ask",
  requirePermission("legal:read"),
  auditMiddleware("LEGAL_RAG_QUERY", "legal"),
  LegalController.askLegalQuestion
);

export default router;
