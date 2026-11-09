import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

// Needs migration ...203 (products table) to have run first.
export class CreateCartOrderPaymentTables1775500022204 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ---------- carts ----------
    await queryRunner.createTable(
      new Table({
        name: 'carts',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'user_id', type: 'uuid', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'checked_out'],
            enumName: 'carts_status_enum',
            default: "'active'",
            isNullable: false,
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'carts',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
    // safety net for the "one active cart per user" rule (the code enforces it too)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_carts_one_active_per_user" ON "carts" ("user_id") WHERE "status" = 'active'`,
    );

    // ---------- cart_items ----------
    await queryRunner.createTable(
      new Table({
        name: 'cart_items',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'cart_id', type: 'int', isNullable: false },
          { name: 'product_id', type: 'int', isNullable: false },
          { name: 'quantity', type: 'int', isNullable: false },
        ],
        uniques: [{ name: 'UQ_cart_items_cart_product', columnNames: ['cart_id', 'product_id'] }],
        checks: [{ name: 'CHK_cart_items_quantity', expression: '"quantity" >= 1' }],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'cart_items',
      new TableForeignKey({
        columnNames: ['cart_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'carts',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'cart_items',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'RESTRICT',
      }),
    );

    // ---------- orders ----------
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'total_amount', type: 'decimal', precision: 10, scale: 2, isNullable: false },
          {
            name: 'fulfilment_method',
            type: 'enum',
            enum: ['pickup', 'delivery'],
            enumName: 'orders_fulfilment_method_enum',
            isNullable: false,
          },
          { name: 'delivery_address', type: 'text', isNullable: true },
          {
            name: 'order_status',
            type: 'enum',
            enum: ['pending', 'paid', 'cancelled'],
            enumName: 'orders_order_status_enum',
            default: "'pending'",
            isNullable: false,
          },
          { name: 'created_at', type: 'timestamp', default: 'now()', isNullable: false },
        ],
        checks: [
          {
            name: 'CHK_orders_delivery_address',
            expression: `"fulfilment_method" = 'pickup' OR ("delivery_address" IS NOT NULL AND length(trim("delivery_address")) > 0)`,
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'RESTRICT', // order history must survive
      }),
    );

    // ---------- order_items ----------
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'order_id', type: 'int', isNullable: false },
          { name: 'product_id', type: 'int', isNullable: false },
          { name: 'quantity', type: 'int', isNullable: false },
          { name: 'unit_price', type: 'decimal', precision: 10, scale: 2, isNullable: false },
        ],
        checks: [{ name: 'CHK_order_items_quantity', expression: '"quantity" >= 1' }],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'RESTRICT',
      }),
    );

    // ---------- payments ----------
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'order_id', type: 'int', isUnique: true, isNullable: false },
          {
            name: 'method',
            type: 'enum',
            enum: ['cash_on_delivery', 'card_simulated', 'mobile_banking_simulated'],
            enumName: 'payments_method_enum',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'paid', 'failed'],
            enumName: 'payments_status_enum',
            default: "'pending'",
            isNullable: false,
          },
          { name: 'amount', type: 'decimal', precision: 10, scale: 2, isNullable: false },
          { name: 'transaction_ref', type: 'varchar', length: '100', isNullable: true },
          { name: 'paid_at', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // dropTable also drops the foreign keys and indexes that belong to the table
    await queryRunner.dropTable('payments', true);
    await queryRunner.dropTable('order_items', true);
    await queryRunner.dropTable('orders', true);
    await queryRunner.dropTable('cart_items', true);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_carts_one_active_per_user"`);
    await queryRunner.dropTable('carts', true);

    await queryRunner.query(`DROP TYPE IF EXISTS "payments_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payments_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_order_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_fulfilment_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "carts_status_enum"`);
  }
}