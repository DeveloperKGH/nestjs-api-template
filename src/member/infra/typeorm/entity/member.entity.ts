import { BaseTimeEntity } from '../../../../global/infra/typeorm/entity/base-time.entity';
import { MemberRole } from '../../../domain/enum/member-role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MemberRoleTransformer } from '../transformer/member-role.transformer';
import { PasswordEncrypterService } from '../../../../auth/domain/service/password-encrypter.service';

@Entity()
export class Member extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: number;

  @Column({ type: 'varchar', length: 320 })
  public readonly email: string;

  @Column({ type: 'varchar', length: 60 })
  public password: string | null;

  @Column({ type: 'varchar', length: 10, transformer: new MemberRoleTransformer() })
  public readonly role: MemberRole;

  private constructor(email: string, password: string | null, role: MemberRole);

  private constructor(email: string, password: string | null, role: MemberRole, id?: number);

  private constructor(email: string, password: string | null, role: MemberRole, id?: number) {
    super();
    this.email = email;
    this.password = password;
    this.role = role;
    if (id) {
      this.id = id;
    }
  }

  public static of(email: string, password: string | null, role: MemberRole): Member;

  public static of(email: string, password: string | null, role: MemberRole, id: number): Member;

  public static of(email: string, password: string | null, role: MemberRole, id?: number): Member {
    return new Member(email, password, role, id);
  }

  public static async signUpMember(
    email: string,
    password: string,
    encrypter: PasswordEncrypterService,
  ): Promise<Member> {
    const hashedPassword = await encrypter.hash(password);
    return new Member(email, hashedPassword, MemberRole.MEMBER);
  }

  public async isMatchPassword(password: string, encrypter: PasswordEncrypterService): Promise<boolean> {
    return await encrypter.match(password, this.password);
  }

  public isEqualToEmail(email: string): boolean {
    return this.email === email;
  }

  public async resetPassword(password: string, encrypter: PasswordEncrypterService): Promise<void> {
    this.password = await encrypter.hash(password);
  }
}
