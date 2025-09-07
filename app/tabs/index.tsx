import { HelloWave } from 'components/HelloWave';
import ParallaxScrollView from 'components/ParallaxScrollView';
import { ThemedText } from 'components/ThemedText';
import { ThemedView } from 'components/ThemedView';
import { Image } from 'expo-image';
import React from 'react';
import { PermissionsAndroid, Platform, Pressable, StyleSheet } from 'react-native';

const handlePermissionStatus = (permission: string, status: string) => {
  switch (status) {
    case PermissionsAndroid.RESULTS.GRANTED:
      console.log(` Permissão concedida para ${permission}`);
      break;
    case PermissionsAndroid.RESULTS.DENIED:
      console.log(`Permissão negada para ${permission} (pode pedir novamente)`);
      break;
    case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
      console.log(`Permissão bloqueada permanentemente para ${permission}`);
      break;
    default:
      console.log(`Status desconhecido para ${permission}: ${status}`);
      break;
  }
};

export const BluetoothPermiss = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // necessário para BLE
      ];

      const results = await PermissionsAndroid.requestMultiple(permissions);

      let allGranted = true;

      for (const perm of permissions) {
        handlePermissionStatus(perm, results[perm]);
        if (results[perm] !== PermissionsAndroid.RESULTS.GRANTED) {
          allGranted = false;
        }
      }

      if (allGranted) {
        console.log(' Todas permissões Bluetooth concedidas');
        return true;
      } else {
        console.log(' Nem todas permissões Bluetooth foram concedidas');
        return false;
      }
    } catch (err) {
      console.error('Erro ao pedir permissões Bluetooth:', err);
      return false;
    }
  } else {
    console.log('BluetoothPermiss: Apenas necessário no Android');
    return true;
  }
};


export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#eee' }}
      headerImage={
        <Image
          source={require('@/assets/images/ImagemColarIA.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bem Vindo a interface CIA</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="default">Ative o bluetooth</ThemedText>
        <Pressable
              onPress={BluetoothPermiss}
              style={[styles.button2, { backgroundColor: 'blue' }]}
            >
              <ThemedText style={styles.buttonText}>AQUI</ThemedText>
            </Pressable>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <Pressable
              onPress={BluetoothPermiss}
              style={[styles.caixa, { backgroundColor: 'blue' }]}
            >
              <ThemedText style={styles.buttonText}>Conecte-se ao dispositivo
                CLIQUE AQUI!
              </ThemedText>
            </Pressable>
      </ThemedView>
    </ParallaxScrollView>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 450,
    width: 400,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  caixa: {
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 8,
    padding: 12,
    height: 80,
    margin: 8,
    minWidth: 20,
    alignItems: "center",
    backgroundColor: "#eee",
  },
  button2: {
    marginTop: 8,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
