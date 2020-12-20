const kuadrat = data => {
  let globArr = [];
  let arr = data;
  let answ = arr.split(',');
  let x = 0;
  answ.forEach(function(obj) {
    globArr.push(parseInt(obj, 10));
  });
  for (i = 1; i <= globArr[1]; i++) {
    x += globArr[0] * globArr[0];

    console.log(x);
  }
};

kuadrat('2,3');



1. buat function kuadrat dg inputan misal 2,3 maka nanti hasilnya 2 pangkat 3 tidak boleh menggunakan function bawaan 




2. ada 3 menara A, B, C di menara A ada bilangan ring 1,2,3, pindahin ke C dengan melalui B tanpa mengubah urutan