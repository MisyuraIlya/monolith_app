import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailSmsService } from './mail-sms.service';
import { MailSmsProcessor } from './mail-sms.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail-sms',
    }),
  ],
  providers: [MailSmsProcessor, MailSmsService],
  exports: [MailSmsService],
})
export class MailSmsModule {}
