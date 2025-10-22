import React, { useEffect, useRef } from 'react';
import { NativeEventEmitter, NativeModules, Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { usePeripheralContext } from './peripheralContext';

export default function BleEventWatcher() {
  const { peripheralId, setPeripheralId } = usePeripheralContext();
  const bleEmitter = new NativeEventEmitter(NativeModules.BleManager);
  const checkInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listener normal — desconexão detectada pelo SO
    const disconnectListener = bleEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      ({ peripheral }) => {
        console.log('Evento de desconexão recebido:', peripheral);
        handleDisconnect(peripheral);
      }
    );

    // Polling: verifica a cada 3s se o dispositivo ainda está conectado
    if (peripheralId) {
      console.log('Iniciando monitoramento ativo de conexão BLE...');
      checkInterval.current = setInterval(async () => {
        try {
          const connected = await BleManager.getConnectedPeripherals([]);
          const stillConnected = connected.some(p => p.id === peripheralId);
          if (!stillConnected) {
            console.log('Periférico desconectado detectado por polling:', peripheralId);
            handleDisconnect(peripheralId);
          }
        } catch (err) {
          console.error('Erro no monitoramento BLE:', err);
        }
      }, 3000);
    }

    return () => {
      disconnectListener.remove();
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
        checkInterval.current = null;
      }
    };
  }, [peripheralId]);

  const handleDisconnect = (peripheral: any) => {
    if (peripheralId) {
      setPeripheralId(null);
      try {
        Alert.alert('Desconectado', 'O dispositivo BLE foi desconectado.');
      } catch (e) {
        console.log('Sem alerta ativo (UI desmontada)');
      }
    }
  };

  return null;
}
