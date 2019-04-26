'use strict'
var calculateButton = document.querySelector('.entry-data__button');
var dataOvershoot = document.querySelectorAll('.entry-data__overshoot-item');
var dataTime = document.querySelectorAll('.entry-data__time-item');
var dataPrice = document.querySelectorAll('.entry-data__price-item');
var chasKofItem = document.querySelectorAll('.result__chas-kof-cor-form-item');
var kofParReg = document.querySelectorAll('.result__kof-par-reg-form-item');
var meanItem = document.querySelectorAll('.result__mean-form-item');
var dispItem = document.querySelectorAll('.result__disp-form-item');
var covarItem = document.querySelectorAll('.result__covar-form-item');
var correlItem = document.querySelectorAll('.result__correl-form-item');
var mnogKofCorFormItem = document.querySelector('.result__mnog-kof-cor-form-item');
var resultAll = document.querySelector('.result-all');
var hypothResultItem = document.querySelectorAll('.hypoth__item-result');
var overshootArr = [];
var timeArr = [];
var priceArr = [];
var mean = [0, 0, 0];
var disp = [0, 0, 0];
var tKrPar = 2.45,
  tKrChast = 2.57,
  fKrMnog = 5.79,
  fKrKoff = 5.99,
  tKrB = 2.36;
