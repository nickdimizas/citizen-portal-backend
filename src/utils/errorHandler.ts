export const extractErrorMessage = (error: Error): string =>
  error instanceof Error ? error.message : 'Unexpected error';
