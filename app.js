document.addEventListener("DOMContentLoaded", () => {
    const elevenLabsApiKey = "sk_13488429e5122e9b99164d79d05d009731689aa55697f48b";
    const voiceId = "15bJsujCI3tcDWeoZsQP"; // Voz en español latino

    /**
     * Función para reproducir texto mediante Eleven Labs.
     * @param {string} message - Texto que será convertido a voz.
     * @param {HTMLElement} messageElement - Elemento del mensaje en el DOM que mostrará el estado "Cargando...".
     * @param {object} settings - Configuración de la voz (estabilidad, similitud).
     */
    async function playVoice(message, messageElement, settings = { stability: 0.5, similarity_boost: 0.75 }) {
        messageElement.textContent = "Cargando..."; // Mostrar estado inicial

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

            // Mostrar el mensaje real al iniciar el audio
            audio.addEventListener("play", () => {
                messageElement.textContent = message;
            });

            await new Promise(resolve => {
                audio.play();
                audio.onended = resolve; // Esperar hasta que termine de reproducirse
            });
        } else {
            console.error("Error al generar la voz:", await response.text());
            messageElement.textContent = "Error al cargar el mensaje.";
        }
    }

    /**
     * Función para mostrar el mensaje en el chat.
     * @param {string} sender - Quién envió el mensaje (zakryo o user).
     * @param {string} text - El contenido inicial del mensaje.
     * @returns {HTMLElement} - El elemento del mensaje en el DOM.
     */
    function addMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);

        const messageContent = document.createElement("p");
        messageContent.textContent = text;

        messageDiv.appendChild(messageContent);
        document.getElementById("chat-window").appendChild(messageDiv);
        document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight; // Desplazar hacia abajo
        return messageContent; // Retornar el elemento del mensaje para actualizarlo después
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
            const messageElement = addMessage("zakryo", ""); // Mostrar inicialmente un mensaje vacío
            await playVoice(message, messageElement, { stability: 0.5, similarity_boost: 0.75 }); // Reproducir el mensaje con Eleven Labs
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

    // Iniciar la reproducción de mensajes
    playMessages();
});
