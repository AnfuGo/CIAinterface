import { ThemedText } from 'components/ThemedText';
import { ThemedView } from 'components/ThemedView';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { usePeripheralContext } from './peripheralContext';
import BleManager from 'react-native-ble-manager';

// UUIDs
const CIA_CONTROL_ENABLE = "22086d8b-57c2-4eb4-b82d-4b7936413e78";
const CONTROLE_TEMP = "2f7d55d9-acce-4a1d-9871-dd3e4ec73eec";
const ENABLE_1 = "1b4a81b4-abf5-450d-9d4d-81b4e951baa7";
const ENABLE_2 = "d2b757c1-9fb1-4166-af83-467a0a0a55f3";
const ENABLE_3 = "765170c6-24e5-4890-a346-10195b57ca7";
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

  // Função de envio BLE de temperatura
  const ComandoBluetooth = (zona: number) => {
    if (!peripheralId) return console.log("dispostivo não conectado");

    let charUUID = '';
    let valor = 0;

    if (zona === 1) {
      charUUID = AlTemp_1;
      valor = valor1;
    } else if (zona === 2) {
      charUUID = AlTemp_2;
      valor = valor2;
    } else if (zona === 3) {
      charUUID = AlTemp_3;
      valor = valor3;
    }

    BleManager.write(peripheralId, CONTROLE_TEMP, charUUID, [valor])
      .then(() => console.log(`Comando enviado para zona ${zona}`))
      .catch(err => console.error('Erro ao enviar:', err));
  };

  // Funções de ativar áreas
  const AtivaArea1 = () => {
    if (!peripheralId) return console.log("dispostivo não conectado");
    BleManager.write(peripheralId, CIA_CONTROL_ENABLE, ENABLE_1, [ligado1])
      .then(() => console.log("Área 1 atualizada"))
      .catch(err => console.error(err));
  };
  const AtivaArea2 = () => {
    if (!peripheralId) return console.log("dispostivo não conectado");
    BleManager.write(peripheralId, CIA_CONTROL_ENABLE, ENABLE_2, [ligado2])
      .then(() => console.log("Área 2 atualizada"))
      .catch(err => console.error(err));
  };
  const AtivaArea3 = () => {
    if (!peripheralId) return console.log("dispostivo não conectado");
    BleManager.write(peripheralId, CIA_CONTROL_ENABLE, ENABLE_3, [ligado3])
      .then(() => console.log("Área 3 atualizada"))
      .catch(err => console.error(err));
  };

  // Troca de cores e update de estado
  const TrocaCor = () => {
    setBt1Color(prev => {
      const novaCor = prev === 'red' ? 'green' : 'red';
      setEnable1(novaCor === 'green' ? 1 : 0);
      return novaCor;
    });
    AtivaArea1();
  };

  const TrocaCor2 = () => {
    setBt2Color(prev => {
      const novaCor = prev === 'red' ? 'green' : 'red';
      setEnable2(novaCor === 'green' ? 1 : 0);
      return novaCor;
    });
    AtivaArea2();
  };

  const TrocaCor3 = () => {
    setBt3Color(prev => {
      const novaCor = prev === 'red' ? 'green' : 'red';
      setEnable3(novaCor === 'green' ? 1 : 0);
      return novaCor;
    });
    AtivaArea3();
  };

  // Funções de ajuste de temperatura
  const AumentaBT1 = () => {
    setValor1(prev => prev + 1);
    ComandoBluetooth(1);
  };
  const DiminuiBT1 = () => {
    setValor1(prev => prev - 1);
    ComandoBluetooth(1);
  };
  const AumentaBT2 = () => {
    setValor2(prev => prev + 1);
    ComandoBluetooth(2);
  };
  const DiminuiBT2 = () => {
    setValor2(prev => prev - 1);
    ComandoBluetooth(2);
  };
  const AumentaBT3 = () => {
    setValor3(prev => prev + 1);
    ComandoBluetooth(3);
  };
  const DiminuiBT3 = () => {
    setValor3(prev => prev - 1);
    ComandoBluetooth(3);
  };

  return (
    <View style={[styles.Empty, { backgroundColor: 'white' }]}>
      <ThemedView style={[styles.titleContainer, { paddingTop: 80 }, { gap: 20 }, { backgroundColor: "white" }]}>
        <ThemedText type="title" style={[styles.color]}>Controle de temperatura</ThemedText>
      </ThemedView>

      {/* Área traseira */}
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

      {/* Área lateral esquerda */}
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

      {/* Área lateral direita */}
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
        <Pressable onPress={DiminuiBT3} style={[styles.button2, { backgroundColor: 'gray' }]}>
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
