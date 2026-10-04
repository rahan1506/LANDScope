import { Router } from "express";
import { CaseController } from "../controllers/caseController";
import { authMiddleware } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { auditMiddleware } from "../middleware/auditLogger";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("cases:read"), CaseController.listCases);
router.get("/:id", requirePermission("cases:read"), CaseController.getCaseById);
router.post(
  "/",
  requirePermission("cases:write"),
  auditMiddleware("CREATE_CASE", "case"),
  CaseController.createCase
);
router.patch(
  "/:id/status",
  requirePermission("cases:write"),
  auditMiddleware("UPDATE_CASE_STATUS", "case"),
  CaseController.updateStatus
);

export default router;
