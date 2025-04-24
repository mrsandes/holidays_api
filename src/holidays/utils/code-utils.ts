import { HttpException, HttpStatus } from '@nestjs/common';
import estados from './estados.json';
import municipios from './municipios.json';

const validStates: string[] = estados.map((row) => row.codigo);
const validCities: string[] = municipios.map((row) => row.codigo_ibge);

export function validateCode(code: string) {
  if (!/^\d+$/.test(code)) {
    throw new HttpException('incorrect code format', HttpStatus.NOT_FOUND);
  }

  if (code.length === 2 && !validStates.includes(code)) {
    throw new HttpException('state code not found', HttpStatus.NOT_FOUND);
  }

  if (code.length === 7 && !validCities.includes(code)) {
    throw new HttpException('city code not found', HttpStatus.NOT_FOUND);
  }

  if (code.length !== 2 && code.length !== 7) {
    throw new HttpException('incorrect code format', HttpStatus.NOT_FOUND);
  }
}
