import { Router } from "express";
import { exportTrafficReportCsv, getTrafficReport } from "../controllers/reportController.js";

const router = Router();

router.get("/reports/traffic", getTrafficReport);
router.get("/reports/traffic.csv", exportTrafficReportCsv);

export default router;
