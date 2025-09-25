import { ThemedText } from 'components/ThemedText';
import { ThemedView } from 'components/ThemedView';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Alert } from 'react-native';
import { usePeripheralContext } from './peripheralContext';
import BleManager from 'react-native-ble-manager';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// UUIDs
const CIA_CONTROL_ENABLE = "22086d8b-57c2-4eb4-b82d-4b7936413e78";
const CONTROLE_TEMP = "2f7d55d9-acce-4a1d-9871-dd3e4ec73eec";
const ENABLE_1 = "1b4a81b4-abf5-450d-9d4d-81b4e951baa7";
const ENABLE_2 = "d2b757c1-9fb1-4166-af83-467a0a0a55f3";
const ENABLE_3 = "765170c6-24e5-4890-a346-10195b57ca7c";
const AlTemp_1 = "28b66ce2-882e-46e2-bc17-1332f33072db";
const AlTemp_2 = "83ec522b-14b0-4b42-8a8b-0924993f5490";
const AlTemp_3 = "e49b8658-6f76-43dd-a36e-db7f4b1aa546";

export default function TabTwoScreen() {
  // Estados
  const { peripheralId } = usePeripheralContext();
  const [valor1, setValor1] = useState(25);
  const [valor2, setValor2] = useState(25);
  const [valor3, setValor3] = useState(25);

  const [bt1Color, setBt1Color] = useState('red');
  const [bt2Color, setBt2Color] = useState('red');
  const [bt3Color, setBt3Color] = useState('red');

  const [ligado1, setEnable1] = useState(0);
  const [ligado2, setEnable2] = useState(0);
  const [ligado3, setEnable3] = useState(0);

  const [Sensor1, setSensor1] = useState(25);
  const [Sensor2, setSensor2] = useState(25);
  const [Sensor3, setSensor3] = useState(25);

  type RootStackParamList = {
    Home: undefined;
    TabTwo: undefined;
  };

  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TabTwo'>;
  const navigation = useNavigation<NavigationProp>();

  // Função centralizada para validar antes de alterar valores
  const safeSetValor = (zona: number, updater: (prev: number) => number) => {
    if (!peripheralId) {
      Alert.alert(
        "Dispositivo não conectado",
        "Ative o Bluetooth e conecte ao CIA primeiro.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "OK", onPress: () => navigation.navigate("Home") },
        ]
      );
      return;
    }

    if (zona === 1) setValor1(updater);
    if (zona === 2) setValor2(updater);
    if (zona === 3) setValor3(updater);
  };

  // Função de envio BLE de temperatura
  const ComandoBluetooth = async (zona: number, valor: number) => {
    if (!peripheralId) {
      Alert.alert(
        'Dispositivo não conectado',
        'Certifique-se que o Bluetooth está ligado e o smartphone está conectado ao CIA',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ok', onPress: () => navigation.navigate("Home") },
        ]
      );
      return;
    }

    let charUUID = '';
    if (zona === 1) charUUID = AlTemp_1;
    else if (zona === 2) charUUID = AlTemp_2;
    else if (zona === 3) charUUID = AlTemp_3;
    else return;

    const byte = valor & 0xFF;

    try {
      await BleManager.write(peripheralId, CONTROLE_TEMP, charUUID, [byte]);
      console.log(`Comando enviado para zona ${zona}: ${byte}`);
    } catch (err) {
      console.error('Erro ao enviar temperatura:', err);
    }
  };

  const lerTemperatura = async () => {
    if (!peripheralId) {
      console.log("dispositivo não conectado (lerTemperatura)");
      return;
    }

    try {
      const data1 = await BleManager.read(peripheralId, CONTROLE_TEMP, AlTemp_1);
      const temp1 = String.fromCharCode.apply(null, data1);
      setSensor1(parseFloat(temp1));

      const data2 = await BleManager.read(peripheralId, CONTROLE_TEMP, AlTemp_2);
      const temp2 = String.fromCharCode.apply(null, data2);
      setSensor2(parseFloat(temp2));

      const data3 = await BleManager.read(peripheralId, CONTROLE_TEMP, AlTemp_3);
      const temp3 = String.fromCharCode.apply(null, data3);
      setSensor3(parseFloat(temp3));

      console.log("Temperaturas:", temp1, temp2, temp3);
    } catch (err) {
      console.error("Erro ao ler temperatura:", err);
    }
  };

  // Ativar áreas
  const AtivaArea1 = async () => {
    if (!peripheralId) {
      console.log("dispositivo não conectado (AtivaArea1)");
      Alert.alert(
        'Dispositivo não conectado',
        'Certifique-se que o Bluetooth está ligado e o smartphone está conectado ao CIA',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ok', onPress: () => navigation.navigate("Home") },
        ]
      );
      return;
    }
    try {
      const byte = ligado1 ? 1 : 0;
      await BleManager.write(peripheralId, CIA_CONTROL_ENABLE, ENABLE_1, [byte]);
      console.log("Área 1 atualizada ->", byte);
    } catch (err) {
      console.error("Erro AtivaArea1:", err);
    }
  };

  const AtivaArea2 = async () => {
    if (!peripheralId) {
      console.log("dispositivo não conectado (AtivaArea2)");
      Alert.alert(
        'Dispositivo não conectado',
        'Certifique-se que o Bluetooth está ligado e o smartphone está conectado ao CIA',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ok', onPress: () => navigation.navigate("Home") },
        ]
      );
      return;
    }
    try {
      const byte = ligado2 ? 1 : 0;
      await BleManager.write(peripheralId, CIA_CONTROL_ENABLE, ENABLE_2, [byte]);
      console.log("Área 2 atualizada ->", byte);
    } catch (err) {
      console.error("Erro AtivaArea2:", err);
    }
  };

  const AtivaArea3 = async () => {
    if (!peripheralId) {
      console.log("dispositivo não conectado (AtivaArea3)");
      Alert.alert(
        'Dispositivo não conectado',
        'Certifique-se que o Bluetooth está ligado e o smartphone está conectado ao CIA',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ok', onPress: () => navigation.navigate("Home") },
        ]
      );
      return;
    }
    try {
      const byte = ligado3 ? 1 : 0;
      await BleManager.write(peripheralId, CIA_CONTROL_ENABLE, ENABLE_3, [byte]);
      console.log("Área 3 atualizada ->", byte);
    } catch (err) {
      console.error("Erro AtivaArea3:", err);
    }
  };

  // useEffects
  useEffect(() => { AtivaArea1(); }, [ligado1, peripheralId]);
  useEffect(() => { AtivaArea2(); }, [ligado2, peripheralId]);
  useEffect(() => { AtivaArea3(); }, [ligado3, peripheralId]);

  useEffect(() => { ComandoBluetooth(1, valor1); }, [valor1, peripheralId]);
  useEffect(() => { ComandoBluetooth(2, valor2); }, [valor2, peripheralId]);
  useEffect(() => { ComandoBluetooth(3, valor3); }, [valor3, peripheralId]);

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>;
    if (peripheralId) {
      intervalo = setInterval(() => {
        lerTemperatura();
      }, 3000);
    }
    return () => clearInterval(intervalo);
  }, [peripheralId]);

  // Troca cores
  const TrocaCor = () => {
    setBt1Color(prev => {
      const novaCor1 = prev === 'red' ? 'green' : 'red';
      const newEnable = novaCor1 === 'green' ? 1 : 0;
      setEnable1(newEnable);
      console.log("cor_1:", novaCor1, "-> will set enable1:", newEnable);
      return novaCor1;
    });
  };

  const TrocaCor2 = () => {
    setBt2Color(prev => {
      const novaCor2 = prev === 'red' ? 'green' : 'red';
      const newEnable = novaCor2 === 'green' ? 1 : 0;
      setEnable2(newEnable);
      console.log("cor_2:", novaCor2, "-> will set enable2:", newEnable);
      return novaCor2;
    });
  };

  const TrocaCor3 = () => {
    setBt3Color(prev => {
      const novaCor3 = prev === 'red' ? 'green' : 'red';
      const newEnable = novaCor3 === 'green' ? 1 : 0;
      setEnable3(newEnable);
      console.log("cor_3:", novaCor3, "-> will set enable3:", newEnable);
      return novaCor3;
    });
  };

  // Ajuste de temperatura
  const AumentaBT1 = () => safeSetValor(1, prev => prev + 1);
  const DiminuiBT1 = () => safeSetValor(1, prev => prev - 1);

  const AumentaBT2 = () => safeSetValor(2, prev => prev + 1);
  const DiminuiBT2 = () => safeSetValor(2, prev => prev - 1);

  const AumentaBT3 = () => safeSetValor(3, prev => prev + 1);
  const DiminuiBT3 = () => safeSetValor(3, prev => prev - 1);

  return (
    <View style={[styles.Empty, { backgroundColor: 'white' }]}>
      <ThemedView style={[styles.titleContainer2, { paddingTop: 80, gap: 20, backgroundColor: "white", justifyContent: "center" }]}>
        <ThemedText type="title" style={styles.color}>Controle de temperatura</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.titleContainer, { justifyContent: "center" }]}>
        <ThemedText type="default" style={styles.color}>Área Traseira de aquecimento</ThemedText>
      </ThemedView>
      <View style={styles.titleContainer}>
        <Pressable onPress={TrocaCor} style={[styles.button, { backgroundColor: bt1Color }]}>
          <ThemedText style={styles.buttonText}>BT1</ThemedText>
        </Pressable>
        <Pressable onPress={AumentaBT1} style={[styles.button2, { backgroundColor: 'gray' }]}>
          <ThemedText style={styles.buttonText}>+</ThemedText>
        </Pressable>
        <Pressable onPress={DiminuiBT1} style={[styles.button2, { backgroundColor: 'gray' }]}>
          <ThemedText style={styles.buttonText}>-</ThemedText>
        </Pressable>
        <View style={styles.caixa}>
          <ThemedText style={styles.valorTexto}>{valor1}</ThemedText>
        </View>
      </View>

      <ThemedView style={[styles.titleContainer, { justifyContent: "center" }]}>
        <ThemedText type="default" style={styles.color}>Área lateral esquerda de aquecimento</ThemedText>
      </ThemedView>
      <View style={styles.titleContainer}>
        <Pressable onPress={TrocaCor2} style={[styles.button, { backgroundColor: bt2Color }]}>
          <ThemedText style={styles.buttonText}>BT2</ThemedText>
        </Pressable>
        <Pressable onPress={AumentaBT2} style={[styles.button2, { backgroundColor: 'gray' }]}>
          <ThemedText style={styles.buttonText}>+</ThemedText>
        </Pressable>
        <Pressable onPress={DiminuiBT2} style={[styles.button2, { backgroundColor: 'gray' }]}>
          <ThemedText style={styles.buttonText}>-</ThemedText>
        </Pressable>
        <View style={styles.caixa}>
          <ThemedText style={styles.valorTexto}>{valor2}</ThemedText>
        </View>
      </View>

      <ThemedView style={[styles.titleContainer, { justifyContent: "center" }]}>
        <ThemedText type="default" style={styles.color}>Área lateral direita de aquecimento</ThemedText>
      </ThemedView>
      <View style={styles.titleContainer}>
        <Pressable onPress={TrocaCor3} style={[styles.button, { backgroundColor: bt3Color }]}>
          <ThemedText style={styles.buttonText}>BT3</ThemedText>
        </Pressable>
        <Pressable onPress={AumentaBT3} style={[styles.button2, { backgroundColor: 'gray' }]}>
          <ThemedText style={styles.buttonText}>+</ThemedText>
        </Pressable>
        <Pressable onPress={DiminuiBT3} style={[styles.button2, { backgroundColor: 'gray' }]}>
          <ThemedText style={styles.buttonText}>-</ThemedText>
        </Pressable>
        <View style={styles.caixa}>
          <ThemedText style={styles.valorTexto}>{valor3}</ThemedText>
        </View>
      </View>

      <ThemedView style={[styles.titleContainer, { justifyContent: "center" }]}>
        <ThemedText type="default" style={styles.color}>Temperatura das Áreas</ThemedText>
      </ThemedView>
      <View style={[styles.titleContainer, { justifyContent: "center" }]}>
        <View style={styles.caixa}>
          <ThemedText style={styles.valorTexto}>{Sensor1} °C</ThemedText>
        </View>
        <View style={styles.caixa}>
          <ThemedText style={styles.valorTexto}>{Sensor2} °C</ThemedText>
        </View>
        <View style={styles.caixa}>
          <ThemedText style={styles.valorTexto}>{Sensor3} °C</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'white',
  },
  titleContainer2: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'white',
  },
  Empty: {
    gap: 14,
    backgroundColor: 'black',
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
  valorTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 8,
    width: 200,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button2: {
    marginTop: 8,
    width: 50,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: "center",
    justifyContent: 'center',
  },
  color: {
    color: 'black',
  },
});
