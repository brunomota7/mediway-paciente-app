import { isServerUnreachable, setServerUnreachable } from '../networkStatus';

afterEach(() => setServerUnreachable(false));

describe('networkStatus', () => {
  it('começa falso', () => {
    expect(isServerUnreachable()).toBe(false);
  });

  it('setServerUnreachable alterna o valor', () => {
    setServerUnreachable(true);
    expect(isServerUnreachable()).toBe(true);
    setServerUnreachable(false);
    expect(isServerUnreachable()).toBe(false);
  });

  it('setar o mesmo valor é idempotente', () => {
    setServerUnreachable(true);
    setServerUnreachable(true);
    expect(isServerUnreachable()).toBe(true);
  });

  it('normaliza para boolean', () => {
    setServerUnreachable('erro');
    expect(isServerUnreachable()).toBe(true);
    setServerUnreachable(0);
    expect(isServerUnreachable()).toBe(false);
  });
});
