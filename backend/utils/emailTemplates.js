// ─── 1. Auto-reply to user after contact form ─────────
export const userAutoReplyTemplate = ({ name, subject, message }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thank you for reaching out</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#ffffff;
                      border-radius:16px;overflow:hidden;
                      border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3a7d5c,#4fa876);
                       padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;
                         font-weight:700;letter-spacing:-0.5px;">
                Nitai Dalal
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);
                        font-size:14px;">
                Full Stack Developer
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="margin:0 0 8px;font-size:22px;font-weight:700;
                        color:#1a1a1a;">
                Hey ${name}! 👋
              </p>

              <p style="margin:0 0 24px;font-size:15px;color:#71717a;
                        line-height:1.6;">
                Thanks for reaching out! I've received your message and
                will get back to you as soon as possible.
              </p>

              <!-- Message preview card -->
              <div style="background:#f4f4f5;border-radius:12px;
                          padding:20px;margin-bottom:24px;
                          border-left:4px solid #3a7d5c;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:600;
                           color:#71717a;text-transform:uppercase;
                           letter-spacing:0.05em;">
                  Your message
                </p>
                ${subject ? `<p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#3a3a3a;">Subject: ${subject}</p>` : ""}
                <p style="margin:0;font-size:14px;color:#3a3a3a;
                           line-height:1.6;font-style:italic;">
                  "${
                    message.length > 200
                      ? message.slice(0, 200) + "..."
                      : message
                  }"
                </p>
              </div>

              <p style="margin:0 0 24px;font-size:15px;color:#71717a;
                        line-height:1.6;">
                In the meantime, feel free to explore my portfolio or
                connect with me on LinkedIn. I typically respond within
                <strong style="color:#1a1a1a;">24–48 hours</strong>.
              </p>

              <!-- CTA buttons -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding-right:12px;">
                    <a href="${process.env.CLIENT_URL}"
                       style="display:inline-block;background:#3a7d5c;
                              color:#ffffff;text-decoration:none;
                              padding:12px 24px;border-radius:10px;
                              font-size:14px;font-weight:600;">
                      View Portfolio
                    </a>
                  </td>
                  <td>
                    <a href="${process.env.LINKEDIN_URL || "#"}"
                       style="display:inline-block;background:#ffffff;
                              color:#3a7d5c;text-decoration:none;
                              padding:12px 24px;border-radius:10px;
                              font-size:14px;font-weight:600;
                              border:1.5px solid #3a7d5c;">
                      LinkedIn
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#1a1a1a;
                        line-height:1.6;">
                Talk soon,<br/>
                <strong>Nitai Dalal</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f4f4f5;
                       border-top:1px solid #e4e4e7;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                You're receiving this because you submitted a message
                on <a href="${process.env.CLIENT_URL}"
                      style="color:#3a7d5c;text-decoration:none;">
                  nitaidalal.dev
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// ─── 2. Notification to admin ─────────────────────────
export const adminNotificationTemplate = ({
  name,
  email,
  subject,
  message,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>New Message</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#ffffff;
                      border-radius:16px;overflow:hidden;
                      border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:24px 40px;
                       text-align:center;">
              <p style="margin:0;font-size:12px;font-weight:600;
                        color:#3a7d5c;text-transform:uppercase;
                        letter-spacing:0.1em;">
                Portfolio Admin
              </p>
              <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;
                         font-weight:700;">
                📬 New message received
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Sender info -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="margin-bottom:24px;background:#f4f4f5;
                            border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e4e4e7;">
                    <p style="margin:0;font-size:12px;color:#71717a;
                               font-weight:600;text-transform:uppercase;
                               letter-spacing:0.05em;">
                      From
                    </p>
                    <p style="margin:4px 0 0;font-size:15px;color:#1a1a1a;
                               font-weight:600;">
                      ${name}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e4e4e7;">
                    <p style="margin:0;font-size:12px;color:#71717a;
                               font-weight:600;text-transform:uppercase;
                               letter-spacing:0.05em;">
                      Email
                    </p>
                    <a href="mailto:${email}"
                       style="display:block;margin:4px 0 0;font-size:15px;
                              color:#3a7d5c;text-decoration:none;
                              font-weight:600;">
                      ${email}
                    </a>
                  </td>
                </tr>
                ${
                  subject
                    ? `
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:12px;color:#71717a;
                               font-weight:600;text-transform:uppercase;
                               letter-spacing:0.05em;">Subject</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#1a1a1a;
                               font-weight:600;">${subject}</p>
                  </td>
                </tr>`
                    : ""
                }
              </table>

              <!-- Message -->
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;
                        color:#71717a;text-transform:uppercase;
                        letter-spacing:0.05em;">
                Message
              </p>
              <div style="background:#f4f4f5;border-radius:12px;
                          padding:20px;margin-bottom:28px;
                          border-left:4px solid #3a7d5c;">
                <p style="margin:0;font-size:15px;color:#1a1a1a;
                           line-height:1.7;">
                  ${message.replace(/\n/g, "<br/>")}
                </p>
              </div>

              <!-- Reply CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:12px;">
                    <a href="${process.env.CLIENT_URL}/admin/messages"
                       style="display:inline-block;background:#3a7d5c;
                              color:#ffffff;text-decoration:none;
                              padding:12px 24px;border-radius:10px;
                              font-size:14px;font-weight:600;">
                      Reply in Dashboard →
                    </a>
                  </td>
                  <td>
                    <a href="mailto:${email}?subject=Re: ${subject || "Your message"}"
                       style="display:inline-block;background:#ffffff;
                              color:#1a1a1a;text-decoration:none;
                              padding:12px 24px;border-radius:10px;
                              font-size:14px;font-weight:600;
                              border:1.5px solid #e4e4e7;">
                      Quick Reply via Gmail
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f4f4f5;
                       border-top:1px solid #e4e4e7;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                Portfolio Admin Notification
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// ─── 3. Admin reply to user ───────────────────────────
export const adminReplyTemplate = ({
  userName,
  originalMessage,
  replyMessage,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Reply from Nitai Dalal</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#ffffff;
                      border-radius:16px;overflow:hidden;
                      border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3a7d5c,#4fa876);
                       padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
                Nitai Dalal
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
                Full Stack Developer
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;">
                Hey ${userName}! 👋
              </p>

              <p style="margin:0 0 28px;font-size:15px;color:#71717a;line-height:1.6;">
                Thanks for your patience! I've read your message and wanted
                to get back to you personally.
              </p>

              <!-- Reply -->
              <div style="background:#f0faf5;border-radius:12px;padding:24px;
                          margin-bottom:28px;border-left:4px solid #3a7d5c;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;
                           color:#3a7d5c;text-transform:uppercase;
                           letter-spacing:0.05em;">
                  Nitai's Reply
                </p>
                <p style="margin:0;font-size:15px;color:#1a1a1a;line-height:1.7;">
                  ${replyMessage.replace(/\n/g, "<br/>")}
                </p>
              </div>

              <!-- Original message -->
              <div style="background:#f4f4f5;border-radius:12px;padding:20px;
                          margin-bottom:28px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;
                           color:#71717a;text-transform:uppercase;
                           letter-spacing:0.05em;">
                  Your original message
                </p>
                <p style="margin:0;font-size:14px;color:#71717a;
                           line-height:1.6;font-style:italic;">
                  "${
                    originalMessage.length > 200
                      ? originalMessage.slice(0, 200) + "..."
                      : originalMessage
                  }"
                </p>
              </div>

              <p style="margin:0 0 28px;font-size:15px;color:#71717a;line-height:1.6;">
                Feel free to reply to this email if you have any follow-up
                questions. Always happy to connect!
              </p>

              <p style="margin:0;font-size:15px;color:#1a1a1a;line-height:1.6;">
                Best,<br/>
                <strong>Nitai Dalal</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f4f4f5;
                       border-top:1px solid #e4e4e7;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                Reply from
                <a href="${process.env.CLIENT_URL}"
                   style="color:#3a7d5c;text-decoration:none;">
                  nitaidalal.me
                </a>
                · Sent via Portfolio Contact System
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;