var r123, r132, r231;
var covarPart;
var covar = [];
var correl = [];
var tVibParResult = '';
var tVibChastResult = '';
var gipKoff = '';
var gipKoffI = '';
var gipMnogKofKorrel = '';
var hastkofkorrel = function (arr, t, i, j) {
  var r = (arr[t][i] - arr[t][j] * arr[i][j]) / (Math.sqrt((1 - Math.pow(arr[i][j], 2)) * (1 - Math.pow(arr[t][j], 2))));
  return r;
}
var oMnogKofCorrel = function (arr, t, i, j) {
  var oMnogKofCorrelResult = Math.sqrt((Math.pow(arr[t][i], 2) + Math.pow(arr[t][j], 2) - 2 * arr[t][i] * arr[t][j] * arr[i][j]) / (1 - Math.pow(arr[i][j], 2)));
  return oMnogKofCorrelResult;
}
var fVib = function (N, oMnogKofCorrelNumber) {
  var L = 3;
  var statZnah = (((N - L - 1) / L) * oMnogKofCorrelNumber) / (1 - oMnogKofCorrelNumber);
  return statZnah;
}
calculateButton.addEventListener('click', function () {
  var k = 2,
    srprim3v = 0,
    fpr = 0,
    sr2vipr = 0;
  var S1 = 0,
    skv2 = 0,
    spv2i3 = 0,
    kv2 = 0;
  var y0 = new Array(dataTime.length).fill(0);
  var d = [0, 0, 0];
  mean = [0, 0, 0];
  disp = [0, 0, 0];
  for (var i = 0; i < dataOvershoot.length; i++) {
    overshootArr[i] = parseFloat(dataOvershoot[i].value);
    timeArr[i] = parseFloat(dataTime[i].value);
    priceArr[i] = parseFloat(dataPrice[i].value);
  };
  var dataEntry = [
        [overshootArr],
        [timeArr],
        [priceArr]
      ];
  for (var i = 0; i < mean.length; i++) {
    for (var j = 0; j < dataTime.length; j++) {
      mean[i] += dataEntry[i][0][j];
    }
    mean[i] /= dataTime.length;
  }
  for (var i = 0; i < mean.length; i++) {
    for (var j = 0; j < dataTime.length; j++) {
      disp[i] += Math.pow((dataEntry[i][0][j] - mean[i]), 2);
    }
    disp[i] /= (dataTime.length - 1);
  }
  for (var j = 0; j < mean.length; j++) {
    covar[j] = [];
    for (var t = 0; t < mean.length; t++) {
      covarPart = 0;
      for (i = 0; i < dataTime.length; i++) {
        covarPart += ((dataEntry[j][0][i] - mean[j]) * (dataEntry[t][0][i] - mean[t]));
      }
      covar[j][t] = (covarPart / (dataTime.length - 1));
    }
  }
  for (i = 0; i < mean.length; i++) {
    correl[i] = [];
    for (j = 0; j < mean.length; j++) {
      if (j == i) {
        correl[i][j] = 1;
      } else
        correl[i][j] = (covar[i][j] / Math.sqrt(disp[i] * disp[j]));
    }
  }
  r123 = hastkofkorrel(correl, 0, 1, 2);
  r132 = hastkofkorrel(correl, 0, 2, 1);
  r231 = hastkofkorrel(correl, 1, 2, 0);
  var tVibPar = (Math.abs(correl[1][2]) * Math.sqrt(dataTime.length - 2)) / Math.sqrt(1 - Math.pow(correl[1][2], 2));
  if (tVibPar > tKrPar) {
    tVibParResult = ('Так как выборочное значение больше критического ' + tVibPar + '>' + tKrPar + ' значит нулевая гипотеза отвергается, поэтому оценка парного коэффициента корреляции r23 является значимой.');
  } else {
    tVibParResult = ('Так как критическое значение больше выборочного ' + tVibPar + '<' + tKrPar + ' значит нулевая гипотеза  не отвергается, поэтому оценка парного коэффициента корреляции r23 является  не значимой.');
  }
  var tVibChast = (Math.abs(r231) * Math.sqrt(dataTime.length - 1 - 2)) / Math.sqrt(1 - Math.pow(r231, 2));
  if (tVibChast > tKrChast) {
    tVibChastResult = ('Так как выборочное значение больше критического ' + tVibChast + '>' + tKrChast + ' значит нулевая гипотеза отвергается, поэтому оценка частного коэффициента корреляции r23/1 является значимой.')
  } else {
    tVibChastResult = ('Так как критическое значение больше выборочного ' + tVibChast + '<' + tKrChast + ' значит нулевая гипотеза  не отвергается, поэтому оценка частного коэффициента корреляции r23/1 является  не значимой.');
  }
  var oMnogKofCorrelNumber = oMnogKofCorrel(correl, 0, 1, 2);
  var fvibResult = fVib(dataTime.length, oMnogKofCorrelNumber);
  if (fvibResult > fKrMnog) {
    gipMnogKofKorrel = ('Так как выборочное значение больше критического ' + fvibResult + '>' + fKrMnog + ' значит нулевая гипотеза отвергается, поэтому оценка множественного коэффициента корреляции R3/2,1 является значимой.')
  } else {
    gipMnogKofKorrel = ('Так как критическое значение больше выборочного ' + fvibResult + '<' + fKrMnog + ' значит нулевая гипотеза  не отвергается, поэтому оценка множественного коэффициента корреляции R3/2,1 является  не значимой.')
  }
  for (var i = 0; i < dataTime.length; i++) {
    S1 += dataEntry[1][0][i] * dataEntry[2][0][i];
    kv2 += Math.pow(dataEntry[1][0][i], 2);
  }
  skv2 += Math.pow(mean[1] * dataTime.length, 2) / dataTime.length;
  spv2i3 = (mean[1] * dataTime.length * mean[2] * dataTime.length) / dataTime.length;
  var b1 = (S1 - spv2i3) / (kv2 - skv2);
  var b0 = ((mean[2] * dataTime.length) / dataTime.length) - (b1 / dataTime.length) * mean[1] * dataTime.length;
  for (var i = 0; i < dataTime.length; i++) {
    y0[i] = b0 + b1 * dataEntry[1][0][i];
    srprim3v += Math.pow(y0[i] - mean[2], 2);
    sr2vipr += Math.pow(dataEntry[2][0][i] - y0[i], 2);
  }
  fpr = (((1 / (k - 1)) * srprim3v) / ((1 / (dataTime.length - k)) * sr2vipr));
  if (fpr > fKrKoff) {
    gipKoff = 'Так как выборочное значение больше критического ' + fpr + '>' + fKrKoff + ' значит нулевая гипотеза отвергается, поэтому полученная регрессионная модель значима.'
  } else {
    gipKoff = 'Так как критическое значение больше выборочного ' + fpr + '<' + fKrKoff + 'значит нулевая гипотеза  не отвергается, поэтому полученная регрессионная модель не значима.'
  }
  for (var i = 0; i < mean.length; i++) {
    for (var j = 0; j < dataTime.length; j++) {
      d[i] += Math.pow((dataEntry[i][0][j] - mean[i]), 2);
    }
  }
  var k = 2;
  var D = ((1 / (dataTime.length - k)) * sr2vipr * kv2) / (dataTime.length * d[1]);
  var tb0 = Math.abs(b0) / (Math.sqrt(D));
  D = ((1 / (dataTime.length - k)) * sr2vipr) / (d[1]);
  var tb1 = Math.abs(b1) / (Math.sqrt(D));
  if (tb0 > tKrB && tb1 > tKrB) {
    gipKoffI = ('Так как оба выборочных значения больше критического ' + tb0 + '>' + tKrB + ' и ' + tb1 + '>' + tKrB + ' значит нулевая гипотеза отвергается, поэтому оба коэффициента значимы.')
  } else if (tb0 > tKrB && tb1 < tKrB) {
    gipKoffI = ('Так как t-выборочное для b0 больше критического ' + tb0 + '>' + tKrB + ', а для b1 меньше критического ' + tb1 + '<' + tKrB + ', то нулевая гипотеза отвергается только для b0, поэтому только коэффицент b0 значим, а коэффицент b1 не значим.')
  } else if (tb0 < tKrB && tb1 > tKrB) {
    gipKoffI = ('Так как t-выборочное для b1 больше критического ' + tb1 + '>' + tKrB + ', а для b0 меньше критического ' + tb0 + '<' + tKrB + ', то нулевая гипотеза отвергается только для b1, поэтому только коэффицент b1 значим, а коэффицент b0 не значим.')
  } else {
    gipKoffI = ('Так как оба выборочных значения меньше критического ' + tb0 + '<' + tKrB + ' и ' + tb1 + '<' + tKrB + ' значит нулевая гипотеза не отвергается, поэтому оба коэффициента не значимы.');
  }
  for (var i = 0; i < mean.length; i++) {
    meanItem[i].value = mean[i];
  }
  for (var i = 0; i < mean.length; i++) {
    dispItem[i].value = disp[i];
  }
  var n = 0;
  for (var i = 0; i < mean.length; i++) {
    for (var j = 0; j < mean.length; j++) {
      covarItem[n].value = covar[i][j];
      n += 1;
    }
  }
  n = 0;
  for (var i = 0; i < mean.length; i++) {
    for (var j = 0; j < mean.length; j++) {
      correlItem[n].value = correl[i][j];
      n += 1;
    }
  }
  kofParReg[0].value = b0;
  kofParReg[1].value = b1;
  chasKofItem[0].value = r123;
  chasKofItem[1].value = r132;
  chasKofItem[2].value = r231;
  hypothResultItem[0].textContent = tVibParResult;
  hypothResultItem[1].textContent = tVibChastResult;
  hypothResultItem[2].textContent = gipMnogKofKorrel;
  hypothResultItem[3].textContent = gipKoff;
  hypothResultItem[4].textContent = gipKoffI;
  mnogKofCorFormItem.value = oMnogKofCorrelNumber;
  resultAll.classList.add('result-all--fade-in');
  console.log('covar=' + covar);
  console.log('correl=' + correl);
  console.log('disp=' + disp);
  console.log('mean=' + mean);
  console.log('r123=' + r123 + ' r132=' + r132 + ' r231' + r231);
  console.log('b0=' + b0 + '  b1=' + b1);
  console.log('t-выборочное для b0 равно:' + tb0);
  console.log('t-выборочное для b1 равно:' + tb1);
  console.log('srprim3v=' + srprim3v + '  sr2vipr=' + sr2vipr);
  console.log(dataEntry);
  console.log('gipKoff' + gipKoff);
  console.log('F-выборочное=' + fpr);
  console.log('tVibParResult' + tVibParResult);
  console.log('tVibChastResult' + tVibChastResult);
  console.log('oMnogKofCorrelNumber' + oMnogKofCorrelNumber);
  console.log('F-выборочное =' + fvibResult);
  console.log('gipMnogKofKorrel' + gipMnogKofKorrel);
});