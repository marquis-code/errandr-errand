import { ref, computed, onMounted } from 'vue';

interface CartItem {
  productId: string;
  vendorId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations: { name: string; selected: string; price: number }[];
  subtotal: number;
}

// Global state using simple refs (Singleton Pattern)
const items = ref<CartItem[]>([]);
const deliveryAddress = ref('');
const deliveryNotes = ref('');
const deliveryLocation = ref<{ type: string; coordinates: number[] } | null>(null);

const cartInitialized = ref(false);

export const useCart = () => {
  const initCart = () => {
    if (cartInitialized.value || !import.meta.client) return;
    
    const stored = localStorage.getItem('errandr_cart');
    if (stored) {
      try {
        items.value = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored cart', e);
      }
    }
    cartInitialized.value = true;
  };

  const saveToStorage = () => {
    if (import.meta.client) {
      localStorage.setItem('errandr_cart', JSON.stringify(items.value));
    }
  };

  const addItem = (item: Omit<CartItem, 'subtotal'>) => {
    // Check if item from same vendor
    if (items.value.length > 0 && items.value[0].vendorId !== item.vendorId) {
      if (!confirm('Start a new order? This will clear your current cart from another vendor.')) return;
      items.value = []; 
    }

    const existingIndex = items.value.findIndex(
      (i) =>
        i.productId === item.productId &&
        JSON.stringify(i.customizations) === JSON.stringify(item.customizations),
    );

    if (existingIndex !== -1) {
      items.value[existingIndex].quantity += item.quantity;
      items.value[existingIndex].subtotal =
        (items.value[existingIndex].price + 
         items.value[existingIndex].customizations.reduce((sum, c) => sum + c.price, 0)) * 
        items.value[existingIndex].quantity;
    } else {
      const customizationTotal = item.customizations.reduce((sum, c) => sum + c.price, 0);
      items.value.push({
        ...item,
        subtotal: (item.price + customizationTotal) * item.quantity,
      });
    }

    saveToStorage();
  };

  const removeItem = (index: number) => {
    items.value.splice(index, 1);
    saveToStorage();
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    items.value[index].quantity = quantity;
    const customizationTotal = items.value[index].customizations.reduce((sum, c) => sum + c.price, 0);
    items.value[index].subtotal = (items.value[index].price + customizationTotal) * quantity;
    saveToStorage();
  };

  const clearCart = () => {
    items.value = [];
    deliveryAddress.value = '';
    deliveryNotes.value = '';
    deliveryLocation.value = null;
    saveToStorage();
  };

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.subtotal, 0));
  const deliveryFee = computed(() => (items.value.length > 0 ? 150 : 0));
  const serviceFee = computed(() => Math.round(subtotal.value * 0.05));
  const total = computed(() => subtotal.value + deliveryFee.value + serviceFee.value);
  const vendorId = computed(() => (items.value.length > 0 ? items.value[0].vendorId : null));
  const isEmpty = computed(() => items.value.length === 0);

  return {
    items,
    deliveryAddress,
    deliveryNotes,
    deliveryLocation,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    deliveryFee,
    serviceFee,
    total,
    vendorId,
    isEmpty,
    initCart,
  };
};
