const nodemailer = require("nodemailer");

const isEmailAlertsEnabled =
  process.env.LEAD_ALERTS_ENABLED === "true" ||
  process.env.LEAD_ALERTS_ENABLED === "1";

let transporter;

if (isEmailAlertsEnabled) {
  transporter = nodemailer.createTransport({
    host: process.env.LEAD_ALERT_SMTP_HOST,
    port: Number(process.env.LEAD_ALERT_SMTP_PORT || 587),
    secure: Number(process.env.LEAD_ALERT_SMTP_PORT) === 465,
    auth: {
      user: process.env.LEAD_ALERT_SMTP_USER,
      pass: process.env.LEAD_ALERT_SMTP_PASS,
    },
  });
}

const sendLeadNotification = async ({
  name,
  email,
  brandName,
  website,
  source,
}) => {
  if (!isEmailAlertsEnabled) {
    return;
  }

  if (!transporter) {
    console.warn(
      "[Lead Alerts] Transporter not configured. Check SMTP env variables."
    );
    return;
  }

  const recipients = (process.env.LEAD_ALERT_RECIPIENTS || "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn("[Lead Alerts] No recipients configured for alerts.");
    return;
  }

  const fromAddress =
    process.env.LEAD_ALERT_FROM || process.env.LEAD_ALERT_SMTP_USER;

  const subject = `New ${source || "resource"} lead: ${name}`;

  const html = `
    <h2>New resource lead</h2>
    <p>A visitor just unlocked a resource on TopTHCABrands.com.</p>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Brand:</strong> ${brandName}</li>
      <li><strong>Website:</strong> ${website || "—"}</li>
      <li><strong>Source:</strong> ${source || "Unknown"}</li>
    </ul>
    <p>Follow up when you get a chance.</p>
  `;

  await transporter.sendMail({
    from: fromAddress,
    to: recipients,
    subject,
    html,
  });
};

module.exports = { sendLeadNotification };

