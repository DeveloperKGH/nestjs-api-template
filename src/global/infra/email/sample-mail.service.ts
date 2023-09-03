import { EmailService } from '../../common/infra/email/email.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleMailService implements EmailService {
  send(to: string, subject: string, content: string): void {
    console.log('메일발송 !! ' + to, subject, content);
  }
}
