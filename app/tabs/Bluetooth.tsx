import React, {useEffect, useState} from 'react';
import { PermissionsAndroid, Pressable, StyleSheet, Linking, Image, Alert, View, Button, FlatList, Text, NativeEventEmitter, NativeModules  } from 'react-native';
import { HelloWave } from 'components/HelloWave';
import ParallaxScrollView from 'components/ParallaxScrollView';
import { ThemedText } from 'components/ThemedText';
import { ThemedView } from 'components/ThemedView';
import BleManager from "react-native-ble-manager";

const CIA_CONTROL_ENABLE = "22086d8b-57c2-4eb4-b82d-4b7936413e78";
const CONTROLE_TEMP = "2f7d55d9-acce-4a1d-9871-dd3e4ec73eec";
const ENABLE_1 = "1b4a81b4-abf5-450d-9d4d-81b4e951baa7";
const ENABLE_2 = "d2b757c1-9fb1-4166-af83-467a0a0a55f3";
const ENABLE_3 = "765170c6-24e5-4890-a346-10195b57ca7c";
const AlTemp_1 = "28b66ce2-882e-46e2-bc17-1332f33072db";
const AlTemp_2 = "83ec522b-14b0-4b42-8a8b-0924993f5490";
const AlTemp_3 = "e49b8658-6f76-43dd-a36e-db7f4b1aa546";

const SERVICE_UUIDS = [CIA_CONTROL_ENABLE, CONTROLE_TEMP];
const CHARACTERISTIC_UUIDS = [ENABLE_1, ENABLE_2, ENABLE_3, AlTemp_1, AlTemp_2, AlTemp_3];

export default function BluetoothConnection() {
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any | null>(null);

  useEffect(() => {
    // Inicializa o BLE Manager
    BleManager.start({ showAlert: false });

    // Eventos do BLE
    const bleEmitter = new NativeEventEmitter(NativeModules.BleManager);

    const handleDiscoverPeripheral = (device: any) => {
      setDevices((prev) => {
        if (!prev.find((d) => d.id === device.id)) {
          return [...prev, device];
        }
        return prev;
      });
    };

    bleEmitter.addListener("BleManagerDiscoverPeripheral", handleDiscoverPeripheral);

    return () => {
      bleEmitter.removeAllListeners("BleManagerDiscoverPeripheral");
    };
  }, []);

  // Escanear dispositivos
  const startScan = () => {
    setDevices([]);
    BleManager.scan([], 10, true).then(() => {
      console.log("Scanning...");
    });
  };

  // Conectar ao dispositivo
  const connectToDevice = async (device: any) => {
    try {
      await BleManager.connect(device.id);
      console.log("Conectado a:", device.name || device.id);
      setConnectedDevice(device);

      // Descobrir serviços e características
      await BleManager.retrieveServices(device.id);
    } catch (err) {
      console.error("Erro na conexão:", err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Escanear dispositivos" onPress={startScan} />

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name ? item.name : "Sem nome"}
            onPress={() => connectToDevice(item)}
          />
        )}
      />

      {connectedDevice && (
        <Text>Conectado a: {connectedDevice.name || connectedDevice.id}</Text>
      )}
    </View>
  );
}
