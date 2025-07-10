import * as Keychain from 'react-native-keychain';
import { Alert } from 'react-native';

const SERVICE = 'flashSaleCheckoutAuth';
const USER = 'biometric_user';
const PASS = 'dummy_password';

export async function setupBiometrics() {
  const type = await Keychain.getSupportedBiometryType();
  if (!type || type === Keychain.BIOMETRY_NONE) return;
  try {
    await Keychain.resetGenericPassword({ service: SERVICE });
  } catch {}
  await Keychain.setGenericPassword(USER, PASS, {
    service: SERVICE,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
    accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  });
}

export async function authenticate(showToast) {
  const type = await Keychain.getSupportedBiometryType();
  if (!type || type === Keychain.BIOMETRY_NONE) {
    Alert.alert('Setup Required', 'Enable biometrics in settings.');
    return false;
  }
  const creds = await Keychain.getGenericPassword({
    authenticationPrompt: {
      title: 'Biometric Authentication Required',
      subtitle: 'Unlock to proceed',
      description: 'Please authenticate.',
      cancelButton: 'Cancel',
    },
    service: SERVICE,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
  });
  if (creds) {
    showToast('Authentication successful!');
    return true;
  }
  Alert.alert('Authentication Failed', 'Cannot proceed.');
  return false;
}
