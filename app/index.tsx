import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RootIndex() {
  const router = useRouter();
  
  // Redirect to the game home screen
  useEffect(() => {
    router.replace('/home');
  }, [router]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
  },
  text: {
    fontSize: 18,
    color: '#4361EE',
  },
});
