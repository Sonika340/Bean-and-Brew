/**
 * Bean & Brew - Contact Form Script
 * Handles input validation, accessibility, and feedback for the contact form.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contactForm');
  const confirmation = document.getElementById('contactConfirmation');
  const resetBtn = document.getElementById('contactAnotherBtn');

  if (!form) return;

  // Real-time error clearing
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    input.addEventListener('input', () => clearFieldError(input));
    input.addEventListener('change', () => clearFieldError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // 1. Name validation
    const nameInput = form.contactName;
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setFieldError(nameInput, 'Please provide your name (at least 2 characters).');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // 2. Email validation
    const emailInput = form.contactEmail;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'Please enter a valid email address (e.g. name@example.com).');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // 3. Subject validation
    const subjectInput = form.contactSubject;
    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
      setFieldError(subjectInput, 'Please specify the subject of your inquiry.');
      isValid = false;
    } else {
      clearFieldError(subjectInput);
    }

    // 4. Message validation
    const messageInput = form.contactMessage;
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setFieldError(messageInput, 'Please write your message (at least 10 characters).');
      isValid = false;
    } else {
      clearFieldError(messageInput);
    }

    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Display sender's name in confirmation
    const senderName = nameInput.value.trim();
    const confNameEl = document.getElementById('contactSenderName');
    if (confNameEl) {
      confNameEl.textContent = senderName;
    }

    // Hide form, show confirmation
    form.style.display = 'none';
    if (confirmation) {
      confirmation.classList.add('is-visible');
      confirmation.setAttribute('tabindex', '-1');
      confirmation.focus();
    }
  });

  if (resetBtn && confirmation) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      confirmation.classList.remove('is-visible');
      form.style.display = 'block';
      const firstInput = form.querySelector('input');
      if (firstInput) firstInput.focus();
    });
  }
}

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

function clearFieldError(input) {
  input.removeAttribute('aria-invalid');
  const parent = input.closest('.form-group');
  if (parent) {
    parent.classList.remove('has-error');
  }
}
