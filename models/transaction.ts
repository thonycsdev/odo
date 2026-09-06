import database from "@/infra/database";
import { DatabaseError } from "@/infra/error-handler";
import {
  TransactionRequest,
  TransactionResponse,
  TransactionResponseSchema,
} from "@/schemas/transaction";

const createOne = async (data: TransactionRequest) => {
  const createdTransaction = await insertOneTransaction(data);
  if (!createdTransaction)
    throw new DatabaseError("Erro ao criar uma nova transação.");
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

const transaction = { createOne, getManyByUserId };
export default transaction;
