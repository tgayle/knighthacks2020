import { ConnectionOptions, createConnections } from "typeorm";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const MONGO_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_CLUSTER}` +
  `.wcclv.gcp.mongodb.net/${process.env.MONGO_DB}` +
  "?retryWrites=true&w=majority";

const SQL_CONNECTION: PostgresConnectionOptions = {
  type: "postgres",
  synchronize: true,
  name: "sql_conn",
  logging: true,
  entities: ["src/entities/sql/*.ts"],
  host: process.env.PG_HOST,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
};

const MONGO_CONNECTION: MongoConnectionOptions = {
  type: "mongodb",
  synchronize: true,
  name: "mongo_conn",
  url: MONGO_URI,
  useNewUrlParser: true,
  logging: true,
  useUnifiedTopology: true,
  entities: ["src/entities/nosql/*.ts"],
};

export async function prepareMongoDb() {}

export async function prepareMainDb() {}

export default async function prepare() {
  await createConnections([SQL_CONNECTION, MONGO_CONNECTION]);
}
