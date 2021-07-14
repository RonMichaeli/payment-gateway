import { Router } from "express";
import { validateHeaders } from "./validations";
import chargeStatusController from "../controllers/chargeStatus.controller";

const router = Router();
router.get("/", validateHeaders, chargeStatusController.get);

export default router;