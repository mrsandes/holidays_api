import { Module } from '@nestjs/common';
import { HolidaysService } from './services/holidays.service';
import { HolidaysController } from './controllers/holidays.controller';
import { Holiday } from './entities/holiday.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { GetHolidayService } from './services/getHoliday.service';
import { PutHolidayService } from './services/putHoliday.service';
import { RemoveHolidayService } from './services/removeHoliday.service';

dotenv.config();

const dbType = process.env.DB_TYPE || 'sqlite';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      dbType === 'postgres'
        ? {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'user',
            password: process.env.DB_PASSWORD || '123',
            database: process.env.DB_NAME || 'holidays',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
          }
        : {
            type: 'sqlite',
            database: process.env.DB_NAME || 'holidays.sqlite',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
          },
    ),
    TypeOrmModule.forFeature([Holiday]),
  ],
  controllers: [HolidaysController],
  providers: [
    HolidaysService,
    PutHolidayService,
    GetHolidayService,
    RemoveHolidayService,
  ],
})
export class HolidaysModule {}
