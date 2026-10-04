import { Router } from "express";
import { ChangeDetectionController } from "../controllers/changeDetectionController";
import { authMiddleware } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { auditMiddleware } from "../middleware/auditLogger";

const router = Router();

router.use(authMiddleware);

router.post(
  "/analyze",
  requirePermission("sentinel:write"),
  auditMiddleware("ANALYZE_CHANGE_DETECTION", "parcel"),
  ChangeDetectionController.analyze
);

export default router;
