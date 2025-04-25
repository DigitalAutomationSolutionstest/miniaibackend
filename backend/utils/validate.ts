// Espressione regolare per validare email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Espressione regolare per validare numeri di telefono italiani
const PHONE_REGEX = /^(\+39)?[ ]?3\d{2}[ ]?\d{6,7}$/;

/**
 * Valida un indirizzo email
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Valida un numero di telefono (formato italiano)
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  return PHONE_REGEX.test(phone.trim());
}

/**
 * Valida un nome (minimo 2 caratteri, massimo 50)
 */
export function validateName(name: string): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
}

/**
 * Valida una password (minimo 8 caratteri, almeno una lettera e un numero)
 */
export function validatePassword(password: string): boolean {
  if (!password) return false;
  // Almeno 8 caratteri, almeno una lettera e un numero
  return password.length >= 8 && 
         /[a-zA-Z]/.test(password) && 
         /\d/.test(password);
}

/**
 * Verifica che una stringa non sia vuota
 */
export function validateRequired(value: string): boolean {
  if (!value) return false;
  return value.trim().length > 0;
}

/**
 * Validazione complessiva del form di richiesta preventivo
 */
export function validateQuoteForm(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}): { valid: boolean; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (!validateName(data.name)) {
    errors.name = 'Nome non valido';
  }
  
  if (!validateEmail(data.email)) {
    errors.email = 'Email non valida';
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Numero di telefono non valido';
  }
  
  if (!validateRequired(data.message)) {
    errors.message = 'Messaggio richiesto';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  };
}

/**
 * Validazione complessiva del form di registrazione
 */
export function validateRegistrationForm(data: {
  name: string;
  email: string;
  password: string;
}): { valid: boolean; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (!validateName(data.name)) {
    errors.name = 'Nome non valido';
  }
  
  if (!validateEmail(data.email)) {
    errors.email = 'Email non valida';
  }
  
  if (!validatePassword(data.password)) {
    errors.password = 'Password non valida (minimo 8 caratteri, almeno una lettera e un numero)';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  };
} 