const vehicles = [
    { name: "Renault Clio", description: "Economique et pratique", image: "clio.png", price: 350 },
    { name: "Dacia Sandero", description: "Confort et fiabilite", image: "dacia.png", price: 300 },
    { name: "Volkswagen Golf 8", description: "Moderne et economique", image: "VOL.png", price: 500 },
    { name: "Peugeot 208 GT", description: "Ideale pour les familles", image: "208.png", price: 350 },
    { name: "Toyota Yaris", description: "Economique, fiable et ideale pour la ville", image: "TOYOTA.png", price: 250 },
    { name: "Ford Focus", description: "Confortable et fiable", image: "ford.jpg", price: 400 },
    { name: "Hyundai i20", description: "Pratique et economique", image: "2.-Hyundai-i20.png", price: 350 },
    { name: "Renault Megane", description: "Confort et elegance", image: "megane.png", price: 450 },
    { name: "Dacia Logan", description: "Spacieuse et economique", image: "logan.png", price: 300 },
    { name: "Dacia Duster", description: "SUV robuste et confortable", image: "duster.png", price: 450 },
    { name: "Renault Captur", description: "SUV moderne et pratique", image: "captur.png", price: 450 },
    { name: "Peugeot 3008", description: "SUV confortable et premium", image: "3008.png", price: 550 },
    { name: "Volkswagen Polo", description: "Compacte et economique", image: "polo.png", price: 350 },
    { name: "Hyundai Tucson", description: "SUV spacieux et confortable", image: "tucson.png", price: 550 },
    { name: "Kia Picanto", description: "Petite et parfaite pour la ville", image: "picanto.png", price: 250 },
    { name: "Mercedes Classe A", description: "Premium, elegante et confortable", image: "mercedes-a.png", price: 700 }
];

// 2. Sélection de la grille HTML
const gridContainer = document.getElementById('vehicles-grid');

// 3. Boucle pour générer le HTML de chaque carte
gridContainer.innerHTML = vehicles.map(vehicle => `
    <div class="bg-white rounded-xl overflow-hidden shadow-soft border border-gray-100 flex flex-col p-4 group hover:shadow-lg transition-shadow">
        
        <div class="h-40 flex items-center justify-center p-4">
            <img src="${vehicle.image}" 
                 onerror="this.onerror=null; this.src='https://placehold.co/600x400?text=${vehicle.placeholderText}';"
                 alt="${vehicle.name}" 
                 class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300">
        </div>

        <div class="mt-4 flex flex-col flex-1">
            <h3 class="font-bold text-gray-900">${vehicle.name}</h3>

            <p class="text-gray-500 text-sm mb-4">
                ${vehicle.description}
            </p>

            <div class="inline-block w-fit bg-brand-main text-white font-bold px-4 py-1.5 rounded text-sm mb-4">
                ${vehicle.price} DH/jour
            </div>

            <!-- Bouton réservation -->
<button 
    onclick="reserveVehicle('${vehicle.name}')"
    class="w-full bg-brand-main hover:bg-brand-main/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-md active:scale-[0.98]">
    Réserver maintenant
</button>
        </div>
    </div>
`).join('');

// ==========================================
// SYSTÈME DE RÉSERVATION
// ==========================================

let selectedVehicle = null;

// Éléments du modal
const reservationModal = document.getElementById('reservation-modal');
const reservationOverlay = document.getElementById('reservation-overlay');
const closeReservationModal = document.getElementById('close-reservation-modal');
const cancelReservation = document.getElementById('cancel-reservation');


// ==========================================
// OUVRIR LE MODAL
// ==========================================

function reserveVehicle(vehicleName) {

    const vehicle = vehicles.find(v => v.name === vehicleName);

    if (!vehicle) {
        console.error("Véhicule introuvable :", vehicleName);
        return;
    }

    selectedVehicle = vehicle;

    // Remplir les informations du véhicule
    document.getElementById('reservation-vehicle-name').textContent =
        vehicle.name;

    document.getElementById('reservation-vehicle-description').textContent =
        vehicle.description;

    document.getElementById('reservation-vehicle-price').textContent =
        vehicle.price;

    document.getElementById('reservation-vehicle-image').src =
        vehicle.image;

    document.getElementById('reservation-vehicle-image').alt =
        vehicle.name;

    document.getElementById('summary-vehicle').textContent =
        vehicle.name;


    // Reset dates
    document.getElementById('reservation-start-date').value = '';
    document.getElementById('reservation-end-date').value = '';

    document.getElementById('reservation-start-time').value = '10:00';
    document.getElementById('reservation-end-time').value = '10:00';


    // Reset options
    document.querySelectorAll('.reservation-option').forEach(option => {
        option.checked = false;
    });


    // Reset erreur
    hideDateError();


    // Reset calcul
    updateReservationTotal();


    // Afficher modal
    reservationModal.classList.remove('hidden');

    // Bloquer scroll de la page
    document.body.classList.add('overflow-hidden');
}


