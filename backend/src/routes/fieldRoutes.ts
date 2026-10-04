import { Router } from "express";
import { FieldController } from "../controllers/fieldController";
import { authMiddleware } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { auditMiddleware } from "../middleware/auditLogger";

const router = Router();

router.use(authMiddleware);

router.post(
  "/field-observations",
  requirePermission("field:write"),
  auditMiddleware("INGEST_FIELD_OBSERVATION", "field"),
  FieldController.createObservation
);

router.post(
  "/field-observations/batch",
  requirePermission("field:write"),
  auditMiddleware("BATCH_SYNC_FIELD", "field"),
  FieldController.batchSync
);

router.post(
  "/field-sync",
  requirePermission("field:write"),
  auditMiddleware("SYNC_FIELD", "field"),
  FieldController.batchSync
);

router.get("/field-observations/:id", requirePermission("field:read"), FieldController.getObservationById);

router.post(
  "/field-observations/:id/photos",
  requirePermission("field:write"),
  auditMiddleware("UPLOAD_FIELD_PHOTO", "field"),
  FieldController.attachPhoto
);

router.post(
  "/field-observations/:id/align",
  requirePermission("field:read"),
  FieldController.alignGroundSatellite
);

export default router;
