import { Resend } from 'resend';

// Crea l'istanza di Resend come funzione esportata
// per evitare l'inizializzazione durante la build
export function createResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Variabile d\'ambiente RESEND_API_KEY mancante');
  }
  
  return new Resend(process.env.RESEND_API_KEY);
}

// Interfaccia semplificata per le email
interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

// Esporta l'istanza per compatibilità con il codice esistente
export const resend = {
  emails: {
    send: async (options: EmailOptions) => {
      const client = createResendClient();
      // Cast delle opzioni per il tipo corretto
      const emailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
      } as any;
      
      if (options.html) emailOptions.html = options.html;
      if (options.text) emailOptions.text = options.text;
      
      return client.emails.send(emailOptions);
    },
  },
}; 