// ==========================================
// FERMER LE MODAL
// ==========================================

function closeReservation() {

    reservationModal.classList.add('hidden');

    document.body.classList.remove('overflow-hidden');

    selectedVehicle = null;
}


closeReservationModal.addEventListener('click', closeReservation);

cancelReservation.addEventListener('click', closeReservation);

reservationOverlay.addEventListener('click', closeReservation);


// Fermer avec ESC
document.addEventListener('keydown', (event) => {

    if (event.key === 'Escape' &&
        !reservationModal.classList.contains('hidden')) {

        closeReservation();

    }

});


// ==========================================
// CALCUL DE LA DURÉE
// ==========================================

function calculateRentalDays() {

    const startDate =
        document.getElementById('reservation-start-date').value;

    const endDate =
        document.getElementById('reservation-end-date').value;


    if (!startDate || !endDate) {
        return 0;
    }


    const start = new Date(startDate + 'T00:00:00');

    const end = new Date(endDate + 'T00:00:00');


    const difference =
        end.getTime() - start.getTime();


    const days =
        Math.ceil(difference / (1000 * 60 * 60 * 24));


    return days;
}


// ==========================================
// AFFICHER ERREUR DATE
// ==========================================

function showDateError(message) {

    const error =
        document.getElementById('reservation-date-error');

    error.textContent = message;

    error.classList.remove('hidden');
}


function hideDateError() {

    const error =
        document.getElementById('reservation-date-error');

    error.textContent = '';

    error.classList.add('hidden');
}


// ==========================================
// CALCUL TOTAL
// ==========================================

function updateReservationTotal() {

    if (!selectedVehicle) {
        return;
    }


    const days = calculateRentalDays();


    // Vérification des dates
    if (days < 0) {

        showDateError(
            "La date de retour doit être après la date de départ."
        );

    } else {

        hideDateError();

    }


    // Prix véhicule
    const rentalPrice =
        days > 0
            ? days * Number(selectedVehicle.price)
            : 0;


    let optionsTotal = 0;


    const summaryOptions =
        document.getElementById('summary-options');

    summaryOptions.innerHTML = '';


    const selectedOptions =
        document.querySelectorAll(
            '.reservation-option:checked'
        );


    selectedOptions.forEach(option => {

        const price =
            Number(option.dataset.price);

        const label =
            option.dataset.label;

        // Vérifier si option par jour
        const isDaily =
            label === 'Assurance premium' ||
            label === 'GPS';


        const optionPrice =
            isDaily
                ? price * days
                : price;


        optionsTotal += optionPrice;


        const optionElement =
            document.createElement('div');

        optionElement.className =
            'flex justify-between text-sm';


        optionElement.innerHTML = `
            <span class="text-gray-500">
                ${label}
                ${isDaily && days > 0 ? `(${days} jours)` : ''}
            </span>

            <span class="font-semibold text-gray-900">
                ${optionPrice.toLocaleString('fr-FR')} DH
            </span>
        `;


        summaryOptions.appendChild(optionElement);

    });


    // Total
    const total =
        rentalPrice + optionsTotal;


    // Affichage durée
    document.getElementById('summary-days').textContent =
        days > 0
            ? `${days} ${days === 1 ? 'jour' : 'jours'}`
            : '0 jour';


    // Prix location
    document.getElementById('summary-rental').textContent =
        `${rentalPrice.toLocaleString('fr-FR')} DH`;


    // Afficher/cacher options
    const optionsContainer =
        document.getElementById(
            'summary-options-container'
        );


    if (selectedOptions.length > 0) {

        optionsContainer.classList.remove('hidden');

    } else {

        optionsContainer.classList.add('hidden');

    }


    // Total
    document.getElementById('summary-total').textContent =
        total.toLocaleString('fr-FR');
}


