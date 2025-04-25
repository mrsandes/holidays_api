import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Holiday } from '../entities/holiday.entity';
import { verifyMovableHolidayDate } from '../utils/date-utils';
import { HolidayType } from '../dto/create-holiday.dto';

@Injectable()
export class GetHolidayService {
  async getMovableHoliday(code: string, resolvedDate: string, holidays: Holiday[]): Promise<string | undefined> {
    const nameOfMovableHoliday = verifyMovableHolidayDate(resolvedDate);

    const movableHolidays = {
      'corpus-christi': 'Corpus Christi',
      'carnaval': 'Carnaval',
      'sexta-feira-santa': 'Sexta-Feira Santa',
    };    
    
    if (nameOfMovableHoliday) {
      const exists = holidays.find(
        (h) => 
          h.name === nameOfMovableHoliday && 
          h.city === code  
      );
    
      if (exists || nameOfMovableHoliday === 'sexta-feira-santa') {       
        return movableHolidays[nameOfMovableHoliday];
      }

      throw new HttpException('Feriado móvel não encontrado', HttpStatus.NOT_FOUND);
    }
  }

  async getHoliday(holidays: Holiday[], resolvedDate: string, code: string, state: string): Promise<{name: string}[]> {
    const listOfHolidays: { name: string }[] = [];

    const foundHolidays = holidays.filter(
      (h) =>
        h.date === resolvedDate &&
        (
          h.type === HolidayType.NACIONAL ||
          (h.type === HolidayType.ESTADUAL && h.state === state) ||
          (h.type === HolidayType.MUNICIPAL && h.city === code)
        )
    );
  
    foundHolidays.forEach(
      (holiday) => holiday.name && listOfHolidays.push({ name: holiday.name })
    );
  
    return listOfHolidays; 
  }
}