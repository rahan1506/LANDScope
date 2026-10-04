import { Router } from "express";
import { ParcelController } from "../controllers/parcelController";
import { authMiddleware } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";
import { auditMiddleware } from "../middleware/auditLogger";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("parcels:read"), ParcelController.listParcels);
router.post("/nearby", requirePermission("parcels:read"), ParcelController.getNearbyParcels);
router.get("/:id", requirePermission("parcels:read"), ParcelController.getParcelById);
router.get("/:id/ndvi", requirePermission("sentinel:read"), auditMiddleware("VIEW_NDVI", "parcel"), ParcelController.getParcelNdvi);
router.get("/:id/ndbi", requirePermission("sentinel:read"), auditMiddleware("VIEW_NDBI", "parcel"), ParcelController.getParcelNdbi);
router.get("/:id/ulpin", requirePermission("parcels:read"), ParcelController.getParcelUlpin);
router.get("/:id/mutations", requirePermission("mutations:read"), ParcelController.getParcelMutations);

export default router;
