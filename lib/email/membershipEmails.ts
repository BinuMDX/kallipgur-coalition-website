import nodemailer from 'nodemailer';
import { sendMimeEmail } from './microsoftGraph';

export interface MembershipApplicationData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: string;
  traditionalCountry?: string | null;
  createdAt: Date;
  status: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Escapes HTML special characters in a string to prevent HTML injection.
 */
function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Low-level utility to send email based on the EMAIL_PROVIDER environment variable.
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER || 'mailpit';
  const senderEmail = process.env.MICROSOFT_SENDER_EMAIL || 'noreply@kallipgurcoalition.org.au';

  if (provider === 'microsoft-graph') {
    // Use Microsoft Graph API
    // We compile the email to MIME (RFC 822) format using nodemailer's stream transport.
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'windows',
    });

    const info = await transporter.sendMail({
      from: senderEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    const mimeBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const messageStream = info.message as any;
      messageStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      messageStream.on('end', () => resolve(Buffer.concat(chunks)));
      messageStream.on('error', reject);
    });

    const mimeBase64 = mimeBuffer.toString('base64');
    await sendMimeEmail(mimeBase64);
  } else if (provider === 'mailpit') {
    // Use local SMTP (Mailpit)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025', 10),
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    });

    await transporter.sendMail({
      from: senderEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  } else {
    // Simulation / Log provider
    console.log('--- EMAIL SEND SIMULATION (Console) ---');
    console.log(`From:    ${senderEmail}`);
    console.log(`To:      ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Text:\n${options.text}`);
    console.log('----------------------------------------');
  }
}

/**
 * Sends a confirmation email to the applicant.
 */
