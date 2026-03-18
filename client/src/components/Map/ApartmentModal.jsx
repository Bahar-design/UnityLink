import { useState } from 'react';

export default function ApartmentModal({ apartment, onClose, onUpdate, getColor }) {
  const [units, setUnits] = useState(apartment.units);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [notes, setNotes] = useState('');

  const updateUnit = (unitNumber, newStatus) => {
    setUnits(prev =>
      prev.map(u => u.unit_number === unitNumber ? { ...u, status: newStatus } : u)
    );
  };

  const handleSaveUnit = () => {
    // TODO: call backend API to persist unit status + notes
    setSelectedUnit(null);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 32,
        width: 480, maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{apartment.address}</h2>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
              {units.filter(u => u.status === 'engaged').length} engaged ·{' '}
              {units.filter(u => u.status === 'visited').length} visited ·{' '}
              {units.filter(u => u.status === 'unvisited').length} unvisited
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        </div>

        {/* Unit grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10, marginBottom: 24
        }}>
          {units.map(unit => (
            <div
              key={unit.unit_number}
              onClick={() => setSelectedUnit(unit)}
              style={{
                background: getColor(unit.status),
                borderRadius: 8, padding: '12px 6px',
                textAlign: 'center', cursor: 'pointer',
                color: 'white', fontWeight: 600, fontSize: 13,
                boxShadow: selectedUnit?.unit_number === unit.unit_number
                  ? '0 0 0 3px #1A6B5A' : 'none',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {unit.unit_number}
            </div>
          ))}
        </div>

        {/* Unit detail — shows when a unit is selected */}
        {selectedUnit && (
          <div style={{
            background: '#F9FAFB', borderRadius: 10, padding: 16,
            border: '1px solid #E5E7EB'
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              Unit {selectedUnit.unit_number}
            </h4>

            {/* Status buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {['unvisited', 'visited', 'engaged'].map(s => (
                <button
                  key={s}
                  onClick={() => updateUnit(selectedUnit.unit_number, s)}
                  style={{
                    flex: 1, padding: '6px 4px', borderRadius: 6, border: 'none',
                    fontSize: 11, cursor: 'pointer', fontWeight: 500,
                    background: selectedUnit.status === s ? getColor(s) : '#E5E7EB',
                    color: selectedUnit.status === s ? 'white' : '#6B7280',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes about this unit..."
              style={{
                width: '100%', height: 80, borderRadius: 8,
                border: '1px solid #E5E7EB', padding: 10,
                fontSize: 13, resize: 'none', fontFamily: 'inherit',
                marginBottom: 10
              }}
            />

            <button
              onClick={handleSaveUnit}
              style={{
                width: '100%', padding: 10, borderRadius: 8,
                background: '#1A6B5A', color: 'white',
                border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer'
              }}
            >
              Save Unit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}