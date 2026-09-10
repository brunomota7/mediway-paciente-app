# Fases de Integração — `mediway-paciente-app` × Mediway API

> Documento **de execução**, organizado por fases, para integrar o app Expo/React Native à API Java/Spring Boot.
> A análise, os riscos e as decisões de produto estão em [`../PLANO_INTEGRACAO_API.md`](../PLANO_INTEGRACAO_API.md) (raiz do ecossistema). **Este arquivo é o passo a passo** e o **catálogo de endpoints** que o app vai efetivamente usar.
> Fonte dos endpoints: [`../api_mediway/API_ENDPOINTS.md`](../api_mediway/API_ENDPOINTS.md).

---

## 0. Como ler este documento

- **Seção 1** — convenções globais da API (valem para toda chamada).
- **Seção 2** — catálogo dos endpoints **globais** (auth) + os do **paciente** (`SCOPE_PACIENTE`), com corpo, resposta, tela consumidora e fase.
- **Seção 3** — endpoints que existem na API mas o **app NÃO usa** (e por quê).
- **Seção 4** — checklist mestre endpoint → fase → status.
- **Seção 5+** — as fases, cada uma com objetivo, endpoints, tarefas, entregáveis e critérios de aceite.

Convenção de status nas tabelas: `[ ]` não iniciado · `[~]` em andamento · `[x]` concluído.

### Progresso das fases

| Fase | Descrição | Status |
|---|---|---|
| 0 | Fundação da camada de integração | ✅ Concluída (2026-09-10) |
| 1 | Autenticação e sessão | ⬜ Não iniciada |
| 2 | Perfil do paciente e onboarding | ⬜ Não iniciada |
| 3 | Consultas e exames (leitura) + dashboard | ⬜ Não iniciada |
| 4 | Medicações e Caixa (CEM) | ⬜ Não iniciada |
| 5 | Vacinas (leitura) | ⬜ Não iniciada |
| 6 | Ajuste de escopo / lacunas | ⬜ Não iniciada |
| 7 | Robustez, QA e fechamento | ⬜ Não iniciada |

---

## 1. Convenções globais da API (aplicam-se a todas as chamadas)

| Item | Regra |
|---|---|
| Base URL | `http(s)://<host>:<porta>` + prefixo **`/api/v1`** |
| Porta padrão (dev) | `8080` |
| Autenticação | Header `Authorization: Bearer <accessToken>` em **tudo**, exceto rotas públicas de `/auth` |
| Papel do app | **`SCOPE_PACIENTE`** (token normal) + **`SCOPE_RESET`** (token temporário, só no fluxo de redefinição de senha) |
| Identidade | Endpoints `/me` identificam o usuário pelo token. Onde a rota tem `{patientId}` / `{patientUserId}`, use o **UUID do próprio usuário logado** (vindo de `GET /patients/me` → campo `patientI`) |
| Content-Type | `application/json` nos corpos; alguns endpoints usam **query param** em vez de body (marcados abaixo) |
| Erro (4xx/5xx) | Sempre `ErrorResponseDTO`: `{ timestamp, status, error, message, path }` |
| Datas | `LocalDate` → `"YYYY-MM-DD"` · `LocalTime` → `"HH:mm"`/`"HH:mm:ss"` · `LocalDateTime`/`Instant` → ISO-8601 |
| Paginação | `Page<T>` com `page` (0-based), `size` (20), `sort`. **Nenhum endpoint do paciente usa paginação** — os `/me` devolvem array direto |
| Rate limit | `POST /auth/request-reset`: 5/hora por IP · `POST /auth/validate-code`: 5/min por IP |

### 1.1 Enums usados pelo app

| Enum | Valores |
|---|---|
| `Gender` | `MASCULINO`, `FEMININO`, `NAO_INFORMADO` |
| `ConditionStatusPatient` | `NECESSITA_DE_ATENCAO`, `EM_ACOMPANHAMENTO`, `ESTAVEL`, `REABILITACAO` |
| `MedicationType` | `GENERICO`, `SIMILAR`, `REFERENCIA`, `FITOTERAPICO`, `MANIPULADO`, `OUTRO` |
| `MedicationStatus` | `ATIVO`, `SUSPENSO` |
| Dias da semana (`dias[]`) | `SEGUNDA`, `TERCA`, `QUARTA`, `QUINTA`, `SEXTA`, `SABADO`, `DOMINGO` |
| `ConsultationAndExmStatus` | `MARCADO`, `REALIZADO`, `CANCELADO`, `REMARCADO`, `INDEFERIDO`, `NAO_COMPARECEU` |
| `VaccineStatus` | `APLICADA`, `AGENDADA`, `ATRASADA` |
| `VaccineDoseType` | `UNICA_DOSE`, `PRIMEIRA_DOSE`, `SEGUNDA_DOSE`, `REFORCO` |

