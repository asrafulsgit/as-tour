import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import { envs } from "../config/env";
import AppError from "../errorHelpers/appError";

const transporter = nodemailer.createTransport({
  host: envs.SMTP_HOST,
  port: Number(envs.SMTP_PORT),
  secure: Number(envs.SMTP_PORT) === 465,  
  auth: {
    user: envs.SMTP_USER,
    pass: envs.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    // Use project root for templates (works in dev & production)
    const templatePath = path.join(
      process.cwd(),
      "src/app/utils/templates",
      `${templateName}.ejs`
    );

    // Render EJS template
    const html = await ejs.renderFile(templatePath, templateData);

    // Send email
    const info = await transporter.sendMail({
      from: envs.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
    });

    console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error("Email sending error details:", error);
    throw new AppError(500, "Email sending failed: " + error.message);
  }
};