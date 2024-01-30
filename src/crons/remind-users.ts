import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { EEmailAction } from "../enums";
import { ApiError } from "../errors";
import { tokenRepository, userRepository } from "../repositories";
import { emailService } from "../services";

dayjs.extend(utc);

const remindUsers = async function () {
  try {
    const prevMonth = dayjs().utc().subtract(30, "days");
    const oldTokens = await tokenRepository.getManyByParams({
      createdAt: { $lte: prevMonth },
    });
    oldTokens.map(async (entity) => {
      const user = await userRepository.getOneByParams({ _id: entity._userId });
      await emailService.sendMail(
        "nadinyman@gmail.com",
        EEmailAction.REMINDER,
        {
          name: user.name,
        },
      );
    });
    console.log("cron is run");
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const userReminder = new CronJob("0 0 */10 * *", remindUsers);
