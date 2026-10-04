import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";
import { auditMiddleware } from "../middleware/auditLogger";

const router = Router();

router.post("/login", AuthController.login);
router.get("/me", authMiddleware, AuthController.me);

export default router;
