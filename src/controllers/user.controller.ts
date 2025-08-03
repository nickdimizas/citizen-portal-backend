// import { Request, Response } from 'express';

// import { createUser } from '../services/user.service';
// import { extractErrorMessage } from '../utils/errorHandler';
// import { StatusCodes } from '../constants/statusCodes';

// const createUserController = async (req: Request, res: Response) => {
//   try {
//     await createUser(req.body);
//     res.status(StatusCodes.CREATED).json({ status: true, message: 'User created successfully' });
//   } catch (error) {
//     console.error('User creation error', error);
//     const errorMessage = extractErrorMessage(error as Error);
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ status: false, message: 'User creation failed', data: errorMessage });
//   }
// };

// export { createUserController };
