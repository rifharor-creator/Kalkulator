// mengambil element html yang akan digunakan
const hasilElement = document.getElementById("hasil");
const riwayatElement = document.getElementById("riwayat");
const tombolContainer = document.getElementById("tombol-kalkulator");

// state : data yang menyimpan kondisi kalkulator
let angkaSekarang = "0";
let angkaPertama = null;
let operator = null;
let inputBaru = false;
let terjadiError = false;

const simbolOperator = {
  "+": "➕",
  "-": "➖",
  "*": "✖",
  "/": "➗"
};

function tampilkanHasil() {
  hasilElement.textContent = angkaSekarang;
}

function resetKalkulator() {
  angkaSekarang = "0";
  angkaPertama = null;
  operator = null;
  inputBaru = false;
  terjadiError = false;

  riwayatElement.textContent = "";
  tampilkanHasil();
}

function tampilkanError(pesan) {
  angkaSekarang = "Error";
  angkaPertama = null;
  operator = null;
  inputBaru = true;
  terjadiError = true;

  riwayatElement.textContent = pesan;
  tampilkanHasil();
}

function tambahAngka(angka) {
  // mengetik angka setelah error dan melalui ulang kalkulator
  if (terjadiError) {
    resetKalkulator();
  }

  //mulai angka kedua atau perhitungan baru.
  if (inputBaru) {
    angkaSekarang = "0";
    inputBaru = false;
  }

  // satu angka hanya boleh memiliki satu titik desimal.
  if (angka === ".") {
    if (!angkaSekarang.includes(".")) {
      angkaSekarang += ".";
    }

    tampilkanHasil();
    return;
  }
  //batasi jumlah digit agar tampilan dan input tetap terkendali.
  const jumlahDigit = angkaSekarang.replace(/[^0-9]/g, "").length;

  if (jumlahDigit >= 12) {
    return;
  }

  //mengganti angka awal 0, bukam menambahkan manjadi 01.
  angkaSekarang = angkaSekarang === "0" ? angka : angkaSekarang + angka;

  tampilkanHasil();
}

function hapusAngka() {
  if (terjadiError) {
    resetKalkulator();
    return;
  }

  //jangna menghapus hasil atau angka yang sudah disimpan.
  if (inputBaru) {
    return;
  }

  angkaSekarang = angkaSekarang.slice(0, -1);

  if (angkaSekarang === "" || angkaSekarang === "-") {
    angkaSekarang = "0";
  }

  tampilkanHasil();
}

function hitungOperasi(angkaA, angkaB, operasi) {
  // operasi ditentukan secara eksplisit, tanpa eval ().
  switch (operasi) {
    case "+":
      return angkaA + angkaB;

    case "-":
      return angkaA - angkaB;

    case "*":
      return angkaA * angkaB;

    case "/":
      if (angkaB === 0) {
        throw new Error("tidak dapat membagi dengan nol.");
      }

      return angkaA / angkaB;

    default:
      throw new Error("Operator tidak dikenali.");
  }
}

function hitungHasil() {
  //perhitungan membutuhkan angka pertama,operator
  //dan angka kedua yang sudah di input
  if (angkaPertama === null || operator === null || inputBaru || terjadiError) {
    return;
  }
  //nvd
  const angkaKedua = Number(angkaSekarang);

  try {
    const hasil = hitungOperasi(angkaPertama, angkaKedua, operator);

    if (!Number.isFinite(hasil)) {
      throw new Error("hasil beranda diluar batas perhitungan.");
    }

    riwayatElement.textContent = `${angkaPertama} ${simbolOperator[operator]} ${angkaKedua} =`;
    //mengurangi tampilan ekor desimal seperti
    //0.3000000004. ini bukan aritmetika finansial presisi.
    angkaSekarang = String(Number(hasil.toPrecision(12)));

    angkaPertama = null;
    operator = null;
    inputBaru = true;

    tampilkanHasil();
  } catch (error) {
    tampilkanError(error.message);
  }
}

function pilihOperator(operatorDipilih) {
  if (terjadiError) {
    return;
  }

  //selesaikan operasi sebelumnnya jika angka kedua tersedia.
  if (operator !== null && !inputBaru) {
    hitungHasil();

    if (terjadiError) {
      return;
    }
  }

  angkaPertama = Number(angkaSekarang);
  operator = operatorDipilih;
  inputBaru = true;

  riwayatElement.textContent = `${angkaPertama} ${simbolOperator[operator]}`;
}

//event delegation: satu listener untuk semua tommbol:
tombolContainer.addEventListener("click", function (event) {
  const tombol = event.target.closest("button");

  if (!tombol || !tombolContainer.contains(tombol)) {
    return;
  }

  if (tombol.dataset.angka !== undefined) {
    tambahAngka(tombol.dataset.angka);
    return;
  }

  if (tombol.dataset.operator !== undefined) {
    pilihOperator(tombol.dataset.operator);
    return;
  }

  switch (tombol.dataset.aksi) {
    case "reset":
      resetKalkulator();
      break;

    case "hapus":
      hapusAngka();
      break;

    case "hitung":
      hitungHasil();
      break;
  }
});
