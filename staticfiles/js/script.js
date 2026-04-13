// Currency button toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const EUR_TO_GBP = 1.16; // Exchange rate
    const TIERS = {
        budget: { pricePerNight: 25, displayId: 'budgetCostDisplay', rangeId: 'budgetAmountPeople', bankDetailsId: 'budgetCostBankDetails' },
        midrange: { pricePerNight: 50, displayId: 'midrangeCostDisplay', rangeId: 'midrangeAmountPeople', bankDetailsId: 'midrangeCostBankDetails' },
        comfort: { pricePerNight: 75, displayId: 'comfortCostDisplay', rangeId: 'comfortAmountPeople', bankDetailsId: 'comfortCostBankDetails' }
    };
    const NIGHTS = 2;

    // Bank details data
    const BANK_DETAILS = {
        gbp: `
            <p class="mb-0"><strong>Account Name:</strong> Wouter Klinkenberg</p>
            <p class="mb-0"><strong>Sort Code:</strong> 60-83-71</p>
            <p class="mb-0"><strong>Account Number:</strong> 09247461</p>
        `,
        eur: `
            <p class="mb-0"><strong>Account Name:</strong> Wouter Klinkenberg</p>
            <p class="mb-0"><strong>IBAN:</strong> GB46SRLG60837109247461</p>
            <p class="mb-0"><strong>SWIFT/BIC:</strong> SRLGGB2L</p>
        `
    };

    // Function to update cost display
    function updateCostDisplay(tier, rangeValue, currency) {
        const pricePerNight = TIERS[tier].pricePerNight;
        const displayEl = document.getElementById(TIERS[tier].displayId);
        
        if (!displayEl) return;

        const priceFor2Nights = pricePerNight * NIGHTS;
        const people = parseInt(rangeValue);
        let total, symbol, display;

        if (currency === 'gbp') {
            total = priceFor2Nights * people;
            symbol = '£';
            display = `${symbol}${pricePerNight} per person × ${people} ${people === 1 ? 'person' : 'people'} × ${NIGHTS} nights = <strong>${symbol}${total} in total</strong>`;
        } else {
            const eurPricePerNight = Math.round(pricePerNight * EUR_TO_GBP);
            const eurTotal = eurPricePerNight * NIGHTS * people;
            symbol = '€';
            display = `${symbol}${eurPricePerNight} per person × ${people} ${people === 1 ? 'person' : 'people'} × ${NIGHTS} nights = <strong>${symbol}${eurTotal} in total</strong>`;
        }

        displayEl.innerHTML = display;
    }

    // Function to update bank details display
    function updateBankDetails(tier, currency) {
        const bankDetailsEl = document.getElementById(TIERS[tier].bankDetailsId);
        if (bankDetailsEl && BANK_DETAILS[currency]) {
            bankDetailsEl.innerHTML = BANK_DETAILS[currency];
        }
    }

    function updateGuestNameFields(tier, numberOfPeople) {
        const nameFieldsContainer = document.getElementById(`${tier}NameFields`);
        if (!nameFieldsContainer) return;
        
        // Clear existing fields
        nameFieldsContainer.innerHTML = '';
        
        // Create input fields for each person
        for (let i = 1; i <= numberOfPeople; i++) {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'mb-2';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.id = `${tier}GuestName${i}`;
            input.placeholder = `Guest ${i} name`;
            input.required = true;
            
            inputDiv.appendChild(input);
            nameFieldsContainer.appendChild(inputDiv);
        }
    }

    // Find all button groups with currency buttons and add toggle listeners
    document.querySelectorAll('.btn-group .btn-rose').forEach(button => {
        button.addEventListener('click', function() {
            const currencyGroup = this.closest('.btn-group');
            const currency = this.getAttribute('data-currency');
            
            // Remove active class from all buttons in this group
            currencyGroup.querySelectorAll('.btn-rose').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');

            // Find the associated range input and update display
            const breakdownDiv = currencyGroup.closest('.modal-body');
            if (breakdownDiv) {
                const rangeInput = breakdownDiv.querySelector('input[type="range"][id*="AmountPeople"]');
                if (rangeInput) {
                    const rangeId = rangeInput.id;
                    const tier = rangeId.replace('AmountPeople', '').toLowerCase();
                    updateCostDisplay(tier, rangeInput.value, currency);
                    updateBankDetails(tier, currency);
                }
            }
        });
    });

    // Amount of people range slider display and cost calculation
    document.querySelectorAll('input[type="range"][id*="AmountPeople"]').forEach(rangeInput => {
        const displaySpan = rangeInput.nextElementSibling;
        const tier = rangeInput.id.replace('AmountPeople', '').toLowerCase();
        
        if (displaySpan && displaySpan.classList.contains('amount-people-display')) {
            // Update display on input change
            rangeInput.addEventListener('input', function() {
                const value = this.value;
                const text = value === '1' ? '1 person' : value + ' people';
                displaySpan.textContent = text;

                // Update cost display
                const currencyBtn = document.querySelector(`#${this.id}`).closest('.modal-body')?.querySelector('.btn-group .btn-rose.active');
                const currency = currencyBtn?.getAttribute('data-currency') || 'gbp';
                updateCostDisplay(tier, value, currency);
                
                // Update dynamic name fields
                updateGuestNameFields(tier, value);
            });
            // Set initial display
            const initialValue = rangeInput.value;
            const initialText = initialValue === '1' ? '1 person' : initialValue + ' people';
            displaySpan.textContent = initialText;
            
            // Initialize cost display and bank details
            updateCostDisplay(tier, initialValue, 'gbp');
            updateBankDetails(tier, 'gbp');
            
            // Initialize guest name fields
            updateGuestNameFields(tier, initialValue);
        }
    });
});

