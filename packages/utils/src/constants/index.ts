export const APP_NAME = 'Your App'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    CREATE: '/subscriptions',
    GET: (id: string) => `/subscriptions/${id}`,
    UPDATE: (id: string) => `/subscriptions/${id}`,
    CANCEL: (id: string) => `/subscriptions/${id}/cancel`,
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
  PASSWORD_WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
} as const

export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  MEDIUM: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
  TIME: 'h:mm a',
  DATETIME: 'MMM dd, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
} as const