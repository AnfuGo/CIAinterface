import { useEffect, useState, useRef } from 'react';
import { Modal, View, FlatList, Text, Pressable, StyleSheet, Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { usePeripheralContext } from './peripheralContext';

const TARGET_MAC = "6C:97:6D:D0:80:1D";
//export const [peripheralId, setPeripheralId] = useState(null);
//export const [peripheralId, setPeripheralId] = useState<string | null>(null);

interface Props {
  onClose: () => void;
}

export const BluetoothConnection = ({ onClose }: Props) => {
  const { setPeripheralId } = usePeripheralContext();
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any | null>(null);
  const scanning = useRef(false);
  const scanInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startScanLoop();

    return () => {
      stopScan().catch(err => console.error("Erro no cleanup do scan:", err));
    };
  }, []);

  const scanDevicesOnce = async () => {
    if (!scanning.current) return;

    try {
      console.log("Scanning dispositivos...");
      await BleManager.scan([], 5, true); // scan de 5s
      const discovered = await BleManager.getDiscoveredPeripherals();
      console.log(`Dispositivos encontrados: ${discovered.length}`);

      // Remove duplicatas e mantém dispositivos anteriores
      setDevices(prev => {
        const combined = [...prev, ...discovered];
        const uniqueDevices = Array.from(new Map(combined.map(d => [d.id, d])).values());

        // Prioriza TARGET_MAC
        const sorted = uniqueDevices.sort((a, b) =>
          (a.id.toLowerCase() === TARGET_MAC.toLowerCase() ? -1 : 1)
        );
        console.log("Dispositivos atualizados:", sorted.map(d => d.id));
        return sorted;
      });
    } catch (err) {
      console.error("Erro no scan:", err);
    }
  };

  const startScanLoop = async () => {
    if (scanning.current) return;

    try {
      console.log("Iniciando scan contínuo...");
      await BleManager.start({ showAlert: false }); // garante que o BLE está ativo
      scanning.current = true;

      
      await scanDevicesOnce();

      // loop contínuo
      scanInterval.current = setInterval(scanDevicesOnce, 5000);
    } catch (err) {
      console.error("Erro iniciando BLE para scan:", err);
    }
  };

  const stopScan = async () => {
    console.log("Parando scan...");
    scanning.current = false;

    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }

    try {
      await BleManager.stopScan();
      console.log("Scan parado.");
    } catch (err) {
      console.error("Erro ao parar scan:", err);
    }

    // Avisa o parent para fechar/remover o componente (desmonta)
    try {
      onClose();
    } catch (e) {
      // se onClose não existir, ignora
    }
  };

  const connectToDevice = async (device: any) => {
    if (connectedDevice) {
      Alert.alert("Atenção", "Você já está conectado a um dispositivo.");
      return;
    }
    try {
      console.log("Conectando ao dispositivo:", device.id);
      await BleManager.connect(device.id);
      console.log("Conectado a:", device.name || device.id);
      setConnectedDevice(device);
      await BleManager.retrieveServices(device.id);
      Alert.alert("Conectado", `Dispositivo ${device.name || device.id} conectado!`);
      setPeripheralId(device.id);
      // Ao conectar com sucesso, fecha o modal (parent vai desmontar o componente)
      onClose();
    } catch (err) {
      console.error("Erro ao conectar:", err);
      Alert.alert("Falha na conexão", `Não foi possível conectar ao dispositivo ${device.name || device.id}`);
    }
  };

  const handleRestartScan = async () => {
  console.log("Reiniciando scan...");

  if (scanning.current) {
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
    try {
      await BleManager.stopScan();
      console.log("Scan externo parado para reiniciar.");
    } catch (err) {
      console.warn("Erro ao parar scan antes de reiniciar:", err);
    }
    scanning.current = false;
  }

  setTimeout(() => {
    startScanLoop();
  }, 200);
};


  // Modal visible sempre que o componente estiver montado (parent controla montar/desmontar)
  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const isConnected = connectedDevice?.id === item.id;
              return (
                <Pressable
                  onPress={() => connectToDevice(item)}
                  style={[styles.deviceButton, isConnected && { backgroundColor: '#d0ffd0' }]}
                  disabled={!!connectedDevice}
                >
                  <Text>
                    {item.name || "Sem nome"} ({item.id})
                    {isConnected ? " - Conectado" : ""}
                  </Text>
                </Pressable>
              );
            }}
          />
          {!connectedDevice && (
            <View style={{ marginTop: 8 }}>
              <Pressable onPress={stopScan} style={styles.cancelButton}>
                <Text>Cancelar Scan</Text>
              </Pressable>
              <Pressable onPress={handleRestartScan} style={[styles.cancelButton, { marginTop: 6 }]}>
                <Text>Reiniciar Scan</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalContainer: { backgroundColor: 'white', margin: 20, borderRadius: 8, padding: 16, maxHeight: '80%' },
  deviceButton: { padding: 12, borderBottomWidth: 1, borderColor: '#ddd' },
  cancelButton: { padding: 12, alignItems: 'center', backgroundColor: '#eee', borderRadius: 6 },
});
