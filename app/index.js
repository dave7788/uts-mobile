import { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { create } from 'zustand';

// ============= ZUSTAND STORE =============
const useStore = create((set) => ({
  userId: '',
  selectedPackage: null,
  selectedPayment: null,
  isLoggedIn: false,
  userEmail: '',
  isAdmin: false,
  packages: [
    { id: 1, vp: 475, bonus: 0, price: 75000, popular: false },
    { id: 2, vp: 1000, bonus: 0, price: 150000, popular: false },
    { id: 3, vp: 2050, bonus: 150, price: 300000, popular: true },
    { id: 4, vp: 3650, bonus: 400, price: 525000, popular: false },
    { id: 5, vp: 5350, bonus: 850, price: 750000, popular: false },
    { id: 6, vp: 11000, bonus: 2000, price: 1500000, popular: false },
  ],
  setUserId: (userId) => set({ userId }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  setSelectedPayment: (payment) => set({ selectedPayment: payment }),
  resetCart: () => set({ userId: '', selectedPackage: null, selectedPayment: null }),
  login: (email) =>
    set({
      isLoggedIn: true,
      userEmail: email,
      isAdmin: email.toLowerCase().endsWith('@admin.com'),
    }),
  logout: () =>
    set({
      isLoggedIn: false,
      userEmail: '',
      isAdmin: false,
      userId: '',
      selectedPackage: null,
      selectedPayment: null,
    }),
  addPackage: (pkg) =>
    set((state) => ({
      packages: [...state.packages, { ...pkg, id: Date.now() }],
    })),
  deletePackage: (id) =>
    set((state) => ({
      packages: state.packages.filter((pkg) => pkg.id !== id),
    })),
}));

const paymentMethods = [
  { id: 1, name: 'Credit/Debit Card', icon: '💳', fee: 0 },
  { id: 2, name: 'PayPal', icon: '🅿️', fee: 0 },
  { id: 3, name: 'GoPay', icon: '🟢', fee: 5000 },
  { id: 4, name: 'OVO', icon: '🟣', fee: 5000 },
  { id: 5, name: 'DANA', icon: '🔵', fee: 5000 },
];

// Helper function untuk format Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// ============= AUTH MODAL COMPONENT =============
function AuthModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const login = useStore((state) => state.login);

  const handleSubmit = () => {
    if (activeTab === 'register' && password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok!');
      return;
    }
    if (!email || !password) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }
    login(email);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.authModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selamat Datang</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => setActiveTab('login')}
            >
              <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                Masuk
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'register' && styles.activeTab]}
              onPress={() => setActiveTab('register')}
            >
              <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>
                Daftar
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {activeTab === 'register' && (
              <>
                <Text style={styles.label}>Konfirmasi Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>
                {activeTab === 'login' ? 'Masuk' : 'Daftar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ============= PACKAGE MANAGER COMPONENT =============
function PackageManager({ visible, onClose }) {
  const { packages, addPackage, deletePackage } = useStore();
  const [vp, setVp] = useState('');
  const [bonus, setBonus] = useState('');
  const [price, setPrice] = useState('');
  const [popular, setPopular] = useState(false);

  const handleAdd = () => {
    if (!vp || !price) return;
    addPackage({
      vp: parseInt(vp),
      bonus: parseInt(bonus) || 0,
      price: parseInt(price),
      popular,
    });
    setVp('');
    setBonus('');
    setPrice('');
    setPopular(false);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.managerContainer}>
        <View style={styles.managerHeader}>
          <Text style={styles.managerTitle}>Kelola Paket VP</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.managerContent}>
          <View style={styles.addSection}>
            <Text style={styles.sectionTitleBold}>Tambah Paket Baru</Text>
            <TextInput
              style={styles.input}
              placeholder="Jumlah VP"
              value={vp}
              onChangeText={setVp}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Bonus VP"
              value={bonus}
              onChangeText={setBonus}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Harga (Rp)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.checkbox} onPress={() => setPopular(!popular)}>
              <View style={[styles.checkboxBox, popular && styles.checkboxChecked]}>
                {popular && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Populer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>+ Tambah Paket</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listSection}>
            <Text style={styles.sectionTitleBold}>Paket Saat Ini</Text>
            {packages.map((pkg) => (
              <View key={pkg.id} style={styles.packageItem}>
                <View style={styles.packageInfoRow}>
                  <View>
                    <Text style={styles.packageVPText}>{pkg.vp} VP</Text>
                    {pkg.bonus > 0 && <Text style={styles.packageBonusText}>+{pkg.bonus} Bonus</Text>}
                  </View>
                  <Text style={styles.packagePriceText}>{formatRupiah(pkg.price)}</Text>
                  {pkg.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>POPULER</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deletePackage(pkg.id)}>
                  <Text style={styles.deleteBtnText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ============= MAIN SCREEN =============
export default function HomeScreen() {
  const {
    userId,
    selectedPackage,
    selectedPayment,
    isLoggedIn,
    userEmail,
    isAdmin,
    packages,
    setUserId,
    setSelectedPackage,
    setSelectedPayment,
    resetCart,
    logout,
  } = useStore();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPackageManager, setShowPackageManager] = useState(false);

  const handlePurchase = () => {
    if (userId && selectedPackage && selectedPayment) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetCart();
      }, 3000);
    }
  };

  const totalPrice =
    selectedPackage && selectedPayment
      ? selectedPackage.price + selectedPayment.fee
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <AuthModal visible={showAuth} onClose={() => setShowAuth(false)} />
      <PackageManager visible={showPackageManager} onClose={() => setShowPackageManager(false)} />

      <Modal visible={showSuccess} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Pembelian Berhasil!</Text>
            <Text style={styles.successText}>VP Anda akan segera dikreditkan</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>V</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>VALORANT</Text>
            <Text style={styles.headerSubtitle}>Pusat Top-Up</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {isLoggedIn ? (
            <View style={styles.userInfo}>
              <Text style={styles.userEmail} numberOfLines={1}>
                {userEmail}
              </Text>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.manageButton}
                  onPress={() => setShowPackageManager(true)}
                >
                  <Text style={styles.manageButtonText}>Kelola</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Keluar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={() => setShowAuth(true)}>
              <Text style={styles.loginButtonText}>Masuk</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {!isLoggedIn && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              💡 <Text style={styles.bold}>Tips:</Text> Login untuk menyimpan riwayat pembelian
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Masukkan User ID</Text>
          </View>
          <TextInput
            style={styles.userIdInput}
            placeholder="Masukkan Riot ID (contoh: PlayerName#TAG)"
            value={userId}
            onChangeText={setUserId}
          />
          <Text style={styles.hint}>ℹ️ Temukan Riot ID di pengaturan VALORANT</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Pilih Jumlah</Text>
          </View>
          <View style={styles.packageGrid}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  selectedPackage?.id === pkg.id && styles.packageCardSelected,
                ]}
                onPress={() => setSelectedPackage(pkg)}
              >
                {pkg.popular && (
                  <View style={styles.hotBadge}>
                    <Text style={styles.hotBadgeText}>HOT</Text>
                  </View>
                )}
                <Text style={styles.packageVP}>{pkg.vp}</Text>
                <Text style={styles.packageVPLabel}>VP</Text>
                {pkg.bonus > 0 && <Text style={styles.packageBonus}>+{pkg.bonus} Bonus</Text>}
                <Text style={styles.packagePrice}>{formatRupiah(pkg.price)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          </View>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment?.id === method.id && styles.paymentCardSelected,
              ]}
              onPress={() => setSelectedPayment(method)}
            >
              <View style={styles.paymentLeft}>
                <Text style={styles.paymentIcon}>{method.icon}</Text>
                <Text style={styles.paymentName}>{method.name}</Text>
              </View>
              {method.fee > 0 && <Text style={styles.paymentFee}>+{formatRupiah(method.fee)}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Ringkasan Pesanan</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>User ID</Text>
            <Text style={styles.summaryValue}>{userId || '-'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Paket</Text>
            <Text style={styles.summaryValue}>
              {selectedPackage
                ? `${selectedPackage.vp}${selectedPackage.bonus ? ' +' + selectedPackage.bonus : ''} VP`
                : '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pembayaran</Text>
            <Text style={styles.summaryValue}>{selectedPayment?.name || '-'}</Text>
          </View>
          {selectedPayment && selectedPayment.fee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Biaya Admin</Text>
              <Text style={styles.summaryValue}>{formatRupiah(selectedPayment.fee)}</Text>
            </View>
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatRupiah(totalPrice)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.buyButton,
            (!userId || !selectedPackage || !selectedPayment) && styles.buyButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={!userId || !selectedPackage || !selectedPayment}
        >
          <Text style={styles.buyButtonText}>
            {userId && selectedPackage && selectedPayment ? 'Beli Sekarang' : 'Lengkapi Semua Langkah'}
          </Text>
        </TouchableOpacity>

        <View style={styles.securityBadge}>
          <Text style={styles.securityIcon}>🔒</Text>
          <View>
            <Text style={styles.securityTitle}>Pembayaran Aman & Terpercaya</Text>
            <Text style={styles.securityText}>Transaksi dilindungi dan terenkripsi</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>⚡ Pengiriman Instan</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerText}>🌐 Support 24/7</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerText}>🔒 Pembayaran Aman</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


// ============= STYLES =============
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: '#f97316',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  headerSubtitle: { fontSize: 11, color: '#6b7280' },
  headerRight: { marginLeft: 8 },
  userInfo: { alignItems: 'flex-end', gap: 4 },
  userEmail: { fontSize: 11, color: '#1f2937', fontWeight: '500', maxWidth: 120 },
  manageButton: { backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  manageButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  logoutButton: { backgroundColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutButtonText: { color: '#374151', fontSize: 12, fontWeight: '500' },
  loginButton: { backgroundColor: '#f97316', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  loginButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { flex: 1 },
  infoBanner: {
    backgroundColor: '#dbeafe',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  infoBannerText: { fontSize: 13, color: '#1e40af' },
  bold: { fontWeight: 'bold' },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#f97316',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  userIdInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 6, padding: 12, fontSize: 14 },
  hint: { fontSize: 11, color: '#6b7280', marginTop: 8 },
  packageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  packageCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  packageCardSelected: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  hotBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#f97316',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  hotBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  packageVP: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  packageVPLabel: { fontSize: 11, color: '#6b7280', marginBottom: 4 },
  packageBonus: { fontSize: 10, fontWeight: '600', color: '#16a34a', marginBottom: 4 },
  packagePrice: { fontSize: 16, fontWeight: 'bold', color: '#f97316' },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  paymentCardSelected: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentIcon: { fontSize: 24 },
  paymentName: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  paymentFee: { fontSize: 13, fontWeight: '600', color: '#f97316' },
  summarySection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 13, color: '#6b7280' },
  summaryValue: { fontSize: 13, fontWeight: '500', color: '#1f2937' },
  summaryDivider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
  summaryTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  summaryTotalValue: { fontSize: 24, fontWeight: 'bold', color: '#f97316' },
  buyButton: {
    backgroundColor: '#f97316',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonDisabled: { backgroundColor: '#d1d5db' },
  buyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  securityBadge: { flexDirection: 'row', gap: 8, backgroundColor: '#f9fafb', margin: 16, padding: 12, borderRadius: 8 },
  securityIcon: { fontSize: 16 },
  securityTitle: { fontSize: 12, fontWeight: '600', color: '#1f2937', marginBottom: 2 },
  securityText: { fontSize: 11, color: '#6b7280' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 24 },
  footerText: { fontSize: 12, color: '#6b7280' },
  footerDot: { fontSize: 12, color: '#6b7280' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  authModal: { backgroundColor: '#fff', borderRadius: 12, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  closeBtn: { fontSize: 28, color: '#9ca3af' },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: 24 },
  tab: { flex: 1, paddingBottom: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#f97316' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#6b7280' },
  activeTabText: { color: '#f97316' },
  form: { gap: 12 },
  label: { fontSize: 13, fontWeight: '500', color: '#374151', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 6, padding: 12, fontSize: 14, marginBottom: 8 },
  submitBtn: { backgroundColor: '#f97316', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  successModal: { backgroundColor: '#fff', borderRadius: 12, padding: 32, alignItems: 'center' },
  successIcon: { fontSize: 60, marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  successText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  managerContainer: { flex: 1, backgroundColor: '#fff' },
  managerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  managerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  managerContent: { flex: 1, padding: 16 },
  addSection: { backgroundColor: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 24 },
  sectionTitleBold: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  checkbox: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#f97316', borderColor: '#f97316' },
  checkmark: { color: '#fff', fontWeight: 'bold' },
  checkboxLabel: { fontSize: 14, color: '#374151' },
  addBtn: { backgroundColor: '#10b981', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  listSection: { marginBottom: 24 },
  packageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  packageInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  packageVPText: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  packageBonusText: { fontSize: 12, color: '#16a34a' },
  packagePriceText: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  popularBadge: { backgroundColor: '#f97316', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  popularText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  deleteBtnText: { color: '#fff', fontWeight: '600' },
});