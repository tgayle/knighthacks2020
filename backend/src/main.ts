import "reflect-metadata";
import express from "express";
import morgan from "morgan";

const server = express();

server.use(morgan("dev"));

server.get("/", (req, res) => res.json("hello!"));

server.listen(3000, () => console.log("Running at http://localhost:3000"));
