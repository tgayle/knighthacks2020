import "reflect-metadata";
import express from "express";
import { config } from "dotenv";
config();
import morgan from "morgan";
import prepareDatabases from "./db";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import schoolRoute from "./routes/schoolRoute";
import requireAuth from "./middleware/requireAuth";

const server = express();

server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => res.json("hello!"));

server.use("/user", requireAuth, userRoute);
server.use("/school", requireAuth, schoolRoute);
server.use("/auth", authRoute);

async function main() {
  await prepareDatabases();
  server.listen(3000, () => console.log("Running at http://localhost:3000"));
}

main();
