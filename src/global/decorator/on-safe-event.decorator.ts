import { applyDecorators } from '@nestjs/common';
import { OnEvent, OnEventType } from '@nestjs/event-emitter';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';

function createSafeEvent() {
  return function onSafeEventDecorator<T>(_target: T, _key: string | symbol, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;

    const metaKeys = Reflect.getOwnMetadataKeys(descriptor.value);
    const metas = metaKeys.map(key => [key, Reflect.getMetadata(key, descriptor.value)]);

    descriptor.value = async function onSafeEventFunction(...args: unknown[]): Promise<void> {
      try {
        await originalMethod.call(this, ...args);
      } catch (err: unknown) {
        const isError = err instanceof Error;
        const message = isError ? err : 'An unexpected error occurred in OnSafeEvent';
        const stack = isError ? err.stack : null;

        console.error(message, stack, 'OnSafeEvent');
      }
    };
    metas.forEach(([k, v]) => Reflect.defineMetadata(k, v, descriptor.value));
  };
}

export function OnSafeEvent(event: OnEventType, options?: OnEventOptions | undefined): MethodDecorator {
  return applyDecorators(OnEvent(event, options), createSafeEvent());
}