### 1.2 Peculiaridades a tratar (detalhe em `../PLANO_INTEGRACAO_API.md` §1.6)

- **B1** — `GET /patients/me` devolve o ID em `patientI` (typo), não `patientId`.
- **B2** — `GET/PUT/DELETE /vaccine/{id}` retornam **500** (não 404) quando o ID não existe.
- **B4** — `POST /medicine-box/register/{patientId}` retorna **409** se o paciente já tem caixa **ou** se `numeroSerie` está duplicado (diferenciar pela `message`).
- Sem **refresh token**: `accessToken` expira em 48 h (`expiresIn: 172800`) → em `401`, deslogar e voltar ao login.

---

## 2. Catálogo de endpoints usados pelo app

### 2.1 GLOBAIS — Autenticação `/api/v1/auth` (nenhum exige papel de usuário, exceto `reset-password`)

| # | Método / Rota | Público? | Corpo (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| A1 | `POST /auth/register` | sim | `{ name*, email*, number*, password*(≥8), role:"PACIENTE" }` → `201` sem corpo | `PatientRegisterScreen` | 1 | `[ ]` |
| A2 | `POST /auth/login` | sim | `{ email*, password* }` → `{ accessToken, expiresIn, roles[] }` | `LoginScreen`, bootstrap de sessão | 1 | `[ ]` |
| A3 | `POST /auth/request-reset` | sim (5/h) | `{ identifier* }` (e-mail ou telefone) → `200` sem corpo | `ForgotPasswordScreen`, `ChangePasswordScreen` (L5) | 1 / 6 | `[ ]` |
| A4 | `POST /auth/validate-code` | sim (5/min) | `{ code* }` (6 dígitos) → `{ tokenTemp }` (`SCOPE_RESET`) | `ValidateCodeScreen` | 1 | `[ ]` |
| A5 | `POST /auth/reset-password` | `SCOPE_RESET` | `{ newPassword*(≥8) }` (Bearer = `tokenTemp`) → `200` sem corpo | tela de nova senha (pós-código) | 1 / 6 | `[ ]` |

### 2.2 PACIENTE — Perfil `/api/v1/patients`

| # | Método / Rota | Acesso | Corpo / Query (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| P1 | `GET /patients/me` | `SCOPE_PACIENTE` | → `PatientResponseInfosDTO` (`patientI`, `personalInfo`, `contactInfo`, `medicalInfo`) | bootstrap de sessão, `UserProfileScreen`, header de várias telas | 2 | `[ ]` |
| P2 | `POST /patients/add-infos` | `SCOPE_PACIENTE` | `{ dateOfBirth*(passada), conditionPatient*, statusPatient*, gender* }` → `201` sem corpo | tela de **onboarding clínico** (nova) | 2 | `[ ]` |
| P3 | `PUT /patients/update-infos` | `SCOPE_PACIENTE` | parcial: `{ name?, email?, number?, dateOfBirth?, conditionPatient?, gender? }` → `200` sem corpo | `UserProfileScreen` | 2 | `[ ]` |

### 2.3 PACIENTE — Consultas `/api/v1/consultation` (somente leitura)

| # | Método / Rota | Acesso | (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| C1 | `GET /consultation/me` | `SCOPE_PACIENTE` | → `ConsultationResponseDTO[]` | `ConsultationListScreen`, `HomeScreen` (dashboard) | 3 | `[ ]` |
| C2 | `GET /consultation/{consultationId}` | `SCOPE_PACIENTE` | → `ConsultationResponseDTO` | detalhe de consulta (opcional) | 3 | `[ ]` |

`ConsultationResponseDTO`: `{ consultationId, status, patient:{name,email,number}, doctor:{name,specialty}, details:{consultationDate,consultationTime,localConsultation,description,requirements} }`.

### 2.4 PACIENTE — Exames `/api/v1/exam` (somente leitura)

| # | Método / Rota | Acesso | (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| E1 | `GET /exam/me` | `SCOPE_PACIENTE` | → `ExamResponseDTO[]` | `ExamListScreen`, `HomeScreen` (dashboard) | 3 | `[ ]` |
| E2 | `GET /exam/{examId}` | `SCOPE_PACIENTE` | → `ExamResponseDTO` | detalhe de exame (opcional) | 3 | `[ ]` |

