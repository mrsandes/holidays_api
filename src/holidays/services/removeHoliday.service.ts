import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Holiday } from '../entities/holiday.entity';
import { DeleteResult } from 'typeorm';
import { HolidaysService } from './holidays.service';
import { HolidayType } from '../dto/create-holiday.dto';

@Injectable()
export class RemoveHolidayService {
  constructor(private readonly holidaysService: HolidaysService) {}

  async removeHoliday(code: string, date: string, holidays: Holiday[], holidayType: HolidayType): Promise<Holiday | DeleteResult | null | undefined> {
    if (!code && !date ) {
      return await this.holidaysService.removeAll();
    }
    
    if (holidays.length === 0) {
      throw new HttpException('Nenhum feriado encontrado', HttpStatus.NOT_FOUND);
    }
    
    if (holidays.length === 1 && holidays[0].type === HolidayType.NACIONAL) {
      throw new HttpException('Não é possível remover um feriado nacional', HttpStatus.FORBIDDEN);
    }
    
    const holiday = holidays.find(h => 
      (holidayType === HolidayType.ESTADUAL && h.type === HolidayType.ESTADUAL && h.state === code) ||
      (holidayType === HolidayType.MUNICIPAL && h.type === HolidayType.MUNICIPAL && h.city === code)
    );
    
    if (!holiday) {
      throw new HttpException(`Nenhum feriado ${holidayType.valueOf()} encontrado`, HttpStatus.FORBIDDEN);
    }
    
    if (holiday.id) {
      console.log('Feriado ' + holidayType.valueOf() + ' removido');
      return await this.holidaysService.removeById(holiday.id);
    }
  }
}