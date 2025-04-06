document.addEventListener('DOMContentLoaded', function() {
    function updateDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        document.getElementById('current-date').textContent = date;
        document.getElementById('current-time').textContent = time;
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    const burger = document.getElementById('burger');
    const menu = document.getElementById('burger-menu');

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!burger.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('show');
        }
    });


    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const fromAmount = document.getElementById('fromAmount');
    const toAmount = document.getElementById('toAmount');
    const swapButton = document.getElementById('swapButton');
    const errorDiv = document.getElementById('error');
    const API_NBU = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

    let currencies = [];

    function fetchCurrencies() {
        fetch(API_NBU)
        .then(response => response.json())
        .then(data => {
            currencies = data.map(currency => ({
                cc: currency.cc,
                rate: currency.rate,
                txt: currency.txt,
            }));
            currencies.unshift({ cc: 'UAH', rate: 1, txt: 'Українська гривня' }); // Add UAH
            populateCurrencies(currencies);
            setTimeout(() => { 
                setInitialCurrencies();
                convert();
            }, 100);
        })
        .catch(error => {
            errorDiv.textContent = 'Не вдалося завантажити курси валют. Спробуйте в інший раз.';
            console.error('Помилка завантаження курсів валют:', error);
        });
    }

    function populateCurrencies(currencyList) {
        fromCurrency.innerHTML = '';
        toCurrency.innerHTML = '';

        currencyList.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.cc;
            option.dataset.rate = currency.rate;
            option.textContent = `${currency.txt} (${currency.cc})`

            fromCurrency.appendChild(option.cloneNode(true));
            toCurrency.appendChild(option);
        });
    }

    function setInitialCurrencies() {
        fromAmount.value = '100';
        for (let i = 0; i < fromCurrency.options.length; i++) {
            if (fromCurrency.options[i].value === 'USD') {
                fromCurrency.selectedIndex = i;
                break;
            }
        }
        for (let i = 0; i < toCurrency.options.length; i++) {
            if (toCurrency.options[i].value === 'UAH') {
                toCurrency.selectedIndex = i;
                break;
            }
        }
    }

    function convert() {
        const fromRate = parseFloat(fromCurrency.selectedOptions[0].dataset.rate);
        const toRate = parseFloat(toCurrency.selectedOptions[0].dataset.rate);
        const amount = parseFloat(fromAmount.value);
        const result = (amount * fromRate) / toRate;
        toAmount.value = result.toFixed(2);
    }

    function convertReverse() {
        const fromRate = parseFloat(fromCurrency.selectedOptions[0].dataset.rate);
        const toRate = parseFloat(toCurrency.selectedOptions[0].dataset.rate);
        const amount = parseFloat(toAmount.value);
        const result = (amount * toRate) / fromRate;
        fromAmount.value = result.toFixed(2);
    }

    fromAmount.addEventListener('input', convert);
    toAmount.addEventListener('input', convertReverse);
    fromCurrency.addEventListener('change', convert);
    toCurrency.addEventListener('change', convert);

    swapButton.addEventListener('click', function () {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        convert();
    });

    fetchCurrencies();

    const budgetAmountInput = document.getElementById("budget-amount")
    const needsSpan = document.getElementById("needs")
    const wantsSpan = document.getElementById("wants")
    const savingsSpan = document.getElementById("savings")

    budgetAmountInput.addEventListener("input", function() {
    const amount = parseFloat(budgetAmountInput.value) || 0;
    const needs = amount * 0.5;
    const wants = amount * 0.3;
    const savings = amount * 0.2;

    needsSpan.textContent = needs.toFixed(2);
    wantsSpan.textContent = wants.toFixed(2);
    savingsSpan.textContent = savings.toFixed(2);
});

