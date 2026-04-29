import { Resend } from 'resend';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail({ name, email, password }) {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: email,
    subject: 'Welcome to PANDR Intern Attendance Tracker',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #ffffff; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #e91e8c; font-size: 32px; margin: 0;">PANDR</h1>
          <p style="color: #888; margin: 4px 0 0;">Intern Attendance Tracker</p>
        </div>
        <h2 style="color: #ffffff;">Welcome, ${name}! 👋</h2>
        <p style="color: #aaa; line-height: 1.6;">Your intern account has been created. Here are your login credentials:</p>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px;"><span style="color: #888;">Email:</span> <strong style="color: #fff;">${email}</strong></p>
          <p style="margin: 0;"><span style="color: #888;">Temporary Password:</span> <strong style="color: #e91e8c;">${password}</strong></p>
        </div>
        <p style="color: #aaa; line-height: 1.6;">
          ⚠️ You will be asked to change your password on your first login.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}" style="background: #e91e8c; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Log In Now
          </a>
        </div>
        <p style="color: #555; font-size: 12px; text-align: center; margin-top: 32px;">
          © 2026 PANDR Outsourcing. If you did not expect this email, please contact your administrator.
        </p>
      </div>
    `
  });
}
