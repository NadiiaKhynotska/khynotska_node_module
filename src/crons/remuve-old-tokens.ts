import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ApiError } from "../errors";
import { tokenRepository } from "../repositories";

dayjs.extend(utc);

const removeOldTokens = async function () {
  try {
    const prevMonth = dayjs().utc().subtract(30, "days");
    await tokenRepository.deleteManyByParams({
      createdAt: { $lte: prevMonth },
    });
    console.log("cron is running");
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const tokenRemover = new CronJob("* * * * *", removeOldTokens);
