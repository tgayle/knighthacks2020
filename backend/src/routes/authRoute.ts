import { Router } from "express";
import { getConnection } from "typeorm";
import { CONN_SQL } from "../db";
import User, { SchoolLevel } from "../entities/sql/User";

const router = Router();

router.post("/register", async (req, res) => {
  const {
    email,
    ethnicity,
    firstName,
    lastName,
    mostEducation,
    gpa,
    satScore,
  } = req.body as Partial<User>;

  try {
    if (!email) {
      throw new Error("Email is required");
    }

    if (!firstName || !lastName) {
      throw new Error("First and last name are required.");
    }

    if (!mostEducation || !Object.values(SchoolLevel).includes(mostEducation)) {
      throw new Error(
        `A level of education must be specified: [${Object.values(
          SchoolLevel
        ).join(", ")}]`
      );
    }

    res.send("yes");
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

export default router;
