import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export const onboardingSchema = z.object({
  program: z.string().min(2, 'Enter your program name'),
  level: z.enum(['undergraduate', 'postgraduate']),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
});

export const courseSchema = z.object({
  code: z.string().min(2).max(20),
  title: z.string().min(3).max(255),
  description: z.string().min(20),
  credits: z.number().int().min(1).max(10),
  department_id: z.number().int().positive(),
  level: z.string().min(1),
  tags: z.array(z.string()).default([]),
});

export const engineSettingsSchema = z.object({
  hybrid_weight: z.number().min(0).max(1),
  top_n: z.number().int().min(1).max(20),
  cold_start_threshold: z.number().int().min(1).max(20),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type EngineSettingsFormData = z.infer<typeof engineSettingsSchema>;
