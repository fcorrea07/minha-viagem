import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedPlaces } from '../data/seedData'

// Cores por categoria
const CAT_COLORS = {
  Museus:       '#4A6FA5',
  Restaurantes: '#C0714F',
  Monumentos:   '#2C7A4B',
  Experiências: '#9B59B6',
}

const STATUS_STYLE = {
  'quero ir':  'bg-yellow-100 text-yellow-700',
  confirmado:  'bg-blue-100 text-blue-700',
  visitado:    'bg-green-100 text-green-700',
}

const CITIES      = ['Todas', 'Roma', 'Florença', 'Veneza', 'Barcelona']
const CATEGORIES  = ['Todas', 'Museus', 'Restaurantes', 'Monumentos', 'Experiências']

// Ícone colorido (dot) para o mapa
const dotIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;background:${color};border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })

// Ajusta o mapa ao bounding box dos marcadores visíveis
function FitBounds({ places }) {
  const map = useMap()
  useEffect(() => {
    if (places.length === 0) return
    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }, [places, map])
  return null
}

const EMPTY_FORM = {
  name: '', city: 'Roma', category: 'Monumentos',
  note: '', status: 'quero ir', lat: '', lng: '',
}

export default function Places() {
  const [places, setPlaces]           = useLocalStorage('travel_places', seedPlaces)
  const [filterCity, setFilterCity]   = useState('Todas')
  const [filterCat, setFilterCat]     = useState('Todas')
  const [showMap, setShowMap]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [editingId, setEditingId]     = useState(null)
  const [isOffline, setIsOffline]     = useState(!navigator.onLine)
  const [form, setForm]               = useState(EMPTY_FORM)

  useEffect(() => {
    const on  = () => setIsOffline(false)
    const off = () => setIsOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const filtered   = places.filter((p) => {
    const c = filterCity === 'Todas' || p.city === filterCity
    const k = filterCat  === 'Todas' || p.category === filterCat
    return c && k
  })
  const mapPlaces  = filtered.filter((p) => p.lat && p.lng)

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (place) => {
    setForm({
      name: place.name, city: place.city, category: place.category,
      note: place.note, status: place.status,
      lat: place.lat ?? '', lng: place.lng ?? '',
    })
    setEditingId(place.id)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    const lat = parseFloat(form.lat) || null
    const lng = parseFloat(form.lng) || null
    if (editingId) {
      setPlaces(places.map((p) =>
        p.id === editingId ? { ...p, ...form, name: form.name.trim(), lat, lng } : p
      ))
    } else {
      setPlaces([...places, { id: `p${Date.now()}`, ...form, name: form.name.trim(), lat, lng }])
    }
    setShowForm(false)
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Remover este lugar?')) {
      setPlaces(places.filter((p) => p.id !== id))
    }
  }

  const updateStatus = (id, status) =>
    setPlaces(places.map((p) => (p.id === id ? { ...p, status } : p)))

  const f = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Lugares</h2>
          <p className="text-sm text-gray-400 mt-0.5">{places.length} lugares salvos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMap(!showMap)}
            className={`px-3 py-2 text-sm rounded-xl border transition-colors ${
              showMap ? 'bg-slate text-white border-slate' : 'bg-white text-gray-500 border-sand'
            }`}
          >
            🗺️ Mapa
          </button>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-terra text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + Lugar
          </button>
        </div>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-sand p-5 mb-5">
          <h4 className="text-sm font-medium text-ink mb-4">
            {editingId ? 'Editar lugar' : 'Novo lugar'}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Nome</label>
              <input
                type="text" value={form.name} onChange={(e) => f('name', e.target.value)}
                placeholder="Ex: Coliseu" autoFocus
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Cidade</label>
              <select value={form.city} onChange={(e) => f('city', e.target.value)}
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm bg-white">
                {['Roma', 'Florença', 'Veneza', 'Barcelona'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Categoria</label>
              <select value={form.category} onChange={(e) => f('category', e.target.value)}
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm bg-white">
                {CATEGORIES.slice(1).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Status</label>
              <select value={form.status} onChange={(e) => f('status', e.target.value)}
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm bg-white">
                <option value="quero ir">Quero ir</option>
                <option value="confirmado">Confirmado</option>
                <option value="visitado">Visitado</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Lat / Lng{' '}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <div className="flex gap-1">
                <input type="number" step="any" value={form.lat}
                  onChange={(e) => f('lat', e.target.value)}
                  placeholder="Lat" className="w-full border border-sand rounded-lg px-2 py-2 text-sm bg-white" />
                <input type="number" step="any" value={form.lng}
                  onChange={(e) => f('lng', e.target.value)}
                  placeholder="Lng" className="w-full border border-sand rounded-lg px-2 py-2 text-sm bg-white" />
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Nota pessoal</label>
              <input type="text" value={form.note} onChange={(e) => f('note', e.target.value)}
                placeholder="Dicas, observações..."
                className="w-full border border-sand rounded-lg px-3 py-2 text-sm bg-white" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave}
              className="px-4 py-2 bg-terra text-white rounded-lg text-sm">
              Salvar
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-500 text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex gap-0.5 bg-white border border-sand rounded-xl p-1">
          {CITIES.map((city) => (
            <button key={city} onClick={() => setFilterCity(city)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                filterCity === city ? 'bg-sand text-ink font-medium' : 'text-gray-500 hover:text-ink'
              }`}>
              {city}
            </button>
          ))}
        </div>
        <div className="flex gap-0.5 bg-white border border-sand rounded-xl p-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                filterCat === cat ? 'bg-sand text-ink font-medium' : 'text-gray-500 hover:text-ink'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      {showMap && (
        <div className="mb-5 relative">
          {isOffline && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-sand/90 rounded-2xl">
              <div className="text-center p-8">
                <span className="text-4xl block mb-2">📡</span>
                <p className="font-medium text-ink">Sem conexão</p>
                <p className="text-sm text-gray-500 mt-1">
                  O mapa fica disponível quando você estiver online
                </p>
              </div>
            </div>
          )}
          <MapContainer
            center={[44.0, 10.5]}
            zoom={5}
            style={{ height: '380px', width: '100%' }}
            className="rounded-2xl border border-sand"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={dotIcon(CAT_COLORS[place.category] || '#888')}
              >
                <Popup>
                  <div className="text-sm leading-snug">
                    <p className="font-semibold">{place.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {place.city} · {place.category}
                    </p>
                    {place.note && (
                      <p className="mt-1.5 text-gray-600 italic text-xs">{place.note}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            {mapPlaces.length > 0 && <FitBounds places={mapPlaces} />}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 z-[400] bg-white rounded-xl border border-sand px-3 py-2 text-xs space-y-1.5 shadow-sm">
            {Object.entries(CAT_COLORS).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-gray-600">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {filtered.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-2xl border border-sand p-4 flex items-start gap-3"
          >
            <div
              className="w-3 h-3 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: CAT_COLORS[place.category] || '#888' }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <p className="font-medium text-ink text-sm">{place.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {place.city} · {place.category}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={place.status}
                    onChange={(e) => updateStatus(place.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_STYLE[place.status]}`}
                  >
                    <option value="quero ir">Quero ir</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="visitado">Visitado</option>
                  </select>
                  <button
                    onClick={() => openEdit(place)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-ink hover:bg-gray-50 text-xs transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(place.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              {place.note && (
                <p className="text-xs text-gray-500 mt-1.5 italic leading-relaxed">
                  {place.note}
                </p>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📍</p>
            <p className="font-medium">Nenhum lugar encontrado</p>
            <p className="text-sm mt-1">Ajuste os filtros ou adicione um novo lugar</p>
          </div>
        )}
      </div>
    </div>
  )
}
