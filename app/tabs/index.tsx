import React, { useState } from 'react';
import { PermissionsAndroid, Pressable, StyleSheet, Linking, Image, Alert, View } from 'react-native';
import { HelloWave } from 'components/HelloWave';
import ParallaxScrollView from 'components/ParallaxScrollView';
import { ThemedText } from 'components/ThemedText';
import { ThemedView } from 'components/ThemedView';
import { BluetoothConnection } from './Bluetooth'; 

export const CameraPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
  const result = await PermissionsAndroid.request(permission);

  if (result === PermissionsAndroid.RESULTS.GRANTED) return true;
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    Alert.alert(
      'Permissão necessária',
      'A permissão de câmera foi bloqueada permanentemente. Habilite nas configurações.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }
  return false;
};

const handlePermissionStatus = (permission: string, status: string) => {
  switch (status) {
    case PermissionsAndroid.RESULTS.GRANTED:
      console.log(`Permissão concedida para ${permission}`);
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
  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ];

    const results = await PermissionsAndroid.requestMultiple(permissions);

    let allGranted = true;
    let blockedPermanently = false;

    for (const perm of permissions) {
      handlePermissionStatus(perm, results[perm]);

      if (results[perm] !== PermissionsAndroid.RESULTS.GRANTED) {
        allGranted = false;
      }
      if (results[perm] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        blockedPermanently = true;
      }
    }

    if (blockedPermanently) {
      Alert.alert(
        'Permissões necessárias',
        'Algumas permissões Bluetooth estão bloqueadas permanentemente. Você precisa habilitá-las manualmente nas configurações do app.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    if (allGranted) {
      console.log('Todas permissões Bluetooth concedidas');
      return true;
    } else {
      console.log('Nem todas permissões Bluetooth foram concedidas');
      return false;
    }
  } catch (err) {
    console.error('Erro ao pedir permissões Bluetooth:', err);
    return false;
  }
};

export default function HomeScreen() {
  const [showBluetooth, setShowBluetooth] = useState(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#eee' }}
      headerImage={
        <Image
          source={require('../../assets/images/ImagemColarIA.png')}
          style={styles.reactLogo}
        />
      }
    >
      <View style={{ gap: 35 }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">
            Bem Vindo a interface CIA <HelloWave />
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.titleContainer, { gap: 20 }]}>
          <ThemedText type="default">Ative o bluetooth</ThemedText>
          <Pressable
            onPress={BluetoothPermiss}
            style={[styles.button2, { backgroundColor: 'blue' }]}
          >
            <ThemedText style={[styles.buttonText, { fontSize: 25 }]}>AQUI</ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.titleContainer}>
          <Pressable
            onPress={() => setShowBluetooth(true)} // ⬅ mostra o componente
            style={[styles.caixa, { backgroundColor: 'blue' }]}
          >
            <ThemedText style={styles.buttonText}>
              Conecte-se ao dispositivo{"\n"}CLIQUE AQUI!
            </ThemedText>
          </Pressable>
        </ThemedView>

        {/* Renderiza o componente BluetoothConnection quando showBluetooth for true */}
        {showBluetooth && <BluetoothConnection onClose={() => setShowBluetooth(false)} />}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 8,
    height: 40,
    borderWidth: 2,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#eee",
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
