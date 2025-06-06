import mailjet from '../config/mailjet.js';

export const enviarEmailBienvenida = async (nombre, email) => {
  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "elzenyt906@gmail.com",
            Name: "Gamers Needs"
          },
          To: [
            {
              Email: email,
              Name: nombre
            }
          ],
          Subject: "¡Bienvenido a Gamers Needs!",
          HTMLPart: `
            <div style="background-color: #272727; padding: 20px; color: white; font-family: Arial, sans-serif;">
              <h1 style="color: #FF4C1A;">¡Bienvenido a Gamers Needs, ${nombre}!</h1>
              <p>¡Gracias por unirte a nuestra comunidad de gamers!</p>
              <p>En Gamers Needs encontrarás:</p>
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px 0;">🎮 Los mejores juegos al mejor precio</li>
                <li style="margin: 10px 0;">🏆 Una comunidad activa de jugadores</li>
                <li style="margin: 10px 0;">⚡ Activación instantánea de juegos</li>
              </ul>
              <div style="margin-top: 20px; text-align: center;">
                <a href="${process.env.FRONTEND_URL}" 
                   style="background-color: #FF4C1A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Visitar la tienda
                </a>
              </div>
            </div>
          `
        }
      ]
    });
    return result;
  } catch (error) {
    console.error('Error en enviarEmailBienvenida:', error);
    throw error;
  }
};