import { Router } from "express";
import { FindConditions, getConnection } from "typeorm";
import qs from "qs";
import { CONN_MONGO } from "../db";
import { School } from "../entities/nosql/School";

const router = Router();

type OrderOptions<T> = {
  [P in keyof T]?: "ASC" | "DESC" | 1 | -1;
};

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
    page: number;
  };

  const {
    max_spend = Number.MAX_SAFE_INTEGER,
    commute = true,
    out_of_state = true,
    prefer_ethnicity = "",
    living_on_campus,
    loan_planned,
    looking_for_scholarships,
    work_planned,
    program_length,
    zip,
    page = 0,
  } = req.query;

  console.log(req.query);

  const where: any = {};
  const order: any = {};

  if (program_length) {
    const field = program_length === "2" ? "associate" : "bachelors";
    where["academics.stats." + field] = true;
  }

  if (prefer_ethnicity) {
    order["demographics." + prefer_ethnicity] = -1;
  }

  if (zip) {
  }

  const conn = await getConnection(CONN_MONGO).getMongoRepository(School);

  const schools = await conn.find({
    take: 20,
    where: where,
    order,
    skip: Math.abs(parseInt(page as string) * 20),
  });
  // page: parseInt(page as string) || 1,
  // TODO: Randomize admissions
  res.json(
    schools.map((s) => {
      return {
        name: s.name,
        admissionRate: s.admissions?.admission_rate || 60,
        schoolLink: s.school_url,
        male: typeof s.demographics.men === "number" ? s.demographics.men : -1,
        female:
          typeof s.demographics.women === "number" ? s.demographics.women : -1,
        age:
          typeof s.demographics.age_entry === "number"
            ? s.demographics.age_entry
            : -1,
        firstGeneration:
          typeof s.demographics.first_generation === "number"
            ? s.demographics.first_generation
            : 0,
        act: s.admissions?.average_act || 23,
        sat: s.admissions?.average_sat || 1300,
        gpa: s.admissions?.average_gpa || 3.5,
        tuition: s.admissions?.tuition || 4500,
        city: s.location.city,
        state: s.location.state,
        black: parseFloat((s.demographics.black * 100).toFixed(2)),
        asian: parseFloat((s.demographics.asian * 100).toFixed(2)),
        white: parseFloat((s.demographics.white * 100).toFixed(2)),
        aian: parseFloat((s.demographics.aian * 100).toFixed(2)),
        hispanic: parseFloat((s.demographics.hispanic * 100).toFixed(2)),
      };
    })
  );
});

router.get("/todos", async (req, res) => {});

export default router;
