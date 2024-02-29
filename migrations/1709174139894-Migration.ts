import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1709174139894 implements MigrationInterface {
    name = 'Migration1709174139894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`member\` (\`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(320) NOT NULL, \`password\` varchar(60) NOT NULL, \`name\` varchar(10) NULL, \`role\` varchar(10) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`auth_code\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`type\` varchar(30) NOT NULL, \`code\` varchar(50) NOT NULL, \`expires_at\` timestamp(3) NOT NULL, \`is_verified\` tinyint NOT NULL DEFAULT 0, \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`member_id\` bigint UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_token\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`token\` varchar(60) NOT NULL, \`expires_at\` timestamp(3) NOT NULL, \`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`member_id\` bigint UNSIGNED NULL, UNIQUE INDEX \`UK_member_id\` (\`member_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`withdrawn_member\` (\`created_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`member_id\` bigint UNSIGNED NOT NULL, \`email\` varchar(320) NOT NULL, \`role\` varchar(10) NOT NULL, \`joined_at\` timestamp(3) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`withdrawn_member\``);
        await queryRunner.query(`DROP INDEX \`UK_member_id\` ON \`refresh_token\``);
        await queryRunner.query(`DROP TABLE \`refresh_token\``);
        await queryRunner.query(`DROP TABLE \`auth_code\``);
        await queryRunner.query(`DROP TABLE \`member\``);
    }

}
