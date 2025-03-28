document.getElementById('btnSearch').addEventListener('click', function() {
    const userInput = document.getElementById('destinationInput').value.toLowerCase().trim();
    
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log("Datos cargados:", data);
            const oldResults = document.querySelector('.results-container');
            if (oldResults) oldResults.remove();

            if (!userInput) {
                alert("Please enter a search term");
                return;
            }

            const results = [];

            if (userInput.includes('beach')) {
                results.push(...data.beaches);
            }
            

            if (userInput.includes('temple')) {
                results.push(...data.temples);
            }
            

            data.countries.forEach(country => {
                if (country.name.toLowerCase().startsWith(userInput)) {
                    results.push(...country.cities);
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().startsWith(userInput)) {
                            results.push(city);
                        }
                    });
                }
            });

            if (results.length > 0) {
                displayResults(results);
            } else {
                alert("No destinations found. Try searching for:\n- A country (e.g., 'Japan')\n- 'beach' or 'beaches'\n- 'temple' or 'temples'");
            }
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert("Error loading travel data. Please try again later.");
        });
});

document.getElementById('btnClear').addEventListener('click', function() {
    document.getElementById('destinationInput').value = '';
    const results = document.querySelector('.results-container');
    if (results) results.remove();
});

function displayResults(results) {
    const resultsColumn = document.getElementById('resultsColumn');
    resultsColumn.innerHTML = '';
    
    if (results.length === 0) return;
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-container';
    
    results.forEach(item => {
        resultsContainer.innerHTML += `
            <div class="destination-card">
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
    });
    
    resultsColumn.appendChild(resultsContainer);
}