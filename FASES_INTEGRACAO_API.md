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
| 1 | Autenticação e sessão | ✅ Concluída (2026-09-10) |
| 2 | Perfil do paciente e onboarding | ✅ Concluída (2026-09-10) |
| 3 | Consultas e exames (leitura) + dashboard | ✅ Concluída (2026-09-10) |
| 4 | Medicações e Caixa (CEM) | ✅ Concluída (2026-09-10) |
| 5 | Vacinas (leitura) | ✅ Concluída (2026-09-10) |
| 6 | Ajuste de escopo / lacunas | ✅ Concluída (2026-09-10) |
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
| A1 | `POST /auth/register` | sim | `{ name*, email*, number*, password*(≥8), role:"PACIENTE" }` → `201` sem corpo | `PatientRegisterScreen` | 1 | `[x]` |
| A2 | `POST /auth/login` | sim | `{ email*, password* }` → `{ accessToken, expiresIn, roles[] }` | `LoginScreen`, bootstrap de sessão | 1 | `[x]` |
| A3 | `POST /auth/request-reset` | sim (5/h) | `{ identifier* }` (e-mail ou telefone) → `200` sem corpo | `ForgotPasswordScreen`, `ValidateCodeScreen` (reenvio); `ChangePasswordScreen` na Fase 6 (L5) | 1 / 6 | `[x]` |
| A4 | `POST /auth/validate-code` | sim (5/min) | `{ code* }` (6 dígitos) → `{ tokenTemp }` (`SCOPE_RESET`) | `ValidateCodeScreen` | 1 | `[x]` |
| A5 | `POST /auth/reset-password` | `SCOPE_RESET` | `{ newPassword*(≥8) }` (Bearer = `tokenTemp`) → `200` sem corpo | `NewPasswordScreen` (pós-código) | 1 / 6 | `[x]` |

### 2.2 PACIENTE — Perfil `/api/v1/patients`

| # | Método / Rota | Acesso | Corpo / Query (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| P1 | `GET /patients/me` | `SCOPE_PACIENTE` | → `PatientResponseInfosDTO` (`patientI`, `personalInfo`, `contactInfo`, `medicalInfo`) | bootstrap de sessão, `usePatient` (`UserProfileScreen`), `user.name` em headers | 2 | `[x]` |
| P2 | `POST /patients/add-infos` | `SCOPE_PACIENTE` | `{ dateOfBirth*(passada), conditionPatient*, statusPatient*, gender* }` → `201` sem corpo | `OnboardingScreen` (nova) | 2 | `[x]` |
| P3 | `PUT /patients/update-infos` | `SCOPE_PACIENTE` | parcial: `{ name?, email?, number?, dateOfBirth?, conditionPatient?, gender? }` → `200` sem corpo | `UserProfileScreen` (envia só o diff) | 2 | `[x]` |

### 2.3 PACIENTE — Consultas `/api/v1/consultation` (somente leitura)

| # | Método / Rota | Acesso | (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| C1 | `GET /consultation/me` | `SCOPE_PACIENTE` | → `ConsultationResponseDTO[]` | `useConsultations` → `ConsultationListScreen`, `HomeScreen` (dashboard) | 3 | `[x]` |
| C2 | `GET /consultation/{consultationId}` | `SCOPE_PACIENTE` | → `ConsultationResponseDTO` | `consultationApi.getById` (detalhe — sem tela dedicada ainda) | 3 | `[x]` |

`ConsultationResponseDTO`: `{ consultationId, status, patient:{name,email,number}, doctor:{name,specialty}, details:{consultationDate,consultationTime,localConsultation,description,requirements} }`.

### 2.4 PACIENTE — Exames `/api/v1/exam` (somente leitura)

| # | Método / Rota | Acesso | (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| E1 | `GET /exam/me` | `SCOPE_PACIENTE` | → `ExamResponseDTO[]` | `useExams` → `ExamListScreen`, `HomeScreen` (dashboard) | 3 | `[x]` |
| E2 | `GET /exam/{examId}` | `SCOPE_PACIENTE` | → `ExamResponseDTO` | `examApi.getById` (detalhe — sem tela dedicada ainda) | 3 | `[x]` |

