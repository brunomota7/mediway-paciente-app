// 📁 src/features/onboarding/screens/OnboardingScreen.js
//
// Cadastro clínico obrigatório (P2 — POST /patients/add-infos). É mostrado
// quando `GET /patients/me` volta sem `medicalInfo` (status 'needsOnboarding').
// Ao concluir, `useAddPatientInfos` chama `refreshMe()` e o RootNavigator
// troca para o AppStack automaticamente.

import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import styles from '../styles/OnboardingScreenStyles';
import { useAuth } from '../../../auth/useAuth';
import { useAddPatientInfos } from '../../../hooks/usePatient';
import { ConditionStatusPatient, Gender } from '../../../lib/enums';
import { isPastDate, toBrDate, toIsoDate } from '../../../lib/datetime';

export default function OnboardingScreen() {
  const { user, signOut } = useAuth();
  const addInfos = useAddPatientInfos();

  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [conditionPatient, setConditionPatient] = useState('');
  const [statusPatient, setStatusPatient] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1); // ontem: a API exige data passada
    return d;
  }, []);

  const validate = () => {
    if (!dateOfBirth || !isPastDate(dateOfBirth)) {
      return 'Informe uma data de nascimento válida (no passado).';
    }
    if (conditionPatient.trim().length < 3) {
      return 'Descreva brevemente sua condição de saúde.';
    }
    if (!ConditionStatusPatient.isValid(statusPatient)) {
      return 'Selecione a situação de acompanhamento.';
    }
    if (!Gender.isValid(gender)) {
      return 'Selecione o gênero.';
    }
    return '';
  };

  const handleSubmit = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    try {
      await addInfos.mutateAsync({
        dateOfBirth: toIsoDate(dateOfBirth),
        conditionPatient: conditionPatient.trim(),
        statusPatient,
        gender,
      });
      // Sucesso: refreshMe() no hook muda o status -> AppStack.
    } catch (err) {
      setError(err?.message || 'Não foi possível salvar. Tente novamente.');
    }
  };

  const loading = addInfos.isPending;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require('../../../../assets/mediway-paciente.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>Complete seu cadastro</Text>
          <Text style={styles.subtitle}>
            {user?.name ? `${user.name}, precisamos` : 'Precisamos'} de algumas
            informações clínicas para continuar.
          </Text>
        </View>

        <Text style={styles.label}>Data de nascimento</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
          disabled={loading}
        >
          <Text style={dateOfBirth ? styles.dateText : styles.datePlaceholder}>
            {dateOfBirth ? toBrDate(dateOfBirth) : 'Selecionar data'}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={dateOfBirth ?? maxDate}
            mode="date"
            display="default"
            maximumDate={maxDate}
            onChange={(event, selected) => {
              setShowPicker(Platform.OS === 'ios');
              if (event?.type === 'dismissed') return;
              if (selected) setDateOfBirth(selected);
            }}
          />
        )}

        <Text style={styles.label}>Condição de saúde</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={conditionPatient}
          onChangeText={setConditionPatient}
          placeholder="Ex.: hipertensão em acompanhamento, diabetes tipo 2…"
          multiline
          editable={!loading}
        />

        <Text style={styles.label}>Situação de acompanhamento</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            enabled={!loading}
            selectedValue={statusPatient}
            onValueChange={setStatusPatient}
          >
            <Picker.Item label="Selecione…" value="" />
            {ConditionStatusPatient.options.map((o) => (
              <Picker.Item key={o.value} label={o.label} value={o.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Gênero</Text>
        <View style={styles.pickerWrapper}>
          <Picker enabled={!loading} selectedValue={gender} onValueChange={setGender}>
            <Picker.Item label="Selecione…" value="" />
            {Gender.options.map((o) => (
              <Picker.Item key={o.value} label={o.label} value={o.value} />
            ))}
          </Picker>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar e continuar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signOut()} disabled={loading}>
          <Text style={styles.link}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
