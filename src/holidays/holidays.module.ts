import { Module } from '@nestjs/common';
import { HolidaysService } from './services/holidays.service';
import { HolidaysController } from './controllers/holidays.controller';
import { Holiday } from './entities/holiday.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { GetHolidayService } from './services/getHoliday.service';
import { PutHolidayService } from './services/putHoliday.service';
import { RemoveHolidayService } from './services/removeHoliday.service';

dotenv.config()

@Module({
    imports: [
      process.env.DB_TYPE === 'sqlite'
        ? TypeOrmModule.forRoot({
          type: 'sqlite',
            database: 'holidays.sqlite',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
          })
        : TypeOrmModule.forRoot({
          type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'user',
            password: '123',
            database: 'holidays',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true, 
          }),

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
