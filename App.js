import { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import AuthModal from './src/components/AuthModal';
import PackageManager from './src/components/PackageManager';
import useStore from './src/store/useStore';

const paymentMethods = [
  { id: 1, name: 'Credit/Debit Card', icon: '💳', fee: 0 },
  { id: 2, name: 'PayPal', icon: '🅿️', fee: 0 },
  { id: 3, name: 'GoPay', icon: '🟢', fee: 0.5 },
  { id: 4, name: 'OVO', icon: '🟣', fee: 0.5 },
  { id: 5, name: 'DANA', icon: '🔵', fee: 0.5 },
];

export default function App() {
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
      ? (selectedPackage.price + selectedPayment.fee).toFixed(2)
      : '0.00';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Modals */}
      <AuthModal visible={showAuth} onClose={() => setShowAuth(false)} />
      <PackageManager
        visible={showPackageManager}
        onClose={() => setShowPackageManager(false)}
      />

      {/* Success Modal */}
      <Modal visible={showSuccess} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Purchase Successful!</Text>
            <Text style={styles.successText}>Your VP will be credited shortly</Text>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>V</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>VALORANT</Text>
            <Text style={styles.headerSubtitle}>Top-Up Center</Text>
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
                  <Text style={styles.manageButtonText}>Manage</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => setShowAuth(true)}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Info Banner */}
        {!isLoggedIn && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              💡 <Text style={styles.bold}>Tip:</Text> Login to save your purchase
              history
            </Text>
          </View>
        )}

        {/* Step 1: User ID */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Enter User ID</Text>
          </View>
          <TextInput
            style={styles.userIdInput}
            placeholder="Enter Riot ID (e.g., PlayerName#TAG)"
            value={userId}
            onChangeText={setUserId}
          />
          <Text style={styles.hint}>ℹ️ Find your Riot ID in VALORANT settings</Text>
        </View>

        {/* Step 2: Select Package */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Select Amount</Text>
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
                {pkg.bonus > 0 && (
                  <Text style={styles.packageBonus}>+{pkg.bonus} Bonus</Text>
                )}
                <Text style={styles.packagePrice}>${pkg.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 3: Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Payment Method</Text>
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
              {method.fee > 0 && (
                <Text style={styles.paymentFee}>+${method.fee}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>User ID</Text>
            <Text style={styles.summaryValue}>{userId || '-'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Package</Text>
            <Text style={styles.summaryValue}>
              {selectedPackage
                ? `${selectedPackage.vp}${
                    selectedPackage.bonus ? ' +' + selectedPackage.bonus : ''
                  } VP`
                : '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment</Text>
            <Text style={styles.summaryValue}>
              {selectedPayment?.name || '-'}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>${totalPrice}</Text>
          </View>
        </View>

        {/* Buy Button */}
        <TouchableOpacity
          style={[
            styles.buyButton,
            (!userId || !selectedPackage || !selectedPayment) &&
              styles.buyButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={!userId || !selectedPackage || !selectedPayment}
        >
          <Text style={styles.buyButtonText}>
            {userId && selectedPackage && selectedPayment
              ? 'Buy Now'
              : 'Complete All Steps'}
          </Text>
        </TouchableOpacity>

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Text style={styles.securityIcon}>🔒</Text>
          <View>
            <Text style={styles.securityTitle}>Safe & Secure Payment</Text>
            <Text style={styles.securityText}>
              Your transaction is protected and encrypted
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>⚡ Instant Delivery</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerText}>🌐 24/7 Support</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerText}>🔒 Secure Payment</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: '#f97316',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6b7280',
  },
  headerRight: {
    marginLeft: 8,
  },
  userInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  userEmail: {
    fontSize: 11,
    color: '#1f2937',
    fontWeight: '500',
    maxWidth: 120,
  },
  manageButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  manageButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  infoBanner: {
    backgroundColor: '#dbeafe',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  infoBannerText: {
    fontSize: 13,
    color: '#1e40af',
  },
  bold: {
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#f97316',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userIdInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  hint: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 8,
  },
  packageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  packageCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
  },
  hotBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#f97316',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  hotBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  packageVP: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  packageVPLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  packageBonus: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f97316',
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  paymentCardSelected: {
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    fontSize: 24,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  paymentFee: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f97316',
  },
  summarySection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  summaryTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
  },
  buyButton: {
    backgroundColor: '#f97316',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityBadge: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f9fafb',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  securityIcon: {
    fontSize: 16,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  securityText: {
    fontSize: 11,
    color: '#6b7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footerDot: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  successModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});