import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTable1775500022201 implements MigrationInterface{
  public async up(queryRunner:QueryRunner):Promise<void>

  {
    await queryRunner.createTable(
      new Table({
        name:"users",
        columns:[
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'full_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'varchar',
            default: "'USER'",
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: 'vehicle_makes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'vehicle_models',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'make_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'vehicle_models',
      new TableForeignKey({
        columnNames: ['make_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicle_makes',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'make',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'model',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'registration_number',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'vehicles',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner):Promise<void> {
    const vehicleTable = await queryRunner.getTable('vehicles');
    if (vehicleTable) {
      const userForeignKey = vehicleTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey('vehicles', userForeignKey);
      }
    }
    await queryRunner.dropTable('vehicles');

    const modelTable = await queryRunner.getTable('vehicle_models');
    if (modelTable) {
      const makeForeignKey = modelTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('make_id') !== -1,
      );
      if (makeForeignKey) {
        await queryRunner.dropForeignKey('vehicle_models', makeForeignKey);
      }
    }
    await queryRunner.dropTable('vehicle_models');

    await queryRunner.dropTable('vehicle_makes');
    await queryRunner.dropTable('users');
  }
  
}