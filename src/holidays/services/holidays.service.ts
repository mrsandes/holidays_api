import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHolidayDto, HolidayType } from '../dto/create-holiday.dto';
import { UpdateHolidayDto } from '../dto/update-holiday.dto';
import { Holiday } from '../entities/holiday.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createNationalHolidaysOnInit } from '../seed/nationalHolidays';
import { validateCode } from '../utils/code-utils';
import { MethodType, validateDate } from '../utils/date-utils';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday)
    private readonly repository: Repository<Holiday>,
  ) {}

  async onModuleInit() {
    createNationalHolidaysOnInit(this.repository);
  }

  async create(dto: CreateHolidayDto): Promise<Holiday> {
    const holiday = this.repository.create(dto);
    return await this.repository.save(holiday);
  }

  async update(
    id: string,
    newHoliday: UpdateHolidayDto,
  ): Promise<Holiday | null> {
    const holiday = await this.repository.findOneBy({ id });
    if (!holiday) return null;

    this.repository.merge(holiday, newHoliday);
    return this.repository.save(holiday);
  }

  async findAll(): Promise<Holiday[]> {
    return await this.repository.find();
  }

  async findAllByDate(date: string): Promise<Holiday[]> {
    return this.repository.find({ where: { date } });
  }

  async removeById(id: string): Promise<Holiday | null> {
    const holiday = await this.repository.findOneBy({ id });
    if (!holiday) return null;

    return await this.repository.remove(holiday);
  }

  async removeAll(): Promise<DeleteResult> {
    return await this.repository.delete({
      type: In([HolidayType.ESTADUAL, HolidayType.MUNICIPAL]),
    });
  }

  async validateParams(
    code: string,
    date: string,
    method: MethodType,
  ): Promise<{
    resolvedDate: string;
    isHolidayMovable: boolean;
    holidayType: HolidayType;
  }> {
    const holidayType = validateCode(code);
    const { resolvedDate, isHolidayMovable } = validateDate(date, method);

    return {
      resolvedDate,
      isHolidayMovable,
      holidayType,
    };
  }

  async validateName(
    bodyName: string | undefined,
    resolvedDate: string,
    isHolidayMovable: boolean,
  ) {
    let name: string;

    if (isHolidayMovable) {
      name = resolvedDate;
    } else {
      if (!bodyName) {
        throw new HttpException(
          'Name must be a string',
          HttpStatus.BAD_REQUEST,
        );
      }

      name = bodyName;
    }

    return name;
  }
}
