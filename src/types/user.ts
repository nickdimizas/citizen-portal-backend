import { IUser, UserRole } from '../models/user.model';

interface GetUsersOptions {
  roleFilter?: UserRole[];
  active?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface UserPaginationResult {
  data: IUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export { GetUsersOptions, UserPaginationResult };
