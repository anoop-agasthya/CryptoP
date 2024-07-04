document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
    const cryptoTable = document.getElementById('cryptoTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInput');
    const sortMarketCapButton = document.getElementById('sortMarketCapButton');
    const sortPercentageChangeButton = document.getElementById('sortPercentageChangeButton');

    let cryptoData = [];

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            cryptoData = data;
            renderTable(cryptoData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function fetchDataUsingThen() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                cryptoData = data;
                renderTable(cryptoData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }


    fetchDataUsingThen();


    function renderTable(data) {
        cryptoTable.innerHTML = '';
        data.forEach(coin => {
            const row = cryptoTable.insertRow();
            const percentageClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
            row.innerHTML = `
                <td><img src="${coin.image}" alt="${coin.name}" width="20">${coin.name}</td>
                <td>${coin.symbol.toUpperCase()}</td>
                <td>$${coin.current_price}</td>
                <td>$${coin.total_volume}</td>
                <td class="${percentageClass}">${coin.price_change_percentage_24h}%</td>
                <td>Mkt Cap: $${coin.market_cap}</td>
            `;
        });
    }

  
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = cryptoData.filter(coin => 
            coin.name.toLowerCase().includes(searchTerm) || 
            coin.symbol.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredData);
    });

  
    sortMarketCapButton.addEventListener('click', () => {
        const sortedData = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
        renderTable(sortedData);
    });

    sortPercentageChangeButton.addEventListener('click', () => {
        const sortedData = [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        renderTable(sortedData);
    });
});
