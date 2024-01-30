import { EEmailAction } from "../enums";

export const emailTemplate = {
  [EEmailAction.WELCOME]: {
    templateName: "welcome",
    subject: "Glad to see you in our super duper app !!!!👋",
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    templateName: "forgot-password",
    subject: "Do not worry we kip your email under control !!!!🫡",
  },
  [EEmailAction.REMINDER]: {
    templateName: "reminder",
    subject: "Do not let go !!!!😢",
  },
};