`ExamResponseDTO`: `{ examId, requestDate, patient:{name,email}, exam:{examDate,examTime,typeExam,requirements,status,local} }`.

### 2.5 PACIENTE — Medicações `/api/v1/medications`

| # | Método / Rota | Acesso | Corpo / Query (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| M1 | `GET /medications/me` | `SCOPE_PACIENTE` | → `MedicationResponseDTO[]` | `useMedications` → `MedicationListScreen` + tabs, dashboard | 4 | `[x]` |
| M2 | `GET /medications/{medicationId}` | `SCOPE_PACIENTE` | → `MedicationResponseDTO` | `medicationApi.getById` (sem tela dedicada) | 4 | `[x]` |
| M3 | `POST /medications/user/{patientUserId}` | `SCOPE_PACIENTE` | `{ nome*, tipo*, nomeReferencia?, descricao?, concentracao?, quantidade?, dias*[], hora*, gaveta?, estoque*(≥0), status*, medicineBoxId* }` → `201` sem corpo | `MedicationForm` → `AddMedicationModal`, `AddCEMMedicationScreen` | 4 | `[x]` |
| M4 | `PATCH /medications/{medicationId}/status?status=` | `SCOPE_PACIENTE` | query `status` ∈ `ATIVO`/`SUSPENSO` → `204` | `EditMedicationModal`, `EditCEMMedicationScreen` | 4 | `[x]` |
| M5 | `DELETE /medications/{medicationId}` | `SCOPE_PACIENTE` | → `204` | `EditMedicationModal` | 4 | `[x]` |

`MedicationResponseDTO`: `{ medicationId, nome, tipo, nomeReferencia, descricao, concentracao, quantidade, dias[], hora, gaveta, estoque, status }`.
> `medicineBoxId` (obrigatório em M3) é o campo `medicineBoxId` do `MedicineBoxResponseDTO` retornado por `GET /medicine-box/me`.

### 2.6 PACIENTE — Caixa de medicamentos / CEM `/api/v1/medicine-box`

| # | Método / Rota | Acesso | Corpo / Query (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| X1 | `GET /medicine-box/me` | `SCOPE_PACIENTE` | → `MedicineBoxResponseDTO` (404 → `null`, tratado como "sem caixa") | `useMedicineBox` → `CEMListScreen`, `ViewCEMMedicationsScreen`, `AddMedicationModal` | 4 | `[x]` |
| X2 | `POST /medicine-box/register/{patientId}` | `SCOPE_PACIENTE` | `{ numeroSerie*, nome?, gavetas*:[{ nome*, medicamentos*:[{ nome*, tipo*, dias*[], hora*, estoque*, ... }] }] }` → `201` `MedicineBoxResponseDTO` (**409** se já existe / série duplicada) | `AddCEMModal` (cadastro da caixa + 1ª gaveta/medicamento) | 4 | `[x]` |
| X3 | `PUT /medicine-box/me?nome=` | `SCOPE_PACIENTE` | query `nome` → `204` | `RenameBoxModal` no `CEMListScreen` | 4 | `[x]` |
| X4 | `DELETE /medicine-box/me/medication/{medicationId}` | `SCOPE_PACIENTE` | → `204` | `EditCEMMedicationScreen` (excluir da caixa) | 4 | `[x]` |
| X5 | `DELETE /medicine-box/me/gaveta?gaveta=` | `SCOPE_PACIENTE` | query `gaveta` → `204` | `ViewCEMMedicationsScreen` (esvaziar gaveta) | 4 | `[x]` |

`MedicineBoxResponseDTO`: `{ medicineBoxId, nome, numeroSerie, externalId, gavetas:[{ nome, medicamentos:[MedicationResponseDTO] }] }`.
> **1 caixa por paciente.** `numeroSerie` é digitado pelo usuário (não há "detecção via rede"). `externalId` (UUID) é o único ID gerado pela API.