const amountInput = document.getElementById('habits-amount');
    const frequencySelect = document.getElementById('frequency');
    const periodSelect = document.getElementById('period');
    const calculateButton = document.getElementById('calculate');
    const clearButton = document.getElementById('clear');
    const resultSpan = document.getElementById('habits-result');

    calculateButton.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        const frequency = frequencySelect.value;
        const period = periodSelect.value;

        if (isNaN(amount) || amount <= 0) {
            resultSpan.textContent = 'Введіть коректну суму.';
            return;
        }

        let frequencyMultiplier;
        switch (frequency) {
            case 'day':
                frequencyMultiplier = 1;
                break;
            case 'week':
                frequencyMultiplier = 7;
                break;
            case 'month':
                frequencyMultiplier = 30;
                break;
            case 'year':
                frequencyMultiplier = 365;
                break;
        }

        let periodMultiplier;
        switch (period) {
            case 'day':
                periodMultiplier = 1;
                break;
            case 'week':
                periodMultiplier = 7;
                break;
            case 'month':
                periodMultiplier = 30;
                break;
            case 'year':
                periodMultiplier = 365;
                break;
        }

        const totalSavings = (amount / frequencyMultiplier) * periodMultiplier;

        resultSpan.textContent = `${totalSavings.toFixed(2)} грн`;
    });

    clearButton.addEventListener('click', () => {
        amountInput.value = '';
        resultSpan.textContent = '';
    });

    const currentAmountInput = document.getElementById('current-amount');
    const currentYearInput = document.getElementById('current-year');
    const futureYearInput = document.getElementById('future-year');
    const inflationRateInput = document.getElementById('inflation-rate');
    const calculateInflation = document.getElementById('calculate-inflation');
    const clearInflation = document.getElementById('clear-inflation');
    const resultDiv = document.getElementById('inflation-result');

    calculateInflation.addEventListener('click', () => {
        const currentAmount = parseFloat(currentAmountInput.value);
        const currentYear = parseInt(currentYearInput.value);
        const futureYear = parseInt(futureYearInput.value);
        const inflationRate = parseFloat(inflationRateInput.value) / 100;

        if (isNaN(currentAmount) || isNaN(currentYear) || isNaN(futureYear) || isNaN(inflationRate)) {
            resultDiv.textContent = 'Будь ласка, введіть коректні числові значення.';
            return;
        }

        if (futureYear <= currentYear) {
            resultDiv.textContent = 'Майбутній рік повинен бути більшим за поточний.';
            return;
        }

        let futureValue = currentAmount;
        for (let i = currentYear; i < futureYear; i++) {
            futureValue /= (1 + inflationRate);
        }

        resultDiv.textContent = `Купівельна спроможність ${currentAmount.toFixed(2)} грн у ${currentYear} році буде еквівалентна ${futureValue.toFixed(2)} грн у ${futureYear} році (при річній інфляції ${inflationRate * 100}%).`;
    });

    clearInflation.addEventListener('click', () => {
        currentAmountInput.value = '';
        futureYearInput.value = '';
        inflationRateInput.value = '';
        resultDiv.textContent = '';
    });

        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        console.log("Збережені транзакції:", transactions);

        let chartInstance;
        
        function addTransaction() {
            
            const categoryElement = document.getElementById('category');
            if (!categoryElement) {
                console.error("Елемент для категорії не знайдений");
                return;
            }
        
            const category = categoryElement.value;
            const amount = parseFloat(document.getElementById('tracker-amount').value);
        
            if (isNaN(amount) || amount <= 0 || !category) {
                console.error("Невірні дані для транзакції");
                return;
            }
        
            transactions.push({ category, amount });
            localStorage.setItem('transactions', JSON.stringify(transactions));
        
            console.log('Нова транзакція додана:', { category, amount });
        
            document.getElementById('tracker-amount').value = '';
            renderTransactions();
            updateChart(); 
        } 

        
        function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    updateChart();
}

        function renderTransactions() {
            const tableBody = document.getElementById('transactions');
            tableBody.innerHTML = '';
        
            transactions.forEach((t, index) => {
                const row = document.createElement('tr');
        
                const categoryCell = document.createElement('td');
                categoryCell.textContent = t.category;
        
                const amountCell = document.createElement('td');
                amountCell.textContent = t.amount.toFixed(2);
        
                const deleteCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = "Видалити";
                deleteButton.classList.add("delete-btn");
                deleteButton.onclick = () => deleteTransaction(index);
        
                deleteCell.appendChild(deleteButton);
                row.append(categoryCell, amountCell, deleteCell);
                tableBody.appendChild(row);
            });
        }
        
        function updateChart() {
            const ctx = document.getElementById('chart').getContext('2d');
            if (chartInstance) chartInstance.destroy();
            
            if (transactions.length === 0) {
                chartInstance = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ["Немає даних"],
                        datasets: [{
                            data: [1],
                            backgroundColor: ['#d3d3d3']
                        }]
                    }
                });
            } else {
                const categories = {};
                transactions.forEach(t => {
                    categories[t.category] = (categories[t.category] || 0) + t.amount;
                });
                
                console.log("Категорії перед оновленням графіка:", categories);

                chartInstance = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(categories),
                        datasets: [{
                            data: Object.values(categories),
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50']
                        }]
                    }
                });
            }
        }
        
        renderTransactions();
        updateChart();

        window.addTransaction = addTransaction;
    });
