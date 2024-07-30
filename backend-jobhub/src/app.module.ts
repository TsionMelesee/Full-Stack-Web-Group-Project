import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './job/job.module';
import { ScheduleModule } from '@nestjs/schedule'; 
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JobModule,
    ScheduleModule.forRoot(),AuthModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
