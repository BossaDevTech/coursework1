document.addEventListener('DOMContentLoaded', function() {
    const flightDetails = JSON.parse(localStorage.getItem('selectedFlight'));

    document.getElementById('flightId').value = flightDetails.flightId;
    document.getElementById('flightNamePlaceholder').textContent = flightDetails.flightName;
    document.getElementById('flightNumberPlaceholder').textContent = flightDetails.flightNumber;
    document.getElementById('originCityPlaceholder').textContent = flightDetails.originCity;
    document.getElementById('destinationCityPlaceholder').textContent = flightDetails.destinationCity;
    document.getElementById('availableSeatsPlaceholder').textContent = flightDetails.availableSeats;
    document.getElementById('amountPlaceholder').textContent = '£' + flightDetails.amount; // Assuming amount is in pounds
    document.getElementById('departureDatePlaceholder').textContent = flightDetails.departureDate;
    document.getElementById('arrivalDatePlaceholder').textContent = flightDetails.arrivalDate;

    document.getElementById('bookingId').value = generateBookingId();
});

document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    const flightDetails = JSON.parse(localStorage.getItem('selectedFlight'));
    jsonData['flightDetails'] = flightDetails;

    fetch('http://localhost:8080/api/flightBookings/createBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert(data); // Display success message or handle response data
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

function generateBookingId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let bookingId = '';
    for (let i = 0; i < 8; i++) {
        bookingId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return bookingId;
}

document.addEventListener('DOMContentLoaded', function() {
    // Get the flight ID from localStorage or any other source
    const flightId = localStorage.getItem('selectedFlightId');

    // Fetch map details for the selected flight
    fetchMapDetails(flightId);
});

function fetchMapDetails(flightId) {
    fetch(`http://localhost:8080/api/map/${flightId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(mapData => {
            // Display the map image in the mapContainer
            const mapContainer = document.getElementById('mapContainer');
            const mapImage = document.createElement('img');
            mapImage.src = `data:image/png;base64,${mapData.imageData}`;
            mapContainer.appendChild(mapImage);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchWeatherDetails(flightId) {
    fetch(`http://localhost:8080/api/weather/${flightId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(weatherData => {
            const weatherDetailsPlaceholder = document.getElementById('weatherDetailsPlaceholder');
            weatherDetailsPlaceholder.innerHTML = `
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
