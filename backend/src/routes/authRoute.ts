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

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.ethnicity = ethnicity || null;
    user.email = email;
    user.password = password;
    user.gpa = parseFloat(gpa) >= 0.0 ? parseFloat(gpa) : null;
    user.mostEducation = mostEducation;

    await getConnection(CONN_SQL).getRepository(User).save(user);

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        ethnicity: user.ethnicity,
        email: user.email,
        password: user.password,
        gpa: user.gpa,
        mostEducation: user.mostEducation,
      },
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

export default router;
