'use strict';

const CORE = {
    random(min, max) {
        let rand = min + Math.random() * (max - min);

        return this.normalize(rand);
    },

    randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);

        return Math.floor(rand);
    },

    calcSum(arr) {
        let sum = arr.reduce((prev, current) => prev + current, 0);

        return this.normalize(sum);
    },

    calcAverage(sum, n) {
        return this.normalize(sum / n);
    },

    getDiffArr(arr, xAve) {
        return arr.map((item) => this.normalize(item - xAve));
    },

    getExpArr(arr) {
        return arr.map((item) => this.normalize(item ** 2));
    },

    calcS(sum, n) {
        let res = Math.sqrt(sum / (n - 1));

        return this.normalize(res);
    },

    calcCV(sValue, xAve) {
        let res = sValue / xAve * 100;

        return this.normalize(res);
    },

    numberWithCommas(num) {
        return num.toString().split('.').join(',');
    },

    getLabelsForChart(days) {
        return Array.from(new Array(days), (val, index) => index + 1);
    },

    toggleElem(elem, state) {
        elem.style.display = state ? 'inline-block' : 'none';
    },

    normalize(num) {
        return Number(num.toFixed(2));
    },

    log(label, value = '') {
        console.log(`[${label}]`, value);
    },
};
