import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { AirtableService } from '../airtable/airtable.service';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private otpStore = new Map<
    string,
    { code: string; expiresAt: number }
  >();

  constructor(
    private readonly airtableService: AirtableService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  private generateOtp(): string {
    return Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
  }

  async login(
    email: string,
  ): Promise<{ message: string }> {
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const contact =
      await this.airtableService.findContactByEmail(
        normalizedEmail,
      );

    if (!contact) {
      throw new UnauthorizedException(
        'Acesso não autorizado.',
      );
    }

    const code = this.generateOtp();

    const expiresAt =
      Date.now() + 10 * 60 * 1000;

    this.otpStore.set(normalizedEmail, {
      code,
      expiresAt,
    });

    await this.mailService.sendOtpEmail(
      normalizedEmail,
      code,
      contact.nomeCompleto,
    );

    this.logger.log(
      `OTP enviado para ${normalizedEmail}`,
    );

    return {
      message:
        'Código enviado para o e-mail informado.',
    };
  }

  async verify(
    email: string,
    code: string,
  ): Promise<{
    access_token: string;
    email: string;
  }> {
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const entry =
      this.otpStore.get(normalizedEmail);

    if (!entry) {
      throw new UnauthorizedException(
        'Nenhum código ativo.',
      );
    }

    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete(normalizedEmail);

      throw new UnauthorizedException(
        'Código expirado.',
      );
    }

    if (entry.code !== code) {
      throw new UnauthorizedException(
        'Código inválido.',
      );
    }

    this.otpStore.delete(normalizedEmail);

    const contact =
      await this.airtableService.findContactByEmail(
        normalizedEmail,
      );

    if (!contact) {
      throw new UnauthorizedException(
        'Usuário não encontrado.',
      );
    }

    const payload = {
      email: normalizedEmail,
      role: contact.role || 'company',
      companyId: contact.companyId || null,
    };

    const access_token =
      this.jwtService.sign(payload);

    this.logger.log(
      `Autenticação realizada para ${normalizedEmail}`,
    );

    return {
      access_token,
      email: normalizedEmail,
    };
  }
}