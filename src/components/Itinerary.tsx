import { useState } from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedItinerary } from '../data/seedData'
import type { Activity, ActivityStatus, ItineraryDay } from '../types'

const STATUS_STYLE: Record<ActivityStatus, string> = {
  planejado: 'bg-gray-100 text-gray-600',
  confirmado: 'bg-blue-100 text-blue-700',
  concluído: 'bg-green-100 text-green-700',
}

const STATUS_LABEL: Record<ActivityStatus, string> = {
  planejado: 'Planejado',
  confirmado: 'Confirmado',
  concluído: 'Concluído',
}

// ── ActivityForm ──────────────────────────────────────────────────────────────

interface ActivityFormProps {
  initial?: Partial<Omit<Activity, 'id'>>
  onSave: (activity: Omit<Activity, 'id'>) => void
  onCancel: () => void
}

function ActivityForm({ initial = {}, onSave, onCancel }: ActivityFormProps) {
  const [time, setTime] = useState(initial.time ?? '')
  const [name, setName] = useState(initial.name ?? '')
  const [status, setStatus] = useState<ActivityStatus>(initial.status ?? 'planejado')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ time, name: name.trim(), status })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-3 bg-gray-50 rounded-xl space-y-2">
      <div className="flex gap-2">
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="border border-sand rounded-lg px-3 py-2 text-sm w-28 bg-white"
        />
        <input
          type="text"
          placeholder="Nome da atividade"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-sand rounded-lg px-3 py-2 text-sm flex-1 bg-white"
          required
          autoFocus
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={e => setStatus(e.target.value as ActivityStatus)}
          className="border border-sand rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="planejado">Planejado</option>
          <option value="confirmado">Confirmado</option>
          <option value="concluído">Concluído</option>
        </select>
        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-500 hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-sm bg-terra text-white rounded-lg hover:opacity-90"
          >
            Salvar
          </button>
        </div>
      </div>
    </form>
  )
}

// ── DayCard ───────────────────────────────────────────────────────────────────

interface DayCardProps {
  day: ItineraryDay
  onUpdateDay: (day: ItineraryDay) => void
  onDeleteDay: (id: string) => void
}