// Scroll to element function
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Handle confirmation checkbox and button enable/disable
document.addEventListener('DOMContentLoaded', function() {
    const confirmationCheckboxes = [
        { checkbox: 'confirmFinalBooking-budget', button: 'completeButton-budget' },
        { checkbox: 'confirmFinalBooking-midrange', button: 'completeButton-midrange' },
        { checkbox: 'confirmFinalBooking-comfort', button: 'completeButton-comfort' }
    ];

    confirmationCheckboxes.forEach(pair => {
        const checkbox = document.getElementById(pair.checkbox);
        const button = document.getElementById(pair.button);

        if (checkbox && button) {
            checkbox.addEventListener('change', function() {
                button.disabled = !this.checked;
            });
        }
    });

    // Handle ready-to-pay checkbox to show/hide payment details
    const readyToPayCheckboxes = [
        { checkbox: 'ready-to-pay-check-budget', details: 'budgetPaymentDetails' },
        { checkbox: 'ready-to-pay-check-midrange', details: 'midrangePaymentDetails' },
        { checkbox: 'ready-to-pay-check-comfort', details: 'comfortPaymentDetails' }
    ];

    readyToPayCheckboxes.forEach(pair => {
        const checkbox = document.getElementById(pair.checkbox);
        const detailsDiv = document.getElementById(pair.details);

        if (checkbox && detailsDiv) {
            checkbox.addEventListener('change', function() {
                detailsDiv.style.display = this.checked ? 'block' : 'none';
            });
        }
    });

    // Function to reset booking modal form
    function resetBookingModal(tierLower) {
        // Uncheck ready-to-pay checkbox
        const readyToPayCheckbox = document.getElementById(`ready-to-pay-check-${tierLower}`);
        if (readyToPayCheckbox) {
            readyToPayCheckbox.checked = false;
        }
        
        // Hide payment details
        const paymentDetailsDiv = document.getElementById(`${tierLower}PaymentDetails`);
        if (paymentDetailsDiv) {
            paymentDetailsDiv.style.display = 'none';
        }
        
        // Uncheck confirmation checkbox
        const confirmCheckbox = document.getElementById(`confirmFinalBooking-${tierLower}`);
        if (confirmCheckbox) {
            confirmCheckbox.checked = false;
        }
        
        // Reset range slider to 1
        const rangeSlider = document.getElementById(`${tierLower}AmountPeople`);
        if (rangeSlider) {
            rangeSlider.value = '1';
            // Trigger change event to update displays
            rangeSlider.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Reset currency to GBP (first button should be active)
        const currencyButtons = document.querySelectorAll(`#paymentModal${tierLower.charAt(0).toUpperCase() + tierLower.slice(1)} .btn-group .btn-rose`);
        currencyButtons.forEach(btn => btn.classList.remove('active'));
        if (currencyButtons.length > 0) {
            currencyButtons[0].classList.add('active');
        }
        
        // Clear all guest name fields
        const nameFieldsContainer = document.getElementById(`${tierLower}NameFields`);
        if (nameFieldsContainer) {
            nameFieldsContainer.innerHTML = '';
        }
    }

    // Handle Complete Booking button clicks - submit form and transition to confirmation modal
    const completeBookingButtons = [
        { button: 'completeButton-budget', paymentModal: 'paymentModalBudget', tier: 'Budget', costPerPerson: 25 },
        { button: 'completeButton-midrange', paymentModal: 'paymentModalMidrange', tier: 'Mid-Range', costPerPerson: 50 },
        { button: 'completeButton-comfort', paymentModal: 'paymentModalComfort', tier: 'Comfort', costPerPerson: 75 }
    ];

    completeBookingButtons.forEach(pair => {
        const button = document.getElementById(pair.button);
        if (button) {
            button.addEventListener('click', async function() {
                // Collect form data
                const tierLower = pair.tier.toLowerCase().replace('-', '');
                const numberOfPeople = parseInt(document.getElementById(`${tierLower}AmountPeople`).value);
                const currency = document.querySelector(`#${pair.paymentModal} .btn-group .btn.active`).dataset.currency === 'gbp' ? 'GBP' : 'EUR';
                
                // Collect all guest names
                const guestNames = [];
                for (let i = 1; i <= numberOfPeople; i++) {
                    const fieldId = `${tierLower}GuestName${i}`;
                    const nameInput = document.getElementById(fieldId);
                    
                    if (nameInput) {
                        const name = nameInput.value.trim();
                        if (!name) {
                            alert(`Please fill in guest name #${i}`);
                            return;
                        }
                        guestNames.push(name);
                    } else {
                        alert(`Guest name field #${i} not found.`);
                        return;
                    }
                }
                
                // Validate all names are filled
                if (guestNames.length === 0 || guestNames.length !== numberOfPeople) {
                    alert('Please fill in all guest names');
                    return;
                }
                
                
                // Calculate total cost
                const costPerPerson = pair.costPerPerson;
                const nights = 2;
                let totalCost = costPerPerson * numberOfPeople * nights;
                
                // Apply currency conversion if EUR
                if (currency === 'EUR') {
                    totalCost = (totalCost * 1.18).toFixed(2);
                }
                
                // Disable button to prevent double submissions
                button.disabled = true;
                button.textContent = 'Submitting...';
                
                try {
                    // Get CSRF token from cookie
                    function getCookie(name) {
                        let cookieValue = null;
                        if (document.cookie && document.cookie !== '') {
                            const cookies = document.cookie.split(';');
                            for (let i = 0; i < cookies.length; i++) {
                                const cookie = cookies[i].trim();
                                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                    break;
                                }
                            }
                        }
                        return cookieValue;
                    }
                    const csrftoken = getCookie('csrftoken');
                    
                    // POST data to backend
                    const response = await fetch('/api/submit-booking/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken || ''
                        },
                        body: JSON.stringify({
                            guestNames: guestNames,
                            numberOfPeople: numberOfPeople,
                            tier: pair.tier,
                            cost: totalCost,
                            currency: currency
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        // Update confirmation modal text with tier information
                        const tierText = document.getElementById('confirmationTierText');
                        if (tierText) {
                            tierText.textContent = `Your requested beds for ${pair.tier} Accommodation have been successfully booked. You're all set for your stay from 24 to 26 July!`;
                        }
                        
                        // Close payment modal
                        const paymentModal = bootstrap.Modal.getInstance(document.getElementById(pair.paymentModal));
                        if (paymentModal) {
                            paymentModal.hide();
                        }
                        
                        // Reset the form
                        const tierLower = pair.tier.toLowerCase().replace('-', '');
                        resetBookingModal(tierLower);
                        
                        // Open confirmation modal
                        setTimeout(() => {
                            const confirmationModal = new bootstrap.Modal(document.getElementById('bookingConfirmationModal'));
                            confirmationModal.show();
                        }, 300);
                    } else {
                        alert('Error submitting booking: ' + (result.error || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error submitting booking. Please try again.');
                } finally {
                    // Re-enable button
                    button.disabled = false;
                    button.textContent = 'Complete Booking';
                }
            });
        }
    });
});
