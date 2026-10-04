import { Router } from "express";
import { RiskController } from "../controllers/riskController";
import { authMiddleware } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.use(authMiddleware);

router.post("/evaluate", requirePermission("sentinel:read"), RiskController.evaluate);

export default router;
