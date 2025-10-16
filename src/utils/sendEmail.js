// utils/sendEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,              // Use TLS port
    secure: false,          // Use STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
});

// Verify connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server ready to send messages');
    }
});

export const sendResetEmail = async (email, resetUrl, userName) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                            line-height: 1.6; 
                            color: #333;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 40px auto; 
                            background: white;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 30px 20px;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .button { 
                            display: inline-block;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white !important;
                            padding: 14px 32px;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: 600;
                            margin: 20px 0;
                        }
                        .button:hover {
                            opacity: 0.9;
                        }
                        .warning { 
                            background-color: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 16px;
                            margin: 24px 0;
                            border-radius: 4px;
                        }
                        .warning strong {
                            color: #856404;
                            display: block;
                            margin-bottom: 8px;
                        }
                        .warning ul {
                            margin: 8px 0 0 0;
                            padding-left: 20px;
                            color: #856404;
                        }
                        .token-link {
                            background: #f8f9fa;
                            padding: 12px;
                            border-radius: 4px;
                            word-break: break-all;
                            font-size: 13px;
                            color: #667eea;
                            margin: 16px 0;
                        }
                        .footer {
                            padding: 20px 30px;
                            background: #f8f9fa;
                            text-align: center;
                            font-size: 12px;
                            color: #6c757d;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset</h1>
                        </div>
                        <div class="content">
                            <p>Hi <strong>${userName || 'there'}</strong>,</p>
                            <p>We received a request to reset your password. Click the button below to create a new password:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </div>
                            
                            <p style="font-size: 14px; color: #6c757d;">Or copy and paste this link into your browser:</p>
                            <div class="token-link">${resetUrl}</div>
                            
                            <div class="warning">
                                <strong>Important Security Information:</strong>
                                <ul>
                                    <li>This link will expire in <strong>1 hour</strong></li>
                                    <li>This link can only be used <strong>once</strong></li>
                                    <li>If you didn't request this, please ignore this email</li>
                                    <li>Your password remains unchanged until you create a new one</li>
                                </ul>
                            </div>
                            
                            <p style="margin-top: 30px;">If you have any questions, please contact our support team.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log('Password reset email sent to:', email);
        return info;

    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

export const sendPasswordChangedEmail = async (email, userName) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Changed Successfully',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6; 
                            color: #333;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 40px auto; 
                            background: white;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                            padding: 30px 20px;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .alert {
                            background-color: #d1ecf1;
                            border-left: 4px solid #0c5460;
                            padding: 16px;
                            margin: 24px 0;
                            border-radius: 4px;
                            color: #0c5460;
                        }
                        .footer {
                            padding: 20px 30px;
                            background: #f8f9fa;
                            text-align: center;
                            font-size: 12px;
                            color: #6c757d;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Changed</h1>
                        </div>
                        <div class="content">
                            <p>Hi <strong>${userName || 'there'}</strong>,</p>
                            <p>Your password has been <strong>successfully changed</strong>.</p>
                            <p>You can now log in with your new password.</p>
                            
                            <div class="alert">
                                <strong>Didn't make this change?</strong><br>
                                If you didn't change your password, please contact our support team immediately at 
                                <a href="mailto:${process.env.SUPPORT_EMAIL || process.env.EMAIL_USER}">
                                    ${process.env.SUPPORT_EMAIL || process.env.EMAIL_USER}
                                </a>
                            </div>
                            
                            <p>For security reasons, you may want to:</p>
                            <ul>
                                <li>Review your recent account activity</li>
                                <li>Update passwords on other accounts if you used the same password</li>
                            </ul>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log('Password changed confirmation sent to:', email);
        return info;

    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};
