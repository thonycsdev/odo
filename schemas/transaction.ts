import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid().nonoptional(),
  amount_cents: z
    .number()
    .positive("O valor não pode ser menor ou igual a zero."),
  description: z.string().max(255),
  category: z.string().max(255),
  occurred_at: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const TransactionRequestSchema = z.object({
  user_id: z.uuid().nonoptional(),
  amount_cents: z
    .number()
    .positive("O valor não pode ser menor ou igual a zero."),
  description: z.string().max(255),
  category: z.string().max(255),
  occurred_at: z.coerce.date(),
});

export const TransactionResponseSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid().nonoptional(),
  amount_cents: z.number().nonnegative(),
  description: z.string().max(255),
  category: z.string().max(255),
  occurred_at: z.coerce.date(),
});

export type TransactionRequest = z.infer<typeof TransactionRequestSchema>;
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
