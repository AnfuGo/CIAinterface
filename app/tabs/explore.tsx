import { ThemedText } from 'components/ThemedText';
import { ThemedView } from 'components/ThemedView';
import React, { useState, } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';



function ComandoBluetooth(){


}


function AtivaArea1() {

}


function AtivaArea2() {

  
  
}

function AtivaArea3() {

  
  
}

export default function TabTwoScreen() {
  const [bt1Color, setBt1Color] = useState('red');
  const [bt2Color, setBt2Color] = useState('red');
  const [bt3Color, setBt3Color] = useState('red');
  const [valor1, setValor1] = useState(25);
  const [valor2, setValor2] = useState(25);
  const [valor3, setValor3] = useState(25);
  const TrocaCor = () => {
    setBt1Color(prev => (prev === 'red' ? 'green' : 'red'));
    AtivaArea1();

  }
  const TrocaCor2 = () => {
    setBt2Color(prev => (prev === 'red' ? 'green' : 'red'));
    AtivaArea2();
  }
  const TrocaCor3 = () => {
    setBt3Color(prev => (prev === 'red' ? 'green' : 'red'));
    AtivaArea3();

  }
  const AumentaBT1 = () => {
    setValor1(prev => prev + 1);
    ComandoBluetooth();

  }
  const DiminuiBT1 = () => {
    setValor1(prev => prev - 1);
    ComandoBluetooth();

  }
  const AumentaBT2 = () => {
    setValor2(prev => prev + 1);
    ComandoBluetooth();

  }
  const DiminuiBT2 = () => {
    setValor2(prev => prev - 1);
    ComandoBluetooth();

  }
  const AumentaBT3 = () => {
    setValor3(prev => prev + 1);
    ComandoBluetooth();

  }
  const DiminuiBT3 = () => {
    setValor3(prev => prev - 1);
    ComandoBluetooth();

  }
  return (
   <View style={[styles.Empty, {backgroundColor: 'white'}]}>
  <ThemedView style={[styles.titleContainer, { paddingTop: 80 }, {gap: 20}, {backgroundColor: "white"}]}>
    <ThemedText type="title" style = {[styles.color]}>Controle de temperatura</ThemedText>

  </ThemedView>
  <ThemedView style={styles.titleContainer}>
    <ThemedText type="default" style = {[styles.color]}>Área Traseira de aquecimento</ThemedText>
  </ThemedView>
  <View style={styles.titleContainer}>
  <Pressable
      onPress={TrocaCor}
      style={[styles.button, { backgroundColor: bt1Color }]}
    >
      <ThemedText style={styles.buttonText}>BT1</ThemedText>
    </Pressable>
    <Pressable
      onPress={AumentaBT1}
      style={[styles.button2, { backgroundColor: 'gray' }]}
    >
      <ThemedText style={styles.buttonText}>+</ThemedText>
    </Pressable>
    <Pressable
      onPress={DiminuiBT1}
      style={[styles.button2, { backgroundColor: 'gray' }]}
    >
      <ThemedText style={styles.buttonText}>-</ThemedText>
    </Pressable>
    <View style={styles.caixa}>
      <ThemedText style={styles.valorTexto}>{valor1}</ThemedText>
    </View>
</View>
  <ThemedView style={styles.titleContainer}>
    <ThemedText type="default" style = {[styles.color]}>Área lateral esquerda de aquecimento</ThemedText>
  </ThemedView>
  <View style={styles.titleContainer}>
  <Pressable
      onPress={TrocaCor2}
      style={[styles.button, { backgroundColor: bt2Color }]}
    >
      <ThemedText style={styles.buttonText}>BT2</ThemedText>
    </Pressable>
    <Pressable
      onPress={AumentaBT2}
      style={[styles.button2, { backgroundColor: 'gray' }]}
    >
      <ThemedText style={styles.buttonText}>+</ThemedText>
    </Pressable>
    <Pressable
      onPress={DiminuiBT2}
      style={[styles.button2, { backgroundColor: 'gray' }]}
    >
      <ThemedText style={styles.buttonText}>-</ThemedText>
    </Pressable>
    <View style={styles.caixa}>
      <ThemedText style={styles.valorTexto}>{valor2}</ThemedText>
    </View>
    </View>

  <ThemedView style={styles.titleContainer}>
    <ThemedText type="default" style = {[styles.color]}>Área lateral direita de aquecimento</ThemedText>
  </ThemedView>
  <View style={styles.titleContainer}>
  <Pressable
      onPress={TrocaCor3}
      style={[styles.button, { backgroundColor: bt3Color }]}
    >
      <ThemedText style={styles.buttonText}>BT3</ThemedText>
    </Pressable>
    <Pressable
      onPress={AumentaBT3}
      style={[styles.button2, { backgroundColor: 'gray' }]}
    >
      <ThemedText style={styles.buttonText}>+</ThemedText>
    </Pressable>
    <Pressable
      onPress={DiminuiBT3}
      style={[styles.button2, { backgroundColor: 'gray' }]}
    >
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
    backgroundColor: 'white'
  },
  Empty: {
    gap: 20,
    backgroundColor: 'black'
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
    justifyContent: "center"
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
