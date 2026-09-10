// 📁 src/config/features.js
//
// Flags de features que dependem de backend ainda inexistente para o paciente.
// Enquanto `false`, as telas ficam fora da navegação e os atalhos/menu não
// aparecem. Ver FASES_INTEGRACAO_API.md §11 e §14 (pendências de backend).

export const features = {
  // L6 — nenhum endpoint de /caregiver é acessível ao SCOPE_PACIENTE.
  caregivers: false,
  // L7 — não existe módulo de tratamentos no backend.
  treatments: false,
  // L8 — não há endpoint/consumidor de notificações.
  notifications: false,
  // L9 — não há campo de tipo sanguíneo em /patients.
  bloodType: false,
  // L10 — login social não tem suporte no backend (telas já removidas na Fase 1).
  socialLogin: false,
};

export default features;
