import { Controller, Get, Body, Param, Delete, NotFoundException,
  HttpCode, Put, HttpException, HttpStatus,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto, HolidayType } from './dto/create-holiday.dto';
import { validateDate, verifyMovableHolidayDate } from './utils/date-utils';
import { validateCode } from './utils/code-utils';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Put(':code/:date')
  async create(
    @Param() params: { code: string; date: string },
    @Body() body: CreateHolidayDto,
  ) {
    const { code, date } = params;

    validateCode(code);
    let resolvedDate = validateDate(date, 'PUT');

    let HolidayIsMovable = false

    if (date === 'corpus-christi' || date === 'carnaval') {  
      if (code.length === 7) {
        HolidayIsMovable = true;
      }

      else {
        return null;
      }
    } 
  
    if (!body.name && !HolidayIsMovable) {
      throw new HttpException('Data deve ser uma string', HttpStatus.BAD_REQUEST)
    }

    const holidays = await this.holidaysService.findAllByDate(resolvedDate);

    if (HolidayIsMovable) {
      const newHoliday: CreateHolidayDto = {
        name: date,
        type: HolidayType.Municipal,
        state: code.slice(0, 2),
        city: code,
        date: date,
      };

      const HolidayExistsInCity = holidays.find(
        (h) =>
          h.type === HolidayType.Municipal &&
          h.state === newHoliday.state &&
          h.city === newHoliday.city,
      );

      if (!HolidayExistsInCity) {
        return await this.holidaysService.create(newHoliday);
      }

      else {
        console.log('municipio ja respeita o feriado móvel');
        return null;
      }
    }

    const newHoliday: CreateHolidayDto = {
      name: body?.name,
      type: code.length === 2 ? HolidayType.Estadual : HolidayType.Municipal,
      city: code.length === 2 ? "" : code,
      state: code.slice(0, 2),
      date: resolvedDate,
    };

    const isHolidayEstadual = newHoliday.type === HolidayType.Estadual;
    const isHolidayMunicipal = newHoliday.type === HolidayType.Municipal;  

    if (holidays.length === 0) {
      return await this.holidaysService.create(newHoliday);
    }

    if (isHolidayEstadual) {
      const HolidayExistsInState = holidays.find(
        (h) =>
          h.type === HolidayType.Estadual &&
          h.state === newHoliday.state,
      );

      const cityHolidays = holidays.filter(
        (h) =>
          h.type === HolidayType.Municipal &&
          h.state === newHoliday.state &&
          h.name === newHoliday.name,
      );

      console.log(cityHolidays);

      for (const holiday of cityHolidays) {
        await this.holidaysService.removeById(holiday.id);
      }

      if (!HolidayExistsInState) {
        console.log('feriado estadual ainda não existe');

        return await this.holidaysService.create(newHoliday);
      }

      console.log('feriado estadual já existe');
      return await this.holidaysService.update(HolidayExistsInState.id, newHoliday);
    }

    if (isHolidayMunicipal) {
      const HolidayExistsInState = holidays.find(
        (h) =>
          h.type === HolidayType.Estadual &&
          h.state === newHoliday.state,
      );

      const HolidayExistsInCity = holidays.find(
        (h) =>
          h.type === HolidayType.Municipal &&
          h.city === newHoliday.city,
      );

      if (HolidayExistsInCity) { 
        console.log('feriado já existe na cidade');
        return await this.holidaysService.update(HolidayExistsInCity.id, newHoliday);
      }

      else if (!HolidayExistsInCity && !HolidayExistsInState) {
        console.log('feriado não existe na cidade');
        return await this.holidaysService.create(newHoliday);
      }

      else if (HolidayExistsInState) {
        if (HolidayExistsInState.name !== newHoliday.name && !HolidayExistsInCity) {
          console.log('feriado estadual com data igual tem nome diferente e feriado não é municipal');
          return await this.holidaysService.create(newHoliday);
        } 
        
        else {
          console.log('feriado municipal tem mesmo nome que o estadual ou feriado já é municipal');
          return null;
        }
      } 
    }
  }

  @Get()
  findAll() {
    return this.holidaysService.findAll();
  }

  @Get(':code/:date')
  async find(@Param() params: { code: string; date: string }) {
    const { code, date } = params;
    const state = code.slice(0, 2);
    const holidays = await this.holidaysService.findAll();
  
    const listOfHolidays: { name: string }[] = [];

    validateCode(code);
    let resolvedDate = validateDate(date, 'GET');   
  
    const movableName = verifyMovableHolidayDate(date);
  
    if (movableName) {
      const exists = holidays.find(
        (h) =>
          h.name === movableName &&
          h.date === movableName && 
          h.type === HolidayType.Municipal &&
          h.city === code
      );
  
      if (exists || movableName === 'sexta-feira-santa') {
        if (movableName === 'corpus-christi') {
          listOfHolidays.push({ name: 'Corpus Christi'})
        }

        else if (movableName === 'carnaval') {
          listOfHolidays.push({ name: 'Carnaval'})
        }

        else {
          listOfHolidays.push({ name: 'Sexta-Feira Santa'})
        }
      }
    }
  
    const foundHolidays = holidays.filter(
      (h) =>
        h.date === resolvedDate &&
        (
          h.type === HolidayType.Nacional ||
          (h.type === HolidayType.Estadual && h.state === state && !h.city) ||
          (h.type === HolidayType.Municipal && h.state === state && h.city === code)
        )
    );
  
    for (const holiday of foundHolidays) {
      listOfHolidays.push({ name: holiday.name});
    }
 
    if (listOfHolidays.length === 0) {
      throw new NotFoundException('Nenhum feriado encontrado');
    }

    else if (listOfHolidays.length === 1) {
      return { name: listOfHolidays[0].name };
    }

    else {
      return listOfHolidays;
    }  
  }

  @Delete(':code/:date')
  @HttpCode(204)
  async remove(@Param() params: { code: string; date: string }) {
    const { code, date } = params;

    if (code === "0" && date === "0") {
      await this.holidaysService.removeAll();
    }

    validateCode(code);
    let resolvedDate = validateDate(date, 'DELETE');

    const holidays = await this.holidaysService.findAllByDate(resolvedDate);

    if (holidays.length === 0) {
      throw new NotFoundException();
    }

    if (holidays.length === 1 && holidays[0].type === HolidayType.Nacional) {
      throw new HttpException('Não é possível remover um feriado nacional', HttpStatus.FORBIDDEN);
    }

    if (code.length === 2) {
      const holiday = holidays.find(
        h => h.type === HolidayType.Estadual && h.state === code
      );
  
      if (!holiday) {
        throw new HttpException('Nenhum feriado estadual encontrado', HttpStatus.FORBIDDEN)
      }
  
      await this.holidaysService.removeById(holiday.id);
    }

    if (code.length === 7) {
      const holiday = holidays.find(
        h => h.type === HolidayType.Municipal && h.city === code
      );
  
      if (!holiday) {
        throw new HttpException('Nenhum feriado municipal encontrado', HttpStatus.FORBIDDEN)
      }
  
      await this.holidaysService.removeById(holiday.id);
    }
  }
}