### 2.7 PACIENTE — Vacinas `/api/v1/vaccine` (somente leitura)

| # | Método / Rota | Acesso | (→ resposta) | Consumido em | Fase | Status |
|---|---|---|---|---|---|---|
| V1 | `GET /vaccine/me` | `SCOPE_PACIENTE` | → `VaccineResponseDTO[]` | `useVaccines` → `VaccineHistoryScreen` | 5 | `[x]` |
| V2 | `GET /vaccine/{vaccineId}` | `SCOPE_PACIENTE` | → `VaccineResponseDTO` (500/404 → `null`, B2) | `vaccineApi.getById` (sem tela dedicada) | 5 | `[x]` |

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

**Fase 1 – Auth (global):** `[x]` A1 `[x]` A2 `[x]` A3 `[x]` A4 `[x]` A5
**Fase 2 – Perfil:** `[x]` P1 `[x]` P2 `[x]` P3
**Fase 3 – Consultas/Exames:** `[x]` C1 `[x]` C2 `[x]` E1 `[x]` E2
**Fase 4 – Medicações/Caixa:** `[x]` M1 `[x]` M2 `[x]` M3 `[x]` M4 `[x]` M5 `[x]` X1 `[x]` X2 `[x]` X3 `[x]` X4 `[x]` X5
**Fase 5 – Vacinas:** `[x]` V1 `[x]` V2
**Fase 6 – Ajuste de escopo:** ✅ flags em `config/features.js`; troca de senha logado reusa A3→A4→A5 (`ChangePasswordScreen`)

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

**Status: ✅ Concluída (2026-09-10)** · commit na branch `feat/fase-1-autenticacao`

**Objetivo:** login, cadastro e redefinição de senha reais; sessão persistida.

**Endpoints:** A1, A2, A3, A4, A5 · bootstrap/login também chamam `GET /patients/me` (P1) para decidir `signedIn` vs `needsOnboarding` — adapter mínimo no `AuthContext`, formalizado na Fase 2.

**Tarefas**
- [x] `api/endpoints/authApi.js`: `register` (injeta `role:"PACIENTE"`), `login`, `requestReset`, `validateCode`, `resetPassword` (modo `auth: 'reset'` + `resetToken`).
- [x] `LoginScreen` → `authApi.login` → `useAuth().signIn()` (persiste sessão + resolve `/patients/me`; troca de stack automática). `401` → "E-mail ou senha incorretos"; rede/timeout → mensagem normalizada. Botões de login social removidos.
- [x] `PatientRegisterScreen` → `authApi.register` (telefone → `number`; senha mín. **8**) → auto-login via `authApi.login` + `signIn` → cai no `OnboardingStack` (Fase 2). Trata `409` (e-mail já usado) e `400`.
- [x] `ForgotPasswordScreen` → `authApi.requestReset({ identifier })` → navega a `ValidateCode` com `identifier`; trata `429` ("aguarde").
- [x] `ValidateCodeScreen` → `authApi.validateCode({ code })` → navega a `NewPassword` com `{ resetToken: tokenTemp }` (em params, nunca persistido); contador real de 60 s e reenvio via `requestReset` respeitando o rate limit.
- [x] Nova tela `NewPasswordScreen` (+ styles) → `authApi.resetPassword({ newPassword, resetToken })` → `Alert` de sucesso → `navigation.reset` para `Login`.
- [x] Bootstrap de sessão: centralizado no `AuthProvider` (roda ao montar, antes do `SplashScreen`). Lê o SecureStore; com token válido chama `GET /patients/me` e roteia `signedIn` / `needsOnboarding` / `signedOut` (401/403 → `signOut`; falha transitória → segue `signedIn`). `SplashScreen` mantido como tela de marca do `AuthStack`.
- [x] `CustomDrawerContent`: "Sair" → `Alert` de confirmação → `useAuth().signOut()`.
- [x] `GoogleRegisterScreen` / `FacebookRegisterScreen` (+ styles) **removidos** e fora do `AuthStack` (L10).
- [x] `ChangePasswordScreen`: `bcryptjs` e a senha fixa `'senha123'` removidos; valida o formato e orienta ao fluxo de reset (ligação real na Fase 6). `bcryptjs` saiu do `package.json`.
- [x] Testes: `authApi.test.js` (rotas/corpos/modos de auth) e `AuthContext.test.js` (bootstrap, `signIn` → signedIn/needsOnboarding, `signOut`). `npm test` → **35 testes verdes**.
- [x] Build: `npx expo export --platform android` conclui sem erros.

