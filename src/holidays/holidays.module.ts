import { Module } from '@nestjs/common';
import { HolidaysService } from './services/holidays.service';
import { HolidaysController } from './controllers/holidays.controller';
import { Holiday } from './entities/holiday.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetHolidayService } from './services/getHoliday.service';
import { PutHolidayService } from './services/putHoliday.service';
import { RemoveHolidayService } from './services/removeHoliday.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Holiday]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
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
