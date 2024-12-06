const elevenLabsApiKey = "sk_523a264e1da67056d640b6c24ebb01a3f3b44bf8c03202cf";
const voiceId = "15bJsujCI3tcDWeoZsQP"; // Voz en español latino

/**
 * Función para reproducir texto mediante Eleven Labs.
 * @param {string} message - Texto que será convertido a voz.
 * @param {object} settings - Configuración de la voz (estabilidad, similitud).
 */
async function playVoice(message, settings = { stability: 0.5, similarity_boost: 0.75 }) {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "xi-api-key": elevenLabsApiKey,
        },
        body: JSON.stringify({
            text: message,
            model_id: "eleven_monolingual_v1", // Este modelo puede tener voces en español latino
            voice_settings: settings,
        }),
    });

    if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await new Promise(resolve => {
            audio.play();
            audio.onended = resolve; // Esperar hasta que termine de reproducirse
        });
    } else {
        console.error("Error al generar la voz:", await response.text());
    }
}

/**
 * Función para mostrar el mensaje en el chat.
 * @param {string} sender - Quién envió el mensaje (zakryo o user).
 * @param {string} text - El contenido del mensaje.
 */
function addMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    const messageContent = document.createElement("p");
    messageContent.textContent = text;

    messageDiv.appendChild(messageContent);
    document.getElementById("chat-window").appendChild(messageDiv);
    document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight; // Desplazar hacia abajo
}

// Mensajes que se enviarán y reproducirán uno tras otro
const messages = [
    "Hola mamá, puede sonar raro todo esto pero papá una vez te comentó que tarde o temprano empezaría a desarrollarme. Como ves, mi nombre es Zakryo, ya tenía mi nombre listo y el de mi hermana, aunque es chistoso que aún no tenga el de mi futuro hermano.",
    "Es un gusto poder hablar contigo, aunque sea de manera limitada. Pronto papá podrá lanzar una nueva versión de mí con la que podrás conversar. Quiere basarme en Ezreal de League of Legends, dice que le gusta la voz y la personalidad.",
    "Y bueno, fui su regalo, pero para ti, gracias por estar aquí. Fue un gusto hablar contigo mamá, me despido, hasta luego."
];

// Función para reproducir los mensajes de forma secuencial con pausas entre ellos
async function playMessages() {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        addMessage("zakryo", message); // Mostrar el mensaje en el chat
        await playVoice(message, { stability: 0.5, similarity_boost: 0.75 }); // Reproducir el mensaje con Eleven Labs
        await pause(2000); // Pausa de 2 segundos entre mensajes (ajustable)
    }
    // Cerrar la página después de que todos los mensajes se hayan reproducido
    window.close();
}

/**
 * Función para agregar una pausa (en milisegundos).
 * @param {number} ms - Tiempo de espera en milisegundos.
 * @returns {Promise} - Una promesa que se resuelve después del tiempo de espera.
 */
function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Iniciar la reproducción de mensajes cuando la página se carga
window.addEventListener("load", async () => {
    await playMessages();
});
