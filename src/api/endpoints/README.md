# `src/api/endpoints/`

Um módulo por domínio da Mediway API, criado nas fases seguintes do
[`FASES_INTEGRACAO_API.md`](../../../FASES_INTEGRACAO_API.md):

| Arquivo | Fase | Endpoints |
|---|---|---|
| `authApi.js` | 1 | A1–A5 (`/auth/*`) |
| `patientApi.js` | 2 | P1–P3 (`/patients/*`) |
| `consultationApi.js` | 3 | C1–C2 (`/consultation/*`) |
| `examApi.js` | 3 | E1–E2 (`/exam/*`) |
| `medicationApi.js` | 4 | M1–M5 (`/medications/*`) |
| `medicineBoxApi.js` | 4 | X1–X5 (`/medicine-box/*`) |
| `vaccineApi.js` | 5 | V1–V2 (`/vaccine/*`) |

Cada módulo importa `api` de [`../client.js`](../client.js) e devolve dados já
adaptados ao modelo do app (ver adapters por fase).
