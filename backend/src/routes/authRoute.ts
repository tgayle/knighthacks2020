import { Router } from "express";
import { getConnection } from "typeorm";
import { CONN_SQL } from "../db";
import User from "../entities/sql/User";

const router = Router();

router.post("/register", async (req, res) => {
  res.json(await getConnection(CONN_SQL).getRepository(User).find());
});

export default router;
