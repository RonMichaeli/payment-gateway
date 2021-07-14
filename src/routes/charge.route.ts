import { Router } from "express";
import { validateChargePayload, validateHeaders } from "./validations";
import chargeController from "../controllers/charge.controller";

const router = Router();
router.post("/", validateHeaders, validateChargePayload, chargeController.charge);

export default router;
