import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.json(req.currentUser.clean());
});

export default router;
