import type {RNPackageContext, RNPackage} from 'rnoh/ts';
import {ReanimatedPackage} from 'rnoh-reanimated/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [new ReanimatedPackage(ctx)];
}
