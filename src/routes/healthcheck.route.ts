import { Router } from "express";
import healthcheckController from "../controllers/healthcheck.controller";

const router = Router();
router.get("/", healthcheckController.get);

export default router;
