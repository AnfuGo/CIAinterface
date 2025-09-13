// IconSymbol.tsx
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import type { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;

// Mapeamento de SF Symbols para Material Icons
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
};

type IconSymbolProps = {
  name: keyof typeof MAPPING;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
};

/**
 * Um componente de ícone que usa Material Icons em todas as plataformas,
 * substituindo o uso de Expo e SF Symbols.
 */
export function IconSymbol({
  name,
  size = 24,
  color = 'black',
  style,
}: IconSymbolProps) {
  return (
    <MaterialIcons
      name={MAPPING[name]}   // pega o ícone correto do mapeamento
      size={size}
      color={color}
      style={style as any}   // cast para ignorar conflito de tipagens
    />
  );
}