**Critérios de aceite**
- [x] Cadastro → login automático → app entra em onboarding (`needsOnboarding` quando `/patients/me` volta sem `medicalInfo`). _(coberto por `AuthContext.test.js`; validação end-to-end depende da API no ar.)_
- [x] Login manual persiste a sessão no SecureStore com `expiresAt`; reabrir o app mantém logado até expirar (bootstrap do `AuthProvider` + `isExpired`).
- [x] Fluxo esqueci-a-senha completo: `identifier` → código → nova senha → volta ao Login.
- [x] Erros da API aparecem com a `message` normalizada (`ApiError` do interceptor).

---

## 7. Fase 2 — Perfil do paciente e onboarding clínico

**Status: ✅ Concluída (2026-09-10)** · commit na branch `feat/fase-2-perfil-onboarding`

**Objetivo:** dados reais do paciente em todo o app; completar cadastro clínico obrigatório.

**Endpoints:** P1 `GET /patients/me` · P2 `POST /patients/add-infos` · P3 `PUT /patients/update-infos`

**Tarefas**
- [x] `api/endpoints/patientApi.js`: `getMe` (adapta), `addInfos` (4 campos), `updateInfos` (parcial).
- [x] Adapter `patientFromApi(dto)` (co-locado em `patientApi.js`): lê **`patientI`** (B1), achata `personalInfo`/`contactInfo`/`medicalInfo`, expõe `hasMedicalInfo` e `raw`. O `AuthContext` deixou de ter o adapter inline e passou a usar `patientApi.getMe`.
- [x] `hooks/usePatient.js`: `usePatient` (query `['patient','me']`, `initialData` = `AuthContext.user`), `useUpdatePatient` e `useAddPatientInfos` (mutations → `invalidateQueries` + `refreshMe`).
- [x] `OnboardingScreen` (nova, em `src/features/onboarding/`) no `OnboardingStack`: `dateOfBirth` (DateTimePicker, `maximumDate` = ontem), `conditionPatient` (texto), `statusPatient` e `gender` (Pickers com `lib/enums`) → `useAddPatientInfos` → `refreshMe` troca o status → `AppStack`. `OnboardingPlaceholderScreen` removido.
- [x] `refreshMe()` disparado no `onSuccess` de `useAddPatientInfos` / `useUpdatePatient`.
- [x] `UserProfileScreen`: sem mocks; carrega de `usePatient`; salva com `useUpdatePatient` **enviando apenas o diff** (comparação com o baseline vindo da API). Campos: nome, e-mail, telefone (→ `number`, "Usuário"/"Celular" removidos), data de nascimento, gênero (enum), condição de saúde. `statusPatient` é somente leitura. Estados de loading/erro/retry.
- [x] Nome hard-coded substituído por `user?.name` em `VaccineHistoryScreen`, `ConsultationListScreen`, `ExamListScreen`, `CEMListScreen`, `CaregiverListScreen`, `AddVaccineScreen`, `ViewCEMMedicationsScreen` (nas carteiras de vacina, a linha demográfica também passou a usar `user`).
- [x] Guarda de navegação (L13): já garantida pelo `AuthContext` — `status === 'needsOnboarding'` → `RootNavigator` renderiza o `OnboardingStack`; sai dele só quando `refreshMe` vê `medicalInfo`.
- [x] Testes: `patientApi.test.js` (adapter + rotas/corpos de `getMe`/`addInfos`/`updateInfos`). `npm test` → **41 testes verdes**. Build: `npx expo export --platform android` sem erros.

