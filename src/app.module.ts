import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AirtableModule } from './airtable/airtable.module';
import { CompanyModule } from './company/company.module';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AirtableModule,
    AuthModule,
    CompanyModule,
    BudgetsModule,
  ],
})
export class AppModule {}