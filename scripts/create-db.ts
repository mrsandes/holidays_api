import { exec } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config();

const { DB_TYPE } = process.env;

if (DB_TYPE === 'postgres') {
  exec('docker-compose up -d');
}
