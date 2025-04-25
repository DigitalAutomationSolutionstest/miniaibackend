import { Resend } from 'resend';

export function createResendClient() {
  // Verifica le variabili d'ambiente a runtime
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Variabile d\'ambiente RESEND_API_KEY richiesta');
  }

  // Crea il client solo a runtime, mai durante la build
  return new Resend(process.env.RESEND_API_KEY);
}

// Funzione helper per inviare email
export async function sendEmail({ 
  to, 
  subject, 
  html, 
  from = 'MiniAI <noreply@miniaiapps.tech>' 
}: { 
  to: string; 
  subject: string; 
  html: string; 
  from?: string; 
}) {
  const resend = createResendClient();
  
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Errore invio email:', error);
      throw new Error(`Errore invio email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Errore servizio email:', error);
    throw error;
  }
} 