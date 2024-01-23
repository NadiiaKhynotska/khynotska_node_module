import { EEmailAction } from "../enums";

export const emailTemplate = {
  [EEmailAction.WELCOME]: {
    templateName: "Welcome",
    subject: "Glad to see you in our super duper app !!!!👋",
  },
  [EEmailAction.FORGOT]: {
    templateName: "Forgot password",
    subject: "Do not worry we kip your email under control !!!!🫡",
  },
};
