'use strict';

(function() {
    const progress = document.querySelector('.spinner');
    const WORKING_DAYS = 20;

    let userMin;
    let userMax;
    let userLimit;
    let isNumbersFloat;
    let iterationCount;
    let chart;

    init();

    function init() {
        let runBtn = document.getElementById('runBtn');

        runBtn.onclick = function(event) {
            event.preventDefault();

            userMin = Number(document.getElementById('userMin').value);
            userMax = Number(document.getElementById('userMax').value);
            userLimit = Number(document.getElementById('userLimit').value);
            isNumbersFloat = document.getElementById('isNumbersFloat').checked;

            if (!userMax || !userLimit) {
                alert('MAX или КОЭФФИЦИЕНТ пропущены!');
            } else {
                CORE.toggleElem(progress, true);
                iterationCount = 0;
                setTimeout(function() {
                    while(!run()) {}
                });
            }
        };
    }

    function run() {
        iterationCount++;

        // Step0: Generate random algorithm quality
        let multiplier = CORE.random(0.01, 0.3); // quality from 1% to 30%
        let userLimitOffset = userLimit * multiplier;
        // CORE.log('LIMIT OFFSET', userLimitOffset);

        // Step1: Generate source array with random numbers
        let randArr = generateRandomArr(WORKING_DAYS);
        // CORE.log('RANDOM ARR', randArr);

        // Step2: Calculate X average
        let xSum = CORE.calcSum(randArr);
        // CORE.log('Xsum', xSum);
        let xAve = CORE.calcAverage(xSum, WORKING_DAYS);
        // CORE.log('Xave', xAve);

        // Step3: Calculate S value
        let diffArr = CORE.getDiffArr(randArr, xAve);
        // CORE.log('DIFF ARR', diffArr);
        let expArr = CORE.getExpArr(diffArr);
        // CORE.log('EXP ARR', expArr);
        let sumExpArr = CORE.calcSum(expArr);
        // CORE.log('SUM EXP ARR', sumExpArr);
        let aveExpArr = CORE.calcAverage(sumExpArr, WORKING_DAYS);
        // CORE.log('AVE EXP ARR', aveExpArr);
        let sValue = CORE.calcS(sumExpArr, WORKING_DAYS);
        // CORE.log('S', sValue);

        // Step4: Calculate CV value
        let cvValue = CORE.calcCV(sValue, xAve);
        // CORE.log('CV', cvValue);

        // Step5: If user limit is not respected run algorithm again
        if (cvValue > (userLimit - userLimitOffset)) {
            return false;
        } else {
            CORE.toggleElem(progress, false);

            renderOutput({
                randArr,
                xSum,
                xAve,
                diffArr,
                expArr,
                sumExpArr,
                aveExpArr,
                sValue,
                cvValue
            });
            createChart(randArr, xAve);
            // CORE.log('Iteration count', iterationCount);
            // CORE.log('CV', cvValue);
            // CORE.log('RANDOM ARR', randArr);

            return true;
        }
    }

    function generateRandomArr(days) {
        let arr = [];

        for (let i = 0; i < days; i++) {
            let randNum;

            for (;;) {
                if (isNumbersFloat) {
                    randNum = CORE.random(userMin, userMax);
                } else {
                    randNum = CORE.randomInteger(userMin, userMax);
                }

                // each element needs to be unique
                if (!arr.includes(randNum)) {
                    break;
                }
            }

            arr.push(randNum);
        }

        return arr;
    }

    function renderOutput({
      randArr,
      xSum,
      xAve,
      diffArr,
      expArr,
      sumExpArr,
      aveExpArr,
      sValue,
      cvValue
    }) {
        let outputTable = document.getElementById('outputTable');
        let outputPre = document.getElementById('outputPre');
        let result = document.getElementById('result');

        let tableContent = '';
        let preContent = '';

        randArr.forEach((item, index) => {
            tableContent += `<tr>`;
            tableContent += `<td>${index + 1}</td>`;
            tableContent += `<td>${item}</td>`;
            tableContent += `<td>${diffArr[index]}</td>`;
            tableContent += `<td>${expArr[index]}</td>`;
            tableContent += `</tr>`;

            preContent += `${CORE.numberWithCommas(item.toFixed(2))}\n`;
        });

        tableContent += `<tr class="warning">`;
        tableContent += `<td>n=${WORKING_DAYS}</td>`;
        tableContent += `<td>${xSum}</td>`;
        tableContent += `<td>0.00</td>`;
        tableContent += `<td>${sumExpArr}</td>`;
        tableContent += `</tr>`;

        tableContent += `<tr class="warning">`;
        tableContent += `<td>ср=</td>`;
        tableContent += `<td>${xAve}</td>`;
        tableContent += `<td>0.00</td>`;
        tableContent += `<td>${aveExpArr}</td>`;
        tableContent += `</tr>`;

        outputTable.innerHTML = tableContent;
        outputPre.textContent = preContent;

        result.innerHTML = `
            <span><b>Итераций = </b>${iterationCount}</span><br>
            <span><b>S = </b>${sValue}</span><br>
            <span><b>CV = </b>${cvValue}</span>
        `;
    }

    function createChart(randArr, xAve) {
        let canvas = document.getElementById('myChart');
        let context = canvas.getContext('2d');

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(context, {
            type: 'line',

            data: {
                labels: CORE.getLabelsForChart(WORKING_DAYS),
                datasets: [{
                    label: "Xi",
                    data: randArr,
                    borderColor: '#ff6384',
                    fill: false,
                    lineTension: 0
                }, {
                    label: "Xср",
                    data: new Array(WORKING_DAYS).fill(xAve),
                    borderColor: '#aaa',
                    fill: false,
                }]
            }
        });
    }
})();
