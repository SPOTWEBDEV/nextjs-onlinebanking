import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(7, "Enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agree: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});
export type OtpValues = z.infer<typeof otpSchema>;

export const transferSchema = z.object({
  fromAccountId: z.string().min(1, "Choose a source account"),
  beneficiaryId: z.string().min(1, "Choose a beneficiary"),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
  note: z.string().max(140, "Note must be under 140 characters").optional(),
});
export type TransferValues = z.infer<typeof transferSchema>;

export const transferPinSchema = z.object({
  pin: z.string().length(4, "Enter your 4-digit transfer PIN"),
});
export type TransferPinValues = z.infer<typeof transferPinSchema>;

export const beneficiarySchema = z.object({
  name: z.string().min(2, "Enter a name"),
  bank: z.string().min(2, "Enter a bank name"),
  accountNumber: z.string().min(4, "Enter a valid account number"),
  currency: z.string().min(3).max(3),
  type: z.enum(["local", "international", "internal"]),
});
export type BeneficiaryValues = z.infer<typeof beneficiarySchema>;

export const billPaymentSchema = z.object({
  biller: z.string().min(1, "Choose a biller"),
  accountOrMeter: z.string().min(2, "Enter account / meter number"),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
});
export type BillPaymentValues = z.infer<typeof billPaymentSchema>;

export const loanApplicationSchema = z.object({
  productId: z.string().min(1, "Choose a loan product"),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
  termMonths: z.coerce.number().int().positive("Choose a loan term"),
});
export type LoanApplicationValues = z.infer<typeof loanApplicationSchema>;

export const savingsGoalSchema = z.object({
  name: z.string().min(2, "Enter a goal name"),
  target: z.coerce.number().positive("Enter a target amount greater than 0"),
  emoji: z.string().min(1).max(4),
  type: z.enum(["flexible", "fixed", "auto"]),
});
export type SavingsGoalValues = z.infer<typeof savingsGoalSchema>;

export const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(4, "Enter your address"),
});
export type ProfileValues = z.infer<typeof profileSchema>;
