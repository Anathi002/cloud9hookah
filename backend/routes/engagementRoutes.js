import { Router } from "express";
import {
  captureLead,
  createBookingRequest,
  submitReview,
  trackEngagementEvent,
} from "../controllers/engagementController.js";

const router = Router();

router.post("/book-now", createBookingRequest);
router.post("/engagement/event", trackEngagementEvent);
router.post("/engagement/lead", captureLead);
router.post("/reviews", submitReview);

export default router;
