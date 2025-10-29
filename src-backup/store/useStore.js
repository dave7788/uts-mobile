import { create } from 'zustand';

const useStore = create((set) => ({
  // State
  userId: '',
  selectedPackage: null,
  selectedPayment: null,
  isLoggedIn: false,
  userEmail: '',
  isAdmin: false,
  packages: [
    { id: 1, vp: 475, bonus: 0, price: 4.99, popular: false },
    { id: 2, vp: 1000, bonus: 0, price: 9.99, popular: false },
    { id: 3, vp: 2050, bonus: 150, price: 19.99, popular: true },
    { id: 4, vp: 3650, bonus: 400, price: 34.99, popular: false },
    { id: 5, vp: 5350, bonus: 850, price: 49.99, popular: false },
    { id: 6, vp: 11000, bonus: 2000, price: 99.99, popular: false }
  ],

  // Actions
  setUserId: (userId) => set({ userId }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  setSelectedPayment: (payment) => set({ selectedPayment: payment }),
  
  resetCart: () => set({ 
    userId: '', 
    selectedPackage: null, 
    selectedPayment: null 
  }),
  
  login: (email) => set({ 
    isLoggedIn: true, 
    userEmail: email, 
    isAdmin: email.toLowerCase().endsWith('@admin.com') 
  }),
  
  logout: () => set({ 
    isLoggedIn: false, 
    userEmail: '', 
    isAdmin: false, 
    userId: '', 
    selectedPackage: null, 
    selectedPayment: null 
  }),
  
  addPackage: (pkg) => set((state) => ({ 
    packages: [...state.packages, { ...pkg, id: Date.now() }] 
  })),
  
  deletePackage: (id) => set((state) => ({ 
    packages: state.packages.filter(pkg => pkg.id !== id) 
  })),
}));

export default useStore;