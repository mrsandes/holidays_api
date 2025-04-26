import { z } from 'zod';

export const getAllHolidaysContract = {
  method: 'GET',
  path: '/feriados',
  responses: {
    200: z.object({
      name: z.string(),
    }),
  },
  summary:
    'Busca por todos os feriados registrados.',
} as const;
