import "reflect-metadata";
import express from "express";
import { config } from "dotenv";
config();
import morgan from "morgan";
import prepareDatabases from "./db";

const server = express();

server.use(morgan("dev"));

server.get("/", (req, res) => res.json("hello!"));

async function main() {
  await prepareDatabases();
  server.listen(3000, () => console.log("Running at http://localhost:3000"));
}

main();