`ExamResponseDTO`: `{ examId, requestDate, patient:{name,email}, exam:{examDate,examTime,typeExam,requirements,status,local} }`.

### 2.5 PACIENTE — Medicações `/api/v1/medications`

| # | Método / Rota | Acesso | Corpo / Query (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| M1 | `GET /medications/me` | `SCOPE_PACIENTE` | → `MedicationResponseDTO[]` | `MedicationListScreen` + tabs | 4 | `[ ]` |
| M2 | `GET /medications/{medicationId}` | `SCOPE_PACIENTE` | → `MedicationResponseDTO` | detalhe / `EditMedicationModal` | 4 | `[ ]` |
| M3 | `POST /medications/user/{patientUserId}` | `SCOPE_PACIENTE` | `{ nome*, tipo*, nomeReferencia?, descricao?, concentracao?, quantidade?, dias*[], hora*, gaveta?, estoque*(≥0), status*, medicineBoxId* }` → `201` sem corpo | `AddMedicationModal`, `AddCEMMedicationScreen` | 4 | `[ ]` |
| M4 | `PATCH /medications/{medicationId}/status?status=` | `SCOPE_PACIENTE` | query `status` ∈ `ATIVO`/`SUSPENSO` → `204` | `EditMedicationModal`, toggle na lista | 4 | `[ ]` |
| M5 | `DELETE /medications/{medicationId}` | `SCOPE_PACIENTE` | → `204` | `EditMedicationModal` | 4 | `[ ]` |

`MedicationResponseDTO`: `{ medicationId, nome, tipo, nomeReferencia, descricao, concentracao, quantidade, dias[], hora, gaveta, estoque, status }`.
> `medicineBoxId` (obrigatório em M3) é o campo `medicineBoxId` do `MedicineBoxResponseDTO` retornado por `GET /medicine-box/me`.

### 2.6 PACIENTE — Caixa de medicamentos / CEM `/api/v1/medicine-box`

| # | Método / Rota | Acesso | Corpo / Query (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| X1 | `GET /medicine-box/me` | `SCOPE_PACIENTE` | → `MedicineBoxResponseDTO` (ou erro se não tiver caixa) | `CEMListScreen`→"Minha Caixa", `ViewCEMMedicationsScreen` | 4 | `[ ]` |
| X2 | `POST /medicine-box/register/{patientId}` | `SCOPE_PACIENTE` | `{ numeroSerie*, nome?, gavetas*:[{ nome*, medicamentos*:[{ nome*, tipo*, dias*[], hora*, estoque*, ... }] }] }` → `201` `MedicineBoxResponseDTO` (**409** se já existe / série duplicada) | fluxo "cadastrar minha caixa" | 4 | `[ ]` |
| X3 | `PUT /medicine-box/me?nome=` | `SCOPE_PACIENTE` | query `nome` → `204` | renomear caixa | 4 | `[ ]` |
| X4 | `DELETE /medicine-box/me/medication/{medicationId}` | `SCOPE_PACIENTE` | → `204` | remover medicamento da caixa | 4 | `[ ]` |
| X5 | `DELETE /medicine-box/me/gaveta?gaveta=` | `SCOPE_PACIENTE` | query `gaveta` → `204` | esvaziar gaveta | 4 | `[ ]` |

`MedicineBoxResponseDTO`: `{ medicineBoxId, nome, numeroSerie, externalId, gavetas:[{ nome, medicamentos:[MedicationResponseDTO] }] }`.
> **1 caixa por paciente.** `numeroSerie` é digitado pelo usuário (não há "detecção via rede"). `externalId` (UUID) é o único ID gerado pela API.

### 2.7 PACIENTE — Vacinas `/api/v1/vaccine` (somente leitura)

| # | Método / Rota | Acesso | (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| V1 | `GET /vaccine/me` | `SCOPE_PACIENTE` | → `VaccineResponseDTO[]` | `VaccineHistoryScreen` | 5 | `[ ]` |
| V2 | `GET /vaccine/{vaccineId}` | `SCOPE_PACIENTE` | → `VaccineResponseDTO` (tratar **500**=inexistente, B2) | detalhe de vacina (opcional) | 5 | `[ ]` |

`VaccineResponseDTO`: `{ vaccineId, nome, tipoDose, dataVacinou, lote, dataFabricacao, proximaDose, status, patientId }`.

---

## 3. Endpoints que o app do paciente **NÃO** usa

