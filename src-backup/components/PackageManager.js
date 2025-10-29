import { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import useStore from '../store/useStore';

const PackageManager = ({ visible, onClose }) => {
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
      price: parseFloat(price),
      popular,
    });
    setVp('');
    setBonus('');
    setPrice('');
    setPopular(false);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage VP Packages</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.addSection}>
            <Text style={styles.sectionTitle}>Add New Package</Text>
            <TextInput
              style={styles.input}
              placeholder="VP Amount"
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
              placeholder="Price ($)"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setPopular(!popular)}
            >
              <View style={[styles.checkboxBox, popular && styles.checkboxChecked]}>
                {popular && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Popular</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>+ Add Package</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Current Packages</Text>
            {packages.map((pkg) => (
              <View key={pkg.id} style={styles.packageItem}>
                <View style={styles.packageInfo}>
                  <View>
                    <Text style={styles.packageVP}>{pkg.vp} VP</Text>
                    {pkg.bonus > 0 && (
                      <Text style={styles.packageBonus}>+{pkg.bonus} Bonus</Text>
                    )}
                  </View>
                  <Text style={styles.packagePrice}>${pkg.price}</Text>
                  {pkg.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>POPULAR</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deletePackage(pkg.id)}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeBtn: {
    fontSize: 28,
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addSection: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
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
  checkboxChecked: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  addBtn: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  listSection: {
    marginBottom: 24,
  },
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
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  packageVP: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  packageBonus: {
    fontSize: 12,
    color: '#16a34a',
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  popularBadge: {
    backgroundColor: '#f97316',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default PackageManager;