**Critérios de aceite**
- [x] Primeiro login de um usuário recém-cadastrado abre o onboarding; após salvar, `refreshMe` → `signedIn` e não abre mais. _(coberto por `AuthContext.test.js` "needsOnboarding"; ponta-a-ponta depende da API no ar.)_
- [x] `UserProfileScreen` mostra e edita dados reais; o `PUT` envia só os campos alterados (`diff`).
- [x] Nenhuma das 7 telas do escopo exibe o nome fixo antigo (demais telas serão tratadas nas Fases 3–6, quando são reescritas).

---

## 8. Fase 3 — Consultas e exames (leitura) + dashboard

**Status: ✅ Concluída (2026-09-10)** · commit na branch `feat/fase-3-consultas-exames`

**Objetivo:** listar consultas e exames reais; dashboard da Home com números reais. **Sem escrita** (L2).

**Endpoints:** C1 `GET /consultation/me` · C2 `GET /consultation/{id}` · E1 `GET /exam/me` · E2 `GET /exam/{id}`

**Tarefas**
- [x] `api/endpoints/consultationApi.js` (`listMine` → mapeia array, `getById`) e `examApi.js` (idem).
- [x] Adapters `consultationFromApi` (achata `details`/`doctor`, `status`→`statusLabel`, `title`) e `examFromApi` (achata `exam`), co-locados nos módulos.
- [x] `lib/statusColors.js`: `consultationExamStatusColor(status)` e `isUpcomingStatus(status)` (MARCADO/REMARCADO = "Marcadas"; resto = "Histórico").
- [x] `hooks/useConsultations.js` (`['consultations','me']`) e `hooks/useExams.js` (`['exams','me']`) — só query, `enabled` pela sessão.
- [x] `ConsultationTabs` reescrito para o modelo adaptado, **sem `onEdit`/lápis**; abas "Marcadas (n)" / "Histórico (n)" por `isUpcomingStatus`.
- [x] `ExamTabs` idem.
- [x] `ConsultationListScreen` / `ExamListScreen`: `useConsultations`/`useExams`; **botão "Adicionar" removido**; estados loading (spinner) / erro (retry) / vazio (pull-to-refresh). Mocks e handlers de escrita removidos.
- [x] `AddConsultationModal`, `EditConsultationModal`, `AddExamModal`, `EditExamModal` (+ styles) **deletados** — sem caminho de escrita para o paciente.
- [x] `HomeScreen`: cards Consultas/Exames com `Marcados: x | Realizados: y` e progresso reais (`summarize` sobre as listas); card "Prescrição Médica" sem números fixos (contagem real na Fase 4).
- [x] Testes: `consultationApi.test.js`, `examApi.test.js`, `statusColors.test.js`. `npm test` → **52 verdes**. Build: `npx expo export --platform android` sem erros.

**Critérios de aceite**
- [x] As listas vêm de `GET /consultation/me` / `GET /exam/me`; as abas separam em aberto × histórico pelo `status` real.
- [x] Home mostra contadores derivados das mesmas listas (React Query compartilha o cache das keys `['consultations','me']` / `['exams','me']`).
- [x] Nenhum caminho de UI chama `POST/PUT/DELETE` de consulta ou exame (modais e botões removidos).

---

## 9. Fase 4 — Medicações e Caixa de medicamentos (CEM)

**Status: ✅ Concluída (2026-09-10)** · commit na branch `feat/fase-4-medicacoes-cem`

**Objetivo:** CRUD de medicação suportado pela API e gestão da caixa única do paciente.

**Endpoints:** M1–M5 · X1–X5

