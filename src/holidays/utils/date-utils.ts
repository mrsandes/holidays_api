import { HttpException, HttpStatus } from '@nestjs/common';

export enum MovableHolidays {
  CARNAVAL = 'carnaval',
  CORPUS_CHRISTI = 'corpus-christi',
  SEXTA_FEIRA_SANTA = 'sexta-feira-santa',
  PASCOA = 'pascoa',
}

export enum MethodType {
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

function sameDay(d1: Date, d2: Date) {
  return d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10);
}

export function verifyMovableHolidayDate(date: string): string | null {
  const holidayDate = new Date(date);
  const year = holidayDate.getFullYear();
  const easter = calculateEaster(year); 

  const movableHolidays = [
    { name: MovableHolidays.CARNAVAL, offset: -47 },
    { name: MovableHolidays.SEXTA_FEIRA_SANTA, offset: -2 },
    { name: MovableHolidays.CORPUS_CHRISTI, offset: 60 },
    { name: MovableHolidays.PASCOA, offset: 0 },
  ];

  for (const holiday of movableHolidays) {
    const d = new Date(easter);
    d.setDate(d.getDate() + holiday.offset);    

    if (sameDay(d, holidayDate)) {           
      return holiday.name;
    }
  }

  return null;
}

export function validateDate(date: string, method: MethodType): { resolvedDate: string, isHolidayMovable: boolean }  {
  if ((Object.values(MovableHolidays) as string[]).includes(date)) {
    if (method === MethodType.GET) {
      throw new HttpException('incorrect date format', HttpStatus.BAD_REQUEST);
    }  
    
    return {
      resolvedDate: date,
      isHolidayMovable: true
    };
  }
  
  if (/^\d{2}-\d{2}$/.test(date)) {      
    return {
      resolvedDate: `0000-${date}`,
      isHolidayMovable: false
    };
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    if (verifyMovableHolidayDate(date)) {
      return {
        resolvedDate: date,
        isHolidayMovable: true
      };
    }

    return {
      resolvedDate: `0000-${date.slice(-5)}`,
      isHolidayMovable: false
    };
  }

  throw new HttpException('incorrect date format', HttpStatus.BAD_REQUEST);
}
