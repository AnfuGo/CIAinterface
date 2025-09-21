import { ThemedText } from 'components/ThemedText';
import { ThemedView } from 'components/ThemedView';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { usePeripheralContext } from './peripheralContext';
import BleManager from 'react-native-ble-manager';

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

  // Função de envio BLE de temperatura (usada pelo useEffect)
  const ComandoBluetooth = async (zona: number, valor: number) => {
    if (!peripheralId) {
      console.log("dispositivo não conectado (ComandoBluetooth)");
      return;
    }

    let charUUID = '';
    if (zona === 1) charUUID = AlTemp_1;
    else if (zona === 2) charUUID = AlTemp_2;
    else if (zona === 3) charUUID = AlTemp_3;
    else return;

    // garante byte entre 0-255
    const byte = valor & 0xFF;

    try {
      await BleManager.write(peripheralId, CONTROLE_TEMP, charUUID, [byte]);
      console.log(`Comando enviado para zona ${zona}: ${byte}`);
    } catch (err) {
      console.error('Erro ao enviar temperatura:', err);
    }
  };

  // Funções de ativar áreas (agora chamadas pelo useEffect que observa 'ligadoX')
  const AtivaArea1 = async () => {
    if (!peripheralId) {
      console.log("dispositivo não conectado (AtivaArea1)");
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

  // useEffects que reagem às mudanças de 'ligadoX' e 'valorX'
  useEffect(() => {
    // quando ligado1 mudar, chama AtivaArea1 usando o valor atualizado
    AtivaArea1();
  }, [ligado1, peripheralId]);

  useEffect(() => {
    AtivaArea2();
  }, [ligado2, peripheralId]);

  useEffect(() => {
    AtivaArea3();
  }, [ligado3, peripheralId]);

  // envia temperatura quando o valor muda (garante que o envio use o valor atualizado)
  useEffect(() => {
    ComandoBluetooth(1, valor1);
  }, [valor1, peripheralId]);

  useEffect(() => {
    ComandoBluetooth(2, valor2);
  }, [valor2, peripheralId]);

  useEffect(() => {
    ComandoBluetooth(3, valor3);
  }, [valor3, peripheralId]);

  // Troca de cores e update de estado (não chamam AtivaArea diretamente)
  const TrocaCor = () => {
    setBt1Color(prev => {
      const novaCor1 = prev === 'red' ? 'green' : 'red';
      const newEnable = novaCor1 === 'green' ? 1 : 0;
      setEnable1(newEnable); // atualização assíncrona; useEffect reagirá
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

  // Funções de ajuste de temperatura (apenas setState - envio via useEffect)
  const AumentaBT1 = () => setValor1(prev => prev + 1);
  const DiminuiBT1 = () => setValor1(prev => prev - 1);
  const AumentaBT2 = () => setValor2(prev => prev + 1);
  const DiminuiBT2 = () => setValor2(prev => prev - 1);
  const AumentaBT3 = () => setValor3(prev => prev + 1);
  const DiminuiBT3 = () => setValor3(prev => prev - 1);

  return (
    <View style={[styles.Empty, { backgroundColor: 'white' }]}>
      <ThemedView style={[styles.titleContainer, { paddingTop: 80 }, { gap: 20 }, { backgroundColor: "white" }]}>
        <ThemedText type="title" style={[styles.color]}>Controle de temperatura</ThemedText>
      </ThemedView>

      {}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="default" style={[styles.color]}>Área Traseira de aquecimento</ThemedText>
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

      {}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="default" style={[styles.color]}>Área lateral esquerda de aquecimento</ThemedText>
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

      {}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="default" style={[styles.color]}>Área lateral direita de aquecimento</ThemedText>
      </ThemedView>
      <View style={styles.titleContainer}>
        <Pressable onPress={TrocaCor3} style={[styles.button, { backgroundColor: bt3Color }]}>
          <ThemedText style={styles.buttonText}>BT3</ThemedText>
        </Pressable>
        <Pressable onPress={AumentaBT3} style={[styles.button2, { backgroundColor: 'gray' }]}>
          <ThemedText style={styles.buttonText}>+</ThemedText>
        </Pressable>
        <Pressable onPress={DiminuiBT3} style={[styles.button2, { backgroundColor: 'gray' }]} >
          <ThemedText style={styles.buttonText}>-</ThemedText>
        </Pressable>
        <View style={styles.caixa}>
          <ThemedText style={styles.valorTexto}>{valor3}</ThemedText>
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
  Empty: {
    gap: 20,
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
