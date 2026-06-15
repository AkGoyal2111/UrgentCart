import { useOrderStore } from '@/stores/orderStore';
import { Order, CartItem, Product } from '@/types';
import productsData from '@/data/products.json';

const products = productsData as unknown as Product[];

/**
 * Find products by their IDs from the catalog.
 */
function getProductsByIds(ids: string[]): Product[] {
  return ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
}

/**
 * Convert products to CartItems with specified quantities and optional reason.
 */
function toCartItems(
  productList: Product[],
  quantities?: number[],
  reason?: string
): CartItem[] {
  return productList.map((product, index) => ({
    ...product,
    quantity: quantities?.[index] ?? 1,
    reason,
  }));
}

/**
 * Checks if the order store has any orders.
 * If empty, seeds 3 demo orders using real products from the catalog.
 * Returns true if seeded, false if orders already existed.
 */
export function seedDemoOrders(): boolean {
  const { pastOrders, addOrder } = useOrderStore.getState();

  if (pastOrders.length > 0) {
    return false;
  }

  const now = Date.now();

  // Order 1: Movie Night — 3 days ago
  const movieNightProducts = getProductsByIds([
    'prod_032', // Butter Popcorn
    'prod_026', // Classic Salted Chips
    'prod_051', // Coca-Cola
    'prod_035', // Dairy Milk Silk
    'prod_048', // Doritos Nacho
    'prod_040', // Dark Fantasy Cookies
    'prod_054', // Mango Juice
    'prod_041', // Kurkure Masala Munch
  ]);
  const movieNightItems = toCartItems(
    movieNightProducts,
    [2, 2, 2, 1, 2, 1, 2, 2],
    'Perfect for a movie night'
  );
  const movieNightTotal = movieNightItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order1: Order = {
    id: 'ORD-DEMO-001',
    items: movieNightItems,
    situationLabel: 'Movie Night',
    total: movieNightTotal,
    date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
  };

  // Order 2: Guests Arriving — 1 week ago
  const guestsProducts = getProductsByIds([
    'prod_026', // Classic Salted Chips
    'prod_027', // Magic Masala Chips
    'prod_052', // Coca-Cola (6-Pack)
    'prod_055', // Mixed Fruit Juice
    'prod_049', // Mineral Water Bottle
    'prod_044', // Oreo Cookies
    'prod_030', // Aloo Bhujia
    'prod_081', // Disposable Cups
    'prod_080', // Disposable Plates
    'prod_088', // Napkins
    'prod_034', // Salted Cashews
    'prod_077', // Room Freshener
  ]);
  const guestsItems = toCartItems(
    guestsProducts,
    [2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
    'Great for hosting guests'
  );
  const guestsTotal = guestsItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order2: Order = {
    id: 'ORD-DEMO-002',
    items: guestsItems,
    situationLabel: 'Guests Arriving',
    total: guestsTotal,
    date: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
  };

  // Order 3: Exam Prep All-Nighter — 2 weeks ago
  // Includes prod_051 (Coca-Cola) and prod_026 (Chips) for replenishment overlap
  const examProducts = getProductsByIds([
    'prod_060', // Instant Coffee
    'prod_057', // Energy Drink
    'prod_029', // Marie Gold Biscuits
    'prod_036', // KitKat
    'prod_042', // Mixed Dry Fruits
    'prod_051', // Coca-Cola (overlap with order 1 and 2)
    'prod_026', // Classic Salted Chips (overlap with order 1 and 2)
  ]);
  const examItems = toCartItems(
    examProducts,
    [1, 2, 2, 2, 1, 2, 1],
    'Fuel for the all-night study session'
  );
  const examTotal = examItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order3: Order = {
    id: 'ORD-DEMO-003',
    items: examItems,
    situationLabel: 'Exam Prep All-Nighter',
    total: examTotal,
    date: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
  };

  // Order 4: Custom Weekly Grocery — 10 days ago
  const groceryProducts = getProductsByIds([
    'prod_001', // Basmati Rice
    'prod_002', // Toor Dal
    'prod_003', // Sunflower Oil
    'prod_049', // Mineral Water
    'prod_029', // Marie Gold Biscuits
    'prod_060', // Instant Coffee
    'prod_054', // Mango Juice
  ]);
  const groceryItems = toCartItems(
    groceryProducts,
    [1, 1, 1, 2, 2, 1, 2],
    'Weekly grocery essentials'
  );
  const groceryTotal = groceryItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order4: Order = {
    id: 'ORD-DEMO-004',
    items: groceryItems,
    situationLabel: 'Weekly Grocery',
    total: groceryTotal,
    date: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
  };

  // Order 5: Custom Snack Box — 5 days ago
  const snackProducts = getProductsByIds([
    'prod_026', // Classic Salted Chips
    'prod_027', // Magic Masala Chips
    'prod_035', // Dairy Milk Silk
    'prod_036', // KitKat
    'prod_040', // Dark Fantasy Cookies
    'prod_044', // Oreo Cookies
    'prod_042', // Mixed Dry Fruits
    'prod_034', // Salted Cashews
  ]);
  const snackItems = toCartItems(
    snackProducts,
    [2, 1, 2, 2, 1, 1, 1, 1],
    'My favourite snack combo'
  );
  const snackTotal = snackItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order5: Order = {
    id: 'ORD-DEMO-005',
    items: snackItems,
    situationLabel: 'My Snack Box',
    total: snackTotal,
    date: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
  };

  // Order 6: Custom Morning Routine — 4 days ago
  const morningProducts = getProductsByIds([
    'prod_060', // Instant Coffee
    'prod_029', // Marie Gold Biscuits
    'prod_049', // Mineral Water
    'prod_054', // Mango Juice
    'prod_051', // Coca-Cola
  ]);
  const morningItems = toCartItems(
    morningProducts,
    [2, 1, 2, 1, 1],
    'Daily morning essentials'
  );
  const morningTotal = morningItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order6: Order = {
    id: 'ORD-DEMO-006',
    items: morningItems,
    situationLabel: 'Morning Essentials',
    total: morningTotal,
    date: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
  };

  // Add orders oldest-first so they appear sorted correctly (store prepends)
  addOrder(order3);
  addOrder(order4);
  addOrder(order2);
  addOrder(order5);
  addOrder(order6);
  addOrder(order1);

  return true;
}
