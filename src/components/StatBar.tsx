import { StyleSheet, Text, View } from 'react-native';
import { MAX_STAT_VALUE, STAT_LABELS } from '../utils/pokemon';

export function StatBar({ name, value }: { name: string; value: number }) {
  const pct = Math.min(100, (value / MAX_STAT_VALUE) * 100);
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{STAT_LABELS[name] ?? name}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    width: 90,
    fontSize: 13,
    color: '#5F6368',
    fontWeight: '600',
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E8E9ED',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4C6EF5',
  },
  value: {
    width: 30,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
});
