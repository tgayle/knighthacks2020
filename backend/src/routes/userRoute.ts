import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await req.currentUser.clean());
});

export default router;
