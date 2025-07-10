import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function PaymentModal({
  onClose,
  isVisible,
  onSuccess,
  onFailure,
  totalAmount,
}) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);

    setTimeout(() => {
      const success = Math.random() > 0.2;
      setProcessing(false);
      onClose();
      success ? onSuccess() : onFailure();
    }, 2000);
  };

  const cardNumber = '4111222233334444';
  const expiry = '12/25';
  const cvv = '123';

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Complete Your Purchase</Text>
          <Text style={styles.total}>Total: ${totalAmount.toFixed(2)}</Text>

          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            maxLength={16}
            value={cardNumber}
            editable={false}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
              value={expiry}
              editable={false}
            />
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="CVV"
              keyboardType="numeric"
              maxLength={3}
              value={cvv}
              editable={false}
            />
          </View>

          <TouchableOpacity
            style={styles.payBtn}
            onPress={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payBtnText}>Pay Now</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000099',
  },
  container: {
    width: '90%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    color: '#333',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    marginBottom: 20,
    color: '#007bff',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#ddd',
    paddingHorizontal: 15,
  },
  row: {
    width: '100%',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },
  payBtn: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#28a745',
  },
  payBtnText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelBtnText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: 'bold',
  },
});
