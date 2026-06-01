// CONFIGURATION: Paste your exact Google Apps Script URL here
const API_URL = "https://script.google.com/macros/s/AKfycbw3cJWVGv87jOiAe0SmbrkrFZmLC84Y1gmyJsL1mSDbrNVwEHKYopdJdEXHiHa1UEuckA/exec";

// Replace the top part of your handleFormSubmit inside app.js with this configuration:

async function handleFormSubmit(event) {
    event.preventDefault(); 

    const idInput = document.getElementById('input-no').value.trim();
    const dobInput = document.getElementById('input-dob').value;
    const tokenInput = document.getElementById('input-token').value.trim(); // <-- Target token element
    const errorBanner = document.getElementById('error-banner');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');

    errorBanner.classList.add('hidden');
    errorBanner.innerText = "";

    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-60', 'cursor-not-allowed');
    btnText.innerText = "MENCARI DATA...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            // Include the token in the secure request body object payload sent to the spreadsheet
            body: JSON.stringify({ id: idInput, dob: dobInput, token: tokenInput }), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            }
        });

        const result = await response.json();

        if (result.success) {
            renderResultBoard(result.data);
        } else {
            errorBanner.innerText = result.message || "Kombinasi data login salah.";
            errorBanner.classList.remove('hidden');
        }

    } catch (error) {
        console.error("Network Exception:", error);
        errorBanner.innerText = "Sistem gagal menghubungi server cloud sheet. Coba lagi dalam beberapa saat.";
        errorBanner.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
        btnText.innerText = "PERIKSA KELULUSAN";
    }
}

function renderResultBoard(student) {
    document.getElementById('res-no').innerText = student.nomor_peserta;
    document.getElementById('res-name').innerText = student.nama_siswa;

    const injector = document.getElementById('status-card-injector');

    if (student.status === "LULUS") {
        injector.innerHTML = `
            <div>
                <h4 class="text-xs uppercase font-extrabold tracking-widest text-zinc-400 mb-2 font-mono">Status Akhir</h4>
                <div class="bg-green-700 text-white p-6 rounded-lg shadow-md border-2 border-green-600 relative overflow-hidden">
                    <h4 class="text-lg sm:text-xl font-black tracking-wide uppercase mb-2">
                        SELAMAT! ANDA NYATAKAN LULUS
                    </h4>
                    <p class="text-xs sm:text-sm text-green-100 leading-relaxed font-medium">
                        Selamat, Anda dinyatakan memenuhi seluruh kriteria kualifikasi kompetensi pembelajaran dan dinyatakan <span class="underline decoration-2 font-black text-white">LULUS</span> dari satuan pendidikan SMP PAB 5 Patumbak tahun ajaran 2025/2026. Segenap keluarga besar sekolah mengucapkan selamat atas pencapaian berharga Anda!
                    </p>
                </div>
            </div>
        `;
    } else {
        injector.innerHTML = `
            <div>
                <h4 class="text-xs uppercase font-extrabold tracking-widest text-zinc-400 mb-2 font-mono">Status Akhir</h4>
                <div class="bg-zinc-100 border-2 border-zinc-300 p-6 rounded-lg shadow-inner">
                    <h4 class="text-base sm:text-lg font-black text-zinc-800 tracking-tight uppercase mb-2">
                        STATUS: BELUM MEMENUHI SYARAT / DITANGGUHKAN
                    </h4>
                    <p class="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium mb-4">
                        Mohon maaf, berkas kelulusan Anda saat ini belum dapat diterbitkan atau ditangguhkan oleh pihak panitia penguji ujian sekolah.
                    </p>
                    <div class="text-xs font-mono font-bold text-red-800 bg-red-50 p-3 rounded border border-red-200">
                        ⚠️ Hubungi Wali Kelas atau datangi loket Tata Usaha (TU) SMP PAB 5 Patumbak untuk memproses penyelesaian administrasi Anda.
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById('portal-gate').classList.add('hidden');
    document.getElementById('announcement-board').classList.remove('hidden');
}

function backToSearch() {
    document.getElementById('announcement-board').classList.add('hidden');
    document.getElementById('portal-gate').classList.remove('hidden');
    document.getElementById('lookup-form').reset();
}