document.getElementById('btnSearch').addEventListener('click', function() {
    const userInput = document.getElementById('destinationInput').value.toLowerCase().trim();
    
    fetch('travel_recommendation_api.json')  // Asegúrate de que el nombre del archivo JSON es correcto
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
            
            // Buscar en playas (beaches)
            if (userInput.includes('beach') || userInput.includes('playa')) {
                results.push(...data.beaches);
            }
            
            // Buscar en templos (temples)
            if (userInput.includes('temple') || userInput.includes('templo')) {
                results.push(...data.temples);
            }
            
            // Buscar en países y ciudades
            data.countries.forEach(country => {
                // Buscar por nombre de país (ej: "japan")
                if (country.name.toLowerCase().includes(userInput)) {
                    results.push(...country.cities);
                } else {
                    // Buscar por nombre de ciudad SOLO si no coincidió el país
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(userInput)) {
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
    resultsColumn.innerHTML = ''; // Limpiar resultados anteriores
    
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