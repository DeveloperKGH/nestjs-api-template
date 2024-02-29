import { Exclude, Expose } from 'class-transformer';
import { NumberUtil } from '../../../../global/util/number.util';
import { EnumResponse } from '../../../../global/interface/dto/response/enum.response';
import { MemberRole } from '../../../domain/enum/member-role.enum';
import { MemberServiceDto } from '../../../application/dto/member.service.dto';

export class MemberResponse {
  @Exclude({ toPlainOnly: true }) private readonly _id: string | number;
  @Exclude({ toPlainOnly: true }) private readonly _email: string;
  @Exclude({ toPlainOnly: true }) public readonly _password: string;
  @Exclude({ toPlainOnly: true }) private readonly _name: string | null;
  @Exclude({ toPlainOnly: true }) private readonly _role: string | MemberRole;

  constructor(id: string | number, email: string, password: string, name: string | null, role: string | MemberRole) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._name = name;
    this._role = role;
  }

  public static fromServiceDto(serviceDto: MemberServiceDto): MemberResponse {
    return new MemberResponse(serviceDto.id, serviceDto.email, serviceDto.password, serviceDto.name, serviceDto.role);
  }

  @Expose()
  get id(): number {
    if (typeof this._id === 'number') {
      return this._id;
    }

    return NumberUtil.parseInt(this._id) as number;
  }

  @Expose()
  get email(): string {
    return this._email;
  }

  @Expose()
  get name(): string | null {
    return this._name;
  }

  @Expose()
  get role(): EnumResponse<MemberRole> | null {
    if (typeof this._role === 'string') {
      return EnumResponse.of(MemberRole.findCode(this._role));
    }

    return EnumResponse.of(this._role);
  }
}