function DayCard({ day, onUpdateDay, onDeleteDay }: DayCardProps) {
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [editingActivityId, setEditingActivity] = useState<string | null>(null)
  const [editingDay, setEditingDay] = useState(false)
  const [dayCity, setDayCity] = useState(day.city)
  const [dayDate, setDayDate] = useState(day.date)

  function addActivity(activity: Omit<Activity, 'id'>): void {
    const newAct: Activity = { id: `a${Date.now()}`, ...activity }
    onUpdateDay({ ...day, activities: [...day.activities, newAct] })
    setShowAddActivity(false)
  }

  function updateActivity(id: string, updated: Omit<Activity, 'id'>): void {
    onUpdateDay({
      ...day,
      activities: day.activities.map(a => (a.id === id ? { ...a, ...updated } : a)),
    })
    setEditingActivity(null)
  }

  function deleteActivity(id: string): void {
    onUpdateDay({ ...day, activities: day.activities.filter(a => a.id !== id) })
  }

  function saveDay(): void {
    onUpdateDay({ ...day, city: dayCity, date: dayDate })
    setEditingDay(false)
  }

  const formattedDate = new Date(day.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })

  const sorted = [...day.activities].sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="bg-white rounded-2xl border border-sand p-5 mb-4">
      {/* Day header */}
      {editingDay ? (
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="date"
            value={dayDate}
            onChange={e => setDayDate(e.target.value)}
            className="border border-sand rounded-lg px-3 py-2 text-sm bg-white"
          />
          <input
            type="text"
            value={dayCity}
            onChange={e => setDayCity(e.target.value)}
            className="border border-sand rounded-lg px-3 py-2 text-sm flex-1 min-w-28 bg-white"
            placeholder="Cidade"
          />
          <button onClick={saveDay} className="px-4 py-2 text-sm bg-terra text-white rounded-lg">
            OK
          </button>
          <button
            onClick={() => setEditingDay(false)}
            className="px-3 py-2 text-sm text-gray-500"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 capitalize">{formattedDate}</p>
            <h3 className="text-lg font-semibold text-ink mt-0.5">
              {day.flag} {day.city}
            </h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setEditingDay(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-ink hover:bg-gray-50 transition-colors text-sm"
              title="Editar dia"
            >
              ✏️
            </button>
            <button
              onClick={() => onDeleteDay(day.id)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors text-sm"
              title="Remover dia"
            >
              🗑️
            </button>
          </div>
        </div>
      )}

      {/* Activities */}
      <div className="space-y-2">
        {sorted.map(act =>
          editingActivityId === act.id ? (
            <ActivityForm
              key={act.id}
              initial={act}
              onSave={updated => updateActivity(act.id, updated)}
              onCancel={() => setEditingActivity(null)}
            />
          ) : (
            <div key={act.id} className="flex items-center gap-3 group py-0.5">
              <span className="text-xs font-mono text-gray-400 w-11 shrink-0">
                {act.time || '--:--'}
              </span>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-sm text-ink truncate">{act.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[act.status]}`}
                >
                  {STATUS_LABEL[act.status]}
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity shrink-0">
                <button
                  onClick={() => setEditingActivity(act.id)}
                  className="p-1 text-gray-400 hover:text-ink text-xs rounded"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteActivity(act.id)}
                  className="p-1 text-gray-400 hover:text-red-500 text-xs rounded"
                >
                  ✕
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Add activity */}
      {showAddActivity ? (
        <ActivityForm onSave={addActivity} onCancel={() => setShowAddActivity(false)} />
      ) : (
        <button
          onClick={() => setShowAddActivity(true)}
          className="mt-4 text-sm text-terra hover:opacity-80 flex items-center gap-1 transition-opacity"
        >
          <span className="text-lg leading-none">+</span>
          <span>Adicionar atividade</span>
        </button>
      )}
    </div>
  )
}

// ── Itinerary ─────────────────────────────────────────────────────────────────

type CountryKey = 'Itália' | 'Espanha'

const FLAG_MAP: Record<CountryKey, string> = { Itália: '🇮🇹', Espanha: '🇪🇸' }
const COUNTRY_ORDER: CountryKey[] = ['Itália', 'Espanha']

export default function Itinerary() {
  const [days, setDays] = useLocalStorage<ItineraryDay[]>('travel_itinerary', seedItinerary)
  const [showAddDay, setShowAddDay] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newCountry, setNewCountry] = useState<CountryKey>('Itália')

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))

  const grouped = sorted.reduce<Record<string, ItineraryDay[]>>((acc, day) => {
    const key = day.country || 'Outros'
    acc[key] = acc[key] ? [...acc[key], day] : [day]
    return acc
  }, {})

  const orderedKeys = Object.keys(grouped).sort(
    (a, b) => COUNTRY_ORDER.indexOf(a as CountryKey) - COUNTRY_ORDER.indexOf(b as CountryKey)
  )

  function updateDay(updated: ItineraryDay): void {
    setDays(prev => prev.map(d => (d.id === updated.id ? updated : d)))
  }

  function deleteDay(id: string): void {
    if (window.confirm('Remover este dia do roteiro?')) {
      setDays(prev => prev.filter(d => d.id !== id))
    }
  }

  function addDay(): void {
    if (!newDate || !newCity.trim()) return
    const newDay: ItineraryDay = {
      id: `d${Date.now()}`,
      date: newDate,
      city: newCity.trim(),
      country: newCountry,
      flag: FLAG_MAP[newCountry] ?? '🌍',
      activities: [],
    }
    setDays(prev => [...prev, newDay])
    setNewDate('')
    setNewCity('')
    setShowAddDay(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Roteiro</h2>
          <p className="text-sm text-gray-400 mt-0.5">{days.length} dias de viagem</p>
        </div>
        <button
          onClick={() => setShowAddDay(true)}
          className="px-4 py-2 bg-terra text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Novo dia
        </button>
      </div>

      {/* Add day form */}
      {showAddDay && (
        <div className="bg-white rounded-2xl border border-sand p-5 mb-5">
          <h4 className="text-sm font-medium text-ink mb-3">Adicionar novo dia</h4>
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="border border-sand rounded-lg px-3 py-2 text-sm bg-white"
            />
            <input
              type="text"
              placeholder="Cidade"
              value={newCity}
              onChange={e => setNewCity(e.target.value)}
              className="border border-sand rounded-lg px-3 py-2 text-sm flex-1 min-w-32 bg-white"
            />
            <select
              value={newCountry}
              onChange={e => setNewCountry(e.target.value as CountryKey)}
              className="border border-sand rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="Itália">🇮🇹 Itália</option>
              <option value="Espanha">🇪🇸 Espanha</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={addDay}
              className="px-4 py-2 bg-terra text-white rounded-lg text-sm"
            >
              Adicionar
            </button>
            <button
              onClick={() => setShowAddDay(false)}
              className="px-4 py-2 text-gray-500 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Days grouped by country */}
      {orderedKeys.map(country => (
        <div key={country} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-sand" />
            <span className="text-sm font-medium text-gray-400 px-1">{country}</span>
            <div className="h-px flex-1 bg-sand" />
          </div>
          {grouped[country].map(day => (
            <DayCard
              key={day.id}
              day={day}
              onUpdateDay={updateDay}
              onDeleteDay={deleteDay}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
