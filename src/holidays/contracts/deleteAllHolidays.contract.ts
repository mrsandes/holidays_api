import { z } from 'zod';

export const deleteAllHolidaysContract = {
  method: 'DELETE',
  path: '/feriados',
  responses: {
    204: z.object({}),
    404: z.object({
      message: z.string(),
    }),
  },
  summary:
    'Remove todos os feriados estaduais e municipais.',
} as const;
