import "reflect-metadata";
import express from "express";
import { config } from "dotenv";
config();
import morgan from "morgan";
import prepareDatabases, { CONN_MONGO } from "./db";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import schoolRoute from "./routes/schoolRoute";
import requireAuth from "./middleware/requireAuth";
import { fetchSchools } from "./tasks/school";
import { getConnection } from "typeorm";
import { School } from "./entities/nosql/School";

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

  let page = 57;
  let numSeen = 0;

  server.listen(3000, async () => {
    console.log("Running at http://localhost:3000");

    // while (true) {
    //   console.log("Fetching schools...", page);
    //   try {
    //     const { schools, page: curr_page, meta } = await fetchSchools(page);

    console.log("Loading courses");
    const stuffs = await getConnection(CONN_MONGO)
      .getMongoRepository(School)
      .find();

    console.log(stuffs.length);

    //     console.log("saved, current page =", curr_page);

    //     page = curr_page + 1;

    //     numSeen += schools.length;

    //     // await new Promise((r) => setTimeout(r, 5000));

    //     if (numSeen == meta.total || schools.length == 0) {
    //       break;
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
  });
}

main();
