import database from '@/infra/database';
import { DatabaseError, NotFoundError } from '@/infra/error-handler';
import {
  type TransactionRequest,
  type TransactionResponse,
  TransactionResponseSchema,
  type TransactionUpdateRequest,
} from '@/schemas/transaction';

const createOne = async (data: TransactionRequest) => {
  const createdTransaction = await insertOneTransaction(data);
  if (!createdTransaction)
    throw new DatabaseError('Erro ao criar uma nova transação.');
  return createdTransaction;
};

const insertOneTransaction = async (
  data: TransactionRequest,
): Promise<TransactionResponse | null> => {
  const result = await database.query(
    `INSERT INTO 
        transactions 
        (user_id,amount_cents,description,category, occurred_at) 
    VALUES 
        ($1,$2,$3,$4,$5) 
    RETURNING *;`,
    [
      data.user_id,
      data.amount_cents,
      data.description,
      data.category,
      data.occurred_at,
    ],
  );
  return result ? TransactionResponseSchema.parse(result[0]) : null;
};

const getManyByUserId = async (
  userId: string,
): Promise<TransactionResponse[]> => {
  const result = await database.query(
    `SELECT * FROM transactions t  
    WHERE t.user_id = $1;
         `,
    [userId],
  );

  const data = result.map((x) => TransactionResponseSchema.parse(x));
  return data;
};

const getOneById = async (
  id: string,
  userId: string,
): Promise<TransactionResponse> => {
  const result = await database.query(
    `SELECT * FROM transactions t  
    WHERE t.id = $1
    AND t.user_id = $2;
         `,
    [id, userId],
  );
  if (!result.length) throw new NotFoundError('Transaction não encontrada.');
  const data = TransactionResponseSchema.parse(result[0]);
  return data;
};

const updateOne = async (
  id: string,
  userId: string,
  data: TransactionUpdateRequest,
): Promise<TransactionResponse> => {
  const result = await database.query(
    `UPDATE transactions
    SET amount_cents = COALESCE($1, amount_cents),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        occurred_at = COALESCE($4, occurred_at),
        updated_at = now()
    WHERE id = $5 AND user_id = $6
    RETURNING *;`,
    [
      data.amount_cents,
      data.description,
      data.category,
      data.occurred_at,
      id,
      userId,
    ],
  );
  if (!result.length) throw new NotFoundError('Transaction não encontrada.');
  return TransactionResponseSchema.parse(result[0]);
};

const deleteOne = async (id: string, userId: string): Promise<void> => {
  const result = await database.query(
    `DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id;`,
    [id, userId],
  );
  if (!result.length) throw new NotFoundError('Transaction não encontrada.');
};

const transaction = {
  createOne,
  getManyByUserId,
  getOneById,
  updateOne,
  deleteOne,
};
export default transaction;
