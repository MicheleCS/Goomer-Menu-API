import { DayOfWeek } from '../shared/enums/dayOfWeek.js';

export function getCurrentDayOfWeek(): DayOfWeek {
  const dayIndex = new Date().getDay();

  switch (dayIndex) {
    case 0:
      return DayOfWeek.DOMINGO;
    case 1:
      return DayOfWeek.SEGUNDA;
    case 2:
      return DayOfWeek.TERCA;
    case 3:
      return DayOfWeek.QUARTA;
    case 4:
      return DayOfWeek.QUINTA;
    case 5:
      return DayOfWeek.SEXTA;
    case 6:
      return DayOfWeek.SABADO;
    default:
      throw new Error('Dia da semana inválido.');
  }
}

export function getCurrentTime(): string {
  const now = new Date();
  const timeString = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return timeString;
}
