import { forwardRef, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { TrueSheet, type TrueSheetProps } from '@lodev09/react-native-true-sheet';

import { DARK, GAP, SPACING, times } from '../../utils';
import { DemoContent } from '../DemoContent';

interface LateScrollableSheetProps extends TrueSheetProps {}

const LOAD_DELAY = 1500;

// Repro: the ScrollView mounts after the sheet has presented, the way content
// that loads first does. On Android, with no grabber, a short pull down on the
// list springs back instead of dismissing the sheet (`dismissThreshold="short"`).
export const LateScrollableSheet = forwardRef<TrueSheet, LateScrollableSheetProps>((props, ref) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [presented, setPresented] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!presented) return;
    const timeout = setTimeout(() => setLoaded(true), LOAD_DELAY);
    return () => clearTimeout(timeout);
  }, [presented]);

  return (
    <TrueSheet
      ref={ref}
      detents={[1]}
      dismissThreshold="short"
      scrollableRef={scrollViewRef}
      grabber={false}
      backgroundColor={DARK}
      style={styles.sheet}
      onDidPresent={() => setPresented(true)}
      onDidDismiss={() => {
        setPresented(false);
        setLoaded(false);
        console.log('Sheet LateScrollable dismissed!');
      }}
      {...props}
    >
      <View style={styles.wrapper} collapsable={false}>
        {loaded ? (
          <ScrollView ref={scrollViewRef} contentContainerStyle={styles.content}>
            {times(20, (i) => (
              <DemoContent key={i} text={`Item #${i + 1}`} />
            ))}
          </ScrollView>
        ) : (
          <ActivityIndicator style={styles.loader} size="large" />
        )}
      </View>
    </TrueSheet>
  );
});

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  content: {
    padding: SPACING,
    gap: GAP,
  },
  loader: {
    flex: 1,
  },
});

LateScrollableSheet.displayName = 'LateScrollableSheet';