| Módulo | Rotas | Motivo |
|---|---|---|
| `/auth` | `/register-admin` e afins | fora de escopo |
| `/admin/*` | todas | exige `SCOPE_ADMIN` |
| `/patients` | `GET /{idPatient}`, `GET /`, `PATCH /{patientId}/status` | exige ADMIN/CUIDADOR/MÉDICO |
| `/doctor/*` | todas (`GET /me`, `GET /{crm}/crm`, `GET /`, `POST/PUT/DELETE`) | nenhuma acessível ao paciente — **o app não consegue listar médicos** |
| `/caregiver/*` | todas | nenhuma acessível ao `SCOPE_PACIENTE` (lacuna L6) |
| `/consultation` | `POST /schedule/{patientId}`, `PUT /{id}/update`, `PUT /{id}/status`, `DELETE /{id}`, `GET /user/{userId}`, `GET /by-date`, `GET /by-status` | escrita/consultas administrativas exigem ADMIN/CUIDADOR/MÉDICO (lacuna L2) |
| `/exam` | `POST /schedule/{patientId}`, `PUT /{id}/update`, `PUT /{id}/status`, `DELETE /{id}`, `GET /by-date`, `GET /by-status` | idem (lacuna L2) |
| `/medicine-box` | `GET /patient/{patientId}`, `DELETE /admin/{userId}` | exige ADMIN/MÉDICO/CUIDADOR |
| `/vaccine` | `POST /register/{patientId}`, `PUT /{id}/status`, `DELETE /{id}`, `GET /patient/{patientId}`, `GET /by-status` | escrita exige ADMIN/CUIDADOR/MÉDICO (lacuna L1) |

**Consequências de UI (ver fases 3, 5 e 6):** telas/modais de **agendar/editar consulta**, **agendar/editar exame** e **adicionar/editar/excluir vacina** ficam **somente leitura** ou ocultos. `CaregiverListScreen`, `TreatmentListScreen`, `NotificationScreen`, `BloodTypeScreen` e login social ficam **ocultos no MVP** (sem backend).

---

## 4. Checklist mestre (endpoint → fase)

**Fase 1 – Auth (global):** `[ ]` A1 `[ ]` A2 `[ ]` A3 `[ ]` A4 `[ ]` A5
**Fase 2 – Perfil:** `[ ]` P1 `[ ]` P2 `[ ]` P3
**Fase 3 – Consultas/Exames:** `[ ]` C1 `[ ]` C2 `[ ]` E1 `[ ]` E2
**Fase 4 – Medicações/Caixa:** `[ ]` M1 `[ ]` M2 `[ ]` M3 `[ ]` M4 `[ ]` M5 `[ ]` X1 `[ ]` X2 `[ ]` X3 `[ ]` X4 `[ ]` X5
**Fase 5 – Vacinas:** `[ ]` V1 `[ ]` V2
**Fase 6 – Ajuste de escopo:** reuso de A3/A4/A5 na troca de senha logado

Total: **5 globais + 17 do paciente = 22 endpoints** integrados ao final da Fase 5.

---

## 5. Fase 0 — Fundação da camada de integração

**Status: ✅ Concluída (2026-09-10)** · commit na branch `feat/fase-0-fundacao-integracao-api`

**Objetivo:** ter cliente HTTP, sessão e navegação por autenticação prontos, sem alterar telas de feature.

**Pré-requisitos**
- [ ] API sobe localmente (Docker: MySQL + RabbitMQ; chaves RSA em `src/main/resources`) — _setup local do dev, fora desta entrega._
- [ ] Existe um paciente de teste (via `POST /auth/register`) e o login retorna token — _validar na Fase 1._
- [x] Definida a URL de acesso por plataforma — resolvida em `src/config/env.js` (`EXPO_PUBLIC_API_URL` → `app.json:expo.extra.apiUrl` → fallback `http://10.0.2.2:8080`); `.env.example` incluído.

**Dependências adicionadas** (`package.json`; install com `npm install --legacy-peer-deps` — conflito de peers pré-existente do `@rneui`)
- [x] `axios` · `expo-secure-store` · `@tanstack/react-query` · `expo-constants` · `dayjs`
- [x] `@react-native-async-storage/async-storage` (cache não sensível — disponível para as próximas fases)
- [x] dev: `jest` · `jest-expo` · `react-test-renderer` + script `npm test`

