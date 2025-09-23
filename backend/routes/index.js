import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Qadence Backend API is running" });
});

export default router;
