import { Inject, Injectable } from '@nestjs/common';
import { CheckEmailDuplicationServiceDto } from '../dto/check-email-duplication-service.dto';
import { MemberCommandRepository } from '../../domain/repository/member-command.repository';
import { ResetMyPasswordServiceDto } from '../dto/reset-my-password.service.dto';
import { GlobalContextUtil } from '../../../global/util/global-context.util';
import { NotFoundException } from '../../../global/exception/not-found.exception';
import {
  PasswordEncrypterService,
  PasswordEncrypterServiceToken,
} from '../../../auth/domain/service/password-encrypter.service';
import { BadRequestException } from '../../../global/exception/bad-request.exception';
import { Transactional } from '../../../global/infra/typeorm/transactional.decorator';
import { WithdrawnMemberCommandRepository } from '../../domain/repository/withdrawn-member-command.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MemberListener } from '../listener/member.listener';
import { WithdrawnMember } from '../../domain/model/withdrawn-member.domain';
import { Member } from '../../domain/model/member.domain';
import { UpdateMyInfoServiceDto } from '../dto/update-my-info.service.dto';
import { isEmpty } from '../../../global/util/common.util';
import { MemberServiceDto } from '../dto/member.service.dto';

@Injectable()
export class MemberService {
  constructor(
    @Inject(MemberCommandRepository)
    private readonly memberCommandRepository: MemberCommandRepository,

    @Inject(WithdrawnMemberCommandRepository)
    private readonly withdrawnMemberCommandRepository: WithdrawnMemberCommandRepository,

    @Inject(PasswordEncrypterServiceToken)
    private readonly passwordEncrypter: PasswordEncrypterService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async checkEmailDuplication(dto: CheckEmailDuplicationServiceDto): Promise<boolean> {
    return await this.memberCommandRepository.existByEmail(dto.email);
  }

  @Transactional()
  async resetMyPassword(dto: ResetMyPasswordServiceDto): Promise<void> {
    const foundMember: Member | null = await this.memberCommandRepository.findById(GlobalContextUtil.getMember().id);

    if (!foundMember) {
      throw new NotFoundException(NotFoundException.ErrorCodes.NOT_FOUND_MEMBER);
    }

    const isMatch = await foundMember.isMatchPassword(dto.password, this.passwordEncrypter);

    if (!isMatch) {
      throw new BadRequestException(BadRequestException.ErrorCodes.INVALID_PASSWORD);
    }

    await foundMember.resetPassword(dto.newPassword, this.passwordEncrypter);

    await this.memberCommandRepository.save(foundMember);
  }

  @Transactional()
  async withdraw(): Promise<void> {
    const memberId = GlobalContextUtil.getMember().id;

    const foundMember = await this.memberCommandRepository.findById(memberId);

    if (!foundMember) {
      throw new NotFoundException(NotFoundException.ErrorCodes.NOT_FOUND_MEMBER);
    }

    const withdrawnMember = await WithdrawnMember.withdrawFromMember(foundMember, this.memberCommandRepository);

    await this.withdrawnMemberCommandRepository.save(withdrawnMember);

    this.eventEmitter.emit(MemberListener.WITHDRAW_MEMBER_EVENT, withdrawnMember);
  }

  @Transactional()
  async updateMyInfo(serviceDto: UpdateMyInfoServiceDto): Promise<MemberServiceDto> {
    const foundMember = await this.memberCommandRepository.findById(GlobalContextUtil.getMember().id);

    if (isEmpty(foundMember)) {
      throw new NotFoundException(NotFoundException.ErrorCodes.NOT_FOUND_MEMBER);
    }

    foundMember!.update(serviceDto.name);

    await this.memberCommandRepository.save(foundMember!);

    return MemberServiceDto.fromDomain(foundMember!);
  }
}
