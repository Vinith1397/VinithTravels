document.addEventListener("DOMContentLoaded", () => {
    fetchRecommendations();
    
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', handleSearch);

    const clearButton = document.getElementById('clear-button');
    clearButton.addEventListener('click', clearSearch);
});

async function fetchRecommendations() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        console.log(data); // To check if the data is fetched correctly
        window.recommendationsData = data; // Store data globally for search functionality
        displayRecommendations(data);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

function displayRecommendations(recommendations) {
    const recommendationsContainer = document.getElementById('recommendations-container');
    recommendationsContainer.innerHTML = ''; // Clear any existing content

    recommendations.forEach(country => {
        country.cities.forEach(city => {
            const recommendationElement = document.createElement('div');
            recommendationElement.classList.add('recommendation');

            const imgElement = document.createElement('img');
            imgElement.src = city.imageUrl;
            imgElement.alt = city.name;

            const nameElement = document.createElement('h3');
            nameElement.textContent = city.name;

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = city.description;

            recommendationElement.appendChild(imgElement);
            recommendationElement.appendChild(nameElement);
            recommendationElement.appendChild(descriptionElement);

            recommendationsContainer.appendChild(recommendationElement);
        });
    });
}

function handleSearch() {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    if (searchInput) {
        const filteredRecommendations = filterRecommendations(searchInput);
        displayRecommendations(filteredRecommendations);
    }
}

function filterRecommendations(keyword) {
    const filteredData = [];

    window.recommendationsData.forEach(country => {
        const matchingCities = country.cities.filter(city => {
            const cityLowerCase = city.name.toLowerCase();
            const descriptionLowerCase = city.description.toLowerCase();
            return cityLowerCase.includes(keyword) || descriptionLowerCase.includes(keyword);
        });

        if (matchingCities.length > 0) {
            filteredData.push({
                id: country.id,
                name: country.name,
                cities: matchingCities
            });
        }
    });

    return filteredData;
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    displayRecommendations(window.recommendationsData);
}
