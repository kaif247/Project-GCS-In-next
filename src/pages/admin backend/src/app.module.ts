import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { ReportsModule } from './modules/reports.module';
import { FlagsModule } from './modules/flags.module';
import { AnnouncementsModule } from './modules/announcements.module';
import { AlertsModule } from './modules/alerts.module';
import { PoliciesModule } from './modules/policies.module';
import { IncidentsModule } from './modules/incidents.module';
import { AuditModule } from './modules/audit.module';
import { PaymentsModule } from './modules/payments.module';
import { UsageSeriesModule } from './modules/usageSeries.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [UsersModule, ReportsModule, FlagsModule, AnnouncementsModule, AlertsModule, PoliciesModule, IncidentsModule, AuditModule, PaymentsModule, UsageSeriesModule, AuthModule],
})
export class AppModule {}
