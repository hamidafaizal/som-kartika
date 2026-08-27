import * as XLSX from 'xlsx';

export const readSomFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Read as array of arrays to find header row dynamically
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        
        if (json.length === 0) {
          throw new Error("File Excel kosong.");
        }

        let headerRowIndex = -1;
        let colMap = { kode: -1, deskripsi: -1, stok: -1 };

        // Find the header row
        for (let i = 0; i < Math.min(20, json.length); i++) {
          const row = json[i];
          let foundKode = false, foundStok = false;
          
          for (let j = 0; j < row.length; j++) {
            const cellVal = String(row[j]).toLowerCase();
            if (cellVal.includes('kode') || cellVal.includes('barcode')) {
              colMap.kode = j; foundKode = true;
            } else if (cellVal.includes('deskripsi') || cellVal.includes('nama') || cellVal.includes('barang')) {
              colMap.deskripsi = j;
            } else if (cellVal.includes('stok') || cellVal.includes('system') || cellVal.match(/^g-/)) {
              colMap.stok = j; foundStok = true;
            }
          }
          if (foundKode) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex === -1 || colMap.kode === -1) {
          throw new Error("Format tidak dikenali. Pastikan ada kolom 'Kode Barang' dan 'Stok'.");
        }

        let parsedData = {};
        let skuCount = 0;

        for (let i = headerRowIndex + 1; i < json.length; i++) {
          const row = json[i];
          const rawKode = row[colMap.kode];
          if (!rawKode) continue;

          // Force string to avoid losing digits
          const kode = String(rawKode).trim();
          const deskripsi = colMap.deskripsi !== -1 ? String(row[colMap.deskripsi]).trim() : "Tanpa Deskripsi";
          const stokSistem = colMap.stok !== -1 ? parseInt(row[colMap.stok]) || 0 : 0;

          if (kode) {
            parsedData[kode] = {
              kode,
              deskripsi,
              stokSistem,
              stokFisik: 0,
              selisih: -stokSistem,
              status: stokSistem === 0 ? 'SESUAI' : 'BELUM DIHITUNG'
            };
            skuCount++;
          }
        }

        resolve({ data: parsedData, count: skuCount, filename: file.name });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = (dataObj) => {
  const dataList = Object.values(dataObj);
  const exportData = dataList.map(item => ({
    "Kode Barang": item.kode,
    "Deskripsi Barang": item.deskripsi,
    "Stok Sistem": item.stokSistem,
    "Stok Fisik": item.stokFisik,
    "Selisih": item.selisih,
    "Status": item.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil SOM");

  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  
  const filename = `Hasil_SOM_Kartika_${yyyy}${mm}${dd}_${hh}${mins}.xlsx`;

  XLSX.writeFile(workbook, filename);
};
