import { Router } from "express";
import { MutationController } from "../controllers/mutationController";
import { authMiddleware } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { auditMiddleware } from "../middleware/auditLogger";

const router = Router();

router.use(authMiddleware);

router.post("/compare", requirePermission("mutations:read"), MutationController.compare);
router.get("/:id", requirePermission("mutations:read"), MutationController.getById);
router.post(
  "/",
  requirePermission("mutations:write"),
  auditMiddleware("CREATE_MUTATION", "mutation"),
  MutationController.create
);

export default router;
