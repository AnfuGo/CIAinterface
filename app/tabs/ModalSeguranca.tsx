import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ModalSegurancaProps {
  visivel: boolean;
  onConfirmar: () => void; // usuário clicou em "Claro..."
  onTimeout: () => void;   // tempo expirou
  tempoEspera?: number;    // tempo em ms
}

export const ModalSeguranca: React.FC<ModalSegurancaProps> = ({
  visivel,
  onConfirmar,
  onTimeout,
  tempoEspera = 30000,
}) => {
  const [tempoRestante, setTempoRestante] = useState(tempoEspera / 1000);

  useEffect(() => {
    if (!visivel) return;

    setTempoRestante(tempoEspera / 1000);

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [visivel]);

  if (!visivel) return null;

  return (
    <Modal transparent animationType="fade" visible={visivel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.titulo}>⚠ Tempo de uso alto</Text>
          <Text style={styles.mensagem}>
            Percebemos que o dispositivo está ligado há muito tempo.{"\n"}Ainda está aí?
          </Text>
          <Text style={styles.contador}>Tempo restante: {tempoRestante}s</Text>

          <TouchableOpacity style={styles.botao} onPress={onConfirmar}>
            <Text style={styles.textoBotao}>Claro...</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 25,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mensagem: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 15,
  },
  contador: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  botao: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textoBotao: {
    color: "white",
    fontWeight: "bold",
  },
});
