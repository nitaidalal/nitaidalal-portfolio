import { Resend } from "resend";

if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
  throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL must be configured");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: `Nitai Dalal <${process.env.RESEND_FROM_EMAIL}>`,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("Email send failed:", error);
    throw new Error(error.message);
  }

  return data;
};
