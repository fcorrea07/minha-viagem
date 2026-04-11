import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedBudget } from '../data/seedData'
import type { BudgetCategory, BudgetData, Expense } from '../types'

const CATEGORIES: BudgetCategory[] = [
  'Hospedagem',
  'Alimentação',
  'Transporte',
  'Atrações',
  'Compras',
  'Outros',
]

const CAT_COLORS: Record<BudgetCategory, string> = {
  Hospedagem: '#4A6FA5',
  Alimentação: '#C0714F',
  Transporte: '#2C7A4B',
  Atrações: '#9B59B6',
  Compras: '#E8A838',
  Outros: '#888888',
}

function fmt(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

interface ExpenseFormData {
  description: string
  category: BudgetCategory
  amount: string
  date: string
}

const EMPTY_FORM: ExpenseFormData = {
  description: '',
  category: 'Alimentação',
  amount: '',
  date: new Date().toISOString().split('T')[0],
}

interface CategoryData {
  name: BudgetCategory
  value: number
  color: string
}

export default function Budget() {
  const [budget, setBudget] = useLocalStorage<BudgetData>('travel_budget', seedBudget)
  const [showForm, setShowForm] = useState(false)
  const [editBudget, setEditBudget] = useState(false)
  const [form, setForm] = useState<ExpenseFormData>(EMPTY_FORM)
  const [tempTotal, setTempTotal] = useState(() => String(budget.totalBudget))
  const [tempRate, setTempRate] = useState(() => String(budget.brlRate))

  const expenses = budget.expenses ?? []
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = budget.totalBudget - totalSpent
  const pctUsed = budget.totalBudget
    ? Math.min(100, Math.round((totalSpent / budget.totalBudget) * 100))
    : 0

  const byCategory: CategoryData[] = CATEGORIES.map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
    color: CAT_COLORS[cat],
  })).filter(c => c.value > 0)

  function updateField(key: keyof ExpenseFormData, val: string): void {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function addExpense(): void {
    if (!form.description.trim() || !form.amount) return
    const newExpense: Expense = {
      id: `e${Date.now()}`,
      description: form.description.trim(),
      category: form.category,
      amount: parseFloat(form.amount),
      date: form.date,
    }
    setBudget(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }))
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  function deleteExpense(id: string): void {
    setBudget(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }))
  }

  function openEditBudget(): void {
    setTempTotal(String(budget.totalBudget))
    setTempRate(String(budget.brlRate))
    setEditBudget(!editBudget)
  }

  function saveBudgetSettings(): void {
    setBudget(prev => ({
      ...prev,
      totalBudget: parseFloat(tempTotal) || 0,
      brlRate: parseFloat(tempRate) || 1,
    }))
    setEditBudget(false)
  }

  const barColor = pctUsed >= 100 ? 'bg-red-500' : pctUsed >= 80 ? 'bg-yellow-500' : 'bg-terra'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Gastos</h2>
          <p className="text-sm text-gray-400 mt-0.5">Valores em EUR</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-terra text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Gasto
        </button>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-sand p-5 mb-5">
        <div className="flex items-start justify-between mb-5">
          <h3 className="font-semibold text-ink">Resumo do orçamento</h3>
          <button onClick={openEditBudget} className="text-xs text-terra hover:underline">
            ✏️ Editar
          </button>
        </div>

        {editBudget && (
          <div className="flex flex-wrap gap-3 mb-5 p-4 bg-cream rounded-xl">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Orçamento total (€)</label>
              <input
                type="number"
                value={tempTotal}
                onChange={e => setTempTotal(e.target.value)}
                className="border border-sand rounded-lg px-3 py-2 text-sm w-36 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Taxa EUR → BRL</label>
              <input
                type="number"
                step="0.01"
                value={tempRate}
                onChange={e => setTempRate(e.target.value)}
                className="border border-sand rounded-lg px-3 py-2 text-sm w-28 bg-white"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={saveBudgetSettings}
                className="px-4 py-2 bg-terra text-white rounded-lg text-sm"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditBudget(false)}
                className="px-3 py-2 text-gray-500 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Numbers */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <p className="text-xs text-gray-400 mb-1">Orçamento</p>
            <p className="text-xl font-bold text-ink">€ {fmt(budget.totalBudget)}</p>
            <p className="text-xs text-gray-400">R$ {fmt(budget.totalBudget * budget.brlRate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Gasto</p>
            <p className="text-xl font-bold text-terra">€ {fmt(totalSpent)}</p>
            <p className="text-xs text-gray-400">R$ {fmt(totalSpent * budget.brlRate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Saldo</p>
            <p className={`text-xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {remaining < 0 ? '-' : ''}€ {fmt(Math.abs(remaining))}
            </p>
            <p className="text-xs text-gray-400">R$ {fmt(Math.abs(remaining) * budget.brlRate)}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-sand rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${pctUsed}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-right">{pctUsed}% utilizado</p>
      </div>

      {/* Add expense form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-sand p-5 mb-5">
          <h4 className="text-sm font-medium text-ink mb-4">Novo gasto</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Descrição</label>
              <input
                type="text"
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Ex: Jantar em Roma"
                autoFocus
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Categoria</label>
              <select
                value={form.category}
                onChange={e => updateField('category', e.target.value)}
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Valor (€)</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={e => updateField('amount', e.target.value)}
                placeholder="0.00"
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Data</label>
              <input
                type="date"
                value={form.date}
                onChange={e => updateField('date', e.target.value)}
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addExpense}
              className="px-4 py-2 bg-terra text-white rounded-lg text-sm"
            >
              Salvar
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-500 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Pie chart + breakdown */}
      {byCategory.length > 0 && (
        <div className="bg-white rounded-2xl border border-sand p-5 mb-5">
          <h3 className="font-semibold text-ink mb-4">Por categoria</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-64 shrink-0">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={byCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {byCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `€ ${fmt(v)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2.5">
              {byCategory.map(cat => (
                <div key={cat.name} className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-600 flex-1">{cat.name}</span>
                  <span className="text-sm font-semibold text-ink tabular-nums">
                    € {fmt(cat.value)}
                  </span>
                  <span className="text-xs text-gray-400 w-10 text-right tabular-nums">
                    {Math.round((cat.value / totalSpent) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expense list */}
      <div className="space-y-2">
        {[...expenses]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map(expense => (
            <div
              key={expense.id}
              className="bg-white rounded-2xl border border-sand px-4 py-3 flex items-center gap-3"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CAT_COLORS[expense.category] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{expense.description}</p>
                <p className="text-xs text-gray-400">
                  {expense.category} ·{' '}
                  {new Date(expense.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-ink tabular-nums">
                  € {fmt(expense.amount)}
                </p>
                <p className="text-xs text-gray-400 tabular-nums">
                  R$ {fmt(expense.amount * budget.brlRate)}
                </p>
              </div>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 text-xs shrink-0 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}

        {expenses.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">💶</p>
            <p className="font-medium">Nenhum gasto registrado</p>
            <p className="text-sm mt-1">Adicione suas despesas para acompanhar o orçamento</p>
          </div>
        )}
      </div>
    </div>
  )
}
