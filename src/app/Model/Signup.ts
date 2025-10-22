export interface Signup {
  id?: number;                     // optional (server assigns it)
  name: string;
  email: string;
  password: string;
  conpassword: string;
  role: string;
  isEmailConfirmed?: boolean;
  emailConfirmationToken?: string;
  emailConfirmationTokenExpiry?: Date;
  failedLoginAttempts?: number;
  lockoutEndTime?: Date;
}