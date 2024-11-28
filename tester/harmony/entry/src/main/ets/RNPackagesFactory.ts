import type {
  RNPackageContext,
  RNPackage,
} from '@rnoh/react-native-openharmony/ts';
import { BackgroundTimerTurboModulePackage } from '@react-native-ohos/react-native-background-timer/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new BackgroundTimerTurboModulePackage(ctx),
  ];
}
