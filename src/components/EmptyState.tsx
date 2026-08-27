import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = 'search-outline', title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color="#C4C7CC" />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5F6368',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#9AA0A6',
    textAlign: 'center',
  },
});
