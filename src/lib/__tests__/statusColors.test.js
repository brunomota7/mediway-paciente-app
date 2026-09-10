import { consultationExamStatusColor, isUpcomingStatus } from '../statusColors';

describe('lib/statusColors', () => {
  it('consultationExamStatusColor: cor por status + fallback', () => {
    expect(consultationExamStatusColor('MARCADO')).toBe('#4caf50');
    expect(consultationExamStatusColor('CANCELADO')).toBe('#9e9e9e');
    expect(consultationExamStatusColor('DESCONHECIDO')).toBe('#9e9e9e');
  });

  it('isUpcomingStatus: só MARCADO e REMARCADO', () => {
    expect(isUpcomingStatus('MARCADO')).toBe(true);
    expect(isUpcomingStatus('REMARCADO')).toBe(true);
    expect(isUpcomingStatus('REALIZADO')).toBe(false);
    expect(isUpcomingStatus('CANCELADO')).toBe(false);
    expect(isUpcomingStatus(null)).toBe(false);
  });
});
