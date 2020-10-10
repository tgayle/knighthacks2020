import User from "../entities/sql/User";
import { Request } from "express-serve-static-core";

declare module "express" {
  import { Request } from "express";
  import { Request } from "express-serve-static-core";

  export interface Request {
    currentUser: User;
  }
}

declare module "express-serve-static-core" {
  import { Request } from "express";
  import { Request } from "express-serve-static-core";

  export interface Request {
    currentUser: User;
  }
}
