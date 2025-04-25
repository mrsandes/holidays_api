import { Holiday } from '../entities/holiday.entity';
import { Repository } from 'typeorm';

export async function createNationalHolidaysOnInit(repository: Repository<Holiday>): Promise<void> {
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
    const exists = await repository.findOne({ where: { date: holiday.date } });
    if (!exists) {
      const holidayEntity = repository.create(holiday);
      await repository.save(holidayEntity);
    }
  }
}
