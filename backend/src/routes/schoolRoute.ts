import { Router } from "express";

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
  res.json({});
});

export default router;
