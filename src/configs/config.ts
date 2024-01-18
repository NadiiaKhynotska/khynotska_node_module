import { config } from "dotenv";

config();

export const configs = {
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT,
  SECRET_SALT: +process.env.SECRET_SALT,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  SECRET_REFRESH_KEY: process.env.SECRET_REFRESH_KEY,
};
