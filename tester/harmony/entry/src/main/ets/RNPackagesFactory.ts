import type {
  RNPackageContext,
  RNPackage,
} from '@rnoh/react-native-openharmony/ts';
import {ReanimatedPackage} from '@rnoh/react-native-openharmony-reanimated/ts';
import {GestureHandlerPackage} from '@react-native-oh-tpl/react-native-gesture-handler/ts';
import {SafeAreaViewPackage} from '@react-native-oh-tpl/react-native-safe-area-context/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new ReanimatedPackage(ctx),
    new GestureHandlerPackage(ctx),
    new SafeAreaViewPackage(ctx),
  ];
}
