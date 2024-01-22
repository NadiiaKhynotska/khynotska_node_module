import { config } from "dotenv";

config();

const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_DATABASE,
  DB_HOST,
  DB_PORT,
} = process.env;

export const configs = {
  DB_URI: `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${DB_HOST}:${DB_PORT}/${MONGO_INITDB_DATABASE}`,
  PORT: process.env.PORT,

  SECRET_SALT: +process.env.SECRET_SALT,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  SECRET_REFRESH_KEY: process.env.SECRET_REFRESH_KEY,

  NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL,
  NO_REPLY_PASSWORD: process.env.NO_REPLY_PASSWORD,
};
