import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { formatTime } from '../utils';

const screenWidth = Dimensions.get('window').width;

export default function ProductListScreen({ products, cart, handleAdd }) {
  return (
    <ScrollView contentContainerStyle={styles.productList}>
      {products.map(product => {
        const { id, name, image, price, currentStock, saleEndTime } = product;
        const isOutOfStock = currentStock <= 0;
        const isSaleEnded = saleEndTime <= Date.now();

        let buttonLabel = 'Add to Cart';
        if (isOutOfStock) buttonLabel = 'Out of Stock';
        else if (isSaleEnded) buttonLabel = 'Sale Ended';

        return (
          <View key={id} style={styles.card}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.detail}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.price}>${price.toFixed(2)}</Text>
              <Text style={styles.stock}>Stock Left: {currentStock}</Text>
              <Text style={styles.countdown}>
                Time Left: {formatTime(saleEndTime - Date.now())}
              </Text>

              <TouchableOpacity
                style={[styles.btn, (isOutOfStock || isSaleEnded) && styles.disabled]}
                disabled={isOutOfStock || isSaleEnded}
                onPress={() => handleAdd(id)}
              >
                <Text style={styles.btnText}>{buttonLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  productList: {
    padding: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  card: {
    padding: 12,
    elevation: 2,
    shadowRadius: 4,
    borderRadius: 12,
    marginVertical: 10,
    shadowOpacity: 0.1,
    shadowColor: '#000',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: screenWidth * 0.95,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#e6e6e6',
  },
  detail: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 15,
    color: '#1e90ff',
    fontWeight: '600',
  },
  stock: {
    fontSize: 14,
    color: '#666',
  },
  countdown: {
    fontSize: 14,
    color: 'crimson',
    fontWeight: '600',
  },
  btn: {
    marginTop: 8,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'seagreen',
  },
  btnText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#bbbbbb',
  },
});
