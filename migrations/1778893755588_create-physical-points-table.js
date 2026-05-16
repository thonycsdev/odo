/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable("physical_points", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    push_ups: {
      type: "integer",
      notNull: true,
      default: 0,
      check: "push_ups >= 0",
    },
    abdominal_crunches: {
      type: "integer",
      notNull: true,
      default: 0,
      check: "abdominal_crunches >= 0",
    },
    side_kicks: {
      type: "integer",
      notNull: true,
      default: 0,
      check: "side_kicks >= 0",
    },
    frontal_kicks: {
      type: "integer",
      notNull: true,
      default: 0,
      check: "frontal_kicks >= 0",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("physical_points", "user_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropTable("physical_points");
};
