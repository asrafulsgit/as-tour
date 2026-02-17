import { sendEmail } from "../../utils/sendMail";
import { IContact } from "./contact.interface";

const contactService = async (payload: IContact) => {
  await sendEmail({
    to: "sourob2356@gmail.com",
    subject: payload.subject,
    templateName: "message",
    templateData: {
      name: payload.name,
      email : payload.email,
      subject: payload.subject,
      message: payload.message,
    },
  });
};

export const userServices = {
  contactService,
};
