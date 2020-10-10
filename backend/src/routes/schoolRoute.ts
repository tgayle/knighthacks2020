import { Router } from "express";
import { getConnection } from "typeorm";
import { CONN_MONGO } from "../db";
import { School } from "../entities/nosql/School";

const router = Router();

router.get("/search", async (req, res) => {
  type Query = {
    max_spend: number;
    commute: boolean;
    out_of_state: boolean;
    prefer_ethnicity: boolean;
    living_on_campus: boolean;
    loan_planned: boolean;
    looking_for_scholarships: boolean;
    work_planned: boolean;
    program_length: number;
  };

  console.log(req.query);
  res.json({
    page: 1,
    schools: await getConnection(CONN_MONGO).getMongoRepository(School).find({
      take: 3,
    }),
  });
});

export default router;