**Estrutura de pastas criada**
```
src/
  api/
    client.js            # axios: baseURL, timeout, interceptors, auth-bridge
    httpError.js          # ErrorResponseDTO -> ApiError (is401/403/404/409/429/network/timeout)
    queryClient.js        # QueryClient do React Query (retry, staleTime)
    endpoints/README.md   # (módulos preenchidos nas fases seguintes)
    __tests__/foundation.smoke.test.js
  auth/
    AuthContext.js        # AuthProvider: bootstrap + signIn/signOut/setUser/setStatus
    useAuth.js
    session.js            # SecureStore: saveSession/loadSession/clearSession/isExpired
  config/
    env.js                # API_URL + API_BASE = `${API_URL}/api/v1`
  lib/
    datetime.js           # toIsoDate/toIsoTime/fromIsoDate/toBrDate/brDateToIso/isPastDate/isTodayOrFuture
    enums.js              # mapas valor<->rótulo (§1.1): Gender, MedicationType, ...
    __tests__/            # datetime.test.js, enums.test.js
  navigation/
    RootNavigator.js      # escolhe stack por `status`
    AuthStack.js          # Splash, Login, ForgotPassword, ValidateCode, Register (+ social, TODO Fase 1)
    OnboardingStack.js    # placeholder (tela real na Fase 2)
    OnboardingPlaceholderScreen.js
    AppStack.js           # Drawer da Home + telas de feature (movido do App.js)
    LoadingScreen.js      # exibido enquanto `status === 'loading'`
  hooks/README.md         # (hooks preenchidos nas fases seguintes)
```
Fora de `src/`: `App.js` reescrito (SafeAreaProvider → QueryClientProvider → AuthProvider → NavigationContainer → RootNavigator); `app.json` com `expo.extra.apiUrl`; `.env.example`; `.gitignore` ignora `.env`/`.env.*` (exceto `.env.example`).

**Tarefas**
- [x] `config/env.js` lendo `EXPO_PUBLIC_API_URL` (fallback para dev + `IS_LOCAL_API`).
- [x] `api/client.js`: instância axios; **request interceptor** injeta `Authorization: Bearer` (modo `bearer` | `none` | `reset` por chamada); **response interceptor** normaliza erro (`toApiError`) e dispara `signOut` global em `401` de chamada autenticada; logs só em `__DEV__`.
- [x] `api/httpError.js`: `ApiError` + getters (`isNotFound`, `isConflict`, `isRateLimited`, `isNetwork`, `isTimeout`, …) e helpers.
- [x] `api/queryClient.js`: `QueryClient` (não repete 401/403/404/409/429; `staleTime` 60s).
- [x] `auth/session.js`: persistência de `accessToken`, `expiresAt`, `roles` no SecureStore + `isExpired`.
- [x] `auth/AuthContext.js` + `useAuth`: estados `loading | signedOut | needsOnboarding | signedIn`; bootstrap lê o SecureStore; `tokenRef` síncrono para o interceptor; ponte com o client via `configureAuthBridge`.
- [x] `App.js` / `src/navigation/*`: `QueryClientProvider` + navegação condicional (`AuthStack` / `OnboardingStack` / `AppStack` / `LoadingScreen`). Tela "NovaSenha" fica para a Fase 1.
- [x] `lib/datetime.js` e `lib/enums.js` com testes unitários (`npm test` → 26 testes verdes: datetime, enums e smoke da fundação).
- [x] Verificação de build: `npx expo export --platform android` conclui sem erros (grafo de módulos íntegro).

**Entregáveis:** camadas `api/`, `auth/`, `config/`, `lib/`, `navigation/` compiláveis; `App.js` refatorado; app abre no `AuthStack` quando sem token; suíte `npm test` verde.

**Critérios de aceite**
- [x] App inicia sem token → `AuthStack` (Login). Com token válido no SecureStore → `AppStack` sem passar pelo Login. _(lógica em `AuthContext` + `RootNavigator`; validação em runtime na Fase 1)._
- [x] Qualquer `401` de chamada autenticada limpa a sessão e volta ao Login (`client.js` → `configureAuthBridge` → `signOut`).
- [x] Nenhuma tela de feature quebrou — mesmas telas/rotas, apenas movidas para `AppStack`; `expo export` confirma o bundle.

---

## 6. Fase 1 — Autenticação e sessão

**Objetivo:** login, cadastro e redefinição de senha reais; sessão persistida.

**Endpoints:** A1, A2, A3, A4, A5 · (bootstrap usa P1)

