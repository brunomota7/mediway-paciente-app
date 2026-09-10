// 📁 src/features/medications/components/MedicationForm.js
//
// Formulário compartilhado de cadastro de medicação (usado pelo modal da lista
// e pela tela de adicionar na CEM). Monta o payload de M3 (sem `medicineBoxId`,
// que o chamador injeta) e chama `onSubmit(payload)`.

import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/AddMedicationModalStyles';
import WeekDayPicker from '../../../components/form/WeekDayPicker';
import { MedicationType } from '../../../lib/enums';
import { toIsoTime } from '../../../lib/datetime';

const EMPTY = {
  nome: '',
  tipo: '',
  nomeReferencia: '',
  descricao: '',
  concentracao: '',
  quantidade: '',
  dias: [],
  hora: '',
  gaveta: '',
  estoque: '',
};

export function buildMedicationPayload(form) {
  return {
    nome: form.nome.trim(),
    tipo: form.tipo,
    nomeReferencia: form.nomeReferencia.trim() || undefined,
    descricao: form.descricao.trim() || undefined,
    concentracao: form.concentracao.trim() || undefined,
    quantidade: form.quantidade.trim() || undefined,
    dias: form.dias,
    hora: toIsoTime(form.hora),
    gaveta: form.gaveta.trim() || undefined,
    estoque: Number(form.estoque),
    status: 'ATIVO',
  };
}

export function validateMedicationForm(form) {
  if (form.nome.trim().length < 2) return 'Informe o nome do medicamento.';
  if (!MedicationType.isValid(form.tipo)) return 'Selecione o tipo.';
  if (form.dias.length === 0) return 'Selecione ao menos um dia.';
  if (!toIsoTime(form.hora)) return 'Informe o horário no formato HH:mm.';
  if (String(form.estoque).trim() === '') return 'Informe o estoque (inteiro ≥ 0).';
  const estoque = Number(form.estoque);
  if (!Number.isInteger(estoque) || estoque < 0) return 'Estoque deve ser inteiro ≥ 0.';
  return '';
}

export default function MedicationForm({
  initialGaveta = '',
  submitting = false,
  disabled = false,
  externalError = '',
  submitLabel = 'Salvar',
  onSubmit,
}) {
  const [form, setForm] = useState({ ...EMPTY, gaveta: initialGaveta });
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const msg = validateMedicationForm(form);
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    onSubmit(buildMedicationPayload(form));
  };

  const shownError = error || externalError;

  return (
    <View>
      <Text style={styles.label}>Nome *</Text>
      <TextInput
        style={styles.input}
        value={form.nome}
        onChangeText={(v) => set('nome', v)}
        placeholder="Nome do medicamento"
      />

      <Text style={styles.label}>Tipo *</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={form.tipo} onValueChange={(v) => set('tipo', v)}>
          <Picker.Item label="Selecione…" value="" />
          {MedicationType.options.map((o) => (
            <Picker.Item key={o.value} label={o.label} value={o.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Nome de referência</Text>
      <TextInput
        style={styles.input}
        value={form.nomeReferencia}
        onChangeText={(v) => set('nomeReferencia', v)}
        placeholder="Ex.: Novalgina"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={form.descricao}
        onChangeText={(v) => set('descricao', v)}
        multiline
      />

      <Text style={styles.label}>Concentração</Text>
      <TextInput
        style={styles.input}
        value={form.concentracao}
        onChangeText={(v) => set('concentracao', v)}
        placeholder="Ex.: 500mg"
      />

      <Text style={styles.label}>Quantidade por aplicação</Text>
      <TextInput
        style={styles.input}
        value={form.quantidade}
        onChangeText={(v) => set('quantidade', v)}
        placeholder="Ex.: 1 comprimido"
      />

      <Text style={styles.label}>Dias *</Text>
      <WeekDayPicker value={form.dias} onChange={(v) => set('dias', v)} />

      <Text style={styles.label}>Horário * (HH:mm)</Text>
      <TextInput
        style={styles.input}
        value={form.hora}
        onChangeText={(v) => set('hora', v)}
        placeholder="08:00"
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>Gaveta</Text>
      <TextInput
        style={styles.input}
        value={form.gaveta}
        onChangeText={(v) => set('gaveta', v)}
        placeholder="Ex.: Gaveta 1"
      />

      <Text style={styles.label}>Estoque *</Text>
      <TextInput
        style={styles.input}
        value={form.estoque}
        onChangeText={(v) => set('estoque', v.replace(/[^0-9]/g, ''))}
        placeholder="Ex.: 30"
        keyboardType="number-pad"
      />

      {shownError ? <Text style={styles.errorText}>{shownError}</Text> : null}

      <TouchableOpacity
        style={[styles.saveButton, (submitting || disabled) && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={submitting || disabled}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>{submitLabel}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
