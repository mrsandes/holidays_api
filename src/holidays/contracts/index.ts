import { initContract } from '@ts-rest/core';
import { getHolidayContract } from './getHoliday.contract';
import { putHolidayContract } from './putHoliday.contract';
import { deleteHolidayContract } from './deleteHoliday.contract';
import { deleteAllHolidaysContract } from './deleteAllHolidays.contract';
import { getAllHolidaysContract } from './getAllHolidays.contract';

const c = initContract();

export const holidayContract = c.router({
  getHoliday: getHolidayContract,
  getAllHolidays: getAllHolidaysContract,
  putHoliday: putHolidayContract,
  deleteHoliday: deleteHolidayContract,
  deleteAllHolidays: deleteAllHolidaysContract,
});
