import React, { useState, useEffect } from "react";
import LocationInput from "./LocationInput";
import { addAsset } from "../services/db";

export default function InputForm() {
    const [formData, setFormData] = useState({
        name: "", // 1
        instansi: "", // 2
        spk_no: "", // 3
        spk_date: "", // 4
        spk_description: "", // 5
        total_quantity: 0, // 6
        received_date: "", // 7
        unit_price: 0, // 8
        total_price: 0, // 9
        make_year: new Date().getFullYear(), // 10
        specifications: "", // 11
        vehicle_details: { nopol: "", rangka: "", mesin: "" }, // 12, 13, 14
        acquisition_type: "Pembelian", // 15
    });

    const [locations, setLocations] = useState([{ room_name: "", quantity: 0, unit: "unit" }]); // 16
    const [files, setFiles] = useState([]); // 17
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Auto-calculate Total Price
    useEffect(() => {
        const qty = parseFloat(formData.total_quantity) || 0;
        const price = parseFloat(formData.unit_price) || 0;
        setFormData(prev => ({ ...prev, total_price: qty * price }));
    }, [formData.total_quantity, formData.unit_price]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleVehicleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            vehicle_details: { ...prev.vehicle_details, [name]: value }
        }));
    }

    // Location Handlers
    function handleLocationChange(index, field, value) {
        const newLocs = [...locations];
        newLocs[index][field] = value;
        setLocations(newLocs);
    }

    function addLocation() {
        setLocations([...locations, { room_name: "", quantity: 0, unit: "unit" }]);
    }

    function removeLocation(index) {
        const newLocs = locations.filter((_, i) => i !== index);
        setLocations(newLocs);
    }

    function handleFileChange(e) {
        setFiles(Array.from(e.target.files));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            // Validate Total Quantity vs Location Quantities
            const totalLocQty = locations.reduce((sum, loc) => sum + (parseInt(loc.quantity) || 0), 0);
            if (totalLocQty !== parseInt(formData.total_quantity)) {
                if (!window.confirm(`Total lokasi (${totalLocQty}) tidak sama dengan Jumlah Barang (${formData.total_quantity}). Lanjutkan?`)) {
                    setLoading(false);
                    return;
                }
            }

            // Ensure dates are converted properly if needed by backend, 
            // but for now passing strings or Date objects as expected by addAsset
            await addAsset({ ...formData, locations }, files);

            setSuccessMsg("Data berhasil disimpan!");
            setTimeout(() => {
                setSuccessMsg("");
                window.scrollTo(0, 0);
            }, 3000);

        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan data.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="main-container">
            <div className="form-header">
                <h2>Form Input Barang</h2>
                <p>Sistem Informasi Aset Pemerintah (SIAP)</p>
            </div>

            <form className="form-body" onSubmit={handleSubmit}>
                {successMsg && <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{successMsg}</div>}

                {/* Section 1: Data Identitas (1-5) */}
                <div className="form-section">
                    <div className="section-title">� Data Identitas & SPK</div>

                    {/* Row: 1 & 2 */}
                    <div className="row">
                        <div className="col" style={{ flex: 2 }}>
                            <div className="form-group">
                                <label className="form-label">Nama Barang</label>
                                <input name="name" className="form-control" required onChange={handleChange} placeholder="Contoh: Laptop Asus Rog" />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label className="form-label">Inventaris</label>
                                <select name="instansi" className="form-control" required onChange={handleChange}>
                                    <option value="">Pilih Inventaris...</option>
                                    <option value="Dinas Pendidikan">Dinas Pendidikan</option>
                                    <option value="Dinas Kesehatan">Dinas Kesehatan</option>
                                    <option value="RSUD Indramayu">RSUD Indramayu</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Row: 3 & 4 */}
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label className="form-label">No. SPK</label>
                                <input name="spk_no" className="form-control" onChange={handleChange} placeholder="Nomor Kontrak/SPK" />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label className="form-label">Tgl SPK</label>
                                <input type="date" name="spk_date" className="form-control" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Row: 5 */}
                    <div className="form-group">
                        <label className="form-label">Uraian SPK</label>
                        <textarea name="spk_description" className="form-control" rows="2" onChange={handleChange} placeholder="Uraian kejadian barang sesuai SPK..."></textarea>
                    </div>
                </div>

                {/* Section 2: Data Kuantitas & Nilai (6-9) */}
                <div className="form-section">
                    <div className="section-title">💰 Data Kuantitas & Nilai</div>

                    {/* Row: 6 & 7 */}
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label className="form-label">Jumlah Barang</label>
                                <input type="number" name="total_quantity" className="form-control" required onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label className="form-label">Tanggal Diterima</label>
                                <input type="date" name="received_date" className="form-control" required onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Row: 8 & 9 */}
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label className="form-label">Harga Satuan (Rp)</label>
                                <input type="number" name="unit_price" className="form-control" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label className="form-label">Total Harga (Otomatis)</label>
                                <input value={formData.total_price} className="form-control" readOnly style={{ background: '#f1f5f9' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Spesifikasi Teknis (10-14) */}
                <div className="form-section">
                    <div className="section-title">�️ Spesifikasi Teknis</div>

                    {/* Row: 10 */}
                    <div className="row" style={{ justifyContent: 'flex-start' }}>
                        <div className="col" style={{ flex: 0, minWidth: '200px' }}>
                            <div className="form-group">
                                <label className="form-label">Tahun Pembuatan</label>
                                <input type="number" name="make_year" className="form-control" onChange={handleChange} defaultValue={new Date().getFullYear()} />
                            </div>
                        </div>
                    </div>

                    {/* Row: 11 */}
                    <div className="form-group">
                        <label className="form-label">Spesifikasi Barang</label>
                        <textarea name="specifications" className="form-control" rows="3" onChange={handleChange} placeholder="Merek, Dimensi, Warna, dsb..."></textarea>
                    </div>

                    {/* Row: 12, 13, 14 */}
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                        <label className="form-label" style={{ marginBottom: '1rem', color: '#64748b' }}>Detail Kendaraan (Opsional)</label>
                        <div className="row">
                            <div className="col">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>No. Polisi</label>
                                <input name="nopol" className="form-control" onChange={handleVehicleChange} />
                            </div>
                            <div className="col">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>No. Rangka</label>
                                <input name="rangka" className="form-control" onChange={handleVehicleChange} />
                            </div>
                            <div className="col">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>No. Mesin</label>
                                <input name="mesin" className="form-control" onChange={handleVehicleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Logistik (15-17) */}
                <div className="form-section">
                    <div className="section-title">📍 Logistik & Dokumentasi</div>

                    {/* Row: 15 */}
                    <div className="form-group" style={{ maxWidth: '300px' }}>
                        <label className="form-label">Perolehan</label>
                        <select name="acquisition_type" className="form-control" onChange={handleChange}>
                            <option value="Pembelian">Pembelian</option>
                            <option value="Hibah">Hibah</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    {/* Row: 16 */}
                    <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                        <label className="form-label">Penempatan Barang</label>
                        <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '10px' }}>
                            <p style={{ margin: 0 }}>Sebutkan detail lokasi penyimpanan barang.</p>
                        </div>
                        {locations.map((loc, idx) => (
                            <LocationInput
                                key={idx}
                                index={idx}
                                data={loc}
                                onChange={handleLocationChange}
                                onRemove={removeLocation}
                                showRemove={locations.length > 1}
                            />
                        ))}
                        <button type="button" onClick={addLocation} className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem' }}>+ Tambah Lokasi Lain</button>
                    </div>

                    {/* Row: 17 */}
                    <div className="upload-zone">
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} id="file-upload" style={{ display: 'none' }} />
                        <label htmlFor="file-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                            <div style={{ fontSize: '2rem' }}>📷</div>
                            <p style={{ fontWeight: 600 }}>Foto Barang</p>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Klik untuk upload (Max 2 MB)</p>
                        </label>
                        {files.length > 0 && <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'green' }}>{files.length} file dipilih</div>}
                    </div>
                </div>

                <button type="submit" className="btn btn-success" disabled={loading} style={{ marginTop: '1rem' }}>
                    {loading ? 'Menyimpan...' : '💾 Simpan Data'}
                </button>
            </form>
        </div>
    );
}
