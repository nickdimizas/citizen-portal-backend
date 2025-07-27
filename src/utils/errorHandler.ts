export const extractErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unexpected error';
