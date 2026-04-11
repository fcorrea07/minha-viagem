import { useState } from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedChecklist } from '../data/seedData'
import type { ChecklistGroup } from '../types'

interface EditingNote {
  groupId: string
  itemId: string
}

export default function Checklist() {
  const [groups, setGroups] = useLocalStorage<ChecklistGroup[]>('travel_checklist', seedChecklist)
  const [editingNote, setEditingNote] = useState<EditingNote | null>(null)

  const allItems = groups.flatMap(g => g.items)
  const doneCount = allItems.filter(i => i.done).length
  const progress = allItems.length ? Math.round((doneCount / allItems.length) * 100) : 0

  function toggleItem(groupId: string, itemId: string): void {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, items: g.items.map(i => (i.id === itemId ? { ...i, done: !i.done } : i)) }
          : g
      )
    )
  }

  function updateNote(groupId: string, itemId: string, note: string): void {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, items: g.items.map(i => (i.id === itemId ? { ...i, note } : i)) }
          : g
      )
    )
  }

  const progressColor =
    progress === 100 ? 'bg-green-500' : progress >= 60 ? 'bg-terra' : 'bg-slate'

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">Checklist</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {doneCount} de {allItems.length} itens concluídos
        </p>
      </div>

      {/* Progress card */}
      <div className="bg-white rounded-2xl border border-sand p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-ink">Progresso geral</span>
          <span className={`text-2xl font-bold ${progress === 100 ? 'text-green-500' : 'text-terra'}`}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-sand rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-sm text-green-600 font-medium mt-3 text-center">
            🎉 Tudo pronto para a viagem!
          </p>
        )}
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {groups.map(group => {
          const groupDone = group.items.filter(i => i.done).length
          const groupTotal = group.items.length

          return (
            <div key={group.id} className="bg-white rounded-2xl border border-sand overflow-hidden">
              {/* Group header */}
              <div className="px-5 py-4 border-b border-sand flex items-center justify-between">
                <h3 className="font-semibold text-ink">{group.group}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-sand rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 bg-terra rounded-full transition-all duration-500"
                      style={{ width: groupTotal ? `${(groupDone / groupTotal) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 tabular-nums">
                    {groupDone}/{groupTotal}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-sand/60">
                {group.items.map(item => {
                  const isEditingNote =
                    editingNote?.groupId === group.id && editingNote?.itemId === item.id

                  return (
                    <div key={item.id} className="px-5 py-3.5">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleItem(group.id, item.id)}
                          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                            item.done
                              ? 'bg-terra border-terra text-white'
                              : 'border-gray-300 hover:border-terra'
                          }`}
                          aria-label={item.done ? 'Desmarcar' : 'Marcar como feito'}
                        >
                          {item.done && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-relaxed transition-colors ${
                              item.done ? 'line-through text-gray-400' : 'text-ink'
                            }`}
                          >
                            {item.text}
                          </p>

                          {/* Note */}
                          {isEditingNote ? (
                            <input
                              type="text"
                              value={item.note}
                              onChange={e => updateNote(group.id, item.id, e.target.value)}
                              onBlur={() => setEditingNote(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingNote(null)}
                              placeholder="Adicionar nota..."
                              autoFocus
                              className="mt-1.5 w-full text-xs border-b border-sand focus:border-terra outline-none text-gray-500 py-0.5 bg-transparent"
                            />
                          ) : (
                            <button
                              onClick={() => setEditingNote({ groupId: group.id, itemId: item.id })}
                              className="mt-1 text-xs text-gray-400 hover:text-terra transition-colors"
                            >
                              {item.note ? (
                                <span className="italic">{item.note}</span>
                              ) : (
                                '+ nota'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