// ==========================================
// ÉCOUTER LES CHANGEMENTS
// ==========================================

document.getElementById('reservation-start-date')
    .addEventListener('change', updateReservationTotal);


document.getElementById('reservation-end-date')
    .addEventListener('change', updateReservationTotal);


document.getElementById('reservation-start-time')
    .addEventListener('change', updateReservationTotal);


document.getElementById('reservation-end-time')
    .addEventListener('change', updateReservationTotal);


document.querySelectorAll('.reservation-option')
    .forEach(option => {

        option.addEventListener(
            'change',
            updateReservationTotal
        );

    });


// ==========================================
// EMPÊCHER DATE RETOUR AVANT DATE DÉPART
// ==========================================

document.getElementById('reservation-start-date')
    .addEventListener('change', function () {

        const endDate =
            document.getElementById('reservation-end-date');

        endDate.min = this.value;

        if (endDate.value && endDate.value < this.value) {

            endDate.value = '';

        }

        updateReservationTotal();

    });


// ==========================================
// DATE MINIMUM = AUJOURD'HUI
// ==========================================

const today =
    new Date().toISOString().split('T')[0];


document.getElementById('reservation-start-date').min =
    today;

document.getElementById('reservation-end-date').min =
    today;


// ==========================================
// CONTINUER LA RÉSERVATION
// ==========================================

document.getElementById('continue-reservation')
    .addEventListener('click', function () {

        if (!selectedVehicle) {
            return;
        }


        const startDate =
            document.getElementById('reservation-start-date').value;

        const endDate =
            document.getElementById('reservation-end-date').value;


        // Validation
        if (!startDate || !endDate) {

            showDateError(
                "Veuillez sélectionner une date de départ et une date de retour."
            );

            return;
        }


        const days = calculateRentalDays();


        if (days <= 0) {

            showDateError(
                "La date de retour doit être après la date de départ."
            );

            return;
        }


        const startTime =
            document.getElementById('reservation-start-time').value;

        const endTime =
            document.getElementById('reservation-end-time').value;


        // Options sélectionnées
        const selectedOptions = [];

        document.querySelectorAll(
            '.reservation-option:checked'
        ).forEach(option => {

            selectedOptions.push({
                label: option.dataset.label,
                price: Number(option.dataset.price)
            });

        });


        const rentalPrice =
            days * Number(selectedVehicle.price);


        let optionsTotal = 0;


        selectedOptions.forEach(option => {

            const isDaily =
                option.label === 'Assurance premium' ||
                option.label === 'GPS';


            optionsTotal += isDaily
                ? option.price * days
                : option.price;

        });


        const total =
            rentalPrice + optionsTotal;


        // Pour le moment :
        console.log({
            vehicle: selectedVehicle,
            startDate,
            endDate,
            startTime,
            endTime,
            days,
            options: selectedOptions,
            rentalPrice,
            optionsTotal,
            total
        });


        // Exemple de redirection
        const params = new URLSearchParams({

            vehicle: selectedVehicle.name,

            startDate,
            endDate,

            startTime,
            endTime,

            days,

            total

        });


        window.location.href =
            `reservation.html?${params.toString()}`;

    });

        document.addEventListener('DOMContentLoaded', () => {
            // Mobile Menu Toggle
            const mobileBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            let isMenuOpen = false;

            mobileBtn.addEventListener('click', () => {
                isMenuOpen = !isMenuOpen;
                if (isMenuOpen) {
                    mobileMenu.classList.remove('hidden');
                    mobileBtn.innerHTML = '<i class="ph ph-x text-3xl"></i>';
                } else {
                    mobileMenu.classList.add('hidden');
                    mobileBtn.innerHTML = '<i class="ph ph-list text-3xl"></i>';
                }
            });

            // Close mobile menu on link click
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    isMenuOpen = false;
                    mobileMenu.classList.add('hidden');
                    mobileBtn.innerHTML = '<i class="ph ph-list text-3xl"></i>';
                });
            });
        });




        // ==================== ==================== ==================== ==================== ==================== ====================

        
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', isOpen);
            mobileBtn.innerHTML = isOpen
                ? '<i class="ph ph-list text-3xl"></i>'
                : '<i class="ph ph-x text-3xl"></i>';
        });

        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileBtn.innerHTML = '<i class="ph ph-list text-3xl"></i>';
            });
        }); haki