**Tarefas**
- [ ] `api/endpoints/authApi.js`: `register`, `login`, `requestReset`, `validateCode`, `resetPassword`.
- [ ] `LoginScreen` → `authApi.login` → `session.set` → `signIn()` (a troca de stack é automática). Tratar `401`/credenciais inválidas com mensagem da API.
- [ ] `PatientRegisterScreen` → `authApi.register` com `role:"PACIENTE"`; mapear campo **telefone → `number`**; **senha mínima 8** (hoje o texto diz 6); em sucesso, auto-login e seguir para onboarding (Fase 2).
- [ ] `ForgotPasswordScreen` → `authApi.requestReset({ identifier })`; tratar `429` (rate limit) com "aguarde".
- [ ] `ValidateCodeScreen` → `authApi.validateCode({ code })` → guardar `tokenTemp` em memória (não no SecureStore de sessão); timer de reenvio respeitando 5/min.
- [ ] Nova tela "Definir nova senha" → `authApi.resetPassword({ newPassword })` usando `tokenTemp` como Bearer → ao concluir, descartar `tokenTemp` e ir ao Login.
- [ ] `SplashScreen` → bootstrap: se há token e não expirou, `GET /patients/me`; roteia para `signedIn` / `needsOnboarding` / `signedOut`.
- [ ] `CustomDrawerContent`: "Sair" chama `signOut()` (hoje é `alert('Sair')`).
- [ ] Remover do fluxo as telas `GoogleRegisterScreen` / `FacebookRegisterScreen` (L10).
- [ ] `ChangePasswordScreen`: remover `bcryptjs` e a comparação com `'senha123'` (implementação real fica na Fase 6).

**Critérios de aceite**
- Cadastro → login automático → app entra em onboarding.
- Login manual persiste sessão; fechar e reabrir o app mantém logado até expirar (48 h).
- Fluxo esqueci-a-senha completo: identifier → código → nova senha → login com a nova senha.
- Erros da API aparecem com a `message` normalizada.

---

## 7. Fase 2 — Perfil do paciente e onboarding clínico

**Objetivo:** dados reais do paciente em todo o app; completar cadastro clínico obrigatório.

**Endpoints:** P1 `GET /patients/me` · P2 `POST /patients/add-infos` · P3 `PUT /patients/update-infos`

**Tarefas**
- [ ] `api/endpoints/patientApi.js`: `getMe`, `addInfos`, `updateInfos`.
- [ ] Adapter `patientFromApi(dto)`: lê **`patientI`** (B1) e achata `personalInfo`/`contactInfo`/`medicalInfo` para um modelo do app; expõe `hasMedicalInfo`.
- [ ] `hooks/usePatient.js`: query `['patient','me']`; `useUpdatePatient` (mutation → invalida a query).
- [ ] Tela **Onboarding clínico** (nova, no `OnboardingStack`): campos `dateOfBirth` (data passada), `conditionPatient` (texto), `statusPatient` (enum), `gender` (enum) → `addInfos` → passa para `AppStack`.
- [ ] `AuthContext.refreshMe()` após `addInfos`.
- [ ] `UserProfileScreen`: remover mocks; carregar de `usePatient`; salvar com `updateInfos` (enviar só campos alterados). Remover campos sem correspondência na API ("Usuário", "Celular" separado) ou mapeá-los para `number`.
- [ ] Substituir nome hard-coded (`"Edilson Carlos Silva Lima"`) pelo `user.name` do contexto em: `VaccineHistoryScreen`, `ConsultationListScreen`, `ExamListScreen`, `CEMListScreen`, `CaregiverListScreen`, `AddVaccineScreen`, `ViewCEMMedicationsScreen`.
- [ ] Guarda de navegação: se `!hasMedicalInfo` após login → forçar `OnboardingStack` (L13).

**Critérios de aceite**
- Primeiro login de um usuário recém-cadastrado abre o onboarding; após salvar, não abre mais.
- `UserProfileScreen` mostra e edita dados reais; `PUT` parcial funciona.
- Nenhuma tela exibe o nome fixo antigo.

---

## 8. Fase 3 — Consultas e exames (leitura) + dashboard

**Objetivo:** listar consultas e exames reais; dashboard da Home com números reais. **Sem escrita** (L2).

**Endpoints:** C1 `GET /consultation/me` · C2 `GET /consultation/{id}` · E1 `GET /exam/me` · E2 `GET /exam/{id}`

**Tarefas**
- [ ] `api/endpoints/consultationApi.js` (`listMine`, `getById`) e `examApi.js` (`listMine`, `getById`).
- [ ] Adapters: `consultationFromApi` (achatar `details`, mapear `status` enum→label), `examFromApi` (achatar `exam`).
- [ ] `hooks/useConsultations.js`, `hooks/useExams.js` (queries `['consultations','me']`, `['exams','me']`).
- [ ] `ConsultationListScreen` + `ConsultationTabs`: dados reais; abas por `status`; **ocultar** botão "Adicionar Nova Consulta" e o lápis de edição; `AddConsultationModal`/`EditConsultationModal` fora da navegação (ou atrás de flag desabilitada).
- [ ] `ExamListScreen` + `ExamTabs`: idem; ocultar `AddExamModal`/`EditExamModal`.
- [ ] `HomeScreen`: `DashboardCard` de Consultas / Exames / Prescrição com contagens derivadas das listas (`MARCADO` vs `REALIZADO`, etc.); remover números fixos.
- [ ] Estados de loading / vazio / erro padronizados.

