import { Router } from "express";
import { UlpinController } from "../controllers/ulpinController";
import { authMiddleware } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.use(authMiddleware);

router.get("/:ulpin", requirePermission("parcels:read"), UlpinController.resolve);

export default router;
