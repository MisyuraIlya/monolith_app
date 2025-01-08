import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
@Processor('mail-sms')
export class MailSmsProcessor {
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  private readonly twilioClient = new Twilio('your-account-sid', 'your-auth-token');

  @Process('send-email')
  async handleSendEmail(job: Job<{ to: string; subject: string; text: string; html?: string }>) {
    const { to, subject, text, html } = job.data;

    try {
      const info = await this.transporter.sendMail({
        from: 'your-email@gmail.com',
        to,
        subject,
        text,
        html,
      });
      console.log(`Email sent: ${info.response}`);
    } catch (error) {
      console.error(`Failed to send email: ${error.message}`);
    }
  }

  @Process('send-sms')
  async handleSendSms(job: Job<{ to: string; message: string }>) {
    const { to, message } = job.data;

    try {
      const sms = await this.twilioClient.messages.create({
        body: message,
        from: '+1234567890', // Your Twilio number
        to,
      });
      console.log(`SMS sent: ${sms.sid}`);
    } catch (error) {
      console.error(`Failed to send SMS: ${error.message}`);
    }
  }
}
