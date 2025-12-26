import React from 'react';

export default function LocationInput({ index, data, onChange, onRemove, showRemove }) {
    return (
        <div className="row" style={{ alignItems: 'flex-end', marginBottom: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px' }}>
            <div className="col" style={{ flex: 2 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Nama Ruang / Lokasi</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Gudang A"
                    value={data.room_name}
                    onChange={(e) => onChange(index, 'room_name', e.target.value)}
                />
            </div>
            <div className="col" style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Jumlah</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={data.quantity}
                    onChange={(e) => onChange(index, 'quantity', e.target.value)}
                />
            </div>
            <div className="col" style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Satuan</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Pcs/Unit"
                    value={data.unit}
                    onChange={(e) => onChange(index, 'unit', e.target.value)}
                />
            </div>
            {showRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="btn btn-danger-ghost"
                    title="Hapus Baris"
                    style={{ marginBottom: '4px' }}
                >
                    ✕
                </button>
            )}
        </div>
    );
}
