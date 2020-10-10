import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { getConnection } from "typeorm";
import { CONN_SQL } from "../db";
import User from "../entities/sql/User";

export default async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  const error = () => {
    return res.status(401).json({
      message: "You must be logged in to access this.",
    });
  };

  if (!authHeader) {
    return error();
  }

  const sections = authHeader.split(" ");

  if (sections[0].toLowerCase() !== "bearer") {
    return error();
  }

  try {
    const token: any = jsonwebtoken.verify(
      sections[1],
      process.env.JWT_KEY!
    ) as object;
    console.log(token);

    req.currentUser = (await getConnection(CONN_SQL)
      .getRepository(User)
      .findOne(token.id))!;

    return next();
  } catch (e) {
    return error();
  }
}
