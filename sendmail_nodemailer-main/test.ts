import * as express from 'express';
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const PORT = process.env.PORT || 3000;
const app = express()as express.Application;;

const myOAuth2Client = new OAuth2(
  "758091215662-a8quu3phbis1t3em84hc4er2djb36ubn.apps.googleusercontent.com",
  "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",
  "https://developers.google.com/oauthplayground"
);

myOAuth2Client.setCredentials({
  refresh_token:
    "1//04OxJEPLjhKCtCgYIARAAGAQSNwF-L9IrzlrGt3gIHV6M_QPNvkB5wO9VzdGCWs1wo0kVt-66o0jFR4Lc7ZGNZWqhPzUZbEdw_ug",
});

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "support@wafflestock.com",
    clientId: "758091215662-a8quu3phbis1t3em84hc4er2djb36ubn.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04OxJEPLjhKCtCgYIARAAGAQSNwF-L9IrzlrGt3gIHV6M_QPNvkB5wO9VzdGCWs1wo0kVt-66o0jFR4Lc7ZGNZWqhPzUZbEdw_ug",
    accessToken: myOAuth2Client.getAccessToken(),
  },
});

app.use(bodyParser.json());

class MailerService {
  private static _mailInstance: MailerService | null = null;

  private constructor() {}

  static getInstance(): MailerService {
    if (!MailerService._mailInstance) {
      MailerService._mailInstance = new MailerService();
    }
    return MailerService._mailInstance as MailerService;
  }

  public async sendEmail(receiverEmail: string, subject: string, html: string) {
    const mailOptions = {
      from: "<Support> support@wafflestock.com",
      to: receiverEmail,
      subject: subject,
      html: html,
    };

    try {
      const result = await transport.sendMail(mailOptions);
      console.log("Email sent successfully:", result);
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

app.post("/send-email", async (req, res) => {
  const { receiverEmail, subject, html } = req.body;

  try {
    await MailerService.getInstance().sendEmail(receiverEmail, subject, html);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
