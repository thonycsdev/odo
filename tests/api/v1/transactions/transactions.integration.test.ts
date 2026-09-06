import { TransactionRequest } from "@/schemas/transaction";
import orchestrator from "@/tests/common/orchestrator";
import { faker } from "@faker-js/faker";

describe("POST /api/v1/transactions", () => {
  test("creates a transaction for the logged-in user", async () => {
    const createdUser = await orchestrator.createUser();
    const createdSession = await orchestrator.createSession(createdUser.id);
    const transaction: TransactionRequest = {
      user_id: createdUser.id,
      amount_cents: +faker.finance.amount({ min: 10, max: 10000, dec: 0 }),
      description: faker.finance.transactionDescription(),
      category: faker.finance.transactionType(),
      occurred_at: faker.date.recent(),
    };

    const response = await fetch("http://localhost:3000/api/v1/transaction", {
      method: "POST",
      body: JSON.stringify(transaction),
      headers: {
        Cookie: `session_token=${createdSession.token_hash}`,
      },
    });

    const responseBody = await response.json();
    expect(response.status).toBe(201);
    expect(responseBody).toEqual({
      id: expect.any(String),
      user_id: transaction.user_id,
      amount_cents: transaction.amount_cents,
      description: transaction.description,
      category: transaction.category,
      occurred_at: transaction.occurred_at.toISOString(),
    });
  });
  test("rejects a non-positive amount", async () => {
    const createdUser = await orchestrator.createUser();
    const createdSession = await orchestrator.createSession(createdUser.id);
    const transaction: TransactionRequest = {
      user_id: createdUser.id,
      amount_cents: +faker.finance.amount({ max: -1, min: -100, dec: 0 }),
      description: faker.finance.transactionDescription(),
      category: faker.finance.transactionType(),
      occurred_at: new Date(),
    };
    const response = await fetch("http://localhost:3000/api/v1/transaction", {
      method: "POST",
      body: JSON.stringify(transaction),
      headers: {
        Cookie: `session_token=${createdSession.token_hash}`,
      },
    });

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: false,
      status: 422,
      message: "O valor não pode ser menor ou igual a zero.",
    });
  });
});

describe("GET /api/v1/transactions", () => {
  test("only returns transactions belonging to the caller", async () => {
    const createdUser = await orchestrator.createUser();
    const createdUser2 = await orchestrator.createUser();

    const createdSession = await orchestrator.createSession(createdUser.id);
    const transaction1: TransactionRequest = {
      user_id: createdUser.id,
      amount_cents: +faker.finance.amount({ max: 100, min: 1, dec: 0 }),
      description: faker.finance.transactionDescription(),
      category: faker.finance.transactionType(),
      occurred_at: new Date(),
    };
    await orchestrator.createTransaction(transaction1);
    const transaction2: TransactionRequest = {
      user_id: createdUser2.id,
      amount_cents: +faker.finance.amount({ max: 100, min: 1, dec: 0 }),
      description: faker.finance.transactionDescription(),
      category: faker.finance.transactionType(),
      occurred_at: new Date(),
    };
    await orchestrator.createTransaction(transaction2);
    const response = await fetch("http://localhost:3000/api/v1/transaction", {
      method: "GET",
      headers: {
        Cookie: `session_token=${createdSession.token_hash}`,
      },
    });

    expect(response.status).toBe(200);
    const responseBody = await response.json();

    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBe(1);
    expect(responseBody[0].user_id).toBe(createdUser.id);
  });
});

describe("GET /api/v1/transactions/[id]", () => {
  test.todo("returns a single transaction owned by the caller");
  test.todo("returns 404 for a nonexistent id");
  test.todo("returns 404 when the transaction belongs to another user");
  test.todo("rejects requests without a valid session cookie");
});

describe("PATCH /api/v1/transactions/[id]", () => {
  test.todo("updates fields on a transaction owned by the caller");
  test.todo("returns 404 when the transaction belongs to another user");
  test.todo("rejects requests without a valid session cookie");
});

describe("DELETE /api/v1/transactions/[id]", () => {
  test.todo("deletes a transaction owned by the caller");
  test.todo("returns 404 when the transaction belongs to another user");
  test.todo("rejects requests without a valid session cookie");
});
