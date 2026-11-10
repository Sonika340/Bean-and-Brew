/**
 * Bean & Brew - Table Reservation Script
 * Handles custom validation, field constraints, and booking confirmation display.
 */

document.addEventListener('DOMContentLoaded', () => {
  initReservationForm();
});

function initReservationForm() {
  const form = document.getElementById('reservationForm');
  const confirmationCard = document.getElementById('reservationConfirmation');
  const resetBtn = document.getElementById('bookAnotherBtn');
  const dateInput = document.getElementById('resDate');

  if (!form) return;

  // Set the minimum selectable date to today's date
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Real-time error clearing when user fixes input
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    input.addEventListener('input', () => clearFieldError(input));
    input.addEventListener('change', () => clearFieldError(input));
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all required fields
    const isValid = validateReservationForm(form);

    if (!isValid) {
      // Focus first invalid input for accessibility
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Extract form values
    const name = form.resName.value.trim();
    const phone = form.resPhone.value.trim();
    const date = form.resDate.value;
    const time = form.resTime.value;
    const guests = form.resGuests.value;
    const notes = form.resNotes ? form.resNotes.value.trim() : '';

    // Generate random booking reference
    const refCode = 'BNB-' + Math.floor(1000 + Math.random() * 9000);

    // Format display date
    const dateObj = new Date(date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // Populate confirmation card
    document.getElementById('confRef').textContent = refCode;
    document.getElementById('confName').textContent = name;
    document.getElementById('confPhone').textContent = phone;
    document.getElementById('confDateTime').textContent = `${formattedDate} at ${time}`;
    document.getElementById('confGuests').textContent = `${guests} ${guests === '1' ? 'Guest' : 'Guests'}`;

    const notesRow = document.getElementById('confNotesRow');
    const notesEl = document.getElementById('confNotes');
    if (notes && notesRow && notesEl) {
      notesEl.textContent = notes;
      notesRow.style.display = 'block';
    } else if (notesRow) {
      notesRow.style.display = 'none';
    }

    // Hide form, show confirmation
    form.style.display = 'none';
    confirmationCard.classList.add('is-visible');
    confirmationCard.setAttribute('tabindex', '-1');
    confirmationCard.focus();
  });

  // Reset and book another table
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      confirmationCard.classList.remove('is-visible');
      form.style.display = 'block';
      const firstInput = form.querySelector('input');
      if (firstInput) firstInput.focus();
    });
  }
}

/**
 * Validates individual inputs and displays accessible error messages.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateReservationForm(form) {
  let isValid = true;

  // 1. Name validation (min 2 chars)
  const nameInput = form.resName;
  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    setFieldError(nameInput, 'Please enter your full name (at least 2 characters).');
    isValid = false;
  } else {
    clearFieldError(nameInput);
  }

  // 2. Phone validation (at least 7 digits, standard phone chars)
  const phoneInput = form.resPhone;
  const phonePattern = /^[\d\s\-\+\(\)]{7,18}$/;
  if (!phoneInput.value.trim() || !phonePattern.test(phoneInput.value.trim())) {
    setFieldError(phoneInput, 'Please enter a valid phone number (e.g. 555-123-4567).');
    isValid = false;
  } else {
    clearFieldError(phoneInput);
  }

  // 3. Date validation (must not be empty, must be today or future)
  const dateInput = form.resDate;
  if (!dateInput.value) {
    setFieldError(dateInput, 'Please select a reservation date.');
    isValid = false;
  } else {
    const selectedDate = new Date(dateInput.value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setFieldError(dateInput, 'Reservation date cannot be in the past.');
      isValid = false;
    } else {
      clearFieldError(dateInput);
    }
  }

  // 4. Time validation (must select an available time slot)
  const timeInput = form.resTime;
  if (!timeInput.value) {
    setFieldError(timeInput, 'Please select your preferred arrival time.');
    isValid = false;
  } else {
    clearFieldError(timeInput);
  }

  // 5. Number of guests
  const guestsInput = form.resGuests;
  if (!guestsInput.value || parseInt(guestsInput.value, 10) < 1) {
    setFieldError(guestsInput, 'Please choose the number of guests.');
    isValid = false;
  } else {
    clearFieldError(guestsInput);
  }

  return isValid;
}

/**
 * Sets error state on a form control and displays error text.
 * @param {HTMLElement} input
 * @param {string} message
 */
function setFieldError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  const parent = input.closest('.form-group');
  if (parent) {
    parent.classList.add('has-error');
    const errorSpan = parent.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }
}

/**
 * Clears error state on a form control.
 * @param {HTMLElement} input
 */
function clearFieldError(input) {
  input.removeAttribute('aria-invalid');
  const parent = input.closest('.form-group');
  if (parent) {
    parent.classList.remove('has-error');
  }
}
