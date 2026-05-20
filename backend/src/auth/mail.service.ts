import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendOtpEmail(
    to: string,
    code: string,
    nomeCompleto: string,
  ): Promise<void> {
    const fromEmail = this.configService.get<string>('EMAIL_USER');
    const appPassword = this.configService.get<string>('EMAIL_PASS');

    if (!fromEmail || !appPassword) {
      throw new InternalServerErrorException(
        'EMAIL_USER e EMAIL_PASS precisam estar configurados no .env para envio do código por e-mail.',
      );
    }

    const firstName = nomeCompleto?.split(' ')[0] || 'usuário';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f7f9fc;">
        <div style="background: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f5;">
          <h2 style="color: #050866; margin: 0 0 8px;">Olá, ${firstName}!</h2>
          <p style="color: #4a5672; line-height: 1.6;">
            Use o código abaixo para acessar a plataforma MilaTec:
          </p>
          <div style="background: linear-gradient(180deg, #f7faff 0%, #eef4ff 100%); padding: 28px; text-align: center; border-radius: 12px; margin: 24px 0; border: 1px solid #dbe5f4;">
            <span style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #050866;">
              ${code}
            </span>
          </div>
          <p style="color: #6b7ea7; font-size: 14px; line-height: 1.6;">
            Este código expira em 10 minutos. Se você não solicitou este acesso, ignore este e-mail.
          </p>
        </div>
        <p style="text-align: center; color: #9aa5b8; font-size: 12px; margin-top: 16px;">
          © MilaTec — Portal do Cliente
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"MilaTec" <${fromEmail}>`,
        to,
        subject: 'Seu código de acesso - MilaTec',
        html,
      });
      this.logger.log(`OTP enviado para ${to}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar e-mail para ${to}: ${error.message}`);
      throw error;
    }
  }
}