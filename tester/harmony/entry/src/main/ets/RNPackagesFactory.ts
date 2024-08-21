import type {RNPackageContext, RNPackage} from '@rnoh/react-native-openharmony/ts';
import {ReanimatedPackage} from '@rnoh/react-native-openharmony-reanimated/ts';
import {GestureHandlerPackage } from "@rnoh/react-native-gesture-handler/ts";


export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [new ReanimatedPackage(ctx), new GestureHandlerPackage(ctx)];
}
