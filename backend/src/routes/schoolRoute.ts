import { Router } from "express";

const router = Router();

router.get("/search", async (req, res) => {
  type Query = {
    max_spend: number;
    commute: boolean;
    out_of_state: boolean;
    living_on_campus: boolean;
    work_planned: boolean;
    expected_years: number;
    prefer_ethnicity: boolean;
    loan_planned: boolean;
  };
});

export default router;
