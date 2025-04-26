import { Holiday } from '../entities/holiday.entity';
import { Repository } from 'typeorm';
import nationalHolidays from './nationalHolidays.json';

export async function createNationalHolidaysOnInit(repository: Repository<Holiday>): Promise<void> {
  const holidays: Partial<Holiday>[] = nationalHolidays;

  for (const holiday of holidays) {
    const exists = await repository.findOne({ where: { date: holiday.date } });
    
    if (!exists) {
      const holidayEntity = repository.create(holiday);
      await repository.save(holidayEntity);
    }
  }
}