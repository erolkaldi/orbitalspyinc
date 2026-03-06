// 1 gerçek dakika = 1 oyun saati
// gameDate her 2 dakikada bir 2 saat ileri gider

export function advanceGameDate(currentDate: Date, realMinutes: number): Date {
  const newDate = new Date(currentDate)
  newDate.setHours(newDate.getHours() + realMinutes)
  return newDate
}

export function formatGameDate(date: Date): string {
  return date.toUTCString().slice(0, 22).toUpperCase()
}