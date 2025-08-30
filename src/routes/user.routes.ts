import { Router } from 'express';

import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import {
  createUserController,
  getUsersController,
  updateUserController,
  getUserController,
  toggleUserActiveController,
  changeUserRoleController,
  changePasswordController,
  deleteUserController,
} from '../controllers/user.controller';
import { UserRole } from '../models/user.model';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Fetch all users
 *     description: Returns a list of all users depending on the role of the requester. Admins see all users; Employees only see citizens.
 *     responses:
 *       200:
 *         description: List of users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/UsersListResponse'
 *       403:
 *         description: Forbidden — the requester does not have permission to access all users
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Allows Admins or Employees to create a new user. Employees can only create users with the 'Citizen' role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseUsername'
 *       400:
 *         description: Validation error (missing or invalid fields)
 *       401:
 *         description: Unauthorized — missing or invalid authentication
 *       403:
 *         description: Forbidden — the requester does not have permission to create this user
 */

router.get('/', verifyToken, verifyRole([UserRole.Admin, UserRole.Employee]), getUsersController);
router.post(
  '/',
  verifyToken,
  verifyRole([UserRole.Admin, UserRole.Employee]),
  createUserController,
);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user's profile
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseUserProfile'
 *       401:
 *         description: Unauthorized — missing or invalid authentication
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user's profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateProfile'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseUserUpdate'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 * /api/users/me/password:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Change current user's password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponseMessage'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

router.get('/me', verifyToken, getUserController);
router.patch('/me', verifyToken, updateUserController);
router.patch('/me/password', verifyToken, changePasswordController);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseUserProfile'
 *       404:
 *         description: User not found
 *
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateProfile'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseUserUpdate'
 *       404:
 *         description: User not found
 *
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseMessage'
 *       404:
 *         description: User not found
 *
 * /api/users/{id}/active:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Toggle user's active status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User active status toggled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseUserActive'
 *
 * /api/users/{id}/role:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Change user's role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserChangeRole'
 *     responses:
 *       200:
 *         description: User role changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseUserRole'
 */

router.get('/:id', verifyToken, verifyRole([UserRole.Admin, UserRole.Employee]), getUserController);
router.patch(
  '/:id',
  verifyToken,
  verifyRole([UserRole.Admin, UserRole.Employee]),
  updateUserController,
);
router.patch(
  '/:id/active',
  verifyToken,
  verifyRole([UserRole.Admin, UserRole.Employee]),
  toggleUserActiveController,
);
router.patch('/:id/role', verifyToken, verifyRole([UserRole.Admin]), changeUserRoleController);
router.delete('/:id', verifyToken, verifyRole([UserRole.Admin]), deleteUserController);

export default router;
