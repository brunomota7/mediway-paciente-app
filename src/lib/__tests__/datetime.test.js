import {
  toIsoDate,
  toIsoTime,
  fromIsoDate,
  toBrDate,
  toBrDateTime,
  brDateToIso,
  isPastDate,
  isTodayOrFuture,
} from '../datetime';

describe('lib/datetime', () => {
  describe('toIsoDate', () => {
    it('formata Date para YYYY-MM-DD', () => {
      expect(toIsoDate(new Date(2026, 0, 9))).toBe('2026-01-09');
    });
    it('mantém string ISO', () => {
      expect(toIsoDate('2026-09-10')).toBe('2026-09-10');
    });
    it('retorna null para entrada vazia ou inválida', () => {
      expect(toIsoDate('')).toBeNull();
      expect(toIsoDate('não é data')).toBeNull();
      expect(toIsoDate(null)).toBeNull();
    });
  });

  describe('toIsoTime', () => {
    it('normaliza HH:mm:ss para HH:mm', () => {
      expect(toIsoTime('08:00:00')).toBe('08:00');
    });
    it('mantém HH:mm', () => {
      expect(toIsoTime('9:5'.replace('5', '05'))).toBe('09:05');
    });
    it('formata Date para HH:mm', () => {
      expect(toIsoTime(new Date(2026, 0, 1, 7, 30))).toBe('07:30');
    });
    it('retorna null para valor sem hora', () => {
      expect(toIsoTime('abc')).toBeNull();
      expect(toIsoTime(null)).toBeNull();
    });
  });

  describe('fromIsoDate', () => {
    it('converte YYYY-MM-DD em Date válido', () => {
      const d = fromIsoDate('2026-09-10');
      expect(d).toBeInstanceOf(Date);
      expect(d.getFullYear()).toBe(2026);
    });
    it('retorna null para inválido', () => {
      expect(fromIsoDate('xx')).toBeNull();
    });
  });

  describe('exibição pt-BR', () => {
    it('toBrDate', () => {
      expect(toBrDate('2026-09-10')).toBe('10/09/2026');
      expect(toBrDate('')).toBe('');
    });
    it('toBrDateTime', () => {
      expect(toBrDateTime('2026-09-10T08:05:00')).toBe('10/09/2026 08:05');
    });
  });

  describe('brDateToIso', () => {
    it('converte DD/MM/YYYY em YYYY-MM-DD', () => {
      expect(brDateToIso('10/09/2026')).toBe('2026-09-10');
    });
    it('rejeita formato inválido', () => {
      expect(brDateToIso('2026-09-10')).toBeNull();
      expect(brDateToIso('32/13/2026')).toBeNull();
    });
  });

  describe('regras de data', () => {
    it('isPastDate', () => {
      expect(isPastDate('1990-01-01')).toBe(true);
      expect(isPastDate('2999-01-01')).toBe(false);
    });
    it('isTodayOrFuture', () => {
      expect(isTodayOrFuture('2999-01-01')).toBe(true);
      expect(isTodayOrFuture('1990-01-01')).toBe(false);
    });
  });
});
