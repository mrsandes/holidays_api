import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { CreateHolidayDto } from 'src/holidays/dto/create-holiday.dto';

export function CreateHolidayDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Crie um novo feriado estadual ou municipal' }),
    ApiParam({
      name: 'code',
      type: String,
      description: 'Código IBGE do estado ou município 2 digitos ou 7 digitos',
      example: '3118601',
    }),
    ApiParam({
      name: 'date',
      type: String,
      description:
        'Data do feriado a ser criado YYYY-MM-DD | MM-DD | carnaval | corpus-christi (feriados sem data fixa)',
      example: '11-20',
    }),
    ApiBody({
      schema: {
        example: {
          name: 'Dia da Consciência Negra',
        },
      },
      required: false,
    }),
    ApiOkResponse({
      description: 'Feriado criado/atualizado',
      type: CreateHolidayDto,
    }),
    ApiBadRequestResponse({ description: 'Erro ao processar data/nome' }),
    ApiNotFoundResponse({
      description: 'Código de estado/município não encontrado',
    }),
  );
}

export function GetAllHolidaysDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Busque por todos os feriados' }),
    ApiOkResponse({
      description: 'Feriados encontrados',
      type: CreateHolidayDto,
      isArray: true,
    }),
  );
}

export function GetHolidayDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Busque por feriados' }),
    ApiParam({
      name: 'code',
      type: String,
      description: 'Código IBGE do estado ou município 2 digitos ou 7 digitos',
      example: '3118601',
    }),
    ApiParam({
      name: 'date',
      type: String,
      description: 'Data do feriado a ser buscado YYYY-MM-DD | MM-DD',
      example: '11-20',
    }),
    ApiOkResponse({
      description: 'Feriado encontrado',
      type: CreateHolidayDto,
    }),
    ApiBadRequestResponse({ description: 'Erro ao processar data' }),
    ApiNotFoundResponse({
      description:
        'Feriado não encontrado / Código de estado/município não encontrado',
    }),
  );
}

export function DeleteAllHolidaysDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Remova todos os feriados estaduais e municipais',
    }),
    ApiNoContentResponse({ description: 'Feriados removidos' }),
    ApiNotFoundResponse({
      description: 'Nenhum feriado que pode ser removido encontrado',
    }),
  );
}

export function DeleteHolidayDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Remova feriados' }),
    ApiParam({
      name: 'code',
      type: String,
      description: 'Código IBGE do estado ou município 2 digitos ou 7 digitos',
      example: '3118601',
    }),
    ApiParam({
      name: 'date',
      type: String,
      description:
        'Data do feriado a ser removido YYYY-MM-DD | MM-DD | carnaval | corpus-christi (feriados sem data fixa)',
      example: '11-20',
    }),
    ApiNoContentResponse({ description: 'Feriado removido' }),
    ApiBadRequestResponse({ description: 'Erro ao processar data' }),
    ApiNotFoundResponse({
      description:
        'Feriado não encontrado / Código de estado/município não encontrado',
    }),
  );
}
