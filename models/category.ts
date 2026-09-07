import database from '@/infra/database';
import { DEFAULT_CATEGORY_NAMES } from '@/schemas/category';

const insertDefaultCategories = async (userId: string): Promise<void> => {
  const inserts = DEFAULT_CATEGORY_NAMES.map((name) =>
    database.query<{ [key: string]: unknown }>(
      'INSERT INTO categories (name, user_id) VALUES ($1, $2);',
      [name, userId],
    ),
  );

  await Promise.all(inserts);
};

export const category = { insertDefaultCategories };
