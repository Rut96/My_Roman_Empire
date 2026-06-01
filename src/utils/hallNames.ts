const HALL_NAMES: Record<string, string> = {
  kindergarten: 'Садик',
  truancy:      'Прогулы',
  garden:       'Сад мечты',
  sport:        'Спортзал',
  final:        'Финал',
}

export function getHallName(activeRoom: string | null): string {
  if (!activeRoom) return 'Главный зал'
  return HALL_NAMES[activeRoom] ?? 'Главный зал'
}
