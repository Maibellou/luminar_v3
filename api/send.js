import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Luminar Web 💎 <web@luminarcristales.com.ar>',
      to: 'info@luminarcristales.com.ar',
      reply_to: email,
      subject: `Nuevo mensaje de ${name} desde la web`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `
    });

    if (error) {
      console.error('Error enviando email:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error inesperado:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
