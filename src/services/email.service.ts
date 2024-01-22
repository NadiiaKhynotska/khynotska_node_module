import nodemailer from "nodemailer";

import { configs } from "../configs";

class EmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      from: "No reply",
      service: "gmail",
      auth: {
        user: configs.NO_REPLY_EMAIL,
        pass: configs.NO_REPLY_PASSWORD,
      },
    });
    //     const hbsOptions ={
    //       viewEngine:{
    // extname: ".hbs",
    //         defaultLayout:
    //       }
    //     }
  }

  public async sendMail(email: string) {
    return await this.transporter.sendMail({
      to: email,
      subject: "First email",
      html: "<div> Hello first email </div>",
    });
  }
}

export const emailService = new EmailService();
