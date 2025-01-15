import { Test, TestingModule } from '@nestjs/testing';
import { MailSmsService } from './mail-sms.service';

describe('MailSmsService', () => {
  let service: MailSmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailSmsService],
    }).compile();

    service = module.get<MailSmsService>(MailSmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
