// ── Roteiro ──────────────────────────────────────────────────────────────────

export type ActivityStatus = 'planejado' | 'confirmado' | 'concluído'

export interface Activity {
  id: string
  time: string
  name: string
  status: ActivityStatus
}

export interface ItineraryDay {
  id: string
  date: string
  city: string
  country: string
  flag: string
  activities: Activity[]
}

// ── Lugares ───────────────────────────────────────────────────────────────────

export type PlaceCategory = 'Museus' | 'Restaurantes' | 'Monumentos' | 'Experiências'
export type PlaceStatus = 'quero ir' | 'confirmado' | 'visitado'

export interface Place {
  id: string
  name: string
  city: string
  category: PlaceCategory
  status: PlaceStatus
  note: string
  lat: number | null
  lng: number | null
}

// ── Checklist ─────────────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
  note: string
}

export interface ChecklistGroup {
  id: string
  group: string
  items: ChecklistItem[]
}

// ── Gastos ────────────────────────────────────────────────────────────────────

export type BudgetCategory =
  | 'Hospedagem'
  | 'Alimentação'
  | 'Transporte'
  | 'Atrações'
  | 'Compras'
  | 'Outros'

export interface Expense {
  id: string
  description: string
  category: BudgetCategory
  amount: number
  date: string
}

export interface BudgetData {
  totalBudget: number
  brlRate: number
  expenses: Expense[]
}
