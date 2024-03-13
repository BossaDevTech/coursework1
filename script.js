document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchResultsDiv = document.getElementById('searchResults');
   

    let searchData; // Define a variable to store search data

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const originCity = document.getElementById('originCity').value;
        const destinationCity = document.getElementById('destinationCity').value;

        fetch(`http://localhost:8080/api/flights/search?originCity=${originCity}&destinationCity=${destinationCity}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                searchData = data; // Store search data
                searchResultsDiv.innerHTML = '';

                if (data.length > 0) {
                    data.forEach(flight => {
                        const flightInfo = document.createElement('div');
                        flightInfo.classList.add('flight-info');
                        flightInfo.innerHTML = `
                            <p>Flight ID: ${flight.flightId}</p>
                            <h2>Flight Name: ${flight.flightName}</h2>
                            <p>Flight Number: ${flight.flightNumber}</p>
                            <p>Origin: ${flight.originCity}</p>
                            <p>Destination: ${flight.destinationCity}</p>
                            <p>Available Seats: ${flight.availableSeats}</p>
                            <p>Amount: <span class="amount-pound">£${flight.amount}</span></p>
                            <p>Departure Date: ${flight.departureDate}</p>
                            <p>Arrival Date: ${flight.arrivalDate}</p>
                        `;
                        const bookFlightButton = document.createElement('button');
                        bookFlightButton.textContent = 'Book Flight';
                        bookFlightButton.addEventListener('click', () => bookFlight(flight.flightId));
                        flightInfo.appendChild(bookFlightButton);
                        searchResultsDiv.appendChild(flightInfo);
                    });
                } else {
                    searchResultsDiv.textContent = 'No flights found.';
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });

    // Fetch weather details for the selected flight
function fetchWeatherDetails(flightId) {
    fetch(`http://localhost:8080/api/weather/${flightId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(weatherData => {
            const weatherDetailsDiv = document.getElementById(`weatherDetails-${flightId}`);
            weatherDetailsDiv.innerHTML = `
                <h3>Weather Details</h3>
                <p>Actual Temperature: ${weatherData.actualTemperature}°C</p>
                <p>Feels Like Temperature: ${weatherData.feelsLikeTemperature}°C</p>
                <p>Wind Speed: ${weatherData.windSpeed} m/s</p>
                <p>Latitude: ${weatherData.latitude}</p>
                <p>Longitude: ${weatherData.longitude}</p>
            `;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

    function bookFlight(flightId) {
        const selectedFlight = searchData.find(flight => flight.flightId === flightId);
        localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
        window.location.href = 'booking.html';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Fetch currency conversion data when the page loads
    fetchCurrencyConversionData();

    // Event listener for currency selection change
    document.getElementById('currencySelect').addEventListener('change', function(event) {
        const selectedCurrency = event.target.value;
        updateFlightPrices(selectedCurrency);
    });
});

function fetchCurrencyConversionData() {
    
    fetch('http://localhost:8080/api/currency-conversion')
        .then(response => response.json())
        .then(data => {
            populateCurrencyDropdown(data);
        })
        .catch(error => {
            console.error('Error fetching currency conversion data:', error);
        });
}

function populateCurrencyDropdown(currencyData) {
    const currencySelect = document.getElementById('currencySelect');
    currencyData.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.curCode;
        option.textContent = `${currency.curCode} - (${currency.curSymbol}) - Conversion Rate: ${currency.curConvRate}`;
        currencySelect.appendChild(option);
    });
}

function updateFlightPrices(selectedCurrency) {
    console.log('Selected Currency:', selectedCurrency);
    const flightPrices = document.querySelectorAll('.flight-info .amount-pound');
    flightPrices.forEach(price => {
        const currentPrice = parseFloat(price.dataset.price);
        console.log('Current Price:', currentPrice);
        const convertedPrice = (currentPrice * selectedCurrency.curConvRate).toFixed(2);
        console.log('Converted Price:', convertedPrice);
        price.textContent = `${selectedCurrency.curSymbol}${convertedPrice}`;
    });
}

document.getElementById('currencySelect').addEventListener('change', function(event) {
    const selectedCurrencyCode = event.target.value;
    const selectedCurrency = currencyData.find(currency => currency.curCode === selectedCurrencyCode);
    if (selectedCurrency) {
        updateFlightPrices(selectedCurrency);
    }
});

