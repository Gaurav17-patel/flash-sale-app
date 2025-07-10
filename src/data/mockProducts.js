const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Limited Edition Smartwatch',
    image: 'https://placehold.co/150x150/FF5733/FFFFFF?text=Smartwatch',
    price: 299.99,
    initialStock: 10,
    currentStock: 10,
    saleEndTime: Date.now() + 5 * 60 * 1000,
  },
];

export default MOCK_PRODUCTS;
