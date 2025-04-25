import { z } from 'zod';

export const putHolidayContract = {
  method: 'PUT',
  path: '/holidays/:code/:date',
  pathParams: z.object({
    code: z.string(),      
    data: z.string(),
  }),
  body: z.object({
    name: z.string().optional(),
  }),
  responses: {
    200: z.object({
      message: z.string(),
    }),
    201: z.object({
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
    'Cria um feriado municipal ou estadual, caso exista um feriado (nacional por exemplo) no dia.\n O feriado é criado para o município ou estado caso tenham nomes diferentes, isso permite \nque ocorra, por exemplo, anivérsario de BH e Sexta-feira Santa no mesmo dia (datas irreais).\n Caso um feriado municipal tenha nome igual ao de um feriado estadual que será cadastrado, \no feriado municipal é removido, já que os municípios seguem os feriados do estado.',
} as const;