**Critérios de aceite**
- Listas refletem o que a API retorna para o paciente logado; filtros por status funcionam.
- Home mostra contadores coerentes com as listas.
- Não há nenhum caminho de UI que chame `POST/PUT/DELETE` de consulta ou exame.

---

## 9. Fase 4 — Medicações e Caixa de medicamentos (CEM)

**Objetivo:** CRUD de medicação suportado pela API e gestão da caixa única do paciente.

**Endpoints:** M1–M5 · X1–X5

**Tarefas — Caixa**
- [ ] `api/endpoints/medicineBoxApi.js`: `getMine`, `register`, `rename`, `deleteMedication`, `clearGaveta`.
- [ ] `hooks/useMedicineBox.js`: query `['medicineBox','me']`; tratar "sem caixa" como estado vazio (não erro fatal).
- [ ] Redesenhar `CEMListScreen` → **"Minha Caixa"**: se não há caixa, CTA "Cadastrar caixa"; se há, mostra `nome`, `numeroSerie`, `externalId` e as gavetas. Remover coluna "pacientes" e "detecção via rede" (L3).
- [ ] Fluxo de cadastro da caixa → `register` com `numeroSerie` digitado + gavetas + medicamentos (payload aninhado X2); tratar **409** distinguindo "já possui caixa" de "série duplicada" (B4).
- [ ] `ViewCEMMedicationsScreen`: renderizar gavetas/medicamentos reais de `getMine` (não a matriz 3×3 fixa).
- [ ] `AddCEMModal`: passa a ser "cadastrar caixa" ou "adicionar gaveta/medicamento", conforme o caso.

**Tarefas — Medicações**
- [ ] `api/endpoints/medicationApi.js`: `listMine`, `getById`, `create`, `setStatus`, `remove`.
- [ ] `hooks/useMedications.js`: query `['medications','me']`; mutations invalidam `['medications','me']` **e** `['medicineBox','me']`.
- [ ] `MedicationListScreen` + `MedicationTabs`: dados reais; aba por `status` (`ATIVO`/`SUSPENSO`).
- [ ] `AddMedicationModal` → `create` (`POST /medications/user/{patientUserId}` com `patientUserId` = UUID do paciente logado e `medicineBoxId` da caixa). Corrigir bugs do form atual (campo "Nome de Referência" hoje amarrado a `Tipo`). `dias` como array de enums; `hora` `HH:mm`; `estoque` inteiro ≥ 0.
- [ ] `EditMedicationModal` → só `setStatus` (ATIVO/SUSPENSO) e `remove` (L4). Para "editar dados", oferecer excluir + recriar (ou aguardar `PUT /medications/{id}` do backend).
- [ ] `AddCEMMedicationScreen` / `EditCEMMedicationScreen`: usar `create` / `setStatus` / `deleteMedication` / `clearGaveta`. Remover o auto-preenchimento farmacológico mockado.

**Critérios de aceite**
- Paciente sem caixa consegue cadastrar uma; segundo cadastro é bloqueado com mensagem clara (409).
- Adicionar medicação aparece na lista e dentro da gaveta da caixa após refetch.
- Suspender/reativar e excluir medicação refletem na lista e na caixa.
- Esvaziar gaveta remove os medicamentos daquela gaveta.

---

## 10. Fase 5 — Vacinas (somente leitura)

**Objetivo:** carteira de vacinas real, sem escrita (L1).

**Endpoints:** V1 `GET /vaccine/me` · V2 `GET /vaccine/{id}`

**Tarefas**
- [ ] `api/endpoints/vaccineApi.js`: `listMine`, `getById` (tratar **500** como "não encontrada", B2).
- [ ] `hooks/useVaccines.js`: query `['vaccines','me']`.
- [ ] Adapter: mapear `tipoDose` e `status` enum→label; datas ISO→BR.
- [ ] `VaccineHistoryScreen`: dados reais; **remover** botões "Adicionar Nova Vacina", "Editar", "Excluir".
- [ ] Tirar da navegação `AddVaccineScreen`, `EditVaccineScreen`, `DeleteVaccineModal` (ou flag desabilitada).

