import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ApartmentModal from './ApartmentModal';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const getColor = (status) => ({
  unvisited: '#9CA3AF',  // gray
  visited:   '#FCD34D',  // yellow
  engaged:   '#34D399',  // green
}[status] || '#9CA3AF');

// Sample data — later this will come from your backend API
const sampleLocations = [
  { id: 1, type: 'house',    lat: 29.7604, lng: -95.5698, address: '123 Maple St',    status: 'engaged',   notes: '' },
  { id: 2, type: 'house',    lat: 29.7614, lng: -95.5678, address: '456 Oak Ave',     status: 'visited',   notes: '' },
  { id: 3, type: 'house',    lat: 29.7594, lng: -95.5658, address: '789 Pine Rd',     status: 'unvisited', notes: '' },
  { id: 4, type: 'apartment',lat: 29.7624, lng: -95.5718, address: 'Sunset Apts',     status: 'visited',   notes: '',
    units: [
      { unit_number: '1A', status: 'engaged' },
      { unit_number: '1B', status: 'visited' },
      { unit_number: '1C', status: 'unvisited' },
      { unit_number: '2A', status: 'unvisited' },
      { unit_number: '2B', status: 'engaged' },
      { unit_number: '2C', status: 'visited' },
    ]
  },
];

export default function OutreachMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [locations, setLocations] = useState(sampleLocations);

  useEffect(() => {
    if (map.current) return; // only initialize once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-95.5698, 29.7604], // SW Harris County
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      addMarkersToMap(locations);
    });
  }, []);

  const addMarkersToMap = (locs) => {
    locs.forEach((loc) => {
      // Create the marker element
      const el = document.createElement('div');
      el.style.cssText = `
        width: 28px;
        height: 28px;
        background: ${getColor(loc.status)};
        border-radius: ${loc.type === 'apartment' ? '4px' : '50% 50% 50% 0'};
        transform: ${loc.type === 'house' ? 'rotate(-45deg)' : 'none'};
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        cursor: pointer;
        transition: transform 0.15s;
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = loc.type === 'house'
          ? 'rotate(-45deg) scale(1.3)'
          : 'scale(1.3)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = loc.type === 'house'
          ? 'rotate(-45deg)'
          : 'scale(1)';
      });

      el.addEventListener('click', () => {
        if (loc.type === 'apartment') {
          setSelectedApartment(loc);
        } else {
          setSelectedHouse(loc);
        }
      });

      new mapboxgl.Marker(el)
        .setLngLat([loc.lng, loc.lat])
        .addTo(map.current);
    });
  };

  // Update a house's status and notes
  const updateLocation = (id, changes) => {
    setLocations(prev =>
      prev.map(loc => loc.id === id ? { ...loc, ...changes } : loc)
    );
    // TODO: call your backend API here to persist the change
    // axios.put(`/api/locations/${id}`, changes)
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>

      {/* The map */}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 32, left: 16,
        background: 'white', borderRadius: 10, padding: '12px 18px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', gap: 8
      }}>
        {[
          { label: 'Engaged',   color: '#34D399' },
          { label: 'Visited',   color: '#FCD34D' },
          { label: 'Unvisited', color: '#9CA3AF' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* House detail panel */}
      {selectedHouse && (
        <HousePanel
          house={selectedHouse}
          onClose={() => setSelectedHouse(null)}
          onUpdate={updateLocation}
        />
      )}

      {/* Apartment modal */}
      {selectedApartment && (
        <ApartmentModal
          apartment={selectedApartment}
          onClose={() => setSelectedApartment(null)}
          onUpdate={updateLocation}
          getColor={getColor}
        />
      )}
    </div>
  );
}

// ── HOUSE DETAIL PANEL ──
function HousePanel({ house, onClose, onUpdate }) {
  const [notes, setNotes] = useState(house.notes || '');
  const [status, setStatus] = useState(house.status);

  const handleSave = () => {
    onUpdate(house.id, { notes, status });
    onClose();
  };

  return (
    <div style={{
      position: 'absolute', top: 20, right: 20,
      background: 'white', borderRadius: 12, padding: 24,
      width: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{house.address}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
      </div>

      {/* Status selector */}
      <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 6 }}>STATUS</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['unvisited', 'visited', 'engaged'].map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              flex: 1, padding: '6px 4px', borderRadius: 6, border: 'none',
              fontSize: 11, cursor: 'pointer', fontWeight: 500,
              background: status === s ? {
                unvisited: '#9CA3AF', visited: '#FCD34D', engaged: '#34D399'
              }[s] : '#F3F4F6',
              color: status === s ? 'white' : '#6B7280',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Notes */}
      <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 6 }}>NOTES</label>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="e.g. Family with two kids, interested in children's classes, best to visit evenings..."
        style={{
          width: '100%', height: 100, borderRadius: 8, border: '1px solid #E5E7EB',
          padding: 10, fontSize: 13, resize: 'none', fontFamily: 'inherit',
          marginBottom: 16
        }}
      />

      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: '10px', borderRadius: 8,
          background: '#1A6B5A', color: 'white', border: 'none',
          fontSize: 14, fontWeight: 500, cursor: 'pointer'
        }}
      >
        Save
      </button>
    </div>
  );
}