import { StyleSheet, Text, View } from 'react-native';

// Segundo uso del Compound Pattern: agrupa "Título + contenido" para las
// secciones del detalle. Root da la caja/espaciado; Title y Body son
// intercambiables.
function Root({ children }: { children: React.ReactNode }) {
  return <View style={styles.section}>{children}</View>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <View style={styles.body}>{children}</View>;
}

export const Section = Object.assign(Root, { Title, Body });

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  body: {
    gap: 10,
  },
});