**Tarefas — Caixa**
- [x] `api/endpoints/medicineBoxApi.js`: `getMine` (404 → `null`), `register`, `rename`, `deleteMedication`, `clearGaveta` + `medicineBoxFromApi` (achata gavetas → `medicationFromApi`, calcula `medicationCount`).
- [x] `hooks/useMedicineBox.js`: query `['medicineBox','me']` + `useRegisterMedicineBox`, `useRenameMedicineBox`, `useDeleteBoxMedication`, `useClearGaveta` (invalidam também `['medications','me']`). "Sem caixa" = `data === null`.
- [x] `CEMListScreen` → **"Minha Caixa"**: sem caixa → card + CTA "Cadastrar caixa"; com caixa → `nome`, `numeroSerie`, `externalId`, contagem de gavetas/medicamentos, "Ver medicamentos", renomear. Removidos lista de CEMs, coluna "pacientes" e "detecção via rede" (L3).
- [x] `AddCEMModal` = cadastro da caixa: `numeroSerie` (digitado) + `nome?` + 1ª gaveta/medicamento via `MedicationForm` → `register` (payload aninhado X2). `409` distingue "já possui caixa" de "série duplicada" (B4).
- [x] `ViewCEMMedicationsScreen`: gavetas/medicamentos reais de `useMedicineBox` (matriz 3×3 e cores por paciente removidas); por gaveta "Esvaziar" (X5); toque no medicamento → `EditCEMMedicationScreen`; "Adicionar medicamento" → `AddCEMMedicationScreen`.

**Tarefas — Medicações**
- [x] `api/endpoints/medicationApi.js`: `listMine`, `getById`, `create`, `setStatus` (query param), `remove` + `medicationFromApi` (traduz `tipo`/`status`, `diasLabel`).
- [x] `hooks/useMedications.js`: query `['medications','me']` + `useCreateMedication` (injeta `patientUserId` = `user.id`), `useSetMedicationStatus`, `useRemoveMedication` — todas invalidam `['medications','me']` **e** `['medicineBox','me']`.
- [x] `MedicationListScreen` + `MedicationTabs`: dados reais; abas `ATIVO`/`SUSPENSO`; loading/erro. Mock removido.
- [x] `components/MedicationForm.js` (+ `WeekDayPicker`): form único (nome, tipo Picker, referência, descrição, concentração, quantidade, **dias como chips de enum**, **hora `HH:mm`** via `toIsoTime`, gaveta, **estoque inteiro ≥ 0**), reusado por `AddMedicationModal` e `AddCEMMedicationScreen`. Bug do campo "Nome de referência" (amarrado a `Tipo`) corrigido.
- [x] `EditMedicationModal` reescrito: dados somente leitura + Suspender/Reativar (M4) + Excluir (M5). Aviso de que não há edição completa (L4).
- [x] `AddCEMMedicationScreen`: `MedicationForm` + `useCreateMedication` com `medicineBoxId` da caixa; auto-preenchimento farmacológico mockado removido.
- [x] `EditCEMMedicationScreen`: acha o medicamento na caixa; Suspender/Reativar (M4) + Excluir da caixa (X4). "Salvar estoque" removido (sem endpoint).
- [x] `HomeScreen`: card "Prescrição Médica" agora com `Ativos: x | Suspensos: y` e progresso reais.
- [x] Testes: `medicationApi.test.js`, `medicineBoxApi.test.js` (inclui 404 → null), `MedicationForm.test.js`. `npm test` → **73 verdes**. Build: `npx expo export --platform android` sem erros.

**Critérios de aceite**
- [x] Paciente sem caixa vê a CTA e cadastra uma; um 2º cadastro cai no `409` com mensagem distinta para "já possui caixa" × "série duplicada" (B4).
- [x] Adicionar medicação invalida `['medications','me']` **e** `['medicineBox','me']` → aparece na lista e dentro da gaveta após o refetch.
- [x] Suspender/reativar (M4) e excluir (M5/X4) refletem em ambas as telas (mesmas query keys).
- [x] "Esvaziar gaveta" chama `DELETE /medicine-box/me/gaveta?gaveta=` (X5) e revalida a caixa.

