import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MemberListener } from '../../../member/application/listener/member.listener';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [MemberListener],
})
export class EventListenerModule {}
