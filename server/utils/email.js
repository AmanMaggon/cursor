const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email templates
const emailTemplates = {
  'email-verification': {
    subject: 'Verify your AyurSutra account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your AyurSutra account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2E7D32, #4CAF50); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 AyurSutra</h1>
            <p>Government-Standard Ayurveda Platform</p>
          </div>
          <div class="content">
            <h2>Welcome to AyurSutra, {{name}}!</h2>
            <p>Thank you for registering with AyurSutra. To complete your registration and start your Ayurvedic journey, please verify your email address.</p>
            <p>Click the button below to verify your account:</p>
            <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">{{verificationUrl}}</p>
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account with AyurSutra, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 AyurSutra. All rights reserved.</p>
            <p>This email was sent from a government-compliant healthcare platform.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  'password-reset': {
    subject: 'Reset your AyurSutra password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your AyurSutra password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2E7D32, #4CAF50); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #FF5722; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #FFF3CD; border: 1px solid #FFEAA7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 AyurSutra</h1>
            <p>Government-Standard Ayurveda Platform</p>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello {{name}},</p>
            <p>We received a request to reset your AyurSutra account password. If you made this request, click the button below to reset your password:</p>
            <a href="{{resetUrl}}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">{{resetUrl}}</p>
            <div class="warning">
              <strong>Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>© 2024 AyurSutra. All rights reserved.</p>
            <p>This email was sent from a government-compliant healthcare platform.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  'otp-verification': {
    subject: 'Your AyurSutra Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your AyurSutra Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2E7D32, #4CAF50); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { background: #E8F5E8; border: 2px solid #4CAF50; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #2E7D32; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #FFF3CD; border: 1px solid #FFEAA7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 AyurSutra</h1>
            <p>Government-Standard Ayurveda Platform</p>
          </div>
          <div class="content">
            <h2>{{purpose}} Verification</h2>
            <p>Your verification code for AyurSutra is:</p>
            <div class="otp-code">{{otp}}</div>
            <div class="warning">
              <strong>Important:</strong> This code will expire in 5 minutes. Do not share this code with anyone. AyurSutra will never ask for your verification code.
            </div>
            <p>If you didn't request this verification code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 AyurSutra. All rights reserved.</p>
            <p>This email was sent from a government-compliant healthcare platform.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  'appointment-confirmation': {
    subject: 'Appointment Confirmed - AyurSutra',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2E7D32, #4CAF50); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 AyurSutra</h1>
            <p>Government-Standard Ayurveda Platform</p>
          </div>
          <div class="content">
            <h2>Appointment Confirmed</h2>
            <p>Hello {{patientName}},</p>
            <p>Your appointment has been confirmed. Here are the details:</p>
            <div class="appointment-details">
              <h3>Appointment Details</h3>
              <p><strong>Doctor:</strong> {{doctorName}}</p>
              <p><strong>Date:</strong> {{appointmentDate}}</p>
              <p><strong>Time:</strong> {{appointmentTime}}</p>
              <p><strong>Type:</strong> {{appointmentType}}</p>
              <p><strong>Location:</strong> {{location}}</p>
              <p><strong>Appointment ID:</strong> {{appointmentId}}</p>
            </div>
            <p>Please arrive 15 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 2 hours in advance.</p>
          </div>
          <div class="footer">
            <p>© 2024 AyurSutra. All rights reserved.</p>
            <p>This email was sent from a government-compliant healthcare platform.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Replace template variables
const replaceTemplateVariables = (template, data) => {
  let html = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value);
  }
  return html;
};

// Send email
const sendEmail = async ({ to, subject, template, data = {}, html, text }) => {
  try {
    const transporter = createTransporter();
    
    let emailHtml = html;
    let emailText = text;
    
    // Use template if provided
    if (template && emailTemplates[template]) {
      emailHtml = replaceTemplateVariables(emailTemplates[template].html, data);
      if (!subject) {
        subject = emailTemplates[template].subject;
      }
    }
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'AyurSutra'}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html: emailHtml,
      text: emailText
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email);
      results.push({ email: email.to, success: result });
    } catch (error) {
      results.push({ email: email.to, success: false, error: error.message });
    }
  }
  
  return results;
};

// Send appointment reminder
const sendAppointmentReminder = async (appointment) => {
  const data = {
    patientName: appointment.patient.firstName,
    doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
    appointmentDate: appointment.scheduledDate.toLocaleDateString('en-IN'),
    appointmentTime: appointment.scheduledTime,
    appointmentType: appointment.type,
    location: appointment.location.type === 'online' ? 'Online Consultation' : appointment.location.address,
    appointmentId: appointment.appointmentId
  };
  
  return await sendEmail({
    to: appointment.patient.email,
    subject: 'Appointment Reminder - AyurSutra',
    template: 'appointment-confirmation',
    data
  });
};

// Send prescription notification
const sendPrescriptionNotification = async (prescription) => {
  return await sendEmail({
    to: prescription.patient.email,
    subject: 'New Prescription Available - AyurSutra',
    html: `
      <h2>New Prescription Available</h2>
      <p>Hello ${prescription.patient.firstName},</p>
      <p>A new prescription has been issued by Dr. ${prescription.doctor.user.firstName} ${prescription.doctor.user.lastName}.</p>
      <p><strong>Prescription ID:</strong> ${prescription.prescriptionId}</p>
      <p><strong>Date:</strong> ${prescription.date.toLocaleDateString('en-IN')}</p>
      <p>Please log in to your AyurSutra account to view and download your prescription.</p>
    `
  });
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  sendAppointmentReminder,
  sendPrescriptionNotification,
  emailTemplates
};