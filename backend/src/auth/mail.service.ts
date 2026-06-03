import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Brevo from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private apiInstance: Brevo.TransactionalEmailsApi;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');

    if (!apiKey) {
      this.logger.error('BREVO_API_KEY não configurada no .env');
      return;
    }

    this.apiInstance = new Brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey,
    );
    this.logger.log('Brevo inicializado com sucesso.');
  }

  async sendOtpEmail(
    to: string,
    code: string,
    nomeCompleto: string,
  ): Promise<void> {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    const fromEmail =
      this.configService.get<string>('BREVO_FROM_EMAIL') ||
      'everton.lbrito@souunit.com.br';
    const fromName =
      this.configService.get<string>('BREVO_FROM_NAME') || 'MilaTec';

    if (!apiKey) {
      throw new InternalServerErrorException(
        'BREVO_API_KEY precisa estar configurada no .env para envio do código por e-mail.',
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
      const sendSmtpEmail = new Brevo.SendSmtpEmail();
      sendSmtpEmail.subject = 'Seu código de acesso - MilaTec';
      sendSmtpEmail.htmlContent = html;
      sendSmtpEmail.sender = { name: fromName, email: fromEmail };
      sendSmtpEmail.to = [{ email: to }];

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log(
        `OTP enviado para ${to} (messageId: ${response.body?.messageId || 'sem id'})`,
      );
    } catch (error) {
      const errorMessage =
        error.response?.body?.message || error.message || 'erro desconhecido';
      this.logger.error(`Erro ao enviar e-mail para ${to}: ${errorMessage}`);
      throw new InternalServerErrorException(
        `Falha ao enviar e-mail: ${errorMessage}`,
      );
    }
  }
}