// 📁 src/components/form/WeekDayPicker.js
//
// Seletor múltiplo de dias da semana. Valor = array de enums (`SEGUNDA`, ...).

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WeekDay } from '../../lib/enums';

const SHORT = {
  SEGUNDA: 'Seg',
  TERCA: 'Ter',
  QUARTA: 'Qua',
  QUINTA: 'Qui',
  SEXTA: 'Sex',
  SABADO: 'Sáb',
  DOMINGO: 'Dom',
};

export default function WeekDayPicker({ value = [], onChange, disabled }) {
  const toggle = (day) => {
    if (disabled) return;
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day]);
  };

  return (
    <View style={styles.row}>
      {WeekDay.values.map((day) => {
        const active = value.includes(day);
        return (
          <TouchableOpacity
            key={day}
            onPress={() => toggle(day)}
            style={[styles.chip, active && styles.chipActive, disabled && styles.chipDisabled]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {SHORT[day]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#81c784',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#fff',
  },
});