export async function sendMembershipApplicantConfirmation(application: MembershipApplicationData): Promise<void> {
  const safeFirstName = escapeHtml(application.firstName);
  const safeId = escapeHtml(application.id);

  const subject = 'Membership Application Received – Kallipgur Coalition Aboriginal Corporation';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f7f6f2; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; padding: 40px; border-radius: 8px; border-top: 5px solid #c5a880; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo-text { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 1px; }
    .logo-sub { font-size: 10px; color: #888888; text-transform: uppercase; letter-spacing: 2px; display: block; margin-top: 4px; }
    .ref-box { background-color: #fcfbfa; border: 1px solid #e8e6e0; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center; }
    .ref-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666666; margin-bottom: 6px; }
    .ref-value { font-family: monospace; font-size: 18px; font-weight: bold; color: #c5a880; }
    .status-value { font-size: 16px; font-weight: bold; color: #666666; margin-top: 4px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 13px; color: #666666; text-align: center; }
    .footer a { color: #c5a880; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Kallipgur Coalition</div>
      <span class="logo-sub">People of the same fire</span>
    </div>
    <h2>Membership Application Received</h2>
    <p>Dear ${safeFirstName},</p>
    <p>Thank you for submitting your application for membership with the Kallipgur Coalition Aboriginal Corporation. We have received your details and your application is now under review.</p>
    
    <div class="ref-box">
      <div class="ref-label">Application Reference</div>
      <div class="ref-value">${safeId}</div>
      <div class="ref-label" style="margin-top: 15px;">Status</div>
      <div class="status-value">PENDING</div>
    </div>
    
    <p><strong>What happens next?</strong><br>
    Your application will be reviewed by the Board of Directors at our next scheduled meeting in accordance with the Corporation's Rule Book. Once a decision has been reached, we will contact you using the details you provided.</p>
    
    <p>If you have any questions or need to update your contact details in the meantime, please reach out to our administration office.</p>
    
    <div class="footer">
      <strong>Kallipgur Coalition Aboriginal Corporation</strong><br>
      123 Country Road, Country Australia, WA 6000<br>
      Email: <a href="mailto:info@kallipgurcoalition.org.au">info@kallipgurcoalition.org.au</a> | Phone: (08) 0000 0000<br>
      Office Hours: Monday – Friday, 9:00am – 5:00pm
    </div>
  </div>
</body>
</html>`;

  const text = `Dear ${application.firstName},

Thank you for submitting your application for membership with the Kallipgur Coalition Aboriginal Corporation.

We have received your details and your application is now under review.

Application Reference: ${application.id}
Status: PENDING

What happens next?
Your application will be reviewed by the Board of Directors at our next scheduled meeting in accordance with the Corporation's Rule Book. Once a decision has been reached, we will contact you using the details you provided.

If you have any questions or need to update your contact details in the meantime, please reach out to our administration office.

--
Kallipgur Coalition Aboriginal Corporation
123 Country Road, Country Australia, WA 6000
Email: info@kallipgurcoalition.org.au | Phone: (08) 0000 0000
Office Hours: Monday – Friday, 9:00am – 5:00pm`;

  await sendEmail({
    to: application.email,
    subject,
    html,
    text,
  });
}

/**
 * Sends a notification email to the organization administrator(s).
 */
export async function sendMembershipAdminNotification(application: MembershipApplicationData, documentCount: number): Promise<void> {
  const recipient = process.env.MEMBERSHIP_NOTIFICATION_EMAIL;
  if (!recipient) {
    throw new Error('Missing MEMBERSHIP_NOTIFICATION_EMAIL environment variable.');
  }

  const safeFirstName = escapeHtml(application.firstName);
  const safeLastName = escapeHtml(application.lastName);
  const safeEmail = escapeHtml(application.email);
  const safePhone = escapeHtml(application.phone);
  const safeMembershipType = escapeHtml(application.membershipType);
  const safeTraditionalCountry = escapeHtml(application.traditionalCountry ?? 'Not Provided');
  const safeId = escapeHtml(application.id);
  const formattedDate = new Date(application.createdAt).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const subject = `New Membership Application – ${application.id}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f7f6f2; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; padding: 40px; border-radius: 8px; border-top: 5px solid #c5a880; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { border-bottom: 1px solid #eeeeee; padding-bottom: 15px; margin-bottom: 25px; }
    .title { font-size: 20px; font-weight: bold; color: #1a1a1a; }
    .detail-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .detail-table th, .detail-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eeeeee; }
    .detail-table th { background-color: #faf9f6; font-weight: bold; color: #555555; width: 40%; }
    .detail-table td { color: #1a1a1a; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 13px; color: #666666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">New Membership Application Received</div>
      <div style="font-size: 13px; color: #888888; margin-top: 5px;">Reference ID: ${safeId}</div>
    </div>
    
    <p>A new membership application has been submitted and requires review. Application details are summarized below:</p>
    
    <table class="detail-table">
      <tr>
        <th>Applicant Name</th>
        <td>${safeFirstName} ${safeLastName}</td>
      </tr>
      <tr>
        <th>Email Address</th>
        <td>${safeEmail}</td>
      </tr>
      <tr>
        <th>Phone Number</th>
        <td>${safePhone}</td>
      </tr>
      <tr>
        <th>Membership Type</th>
        <td>${safeMembershipType}</td>
      </tr>
      <tr>
        <th>Traditional Country</th>
        <td>${safeTraditionalCountry}</td>
      </tr>
      <tr>
        <th>Submission Date</th>
        <td>${formattedDate}</td>
      </tr>
      <tr>
        <th>Current Status</th>
        <td>PENDING</td>
      </tr>
      <tr>
        <th>Uploaded Documents</th>
        <td>${documentCount} file(s)</td>
      </tr>
    </table>
    
    <p style="margin-top: 25px;">Please log in to the Kallipgur administrative portal to view the complete details and download any uploaded identity or supporting documents.</p>
    
    <div class="footer">
      Kallipgur Coalition Aboriginal Corporation — Administrative Notification System
    </div>
  </div>
</body>
</html>`;

  const text = `New Membership Application Received

Reference ID: ${application.id}

A new membership application has been submitted and requires review.

Applicant Details:
- Name: ${application.firstName} ${application.lastName}
- Email: ${application.email}
- Phone: ${application.phone}
- Membership Type: ${application.membershipType}
- Traditional Country: ${application.traditionalCountry ?? 'Not Provided'}
- Submission Date: ${formattedDate}
- Current Status: PENDING
- Uploaded Documents: ${documentCount} file(s)

Please log in to the Kallipgur administrative portal to view the complete details and download any uploaded identity or supporting documents.

--
Kallipgur Coalition Aboriginal Corporation
Administrative Notification System`;

  await sendEmail({
    to: recipient,
    subject,
    html,
    text,
  });
}

/**
 * Sends an email notifying the applicant that their application is now Under Review.
 */
export async function sendMembershipStatusUnderReview(
  application: MembershipApplicationData,
  reviewNote?: string | null
): Promise<void> {
  const safeFirstName = escapeHtml(application.firstName);
  const safeId = escapeHtml(application.id);
  const safeNote = reviewNote ? escapeHtml(reviewNote) : '';

  const subject = 'Membership Application Update: Under Review – Kallipgur Coalition';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f7f6f2; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; padding: 40px; border-radius: 8px; border-top: 5px solid #c5a880; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo-text { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 1px; }
    .logo-sub { font-size: 10px; color: #888888; text-transform: uppercase; letter-spacing: 2px; display: block; margin-top: 4px; }
    .ref-box { background-color: #fcfbfa; border: 1px solid #e8e6e0; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center; }
    .ref-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666666; margin-bottom: 6px; }
    .ref-value { font-family: monospace; font-size: 18px; font-weight: bold; color: #c5a880; }
    .status-value { font-size: 16px; font-weight: bold; color: #5B8EC9; margin-top: 4px; }
    .note-box { background-color: #faf9f6; border-left: 3px solid #c5a880; padding: 15px; margin: 20px 0; font-style: italic; font-size: 14px; color: #555555; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 13px; color: #666666; text-align: center; }
    .footer a { color: #c5a880; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Kallipgur Coalition</div>
      <span class="logo-sub">People of the same fire</span>
    </div>
    <h2>Membership Application Update</h2>
    <p>Dear ${safeFirstName},</p>
    <p>This is to inform you that your application for membership with the Kallipgur Coalition Aboriginal Corporation is currently under review by our administration board.</p>
    
    <div class="ref-box">
      <div class="ref-label">Application Reference</div>
      <div class="ref-value">${safeId}</div>
      <div class="ref-label" style="margin-top: 15px;">Current Status</div>
      <div class="status-value">UNDER REVIEW</div>
    </div>
    
    ${safeNote ? `
    <p><strong>Note from our Reviewers:</strong></p>
    <div class="note-box">${safeNote}</div>
    ` : ''}

    <p>We are verifying your supporting documents and eligibility criteria. No further action is required from you at this stage. We will notify you immediately once the board reaches a final decision.</p>
    
    <p>If you have any questions, please feel free to reach out to our administration office.</p>
    
    <div class="footer">
      <strong>Kallipgur Coalition Aboriginal Corporation</strong><br>
      123 Country Road, Country Australia, WA 6000<br>
      Email: <a href="mailto:info@kallipgurcoalition.org.au">info@kallipgurcoalition.org.au</a> | Phone: (08) 0000 0000<br>
      Office Hours: Monday – Friday, 9:00am – 5:00pm
    </div>
  </div>
</body>
</html>`;

  const text = `Dear ${application.firstName},

Your application for membership with the Kallipgur Coalition Aboriginal Corporation is currently under review.

Application Reference: ${application.id}
Current Status: UNDER REVIEW

${reviewNote ? `Reviewer Note: ${reviewNote}\n` : ''}
We are verifying your supporting documents. We will notify you immediately once the board reaches a final decision.

--
Kallipgur Coalition Aboriginal Corporation
123 Country Road, Country Australia, WA 6000
Email: info@kallipgurcoalition.org.au | Phone: (08) 0000 0000`;

  await sendEmail({
    to: application.email,
    subject,
    html,
    text,
  });
}

/**
 * Sends an email notifying the applicant that their application is Approved.
 */
export async function sendMembershipStatusApproved(
  application: MembershipApplicationData,
  reviewNote?: string | null
): Promise<void> {
  const safeFirstName = escapeHtml(application.firstName);
  const safeId = escapeHtml(application.id);
  const safeNote = reviewNote ? escapeHtml(reviewNote) : '';

  const subject = 'Membership Application Approved – Kallipgur Coalition';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f7f6f2; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; padding: 40px; border-radius: 8px; border-top: 5px solid #4B8B5A; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo-text { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 1px; }
    .logo-sub { font-size: 10px; color: #888888; text-transform: uppercase; letter-spacing: 2px; display: block; margin-top: 4px; }
    .ref-box { background-color: #f4faf5; border: 1px solid #d3ebd6; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center; }
    .ref-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #555555; margin-bottom: 6px; }
    .ref-value { font-family: monospace; font-size: 18px; font-weight: bold; color: #4B8B5A; }
    .status-value { font-size: 18px; font-weight: bold; color: #4B8B5A; margin-top: 4px; }
    .note-box { background-color: #faf9f6; border-left: 3px solid #4B8B5A; padding: 15px; margin: 20px 0; font-style: italic; font-size: 14px; color: #555555; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 13px; color: #666666; text-align: center; }
    .footer a { color: #c5a880; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Kallipgur Coalition</div>
      <span class="logo-sub">People of the same fire</span>
    </div>
    <h2 style="color: #4B8B5A;">Membership Application Approved</h2>
    <p>Dear ${safeFirstName},</p>
    <p>Congratulations! We are pleased to inform you that your application for membership has been formally approved by the Board of Directors of the Kallipgur Coalition Aboriginal Corporation.</p>
    
    <div class="ref-box">
      <div class="ref-label">Application Reference</div>
      <div class="ref-value">${safeId}</div>
      <div class="ref-label" style="margin-top: 15px;">Status</div>
      <div class="status-value">APPROVED</div>
    </div>
    
    ${safeNote ? `
    <p><strong>Message from the Board:</strong></p>
    <div class="note-box">${safeNote}</div>
    ` : ''}

    <p>Welcome as a member of the Corporation. Your registration details have been entered into the Register of Members. You are now entitled to the rights and privileges of membership, in accordance with the Corporation's Rule Book.</p>
    
    <p>We look forward to your active participation in our community and programs. We will keep you updated regarding upcoming meetings, events, and opportunities.</p>
    
    <div class="footer">
      <strong>Kallipgur Coalition Aboriginal Corporation</strong><br>
      123 Country Road, Country Australia, WA 6000<br>
      Email: <a href="mailto:info@kallipgurcoalition.org.au">info@kallipgurcoalition.org.au</a> | Phone: (08) 0000 0000<br>
      Office Hours: Monday – Friday, 9:00am – 5:00pm
    </div>
  </div>
</body>
</html>`;

  const text = `Dear ${application.firstName},

Congratulations! We are pleased to inform you that your application for membership has been formally approved by the Board of Directors.

Application Reference: ${application.id}
Status: APPROVED

${reviewNote ? `Message from the Board: ${reviewNote}\n` : ''}
Welcome as a member of the Corporation. Your registration details have been entered into the Register of Members.

--
Kallipgur Coalition Aboriginal Corporation
123 Country Road, Country Australia, WA 6000
Email: info@kallipgurcoalition.org.au | Phone: (08) 0000 0000`;

  await sendEmail({
    to: application.email,
    subject,
    html,
    text,
  });
}

/**
 * Sends an email notifying the applicant that their application is Rejected.
 */
export async function sendMembershipStatusRejected(
  application: MembershipApplicationData,
  reviewNote?: string | null
): Promise<void> {
  const safeFirstName = escapeHtml(application.firstName);
  const safeId = escapeHtml(application.id);
  const safeNote = reviewNote ? escapeHtml(reviewNote) : '';

  const subject = 'Membership Application Status Update – Kallipgur Coalition';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f7f6f2; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; padding: 40px; border-radius: 8px; border-top: 5px solid #C44B3F; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo-text { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 1px; }
    .logo-sub { font-size: 10px; color: #888888; text-transform: uppercase; letter-spacing: 2px; display: block; margin-top: 4px; }
    .ref-box { background-color: #fbf5f4; border: 1px solid #ebd3d1; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center; }
    .ref-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #555555; margin-bottom: 6px; }
    .ref-value { font-family: monospace; font-size: 18px; font-weight: bold; color: #C44B3F; }
    .status-value { font-size: 18px; font-weight: bold; color: #C44B3F; margin-top: 4px; }
    .note-box { background-color: #faf9f6; border-left: 3px solid #C44B3F; padding: 15px; margin: 20px 0; font-style: italic; font-size: 14px; color: #555555; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 13px; color: #666666; text-align: center; }
    .footer a { color: #c5a880; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Kallipgur Coalition</div>
      <span class="logo-sub">People of the same fire</span>
    </div>
    <h2>Membership Application Decision</h2>
    <p>Dear ${safeFirstName},</p>
    <p>Thank you for your interest in joining the Kallipgur Coalition Aboriginal Corporation. We appreciate you taking the time to apply for membership.</p>
    <p>Your application was reviewed by the Board of Directors. We regret to inform you that your application for membership was not approved at this time.</p>
    
    <div class="ref-box">
      <div class="ref-label">Application Reference</div>
      <div class="ref-value">${safeId}</div>
      <div class="ref-label" style="margin-top: 15px;">Status</div>
      <div class="status-value">UNSUCCESSFUL</div>
    </div>
    
    ${safeNote ? `
    <p><strong>Note from the Board:</strong></p>
    <div class="note-box">${safeNote}</div>
    ` : ''}

    <p>If you believe there has been an error or wish to appeal the decision, please contact the administration office within 28 days of this notice.</p>
    
    <div class="footer">
      <strong>Kallipgur Coalition Aboriginal Corporation</strong><br>
      123 Country Road, Country Australia, WA 6000<br>
      Email: <a href="mailto:info@kallipgurcoalition.org.au">info@kallipgurcoalition.org.au</a> | Phone: (08) 0000 0000<br>
      Office Hours: Monday – Friday, 9:00am – 5:00pm
    </div>
  </div>
</body>
</html>`;

  const text = `Dear ${application.firstName},

Thank you for your interest in joining the Kallipgur Coalition Aboriginal Corporation.

Your application was reviewed by the Board of Directors. We regret to inform you that your application for membership was not approved at this time.

Application Reference: ${application.id}
Status: UNSUCCESSFUL

${reviewNote ? `Note from the Board: ${reviewNote}\n` : ''}
If you believe there has been an error or wish to appeal the decision, please contact the administration office.

--
Kallipgur Coalition Aboriginal Corporation
123 Country Road, Country Australia, WA 6000
Email: info@kallipgurcoalition.org.au | Phone: (08) 0000 0000`;

  await sendEmail({
    to: application.email,
    subject,
    html,
    text,
  });
}
