import { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
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
  darkMode: false,
  transactions: [],
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
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
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
  updatePackage: (id, updatedPkg) =>
    set((state) => ({
      packages: state.packages.map((pkg) =>
        pkg.id === id ? { ...pkg, ...updatedPkg } : pkg
      ),
    })),
  deletePackage: (id) =>
    set((state) => ({
      packages: state.packages.filter((pkg) => pkg.id !== id),
      selectedPackage: state.selectedPackage?.id === id ? null : state.selectedPackage,
    })),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        {
          ...transaction,
          id: Date.now(),
          date: new Date().toISOString(),
          status: 'success',
        },
        ...state.transactions,
      ],
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

// Helper function untuk format tanggal
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('id-ID', options);
};

// ============= AUTH MODAL COMPONENT =============
function AuthModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const login = useStore((state) => state.login);
  const darkMode = useStore((state) => state.darkMode);

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

  const styles = getStyles(darkMode);

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
              placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
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
                  placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
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

// ============= TRANSACTION HISTORY MODAL =============
function TransactionHistory({ visible, onClose }) {
  const { transactions, userEmail, darkMode } = useStore();
  const styles = getStyles(darkMode);

  const userTransactions = transactions.filter((t) => t.userEmail === userEmail);

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.managerContainer}>
        <View style={styles.managerHeader}>
          <Text style={styles.managerTitle}>📋 Riwayat Transaksi</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.managerContent}>
          {userTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyStateTitle}>Belum ada transaksi</Text>
              <Text style={styles.emptyStateText}>
                Transaksi Anda akan muncul di sini setelah melakukan pembelian
              </Text>
            </View>
          ) : (
            <View style={styles.transactionList}>
              <Text style={styles.transactionCount}>
                Total {userTransactions.length} Transaksi
              </Text>
              {userTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionHeader}>
                    <View style={styles.transactionStatus}>
                      <Text style={styles.statusIcon}>✓</Text>
                      <Text style={styles.statusText}>Berhasil</Text>
                    </View>
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.date)}
                    </Text>
                  </View>

                  <View style={styles.transactionDivider} />

                  <View style={styles.transactionDetail}>
                    <Text style={styles.transactionLabel}>User ID</Text>
                    <Text style={styles.transactionValue}>{transaction.userId}</Text>
                  </View>

                  <View style={styles.transactionDetail}>
                    <Text style={styles.transactionLabel}>Paket VP</Text>
                    <Text style={styles.transactionValue}>
                      {transaction.vp} VP
                      {transaction.bonus > 0 && (
                        <Text style={styles.bonusText}> +{transaction.bonus} Bonus</Text>
                      )}
                    </Text>
                  </View>

                  <View style={styles.transactionDetail}>
                    <Text style={styles.transactionLabel}>Metode Pembayaran</Text>
                    <Text style={styles.transactionValue}>
                      {transaction.paymentIcon} {transaction.paymentMethod}
                    </Text>
                  </View>

                  <View style={styles.transactionDivider} />

                  <View style={styles.transactionTotal}>
                    <Text style={styles.transactionTotalLabel}>Total Bayar</Text>
                    <Text style={styles.transactionTotalValue}>
                      {formatRupiah(transaction.totalPrice)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ============= PACKAGE MANAGER COMPONENT =============
function PackageManager({ visible, onClose }) {
  const { packages, addPackage, deletePackage, updatePackage, darkMode } = useStore();
  const [vp, setVp] = useState('');
  const [bonus, setBonus] = useState('');
  const [price, setPrice] = useState('');
  const [popular, setPopular] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const styles = getStyles(darkMode);

  const handleSubmit = () => {
    if (!vp || !price) {
      Alert.alert('Error', 'Mohon isi VP dan Harga');
      return;
    }
    
    if (editingId) {
      updatePackage(editingId, {
        vp: parseInt(vp),
        bonus: parseInt(bonus) || 0,
        price: parseInt(price),
        popular,
      });
      Alert.alert('Berhasil', 'Paket berhasil diupdate!');
      setEditingId(null);
    } else {
      addPackage({
        vp: parseInt(vp),
        bonus: parseInt(bonus) || 0,
        price: parseInt(price),
        popular,
      });
      Alert.alert('Berhasil', 'Paket baru berhasil ditambahkan!');
    }
    
    setVp('');
    setBonus('');
    setPrice('');
    setPopular(false);
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    setVp(pkg.vp.toString());
    setBonus(pkg.bonus.toString());
    setPrice(pkg.price.toString());
    setPopular(pkg.popular);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setVp('');
    setBonus('');
    setPrice('');
    setPopular(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus paket ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => {
            deletePackage(id);
            if (editingId === id) {
              handleCancelEdit();
            }
            Alert.alert('Berhasil', 'Paket berhasil dihapus!');
          }
        },
      ]
    );
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
            <View style={styles.formHeader}>
              <Text style={styles.sectionTitleBold}>
                {editingId ? '✏️ Edit Paket' : '➕ Tambah Paket Baru'}
              </Text>
              {editingId && (
                <TouchableOpacity onPress={handleCancelEdit}>
                  <Text style={styles.cancelLink}>Batal</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={styles.inputLabel}>Jumlah VP *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 1000"
              placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
              value={vp}
              onChangeText={setVp}
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Bonus VP</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 100 (opsional)"
              placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
              value={bonus}
              onChangeText={setBonus}
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Harga (Rp) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 150000"
              placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            
            <TouchableOpacity style={styles.checkbox} onPress={() => setPopular(!popular)}>
              <View style={[styles.checkboxBox, popular && styles.checkboxChecked]}>
                {popular && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Tandai sebagai Populer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitBtn, editingId ? styles.updateBtn : styles.addBtn]} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>
                {editingId ? '✓ Update Paket' : '+ Tambah Paket'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listSection}>
            <Text style={styles.sectionTitleBold}>📦 Daftar Paket ({packages.length})</Text>
            {packages.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Belum ada paket tersedia</Text>
              </View>
            ) : (
              packages.map((pkg) => (
                <View 
                  key={pkg.id} 
                  style={[
                    styles.packageItem,
                    editingId === pkg.id && styles.packageItemEditing
                  ]}
                >
                  <View style={styles.packageInfo}>
                    <View style={styles.packageMainInfo}>
                      <Text style={styles.packageVPText}>{pkg.vp} VP</Text>
                      {pkg.bonus > 0 && (
                        <View style={styles.bonusBadge}>
                          <Text style={styles.bonusBadgeText}>+{pkg.bonus}</Text>
                        </View>
                      )}
                      {pkg.popular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularText}>HOT</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.packagePriceText}>{formatRupiah(pkg.price)}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.editBtn} 
                      onPress={() => handleEdit(pkg)}
                    >
                      <Text style={styles.editBtnText}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteBtn} 
                      onPress={() => handleDelete(pkg.id)}
                    >
                      <Text style={styles.deleteBtnText}>🗑️ Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
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
    darkMode,
    setUserId,
    setSelectedPackage,
    setSelectedPayment,
    resetCart,
    logout,
    toggleDarkMode,
    addTransaction,
  } = useStore();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPackageManager, setShowPackageManager] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  const styles = getStyles(darkMode);

  const handlePurchase = () => {
    if (userId && selectedPackage && selectedPayment) {
      // Add transaction to history if logged in
      if (isLoggedIn) {
        addTransaction({
          userId,
          userEmail,
          vp: selectedPackage.vp,
          bonus: selectedPackage.bonus,
          price: selectedPackage.price,
          paymentMethod: selectedPayment.name,
          paymentIcon: selectedPayment.icon,
          paymentFee: selectedPayment.fee,
          totalPrice: selectedPackage.price + selectedPayment.fee,
        });
      }

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
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <AuthModal visible={showAuth} onClose={() => setShowAuth(false)} />
      <PackageManager visible={showPackageManager} onClose={() => setShowPackageManager(false)} />
      <TransactionHistory visible={showTransactionHistory} onClose={() => setShowTransactionHistory(false)} />

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
          <View style={styles.darkModeToggle}>
            <Text style={styles.darkModeLabel}>{darkMode ? '🌙' : '☀️'}</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#d1d5db', true: '#f97316' }}
              thumbColor={darkMode ? '#fff' : '#fff'}
            />
          </View>
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
                  <Text style={styles.manageButtonText}>⚙️ Kelola</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => setShowTransactionHistory(true)}
              >
                <Text style={styles.historyButtonText}>📋 Riwayat</Text>
              </TouchableOpacity>
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
            placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
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

// ============= DYNAMIC STYLES =============
const getStyles = (darkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: darkMode ? '#374151' : '#e5e7eb',
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937' },
  headerSubtitle: { fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280' },
  headerRight: { marginLeft: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  darkModeToggle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  darkModeLabel: { fontSize: 18 },
  userInfo: { alignItems: 'flex-end', gap: 4 },
  userEmail: { fontSize: 11, color: darkMode ? '#f9fafb' : '#1f2937', fontWeight: '500', maxWidth: 120 },
  manageButton: { backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  manageButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  historyButton: { backgroundColor: '#8b5cf6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  historyButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  logoutButton: { backgroundColor: darkMode ? '#374151' : '#e5e7eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutButtonText: { color: darkMode ? '#f9fafb' : '#374151', fontSize: 12, fontWeight: '500' },
  loginButton: { backgroundColor: '#f97316', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  loginButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { flex: 1 },
  infoBanner: {
    backgroundColor: darkMode ? '#1e3a8a' : '#dbeafe',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkMode ? '#3b82f6' : '#93c5fd',
  },
  infoBannerText: { fontSize: 13, color: darkMode ? '#bfdbfe' : '#1e40af' },
  bold: { fontWeight: 'bold' },
  section: {
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkMode ? '#374151' : '#e5e7eb',
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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937' },
  userIdInput: { 
    borderWidth: 1, 
    borderColor: darkMode ? '#4b5563' : '#d1d5db', 
    borderRadius: 6, 
    padding: 12, 
    fontSize: 14,
    color: darkMode ? '#f9fafb' : '#1f2937',
    backgroundColor: darkMode ? '#374151' : '#fff',
  },
  hint: { fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280', marginTop: 8 },
  packageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  packageCard: {
    width: '30%',
    backgroundColor: darkMode ? '#374151' : '#fff',
    borderWidth: 2,
    borderColor: darkMode ? '#4b5563' : '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  packageCardSelected: { borderColor: '#f97316', backgroundColor: darkMode ? '#451a03' : '#fff7ed' },
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
  packageVP: { fontSize: 20, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937' },
  packageVPLabel: { fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280', marginBottom: 4 },
  packageBonus: { fontSize: 10, fontWeight: '600', color: '#16a34a', marginBottom: 4 },
  packagePrice: { fontSize: 16, fontWeight: 'bold', color: '#f97316' },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: darkMode ? '#4b5563' : '#e5e7eb',
    backgroundColor: darkMode ? '#374151' : '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  paymentCardSelected: { borderColor: '#f97316', backgroundColor: darkMode ? '#451a03' : '#fff7ed' },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentIcon: { fontSize: 24 },
  paymentName: { fontSize: 14, fontWeight: '500', color: darkMode ? '#f9fafb' : '#1f2937' },
  paymentFee: { fontSize: 13, fontWeight: '600', color: '#f97316' },
  summarySection: {
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkMode ? '#374151' : '#e5e7eb',
  },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 13, color: darkMode ? '#9ca3af' : '#6b7280' },
  summaryValue: { fontSize: 13, fontWeight: '500', color: darkMode ? '#f9fafb' : '#1f2937' },
  summaryDivider: { height: 1, backgroundColor: darkMode ? '#374151' : '#e5e7eb', marginVertical: 12 },
  summaryTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { fontSize: 16, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937' },
  summaryTotalValue: { fontSize: 24, fontWeight: 'bold', color: '#f97316' },
  buyButton: {
    backgroundColor: '#f97316',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonDisabled: { backgroundColor: darkMode ? '#4b5563' : '#d1d5db' },
  buyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  securityBadge: { 
    flexDirection: 'row', 
    gap: 8, 
    backgroundColor: darkMode ? '#1f2937' : '#f9fafb', 
    margin: 16, 
    padding: 12, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkMode ? '#374151' : 'transparent',
  },
  securityIcon: { fontSize: 16 },
  securityTitle: { fontSize: 12, fontWeight: '600', color: darkMode ? '#f9fafb' : '#1f2937', marginBottom: 2 },
  securityText: { fontSize: 11, color: darkMode ? '#9ca3af' : '#6b7280' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 24 },
  footerText: { fontSize: 12, color: darkMode ? '#9ca3af' : '#6b7280' },
  footerDot: { fontSize: 12, color: darkMode ? '#9ca3af' : '#6b7280' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  authModal: { backgroundColor: darkMode ? '#1f2937' : '#fff', borderRadius: 12, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937' },
  closeBtn: { fontSize: 28, color: '#9ca3af' },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: darkMode ? '#374151' : '#e5e7eb', marginBottom: 24 },
  tab: { flex: 1, paddingBottom: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#f97316' },
  tabText: { fontSize: 14, fontWeight: '500', color: darkMode ? '#9ca3af' : '#6b7280' },
  activeTabText: { color: '#f97316' },
  form: { gap: 12 },
  label: { fontSize: 13, fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151', marginTop: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: darkMode ? '#4b5563' : '#d1d5db', 
    backgroundColor: darkMode ? '#374151' : '#fff',
    borderRadius: 6, 
    padding: 12, 
    fontSize: 14, 
    marginBottom: 8,
    color: darkMode ? '#f9fafb' : '#1f2937',
  },
  submitBtn: { backgroundColor: '#f97316', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  successModal: { backgroundColor: darkMode ? '#1f2937' : '#fff', borderRadius: 12, padding: 32, alignItems: 'center' },
  successIcon: { fontSize: 60, marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937', marginBottom: 8 },
  successText: { fontSize: 14, color: darkMode ? '#9ca3af' : '#6b7280', textAlign: 'center' },
  managerContainer: { flex: 1, backgroundColor: darkMode ? '#111827' : '#fff' },
  managerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: darkMode ? '#374151' : '#e5e7eb',
    backgroundColor: darkMode ? '#1f2937' : '#fff',
  },
  managerTitle: { fontSize: 20, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937' },
  managerContent: { flex: 1, padding: 16, backgroundColor: darkMode ? '#111827' : '#fff' },
  addSection: { 
    backgroundColor: darkMode ? '#1f2937' : '#f9fafb', 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: darkMode ? '#374151' : '#e5e7eb' 
  },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitleBold: { fontSize: 16, fontWeight: '600', color: darkMode ? '#f9fafb' : '#374151' },
  cancelLink: { fontSize: 14, color: '#f97316', fontWeight: '600' },
  inputLabel: { fontSize: 13, fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151', marginTop: 8, marginBottom: 4 },
  checkbox: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: darkMode ? '#4b5563' : '#d1d5db',
    backgroundColor: darkMode ? '#374151' : '#fff',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#f97316', borderColor: '#f97316' },
  checkmark: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  checkboxLabel: { fontSize: 14, color: darkMode ? '#e5e7eb' : '#374151' },
  addBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  updateBtn: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  listSection: { marginBottom: 24 },
  emptyState: { 
    backgroundColor: darkMode ? '#1f2937' : '#f9fafb', 
    padding: 32, 
    borderRadius: 8, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkMode ? '#374151' : '#e5e7eb',
    marginTop: 12,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyStateTitle: { fontSize: 16, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937', marginBottom: 4 },
  emptyStateText: { fontSize: 14, color: darkMode ? '#9ca3af' : '#6b7280', textAlign: 'center' },
  packageItem: {
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: darkMode ? '#374151' : '#e5e7eb',
  },
  packageItemEditing: {
    borderColor: '#3b82f6',
    backgroundColor: darkMode ? '#1e3a8a' : '#eff6ff',
  },
  packageInfo: { marginBottom: 12 },
  packageMainInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  packageVPText: { fontSize: 18, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937' },
  bonusBadge: { backgroundColor: darkMode ? '#065f46' : '#dcfce7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  bonusBadgeText: { fontSize: 11, fontWeight: '600', color: darkMode ? '#86efac' : '#16a34a' },
  packagePriceText: { fontSize: 16, fontWeight: 'bold', color: '#f97316' },
  popularBadge: { backgroundColor: '#f97316', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  popularText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  editBtn: { flex: 1, backgroundColor: '#3b82f6', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  editBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  deleteBtn: { flex: 1, backgroundColor: '#ef4444', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  deleteBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  transactionList: { marginBottom: 24 },
  transactionCount: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: darkMode ? '#9ca3af' : '#6b7280', 
    marginBottom: 12 
  },
  transactionCard: {
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: darkMode ? '#374151' : '#e5e7eb',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: darkMode ? '#065f46' : '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: { fontSize: 14, color: darkMode ? '#86efac' : '#16a34a' },
  statusText: { fontSize: 12, fontWeight: '600', color: darkMode ? '#86efac' : '#16a34a' },
  transactionDate: { fontSize: 12, color: darkMode ? '#9ca3af' : '#6b7280' },
  transactionDivider: { height: 1, backgroundColor: darkMode ? '#374151' : '#e5e7eb', marginVertical: 12 },
  transactionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionLabel: { fontSize: 13, color: darkMode ? '#9ca3af' : '#6b7280' },
  transactionValue: { fontSize: 13, fontWeight: '500', color: darkMode ? '#f9fafb' : '#1f2937' },
  bonusText: { fontSize: 11, fontWeight: '600', color: '#16a34a' },
  transactionTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionTotalLabel: { fontSize: 14, fontWeight: 'bold', color: darkMode ? '#f9fafb' : '#1f2937' },
  transactionTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#f97316' },
});