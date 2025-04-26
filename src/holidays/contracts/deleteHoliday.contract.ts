import { z } from 'zod';

export const deleteHolidayContract = {
  method: 'DELETE',
  path: '/feriados/:code/:date',
  pathParams: z.object({
    code: z.string(),      
    data: z.string(),
  }),
  responses: {
    204: z.object({}),
    400: z.object({
      message: z.string(),
    }),
    403: z.object({
      message: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
  },
  summary:
    'Remove um feriado estadual ou municipal de acordo com o código enviado, caso existam feriado \nmunicipal e estadual no mesmo dia, o feriado removido depende do código enviado (código de \nestado remove o estadual, código de município remove o municipal). Não é possível remover \nferiados nacionais.',
} as const;
