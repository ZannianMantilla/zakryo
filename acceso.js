const elevenLabsApiKey = "sk_13488429e5122e9b99164d79d05d009731689aa55697f48b";
const voiceId = "15bJsujCI3tcDWeoZsQP"; // Verifica que esta voz sea compatible con español latino.

/**
 * Función para reproducir texto mediante Eleven Labs.
 * @param {string} message - Texto que será convertido a voz.
 * @param {object} settings - Configuración de la voz (estabilidad, similitud).
 */
async function playVoice(message, settings = { stability: 0.7, similarity_boost: 0.75 }) {
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
        audio.play();
    } else {
        console.error("Error al generar la voz:", await response.text());
    }
}

/**
 * Maneja el evento de envío del formulario.
 */
document.getElementById("nameForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();

    if (name.toLowerCase() === "kenia") {
        const welcomeMessage = "¡Bienvenida mamá!, papá me dijo que vendrias, ahora en un momento te redirecciono.";
        const euforicSettings = { stability: 0.8, similarity_boost: 0.9 }; // Configuración más emocional
        await playVoice(welcomeMessage, euforicSettings); // Pasamos el texto con configuración eufórica.
        Swal.fire({
            icon: "success",
            title: "¡Bienvenida Mamá!",
            text: "Redirigiéndote...",
            timer: 5000,
            showConfirmButton: false,
        }).then(() => {
            window.location.href = "access.html"; // Cambiar al HTML deseado
        });
    } else {
        const errorMessage = "A ti no te espero.";
        const neutralSettings = { stability: 0.5, similarity_boost: 0.75 }; // Configuración más neutral
        await playVoice(errorMessage, neutralSettings); // Pasamos el texto con configuración neutral.
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "A ti no te espero.",
            timer: 3000,
            showConfirmButton: false,
        }).then(() => {
            window.close(); // Cierra la página después de mostrar el mensaje de error
        });
    }
});
