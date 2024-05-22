import { Request, Response, NextFunction } from "express";
import { userModel } from "_app/models";
import * as fs from "fs";

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const PORT = process.env.PORT || 3000;
const app = express();

const myOAuth2Client = new OAuth2(
  "758091215662-a8quu3phbis1t3em84hc4er2djb36ubn.apps.googleusercontent.com",
  "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",
  "https://developers.google.com/oauthplayground"
);

myOAuth2Client.setCredentials({
  refresh_token:
    "1//04OxJEPLjhKCtCgYIARAAGAQSNwF-L9IrzlrGt3gIHV6M_QPNvkB5wO9VzdGCWs1wo0kVt-66o0jFR4Lc7ZGNZWqhPzUZbEdw_ug",
});
const myAccessToken = myOAuth2Client.getAccessToken();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "support@wafflestock.com", //your gmail account you used to set the project up in google cloud console"
    clientId: "758091215662-a8quu3phbis1t3em84hc4er2djb36ubn.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04OxJEPLjhKCtCgYIARAAGAQSNwF-L9IrzlrGt3gIHV6M_QPNvkB5wO9VzdGCWs1wo0kVt-66o0jFR4Lc7ZGNZWqhPzUZbEdw_ug",
    accessToken: myAccessToken, //access token variable we defined earlier
  },
});

app.use(bodyParser.json());

export class MailerService {
  static _mailsInstance: MailerService = null;

  static getInstance() {
    if (!MailerService._mailsInstance) {
      MailerService._mailsInstance = new MailerService();
    }
    return MailerService._mailsInstance;
  }

  public async sendEmail(receiverEmail: String, subject: String, html: String) {
    //const html = fs.readFileSync(__dirname + "/../emailTemplates/verify-email.html", "utf8").toString();
    var mailOptions = {
      from: "<Support> support@wafflestock.com", // sender
      to: receiverEmail, // receiver
      subject: subject, // Subject
      // html: '<p>You have received this email using nodemailer, you are welcome123 ;)</p>'// html body
      html: html, //'<p>You have received this email using nodemailer, you are welcome123 ;)</p>'
    };

    transport.sendMail(mailOptions, function (err: any, result: any) {
      if (err) {
        return err;
      } else {
        transport.close();
        return result;
      }
    });
  }
}