**Critérios de aceite**
- Carteira lista as vacinas do paciente; nenhum caminho de escrita.
- ID inexistente não derruba a tela (500 tratado).

---

## 11. Fase 6 — Ajuste de escopo e lacunas sem backend

**Objetivo:** deixar o app coerente com o que a API oferece hoje.

**Tarefas**
- [ ] **Troca de senha logado** (`ChangePasswordScreen`, L5): reaproveitar o fluxo A3→A4→A5 a partir da área logada (pré-preencher `identifier` com o e-mail do `user`), ou aguardar endpoint dedicado. Sem `bcryptjs`.
- [ ] **Cuidadores** (L6): ocultar `CaregiverListScreen` e entradas de menu, atrás de `features.caregivers = false`. Registrar pedido de `GET /caregiver/me` ao backend.
- [ ] **Tratamentos** (L7): ocultar `TreatmentListScreen` e modais (`features.treatments = false`). Alternativa: reduzir a uma visão de `conditionPatient` + `statusPatient` do perfil.
- [ ] **Notificações** (L8): ocultar `NotificationScreen` ou implementar apenas **notificações locais** derivadas de `hora`/`dias` das medicações e datas de consultas/exames (client-side, sem backend).
- [ ] **Tipo sanguíneo** (L9): ocultar `BloodTypeScreen`. Registrar pedido de campo em `patients`.
- [ ] **Login social** (L10): remover telas e botões do `LoginScreen`.
- [ ] Centralizar as flags em `config/features.js`.

**Critérios de aceite**
- Menu lateral / Home não mostram features sem backend.
- Nenhum botão leva a tela "morta".
- Lista de pendências de backend registrada (issues) — ver §12.

---

## 12. Fase 7 — Robustez, QA e fechamento

**Objetivo:** app estável para homologação.

**Tarefas**
- [ ] `401` global → logout + tela/toast "sessão expirada" (L11); checar `expiresAt` antes de chamadas e no `AppState` voltando a `active`.
- [ ] Retry (1x) e timeout nos `GET`; backoff em erro de rede; banner offline.
- [ ] Estados de loading/vazio/erro unificados (componentes compartilhados).
- [ ] Testes unitários: `lib/enums`, `lib/datetime`, adapters (`patientI`, achatamento de DTOs), `httpError` (is404/409/429).
- [ ] Testes de integração dos `api/endpoints/*` contra mock server (ou API local em CI).
- [ ] Revisar `app.json`/`expo-build-properties`: `usesCleartextTraffic` só em dev; produção só HTTPS.
- [ ] Remover `console.log` de rede fora de `__DEV__`.
- [ ] Smoke test manual do fluxo completo: cadastro → onboarding → navegação por todas as telas ativas → logout.

**Critérios de aceite**
- Sessão expirada é tratada sem crash em qualquer tela.
- Suite de testes verde; build de produção sem cleartext.
- Checklist mestre (§4) com os 22 endpoints marcados `[x]`.

---

## 13. Dependências entre fases

```
Fase 0 (fundação)
  └─> Fase 1 (auth)  ──> Fase 2 (perfil/onboarding)
                            ├─> Fase 3 (consultas/exames + dashboard)
                            ├─> Fase 4 (medicações/caixa)
                            └─> Fase 5 (vacinas)
Fases 3/4/5 ──> Fase 6 (ajuste de escopo) ──> Fase 7 (robustez/QA)
```
- Fases 3, 4 e 5 são independentes entre si — podem ser paralelizadas após a Fase 2.
- Fase 6 pode começar em paralelo (é só ocultar/flag), mas fecha depois das telas ativas.

---

## 14. Pendências para o time de backend (rastrear como issues)

1. Corrigir `patientI` → `patientId` em `PatientResponseInfosDTO` (B1).
2. `GET/PUT/DELETE /vaccine/{id}` devolver `404` em vez de `500` (B2/B3).
3. Avaliar liberar para `SCOPE_PACIENTE`: `POST /vaccine/register`, `POST /consultation/schedule`, `POST /exam/schedule` (ou confirmar que paciente é read-only nesses domínios).
4. `PUT /medications/{id}` para edição completa de medicação (hoje só `PATCH status`).
5. Endpoint de troca de senha para usuário autenticado (ex.: `PUT /auth/change-password`).
6. `GET /caregiver/me` (ou incluir cuidadores em `GET /patients/me`).
7. Módulo de **tratamentos** (não existe).
8. Campo **tipo sanguíneo** em `patients`.
9. Refresh token / renovação de sessão (hoje expira em 48 h sem renovação).
