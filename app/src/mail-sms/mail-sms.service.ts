import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailSmsService {
  constructor(@InjectQueue('mail-sms') private readonly mailSmsQueue: Queue) {}

  async sendEmail(data: { to: string; subject: string; text: string; html?: string }) {
    await this.mailSmsQueue.add('send-email', data);
  }

  async sendSms(data: { to: string; message: string }) {
    await this.mailSmsQueue.add('send-sms', data);
  }
}
