import { Injectable } from '@nestjs/common';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { Holiday } from './entities/holiday.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday)
    private readonly repository: Repository<Holiday>,
  ) {}

  async onModuleInit() {
    const holidays: Partial<Holiday>[] = [
      { name: 'Ano Novo', date: '0000-01-01', type: 'nacional' },
      { name: 'Tiradentes', date: '0000-04-21', type: 'nacional' },
      { name: 'Dia do Trabalhador', date: '0000-05-01', type: 'nacional' },
      { name: 'Independência', date: '0000-09-07', type: 'nacional' },
      { name: 'Nossa Senhora Aparecida', date: '0000-10-12', type: 'nacional' },
      { name: 'Finados', date: '0000-11-02', type: 'nacional' },
      { name: 'Proclamação da República', date: '0000-11-15', type: 'nacional' },
      { name: 'Natal', date: '0000-12-25', type: 'nacional' },
    ];

    for (const holiday of holidays) {
      const exists = await this.repository.findOne({ where: { date: holiday.date } });
      if (!exists) {
        const holidayEntity = this.repository.create(holiday);
        await this.repository.save(holidayEntity);
      }
    }
  }

  async create(dto: CreateHolidayDto) {
    const holidayEntity = this.repository.create(dto);
    return await this.repository.save(holidayEntity);
  }

  async update(id: string, newHoliday: UpdateHolidayDto) {
    const holiday = await this.repository.findOneBy({ id });
  
    if (!holiday) return null;
  
    this.repository.merge(holiday, newHoliday);
    return this.repository.save(holiday);
  }

  findAll() {
    return this.repository.find();
  }

  async findAllByDate(date: string): Promise<Holiday[]> {
    return this.repository.find({ where: { date } });
  }


  async removeById(id: string) {
    const holiday = await this.repository.findOneBy({ id });
    if (!holiday) return null;

    return this.repository.remove(holiday);
  }

  async removeAll() {
    return this.repository.delete({});
  }  
}
