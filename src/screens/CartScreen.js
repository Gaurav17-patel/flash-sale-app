import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const MAX_LENGTH = 3;
const BUTTON_PADDING = 10;

export default function CartScreen({
  cart,
  products,
  handlers,
  calculateTotal,
  isAuthenticating,
  handleCheckout,
}) {
  const keys = Object.keys(cart);
  
  const renderCartItem = (pid) => {
    const qty = cart[pid];
    const product = products.find(x => x.id === pid);

    if (!product) {
      return (
        <View key={pid} style={styles.item}>
          <Image source={{ uri: '' }} style={styles.image} />
          <View style={styles.detail}>
            <Text>Unknown Item</Text>
            <TouchableOpacity onPress={() => handlers.remove(pid)}>
              <Text>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const isSaleEnded = product.saleEndTime <= Date.now();
    const isOutOfStock = product.currentStock <= 0;
    const isDisabled = isSaleEnded || isOutOfStock;

    return (
      <View key={pid} style={styles.item}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.detail}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handlers.update(pid, qty - 1)}
              disabled={qty <= 1}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.qtyInput}
              value={`${qty}`}
              onChangeText={(text) => {
                const newQty = Math.max(1, parseInt(text) || 1);
                handlers.update(pid, newQty);
              }}
              keyboardType="numeric"
              maxLength={MAX_LENGTH}
            />
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handlers.update(pid, qty + 1)}
              disabled={qty >= product.currentStock}
            >
              <Text>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handlers.remove(pid)}
            >
              <Text>Remove</Text>
            </TouchableOpacity>
          </View>
          {isSaleEnded && <Text style={styles.unavail}>Sale Ended!</Text>}
          {isOutOfStock && <Text style={styles.unavail}>Out of Stock!</Text>}
          <Text style={styles.subtotal}>
            Subtotal: ${(product.price * qty).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {keys.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty.</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {keys.map(renderCartItem)}
        </ScrollView>
      )}
      <View style={styles.summary}>
        <Text style={styles.total}>Total: ${calculateTotal().toFixed(2)}</Text>
        <TouchableOpacity
          style={[styles.checkout, (keys.length === 0 || isAuthenticating) && styles.disabled]}
          onPress={handleCheckout}
          disabled={keys.length === 0 || isAuthenticating}
        >
          {isAuthenticating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  empty: {
    fontSize: 18,
    color: '#666',
    marginTop: 50,
    marginBottom: 10,
    textAlign: 'center',
  },
  item: {
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  detail: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#007bff',
  },
  qtyControl: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    margin: 5,
    borderRadius: 5,
    padding: BUTTON_PADDING,
    backgroundColor: '#e0e0e0',
  },
  qtyInput: {
    width: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    textAlign: 'center',
  },
  removeBtn: {
    padding: 5,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#dc3545',
  },
  unavail: {
    color: 'red',
    fontWeight: 'bold',
  },
  subtotal: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  summary: {
    paddingTop: 15,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  total: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  checkout: {
    padding: 15,
    width: '80%',
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
});
