import { z } from "zod";
import { startOfToday } from "date-fns";

export const formSchema = z.object({
  startDate: z.date(),
  periodLengthDays: z.number().min(1).max(3650),
  unit: z.literal("days"),
  randomSeed: z.number().int().positive(),
});

export type FormValues = z.infer<typeof formSchema>;

export const buildDefaultValues = (today: Date): FormValues => ({
  startDate: today,
  periodLengthDays: 21,
  unit: "days",
  randomSeed: 12345,
});

export const getToday = () => startOfToday();

