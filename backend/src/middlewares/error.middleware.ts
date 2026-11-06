import { ErrorRequestHandler } from 'express';
import { ZodError, z } from 'zod';
import { AppError } from '../utils/common/error/AppError.js';
import { logger } from '../lib/logger.js';

type ErrorResponse = {
  success: false;
  status: string;
  message: string;
  errors?: unknown;
};

const isJsonSyntaxError = (
  error: unknown,
): error is SyntaxError & { status?: number; body?: unknown } =>
  error instanceof SyntaxError &&
  'status' in error &&
  (error as { status?: number }).status === 400 &&
  'body' in error;

const isDatabaseUnavailable = (error: unknown, depth = 0): boolean => {
  if (!error || typeof error !== 'object' || depth > 5) return false;
  const detail = error as Record<string, unknown>;
  const codes = [
    'P1000',
    'P1001',
    'P1002',
    'P1008',
    'P1017',
    'P2024',
    'P2037',
    '45028',
    '45044',
    'ER_GET_CONNECTION_TIMEOUT',
    'ER_CANNOT_RETRIEVE_RSA_KEY',
    'ECONNREFUSED',
    'ETIMEDOUT',
  ];
  return (
    [detail.code, detail.errno, detail.originalCode].some(
      (code) => code !== undefined && codes.includes(String(code)),
    ) ||
    ['cause', 'meta', 'driverAdapterError'].some((key) =>
      isDatabaseUnavailable(detail[key], depth + 1),
    )
  );
};

export const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let status = 'error';
  let message = 'Something went wrong. Please try again later.';
  let errors: unknown;
  let isOperational = false;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    status = error.status;
    isOperational = error.isOperational;
    if (isOperational) message = error.message;
  } else if (isDatabaseUnavailable(error)) {
    statusCode = 503;
    message = 'Our service is temporarily unavailable. Please try again shortly.';
  } else if (error instanceof ZodError) {
    statusCode = 400;
    status = 'fail';
    message = 'Validation failed';
    errors = z.treeifyError(error);
    isOperational = true;
  } else if (isJsonSyntaxError(error)) {
    statusCode = 400;
    status = 'fail';
    message = 'Invalid JSON payload';
    isOperational = true;
  }

  if (!isOperational) {
    logger.error(error);
  }

  const response: ErrorResponse = {
    success: false,
    status,
    message,
  };

  if (errors !== undefined) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
