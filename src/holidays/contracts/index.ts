import { initContract } from '@ts-rest/core';
import { getHolidayContract } from './getHoliday.contract';
import { putHolidayContract } from './putHoliday.contract';
import { deleteHolidayContract } from './deleteHoliday.contract';

const c = initContract();

export const holidayContract = c.router({
  getHoliday: getHolidayContract,
  putHoliday: putHolidayContract,
  deleteHoliday: deleteHolidayContract,
});
