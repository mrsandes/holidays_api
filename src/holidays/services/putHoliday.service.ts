import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHolidayDto, HolidayType } from '../dto/create-holiday.dto';
import { Holiday } from '../entities/holiday.entity';
import { HolidaysService } from './holidays.service';
import { MovableHolidays } from '../utils/date-utils';

@Injectable()
export class PutHolidayService {
  constructor(private readonly holidaysService: HolidaysService) {}
  
  async handleMovableHoliday(holidayType: HolidayType, holidaysInResolvedDate: Holiday[], state: string, city: string, resolvedDate: string): Promise<Holiday> {
    if (holidayType === HolidayType.ESTADUAL) {
      throw new HttpException('Não é possível adicionar um feriado móvel no estado', HttpStatus.BAD_REQUEST);
    }

    const exists = holidaysInResolvedDate.some(
      (h) => h.city === city,
    );
    
    if (exists || resolvedDate === MovableHolidays.SEXTA_FEIRA_SANTA || resolvedDate === MovableHolidays.PASCOA) {
      console.log('Feriado já existe no município');
      throw new HttpException('Feriado já existe no município', HttpStatus.OK);
    }
  
    return await this.holidaysService.create({
      name: resolvedDate,
      type: HolidayType.MUNICIPAL,
      date: resolvedDate,
      state,
      city,
    });
  }

  async hanldeStateHoliday(holidayExistsInState: Holiday | undefined, newHoliday: CreateHolidayDto, holidaysInResolvedDate: Holiday[]): Promise<Holiday | null | undefined> {
    const cityHolidays = holidaysInResolvedDate.filter(
      (h) => h.type === HolidayType.MUNICIPAL && h.state === newHoliday.state && h.name === newHoliday.name,
    );
  
    for (const h of cityHolidays) {
      if (h.id) {
        await this.holidaysService.removeById(h.id);
      } 
    }
  
    if (!holidayExistsInState) {
      console.log('feriado estadual ainda não existe');
      return await this.holidaysService.create(newHoliday);
    }
  
    console.log('feriado estadual já existe');
    return holidayExistsInState.id ? await this.holidaysService.update(holidayExistsInState.id, newHoliday) : undefined;
  }

  async handleMunicipalHoliday(holidayExistsInCity: Holiday | undefined, holidayExistsInState: Holiday | undefined, newHoliday: CreateHolidayDto): Promise<Holiday | null | undefined> {
    if (holidayExistsInCity) {
      console.log('feriado já existe na cidade');
      return holidayExistsInCity.id 
        ? await this.holidaysService.update(holidayExistsInCity.id, newHoliday)
        : undefined;
    }
  
    if (holidayExistsInState) {
      if (holidayExistsInState.name !== newHoliday.name) {
        console.log('feriado estadual com data igual tem nome diferente e feriado não é municipal');
        return await this.holidaysService.create(newHoliday);
      } 
      
      else {
        console.log('feriado municipal tem mesmo nome que o estadual ou feriado já é municipal');
        throw new HttpException('Feriado já existe no estado', HttpStatus.BAD_REQUEST);
      }
    }
  
    console.log('feriado não existe na cidade nem no estado');
    return await this.holidaysService.create(newHoliday);
  }
}