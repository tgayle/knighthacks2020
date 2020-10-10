import { Router } from "express";
import { getConnection } from "typeorm";
import { CONN_SQL } from "../db";
import User, { Ethnicity, SchoolLevel } from "../entities/sql/User";

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
    password,
  } = req.body;

  try {
    if (!email || !password) {
      throw new Error("Email and password is required");
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

    if (ethnicity && !Object.values(Ethnicity).includes(ethnicity)) {
      throw new Error(
        `A valid ethnicity must be specified or null: [${Object.values(
          Ethnicity
        ).join(", ")}]`
      );
    }

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.ethnicity = ethnicity || null;
    user.email = email;
    user.password = password;
    user.satScore = Number.isNaN(parseInt(satScore))
      ? null
      : parseInt(satScore);
    user.gpa = parseFloat(gpa) >= 0.0 ? parseFloat(gpa) : null;
    user.ethnicity = ethnicity;
    user.mostEducation = mostEducation;

    await getConnection(CONN_SQL).getRepository(User).save(user);

    res.json({
      token: user.getToken(),
      user: user.clean(),
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

export default router;
