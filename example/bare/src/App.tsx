import { useEffect, useRef, useState, useCallback } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { TrueSheet, TrueSheetProvider } from '@lodev09/react-native-true-sheet';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const DARK = '#1c1c1e';
const DARK_BLUE = '#2c2c3e';
const SPACING = 16;
const GAP = 12;

const FooterRepro = () => {
  const sheetRef = useRef<TrueSheet>(null);
  const insets = useSafeAreaInsets();
  const [footerTaps, setFooterTaps] = useState(0);
  const [contentTaps, setContentTaps] = useState(0);
  const footerTapsRef = useRef(0);

  const handleFooterTap = useCallback(() => {
    footerTapsRef.current += 1;
    const count = footerTapsRef.current;
    setFooterTaps(count);
    Alert.alert('Footer Tap', `Count: ${count}`);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => sheetRef.current?.present(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Footer Touch Repro</Text>
      <Text style={styles.subtitle}>
        {'Tap each button 10 times. The counter should reach 10.\n\n' +
          'BUG: On physical iOS devices, every 2nd footer tap is ' +
          'silently swallowed. The content button (control) works every time.'}
      </Text>
      <Pressable
        style={[styles.button, { backgroundColor: '#007AFF', marginBottom: 16 }]}
        onPress={() => sheetRef.current?.present()}
      >
        <Text style={styles.buttonText}>Present Sheet</Text>
      </Pressable>

      <TrueSheet
        ref={sheetRef}
        detents={['auto', 0.5, 1]}
        backgroundColor={DARK}
        style={styles.sheetContent}
        footer={
          <View style={styles.footer}>
            <Pressable
              style={[
                styles.button,
                footerTaps >= 10
                  ? { backgroundColor: '#2d7d2d' }
                  : footerTaps > 0 && footerTaps < 10
                    ? { backgroundColor: '#cc3333' }
                    : undefined,
              ]}
              onPress={handleFooterTap}
            >
              <Text style={styles.buttonText}>
                FOOTER: {footerTaps}/10 {footerTaps >= 10 ? ' PASS' : ''}
              </Text>
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="Tap to focus (keyboard test)"
              placeholderTextColor="#999"
              returnKeyType="done"
            />
          </View>
        }
      >
        <Pressable
          style={[
            styles.demoBlock,
            contentTaps >= 10
              ? { backgroundColor: '#2d7d2d' }
              : contentTaps > 0 && contentTaps < 10
                ? { backgroundColor: '#cc3333' }
                : undefined,
          ]}
          onPress={() => setContentTaps((n) => n + 1)}
        >
          <Text style={styles.demoText}>
            CONTENT: {contentTaps}/10 {contentTaps >= 10 ? ' PASS' : ''}
          </Text>
          <Text style={[styles.demoText, { fontSize: 12, marginTop: 4, opacity: 0.6 }]}>
            (control — this should always work)
          </Text>
        </Pressable>
        <View style={styles.demoBlock}>
          <Text style={styles.demoText}>Sheet content block 2</Text>
        </View>
        <View style={styles.demoBlock}>
          <Text style={styles.demoText}>Sheet content block 3</Text>
        </View>
      </TrueSheet>
    </View>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <TrueSheetProvider>
        <FooterRepro />
      </TrueSheetProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: SPACING,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sheetContent: {
    paddingHorizontal: SPACING,
    paddingTop: SPACING,
    paddingBottom: 80 + SPACING,
    gap: GAP,
  },
  footer: {
    padding: SPACING,
    gap: GAP,
  },
  demoBlock: {
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  demoText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: DARK_BLUE,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: SPACING,
    height: 48,
    borderRadius: 24,
    fontSize: 16,
    color: '#fff',
  },
});
