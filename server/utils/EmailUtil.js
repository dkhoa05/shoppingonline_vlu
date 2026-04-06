// CLI:
// npm install nodemailer --save
//
// Gmail: dùng App Password (bật 2FA → tạo mật khẩu ứng dụng), EMAIL_SERVICE=gmail
// Outlook/Hotmail: lỗi "SmtpClientAuthentication is disabled" → bật SMTP AUTH cho mailbox
//   (Microsoft 365 admin / cá nhân: https://aka.ms/smtp_auth_disabled ) hoặc chuyển sang Gmail.

const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

function getTransporter() {
  const user = process.env.EMAIL_USER || MyConstants.EMAIL_USER;
  const pass = process.env.EMAIL_PASS || MyConstants.EMAIL_PASS;
  const service = (process.env.EMAIL_SERVICE || 'gmail').toLowerCase();

  if (service === 'outlook' || service === 'office365') {
    return nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: { user, pass },
    });
  }

  if (service === 'hotmail') {
    return nodemailer.createTransport({
      service: 'hotmail',
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

const EmailUtil = {
  async send(email, id, token) {
    const text =
      'Thanks for signing up, please input these informations to activate your account:\n' +
      '\t.id: ' +
      id +
      '\n' +
      '\t.token: ' +
      token;

    const user = process.env.EMAIL_USER || MyConstants.EMAIL_USER;
    const mailOptions = {
      from: user,
      to: email,
      subject: 'Signup | Verification',
      text: text,
    };

    try {
      const transporter = getTransporter();
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.error('[EmailUtil] send failed:', err.message);
      return false;
    }
  },
};

module.exports = EmailUtil;