---

## 10. Fase 5 — Vacinas (somente leitura)

**Status: ✅ Concluída (2026-09-10)** · commit na branch `feat/fase-5-vacinas`

**Objetivo:** carteira de vacinas real, sem escrita (L1).

**Endpoints:** V1 `GET /vaccine/me` · V2 `GET /vaccine/{id}`

**Tarefas**
- [x] `api/endpoints/vaccineApi.js`: `listMine`, `getById` (500/404 → `null`, B2) + `vaccineFromApi` (traduz `tipoDose`/`status`, datas ISO→BR).
- [x] `hooks/useVaccines.js`: query `['vaccines','me']`, `enabled` pela sessão.
- [x] `VaccineHistoryScreen` reescrito: `useVaccines`, badge de status, loading/erro/vazio + pull-to-refresh; **sem** botões "Adicionar/Editar/Excluir". Cabeçalho com `user`.
- [x] `AddVaccineScreen`, `EditVaccineScreen`, `DeleteVaccineModal` (+ styles) **deletados** e removidos do `AppStack` (rotas "Adicionar Vacina" / "Editar Vacina").
- [x] Testes: `vaccineApi.test.js` (adapter + 500/404 → null). `npm test` → **81 verdes**. Build: `npx expo export --platform android` sem erros.

**Critérios de aceite**
- [x] A carteira lista `GET /vaccine/me`; nenhum caminho de UI escreve vacina.
- [x] `getById` de id inexistente devolve `null` (500 e 404 tratados) sem derrubar a tela.

---

## 11. Fase 6 — Ajuste de escopo e lacunas sem backend

**Status: ✅ Concluída (2026-09-10)** · commit na branch `feat/fase-6-ajuste-escopo`

**Objetivo:** deixar o app coerente com o que a API oferece hoje.

**Tarefas**
- [x] `config/features.js`: flags `caregivers`, `treatments`, `notifications`, `bloodType`, `socialLogin` — todas `false`.
- [x] **Troca de senha logado** (`ChangePasswordScreen`, L5): reescrito como assistente em 2 passos que reusa A3 (`requestReset` com o e-mail do `user`) → A4 (`validateCode`) → A5 (`resetPassword` com o `tokenTemp`), com reenvio. Sem `bcryptjs` (já removido na Fase 1).
- [x] **Cuidadores** (L6): `Drawer.Screen` "Cuidadores" e o atalho da Home atrás de `features.caregivers`. Tela mantida no repo para quando houver `GET /caregiver/me` (§14).
- [x] **Tratamentos** (L7): `Stack.Screen` "Tratamentos" e o atalho da Home atrás de `features.treatments`.
- [x] **Notificações** (L8): `Drawer.Screen` "Notificações", `Stack.Screen` "Notifications", o item do menu e o `TabIcon` da Home atrás de `features.notifications`.
- [x] **Tipo sanguíneo** (L9): `Drawer.Screen` "Tipo Sanguíneo" e o item do menu atrás de `features.bloodType`.
- [x] **Login social** (L10): telas e botões já removidos na Fase 1; flag `socialLogin` documenta a decisão.

**Critérios de aceite**
- [x] Com as flags `false`, o menu lateral e a Home não mostram Cuidadores / Tratamentos / Notificações / Tipo Sanguíneo; as rotas ficam fora do `AppStack`.
- [x] Nenhum botão visível leva a uma rota inexistente (`grep` por `navigate('Cuidadores'|'Tratamentos'|'Notifications'|'Tipo Sanguíneo')` só acha chamadas dentro de blocos `{features.* && …}` ou de branches inalcançáveis do `handleTabPress`).
- [x] Pendências de backend já listadas em §14 (itens 5–8: troca de senha logado, `GET /caregiver/me`, módulo de tratamentos, campo tipo sanguíneo).
- [x] `npm test` → **81 verdes**; `npx expo export --platform android` sem erros.

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
