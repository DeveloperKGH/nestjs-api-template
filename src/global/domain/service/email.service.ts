export interface EmailService {
  send(to: string, subject: string, content: string): void;
}

export const EmailService = Symbol('EmailService');
