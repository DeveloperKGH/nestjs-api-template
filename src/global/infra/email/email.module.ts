import { Module } from '@nestjs/common';
import { SampleMailService } from './sample-mail.service';
import { EmailService } from '../../common/infra/email/email.service';

@Module({
  providers: [
    {
      provide: EmailService,
      useClass: SampleMailService,
    },
  ],
  exports: [
    {
      provide: EmailService,
      useClass: SampleMailService,
    },
  ],
})
export class EmailModule {}
