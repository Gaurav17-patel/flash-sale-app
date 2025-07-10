import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'flashSaleCart';

export async function loadCart() {
  const s = await AsyncStorage.getItem(KEY);
  return s ? JSON.parse(s) : {};
}

export async function saveCart(cart) {
  await AsyncStorage.setItem(KEY, JSON.stringify(cart));
}
