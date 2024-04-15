import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { ASPECT } from '../constants/aspect.constant';

/**
 * Decorator to apply to providers that implements LazyDecorator.
 * @see LazyDecorator
 */
export function Aspect(metadataKey: string | symbol) {
  return applyDecorators(SetMetadata(ASPECT, metadataKey), Injectable);
}
