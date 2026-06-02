// CONFIGURATION: Paste your exact Google Apps Script URL here
const API_URL = "https://script.google.com/macros/s/AKfycbw3cJWVGv87jOiAe0SmbrkrFZmLC84Y1gmyJsL1mSDbrNVwEHKYopdJdEXHiHa1UEuckA/exec";

async function handleFormSubmit(event) {
    event.preventDefault(); 

    const idInput = document.getElementById('input-no').value.trim();
    const dobInput = document.getElementById('input-dob').value;
    const tokenInput = document.getElementById('input-token').value.trim();
    const errorBanner = document.getElementById('error-banner');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');

    // Reset error banners
    errorBanner.classList.add('hidden');
    errorBanner.innerText = "";

    // Set loading indicator parameter state
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-60', 'cursor-not-allowed');
    btnText.innerText = "MENCARI DATA...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ id: idInput, dob: dobInput, token: tokenInput }), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            }
        });

        const result = await response.json();

        if (result.success) {
            renderResultBoard(result.data);
        } else {
            // Show error message straight from Google Sheets
            errorBanner.innerText = result.message || "Kombinasi data login salah.";
            errorBanner.classList.remove('hidden');
        }

    } catch (error) {
        console.error("Network Exception:", error);
        errorBanner.innerText = "Sistem gagal menghubungi server cloud sheet. Coba lagi.";
        errorBanner.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
        btnText.innerText = "Periksa Lembar Hasil Kelulusan →";
    }
}

function renderResultBoard(student) {
    // Inject database values dynamically from Google Sheets
    document.getElementById('res-no').innerText = student.nomor_peserta;
    document.getElementById('res-name').innerText = student.nama_siswa.toUpperCase();

    const injector = document.getElementById('status-card-injector');

    // Dynamically choose layout styling accents based on actual row status field
    if (student.status === "LULUS") {
        injector.innerHTML = `
          <div class="flex justify-start my-2">
            <div class="inline-flex px-12 py-4 bg-inst-main border-2 border-inst-deep text-white shadow-[4px_4px_0px_#032319] relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-white"></div>
              <div class="absolute top-0 right-0 w-1.5 h-1.5 bg-white"></div>
              <div class="absolute bottom-0 left-0 w-1.5 h-1.5 bg-white"></div>
              <div class="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white"></div>
              
              <span class="academic-font text-4xl font-black uppercase tracking-[0.2em] pl-[0.2em]">
                LULUS
              </span>
            </div>
          </div>
        `;
    } else {
        // Administrative holding fallback stamp layout design
        injector.innerHTML = `
          <div class="flex justify-start my-2">
            <div class="inline-flex px-8 py-4 bg-zinc-100 border-2 border-zinc-400 text-zinc-700 shadow-[4px_4px_0px_#27272a] relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-white"></div>
              <div class="absolute top-0 right-0 w-1.5 h-1.5 bg-white"></div>
              <div class="absolute bottom-0 left-0 w-1.5 h-1.5 bg-white"></div>
              <div class="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white"></div>
              
              <span class="academic-font text-2xl font-black uppercase tracking-[0.05em] text-zinc-800">
                DITANGGUHKAN
              </span>
            </div>
          </div>
        `;
    }

    // Toggle board visibility matrices
    document.getElementById('portal-gate').classList.add('hidden');
    document.getElementById('announcement-board').classList.remove('hidden');
}

function backToSearch() {
    document.getElementById('announcement-board').classList.add('hidden');
    document.getElementById('portal-gate').classList.remove('hidden');
    document.getElementById('lookup-form').reset();
}