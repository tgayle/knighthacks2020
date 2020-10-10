import { Router } from "express";
import { getConnection } from "typeorm";
import { CONN_SQL } from "../db";
import User, { Ethnicity, Gender, SchoolLevel } from "../entities/sql/User";
import UserInterests from "../entities/sql/UserInterests";

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
    gender,
    password,
    interests = [] as string[],
  } = req.body as Record<string, string> & { interests: string[] };

  try {
    if (!email || !password) {
      throw new Error("Email and password is required");
    }

    if (!firstName || !lastName) {
      throw new Error("First and last name are required.");
    }

    if (
      !mostEducation ||
      !Object.values(SchoolLevel).includes(mostEducation as SchoolLevel)
    ) {
      throw new Error(
        `A level of education must be specified: [${Object.values(
          SchoolLevel
        ).join(", ")}]`
      );
    }

    if (
      ethnicity &&
      !Object.values(Ethnicity).includes(ethnicity as Ethnicity)
    ) {
      throw new Error(
        `A valid ethnicity must be specified or null: [${Object.values(
          Ethnicity
        ).join(", ")}]`
      );
    }

    if (!gender || !Object.values(Gender).includes(gender as Gender)) {
      throw new Error(
        `A valid gender must be specified or null: [${Object.values(
          Gender
        ).join(", ")}]`
      );
    }

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.ethnicity = (ethnicity as Ethnicity) || null;
    user.email = email;
    user.gender = gender as Gender;
    user.password = password;
    user.satScore = Number.isNaN(parseInt(satScore))
      ? null
      : parseInt(satScore);
    user.gpa = parseFloat(gpa) >= 0.0 ? parseFloat(gpa) : null;
    user.mostEducation = mostEducation as SchoolLevel;
    user.interests = interests.map((i) => {
      const interest = new UserInterests();
      interest.user = user;
      interest.interest = i;
      return interest;
    });

    await getConnection(CONN_SQL).getRepository(User).save(user);

    res.json({
      token: user.getToken(),
      user: await user.clean(),
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

export default router;
