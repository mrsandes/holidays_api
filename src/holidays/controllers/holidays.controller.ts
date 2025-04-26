import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HolidaysService } from '../services/holidays.service';
import { CreateHolidayDto, HolidayType } from '../dto/create-holiday.dto';
import { MethodType } from '../utils/date-utils';
import { PutHolidayService } from '../services/putHoliday.service';
import { GetHolidayService } from '../services/getHoliday.service';
import { RemoveHolidayService } from '../services/removeHoliday.service';
import {
  CreateHolidayDocs,
  DeleteAllHolidaysDocs,
  DeleteHolidayDocs,
  GetAllHolidaysDocs,
  GetHolidayDocs,
} from './docs/holidays.doc';

@Controller('feriados')
export class HolidaysController {
  constructor(
    private readonly holidaysService: HolidaysService,
    private readonly putHolidayService: PutHolidayService,
    private readonly getHolidayService: GetHolidayService,
    private readonly removeHolidayService: RemoveHolidayService,
  ) {}

  @CreateHolidayDocs()
  @Put(':code/:date')
  async create(
    @Param() params: { code: string; date: string },
    @Body() body: CreateHolidayDto,
  ) {
    const { code, date } = params;

    const { resolvedDate, isHolidayMovable, holidayType } =
      await this.holidaysService.validateParams(code, date, MethodType.PUT);
    const name = await this.holidaysService.validateName(
      body.name,
      resolvedDate,
      isHolidayMovable,
    );

    const isEstadual = holidayType === HolidayType.ESTADUAL;
    const isMunicipal = holidayType === HolidayType.MUNICIPAL;

    const state = code.slice(0, 2);
    const city = isMunicipal ? code : '';

    const newHoliday: CreateHolidayDto = {
      name: name,
      type: holidayType,
      city: city,
      state: state,
      date: resolvedDate,
    };

    const holidaysInResolvedDate =
      await this.holidaysService.findAllByDate(resolvedDate);

    const holidayExistsInState = holidaysInResolvedDate.find(
      (h) => h.type === HolidayType.ESTADUAL && h.state === newHoliday.state,
    );

    const holidayExistsInCity = holidaysInResolvedDate.find(
      (h) => h.type === HolidayType.MUNICIPAL && h.city === newHoliday.city,
    );

    if (isHolidayMovable) {
      return this.putHolidayService.handleMovableHoliday(
        holidayType,
        holidaysInResolvedDate,
        state,
        city,
        resolvedDate,
      );
    }

    if (isEstadual) {
      return this.putHolidayService.hanldeStateHoliday(
        holidayExistsInState,
        newHoliday,
        holidaysInResolvedDate,
      );
    }

    if (isMunicipal) {
      return this.putHolidayService.handleMunicipalHoliday(
        holidayExistsInCity,
        holidayExistsInState,
        newHoliday,
      );
    }

    if (holidaysInResolvedDate.length === 0) {
      return await this.holidaysService.create(newHoliday);
    }
  }

  @GetAllHolidaysDocs()
  @Get()
  findAll() {
    return this.holidaysService.findAll();
  }

  @GetHolidayDocs()
  @Get(':code/:date')
  async find(@Param() params: { code: string; date: string }) {
    const { code, date } = params;
    const state = code.slice(0, 2);
    const { resolvedDate } = await this.holidaysService.validateParams(
      code,
      date,
      MethodType.GET,
    );

    const holidays = await this.holidaysService.findAll();
    const listOfHolidaysOnResolvedDate: { name: string }[] = [];

    const movableHoliday = await this.getHolidayService.getMovableHoliday(
      code,
      resolvedDate,
      holidays,
    );

    if (movableHoliday) {
      listOfHolidaysOnResolvedDate.push({ name: movableHoliday });
    }

    listOfHolidaysOnResolvedDate.push(
      ...(await this.getHolidayService.getHoliday(
        holidays,
        resolvedDate,
        code,
        state,
      )),
    );

    if (listOfHolidaysOnResolvedDate.length === 0) {
      throw new HttpException(
        'Nenhum feriado encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return listOfHolidaysOnResolvedDate.length === 1
      ? { name: listOfHolidaysOnResolvedDate[0].name }
      : listOfHolidaysOnResolvedDate;
  }

  @DeleteAllHolidaysDocs()
  @Delete()
  @HttpCode(204)
  async removeAll() {
    return this.holidaysService.removeAll();
  }

  @DeleteHolidayDocs()
  @Delete(':code/:date')
  @HttpCode(204)
  async remove(@Param() params: { code: string; date: string }) {
    const { code, date } = params;
    const { resolvedDate, holidayType } =
      await this.holidaysService.validateParams(code, date, MethodType.DELETE);
    const holidays = await this.holidaysService.findAllByDate(resolvedDate);

    return this.removeHolidayService.removeHoliday(
      code,
      date,
      holidays,
      holidayType,
    );
  }
}
