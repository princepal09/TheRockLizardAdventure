import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { globalErrorHandler } from '../src/middlewares/error.middleware.js';
import { AppError } from '../src/utils/common/error/AppError.js';
import { databaseUrlForDriver } from '../src/lib/database-url.js';
import { logger } from '../src/lib/logger.js';
import { getErrorMessage } from '../../frontend/src/utils/error.js';

logger.level = 'silent';
const internalMessage =
  'Invalid prisma.contact.create() invocation in D:\\TheRockLizard\\backend: Database error 45028';

function handle(error: unknown) {
  let status = 0;
  let body: Record<string, unknown> = {};
  const response = {
    status(code: number) {
      status = code;
      return response;
    },
    json(value: Record<string, unknown>) {
      body = value;
      return response;
    },
  };
  globalErrorHandler(error, {} as Request, response as Response, () => {});
  assert.ok(!JSON.stringify(body).includes('prisma'));
  assert.ok(!JSON.stringify(body).includes('TheRockLizard'));
  assert.ok(!('stack' in body));
  return { status, body };
}

test('unexpected errors never expose internal messages or stacks', () => {
  const result = handle(new Error(internalMessage));
  assert.equal(result.status, 500);
  assert.equal(result.body.message, 'Something went wrong. Please try again later.');
});

test('Prisma driver pool failure returns a safe retryable 503', () => {
  const error = Object.assign(new Error(internalMessage), {
    code: 'P2010',
    meta: { code: '45028', message: internalMessage },
  });
  const result = handle(error);
  assert.equal(result.status, 503);
  assert.equal(
    result.body.message,
    'Our service is temporarily unavailable. Please try again shortly.',
  );
  assert.equal(handle({ code: 'P1001' }).status, 503);
});

test('intentional user errors and form validation remain useful', () => {
  const result = handle(new AppError('Selected trip not found', 404));
  assert.equal(result.status, 404);
  assert.equal(result.body.message, 'Selected trip not found');
  const validation = z.object({ email: z.email() }).safeParse({ email: 'bad' });
  assert.equal(handle(validation.error).status, 400);
});

test('RSA retrieval is enabled only for loopback and respects explicit settings', () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    const url = new URL(
      databaseUrlForDriver(`mysql://user:p%40ss@${host}:3306/db?connectionLimit=4`),
    );
    assert.equal(url.searchParams.get('allowPublicKeyRetrieval'), 'true');
    assert.equal(url.searchParams.get('connectionLimit'), '4');
    assert.equal(url.password, 'p%40ss');
  }
  assert.ok(
    !databaseUrlForDriver('mysql://user:pass@db.example.com/db').includes(
      'allowPublicKeyRetrieval',
    ),
  );
  assert.equal(
    new URL(
      databaseUrlForDriver('mysql://user:pass@localhost/db?allowPublicKeyRetrieval=false'),
    ).searchParams.get('allowPublicKeyRetrieval'),
    'false',
  );
});

test('frontend hides legacy server leaks and keeps normal user errors', () => {
  const axiosError = (status: number, message: string) => ({
    isAxiosError: true,
    response: { status, data: { message, errors: [{ message }] } },
  });
  assert.equal(
    getErrorMessage(axiosError(500, internalMessage)),
    'Something went wrong. Please try again later.',
  );
  assert.equal(
    getErrorMessage(axiosError(503, internalMessage)),
    'Our service is temporarily unavailable. Please try again shortly.',
  );
  assert.equal(getErrorMessage(axiosError(400, 'Email is required')), 'Email is required');
  assert.match(getErrorMessage({ isAxiosError: true }), /Could not connect/);
});
