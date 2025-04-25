import { z } from 'zod';

export const getHolidayContract = {
  method: 'GET',
  path: '/holidays/:code_ibge/:date',
  pathParams: z.object({
    code: z.string(),
    date: z.string(),
  }),
  responses: {
    200: z.object({
      name: z.string(),
    }),
    403: z.object({
      message: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
  },
  summary:
    'Busca os feriados cadastrados para um município/estado a partir dos seus respectivos \ncódigos. Caso exista mais 1 feriado cadastrado, é retornado uma lista contendo os nomes de \ncada um.',
} as const;
