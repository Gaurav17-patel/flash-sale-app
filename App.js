import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Toast from './src/components/Toast';
import CartScreen from './src/screens/CartScreen';
import PaymentModal from './src/components/PaymentModal';
import { fetchProducts } from './src/services/apiService';
import ProductListScreen from './src/screens/ProductListScreen';
import { loadCart, saveCart } from './src/services/cartService';
import { setupBiometrics, authenticate } from './src/services/biometricService';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [currentPage, setCurrentPage] = useState('products');
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToastFlag, setShowToast] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const stockInterval = useRef(null);
  const countdowns = useRef({});

  const showToast = useCallback(msg => {
    setToastMsg(msg);
    setShowToast(true);
  }, []);

  const hideToast = useCallback(() => setShowToast(false), []);

  const getProduct = useCallback(
    id => products.find(p => p.id === id),
    [products]
  );

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await setupBiometrics();

      try {
        const data = await fetchProducts();
        const prods = data.map(p => ({
          ...p,
          currentStock: p.stock,
          initialStock: p.stock,
          saleEndTime: Date.now() + (Math.floor(Math.random() * 10) + 1) * 60000,
        }));

        setProducts(prods);

        stockInterval.current = setInterval(() => {
          setProducts(prev =>
            prev.map(p => {
              if (p.saleEndTime <= Date.now()) return p;
              if (p.currentStock > 0 && Math.random() < 0.3) {
                return { ...p, currentStock: p.currentStock - 1 };
              }
              if (p.currentStock <= 0) {
                return { ...p, saleEndTime: Date.now() - 1 };
              }
              return p;
            })
          );
        }, 5000);

        prods.forEach(p => {
          countdowns.current[p.id] = setInterval(() => {
            setProducts(prev =>
              prev.map(x =>
                x.id === p.id
                  ? { ...x, saleEndTime: Math.max(0, x.saleEndTime - 1000) }
                  : x
              )
            );
          }, 1000);
        });

        const savedCart = await loadCart();
        setCart(savedCart);
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();

    return () => {
      clearInterval(stockInterval.current);
      Object.values(countdowns.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const handleAdd = useCallback(
    id => {
      const p = getProduct(id);
      if (!p || p.currentStock <= 0 || p.saleEndTime <= Date.now()) {
        return showToast('This item is currently unavailable.');
      }

      setCart(prev => {
        const currQty = prev[id] || 0;
        if (currQty >= p.currentStock) {
          showToast('Stock limit reached');
          return prev;
        }
        return { ...prev, [id]: currQty + 1 };
      });

      showToast(`${p.name} added to cart.`);
    },
    [getProduct]
  );

  const handleUpdate = useCallback(
    (id, qty) => {
      const p = getProduct(id);
      const parsedQty = parseInt(qty, 10);

      if (isNaN(parsedQty) || parsedQty < 1) {
        setCart(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        return showToast('Invalid quantity. Removed.');
      }

      if (parsedQty > p.currentStock) {
        setCart(prev => ({ ...prev, [id]: p.currentStock }));
        return showToast(`You can only add up to ${p.currentStock}.`);
      }

      setCart(prev => ({ ...prev, [id]: parsedQty }));
    },
    [getProduct]
  );

  const handleRemove = useCallback(id => {
    setCart(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    showToast('Item removed.');
  }, []);

  const calculateTotal = useCallback(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const p = getProduct(id);
      return total + (p ? p.price * qty : 0);
    }, 0);
  }, [cart, getProduct]);

  const proceedCheckout = async () => {
    if (!Object.keys(cart).length) return showToast('Cart is empty.');

    setAuthenticating(true);
    const ok = await authenticate(showToast);
    setAuthenticating(false);
    if (!ok) return;

    const invalidItems = Object.entries(cart).filter(([id, qty]) => {
      const p = getProduct(id);
      return !p || p.currentStock < qty || p.saleEndTime <= Date.now();
    });

    if (invalidItems.length) {
      Alert.alert(
        'Unavailable',
        invalidItems.map(([id]) => getProduct(id)?.name || id).join(', ')
      );
      return;
    }

    setShowPayment(true);
  };

  const onSuccess = () => {
    Alert.alert('Order Placed!', 'Thank you!');
    setProducts(prev =>
      prev.map(p =>
        cart[p.id]
          ? { ...p, currentStock: p.currentStock - cart[p.id] }
          : p
      )
    );
    setCart({});
    setCurrentPage('products');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading Flash Sale...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flash Sale App</Text>

        <TouchableOpacity
          onPress={() => setCurrentPage('products')}
          style={[styles.navBtn, currentPage === 'products' && styles.activeNav]}
        >
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentPage('cart')}
          style={[styles.navBtn, currentPage === 'cart' && styles.activeNav]}
        >
          <Text style={styles.navText}>Cart ({Object.keys(cart).length})</Text>
        </TouchableOpacity>
      </View>

      {currentPage === 'products' ? (
        <ProductListScreen products={products} cart={cart} handleAdd={handleAdd} />
      ) : (
        <CartScreen
          cart={cart}
          products={products}
          handlers={{ update: handleUpdate, remove: handleRemove }}
          calculateTotal={calculateTotal}
          isAuthenticating={authenticating}
          handleCheckout={proceedCheckout}
        />
      )}

      <Toast message={toastMsg} isVisible={showToastFlag} onHide={hideToast} />

      <PaymentModal
        isVisible={showPayment}
        totalAmount={calculateTotal()}
        onClose={() => setShowPayment(false)}
        onSuccess={onSuccess}
        onFailure={() => Alert.alert('Payment Failed')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  header: {
    padding: 15,
    marginTop: 30,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  headerTitle: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
  },
  navBtn: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#007bff',
  },
  activeNav: {
    backgroundColor: '#0056b3',
  },
  navText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
