import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client.js';
import dotenv from 'dotenv';
import { databaseUrlForDriver } from './database-url.js';
dotenv.config();
const adapter = new PrismaMariaDb(databaseUrlForDriver(process.env.DATABASE_URL!));
export const prisma = new PrismaClient({ adapter });
