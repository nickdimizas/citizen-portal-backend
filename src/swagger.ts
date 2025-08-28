import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Citizen Portal - User Management API',
      version: '1.0.0',
      description: 'An application for creating and managing users',
      contact: {
        name: 'API Support',
        email: 'support@citizenportal.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints for authentication',
      },
      {
        name: 'Users',
        description: 'Endpoints for user management',
      },
    ],
    components: {
      schemas: {
        UserBase: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            firstname: { type: 'string' },
            lastname: { type: 'string' },
            phoneNumber: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                street: { type: 'string' },
                number: { type: 'string' },
                postcode: { type: 'string' },
              },
              required: ['city', 'street', 'number', 'postcode'],
            },
          },
          required: ['username', 'email', 'firstname', 'lastname', 'phoneNumber', 'address'],
        },

        UserRegister: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              properties: {
                password: { type: 'string' },
                ssn: { type: 'string' },
              },
              required: ['password', 'ssn'],
            },
          ],
        },

        UserLogin: {
          type: 'object',
          properties: {
            usernameOrEmail: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['usernameOrEmail', 'password'],
        },

        UserCreate: {
          allOf: [
            { $ref: '#/components/schemas/UserRegister' },
            {
              type: 'object',
              properties: {
                role: { type: 'string', enum: ['Admin', 'Employee', 'Citizen'] },
              },
              required: ['role'],
            },
          ],
        },

        UserProfile: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              properties: {
                id: { type: 'string' },
                role: { type: 'string' },
                ssn: { type: 'string' },
                active: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          ],
        },

        UsersResponse: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              properties: {
                id: { type: 'string' },
                role: { type: 'string' },
                active: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          ],
        },

        UserUpdateProfile: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              properties: {
                ssn: { type: 'string' },
              },
              required: ['ssn'],
            },
          ],
        },

        UserChangeRole: {
          type: 'object',
          properties: {
            role: { type: 'string', enum: ['Admin', 'Employee', 'Citizen'] },
          },
          required: ['role'],
        },

        UserChangePassword: {
          type: 'object',
          properties: {
            currentPassword: { type: 'string' },
            newPassword: { type: 'string' },
          },
          required: ['currentPassword', 'newPassword'],
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            pages: { type: 'integer' },
          },
          required: ['total', 'page', 'limit', 'pages'],
        },
        UsersPayload: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: { $ref: '#/components/schemas/UsersResponse' },
            },
            pagination: { $ref: '#/components/schemas/Pagination' },
          },
          required: ['users', 'pagination'],
        },
        UsersListResponse: {
          type: 'object',
          properties: {
            status: { type: 'boolean' },
            message: { type: 'string' },
            payload: { $ref: '#/components/schemas/UsersPayload' },
          },
          required: ['status', 'message', 'payload'],
        },
        ApiResponseUsername: {
          type: 'object',
          properties: {
            status: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'string', description: 'Username returned' },
          },
        },
        ApiResponseMessage: {
          type: 'object',
          properties: {
            status: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        ApiResponseUserUpdate: {
          type: 'object',
          properties: {
            status: { type: 'boolean' },
            message: { type: 'string' },
            data: { $ref: '#/components/schemas/UserUpdateProfile' },
          },
          required: ['status', 'message', 'data'],
        },
        ApiResponseUserProfile: {
          type: 'object',
          properties: {
            status: { type: 'boolean' },
            message: { type: 'string' },
            data: { $ref: '#/components/schemas/UserProfile' },
          },
        },
        ApiResponseUserActive: {
          type: 'object',
          properties: {
            status: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                active: { type: 'boolean' },
              },
            },
          },
        },
        ApiResponseUserRole: {
          type: 'object',
          properties: {
            status: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                role: { type: 'string', enum: ['Admin', 'Employee', 'Citizen'] },
              },
            },
          },
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
