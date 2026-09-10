// 📁 src/features/profile/screens/UserProfileScreen.js
//
// Perfil do paciente com dados reais da API.
//   Exibe:  GET /patients/me  (via usePatient)
//   Salva:  PUT /patients/update-infos  (via useUpdatePatient) — só os campos alterados.
// `statusPatient` é somente leitura (o paciente não altera a própria situação).

import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/UserProfileScreenStyles';
import { usePatient, useUpdatePatient } from '../../../hooks/usePatient';
import { ConditionStatusPatient, Gender } from '../../../lib/enums';
import { fromIsoDate, isPastDate, toBrDate, toIsoDate } from '../../../lib/datetime';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildForm(patient) {
  return {
    name: patient?.name ?? '',
    email: patient?.email ?? '',
    number: patient?.number ?? '',
    dateOfBirth: patient?.dateOfBirth ? fromIsoDate(patient.dateOfBirth) : null,
    conditionPatient: patient?.conditionPatient ?? '',
    gender: patient?.gender ?? '',
  };
}

export default function UserProfileScreen({ navigation }) {
  const { data: patient, isLoading, isError, error, refetch } = usePatient();
  const updatePatient = useUpdatePatient();

  const [form, setForm] = useState(() => buildForm(patient));
  const [baseline, setBaseline] = useState(() => buildForm(patient));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, text: '' });

  // Sincroniza o formulário quando os dados da API chegam/mudam.
  useEffect(() => {
    if (!patient) return;
    const next = buildForm(patient);
    setForm(next);
    setBaseline(next);
  }, [patient]);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }, []);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  /** Só os campos que mudaram em relação ao que veio da API. */
  const diff = useMemo(() => {
    const out = {};
    if (form.name.trim() !== (baseline.name ?? '').trim()) out.name = form.name.trim();
    if (form.email.trim() !== (baseline.email ?? '').trim()) out.email = form.email.trim();
    if (form.number.trim() !== (baseline.number ?? '').trim()) out.number = form.number.trim();
    if (form.conditionPatient.trim() !== (baseline.conditionPatient ?? '').trim()) {
      out.conditionPatient = form.conditionPatient.trim();
    }
    if (form.gender !== baseline.gender && Gender.isValid(form.gender)) {
      out.gender = form.gender;
    }
    const baseIso = baseline.dateOfBirth ? toIsoDate(baseline.dateOfBirth) : null;
    const formIso = form.dateOfBirth ? toIsoDate(form.dateOfBirth) : null;
    if (formIso && formIso !== baseIso) out.dateOfBirth = formIso;
    return out;
  }, [form, baseline]);

  const hasChanges = Object.keys(diff).length > 0;

  const handleSave = async () => {
    setFeedback({ type: null, text: '' });

    if (!hasChanges) {
      setFeedback({ type: 'error', text: 'Nenhuma alteração para salvar.' });
      return;
    }
    if (diff.email !== undefined && !EMAIL_RE.test(diff.email)) {
      setFeedback({ type: 'error', text: 'Informe um e-mail válido.' });
      return;
    }
    if (diff.dateOfBirth !== undefined && !isPastDate(form.dateOfBirth)) {
      setFeedback({ type: 'error', text: 'A data de nascimento deve estar no passado.' });
      return;
    }

    try {
      await updatePatient.mutateAsync(diff);
      setFeedback({ type: 'success', text: 'Perfil atualizado.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Não foi possível salvar as alterações.',
      });
    }
  };

  if (isLoading && !patient) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (isError && !patient) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>
          {error?.message || 'Não foi possível carregar o perfil.'}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={() => refetch()}>
          <Text style={styles.saveButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const saving = updatePatient.isPending;
  const statusLabel = patient?.statusPatient
    ? ConditionStatusPatient.label(patient.statusPatient)
    : '—';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../../assets/avatar-paciente.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{form.name || 'Paciente'}</Text>
        {patient?.age ? (
          <Text style={styles.updated}>{patient.age} anos</Text>
        ) : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(v) => set('name', v)}
          editable={!saving}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(v) => set('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!saving}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={form.number}
          onChangeText={(v) => set('number', v)}
          keyboardType="phone-pad"
          editable={!saving}
        />

        <Text style={styles.label}>Data de nascimento</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
          disabled={saving}
        >
          <Text>{form.dateOfBirth ? toBrDate(form.dateOfBirth) : 'Selecionar data'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form.dateOfBirth ?? maxDate}
            mode="date"
            display="default"
            maximumDate={maxDate}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (event?.type === 'dismissed') return;
              if (selectedDate) set('dateOfBirth', selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Gênero</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            enabled={!saving}
            selectedValue={form.gender}
            onValueChange={(v) => set('gender', v)}
          >
            <Picker.Item label="Selecione…" value="" />
            {Gender.options.map((o) => (
              <Picker.Item key={o.value} label={o.label} value={o.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Condição de saúde</Text>
        <TextInput
          style={styles.input}
          value={form.conditionPatient}
          onChangeText={(v) => set('conditionPatient', v)}
          multiline
          editable={!saving}
        />

        <Text style={styles.label}>Situação de acompanhamento</Text>
        <View style={styles.readonly}>
          <Text style={styles.readonlyText}>{statusLabel}</Text>
        </View>
        <Text style={styles.hint}>
          A situação de acompanhamento é definida pela equipe de saúde.
        </Text>

        {feedback.text ? (
          <Text style={feedback.type === 'success' ? styles.success : styles.error}>
            {feedback.text}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, (saving || !hasChanges) && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving || !hasChanges}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <Text style={styles.exitButtonText}>
          <MaterialIcons name="arrow-back" size={14} /> Voltar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
