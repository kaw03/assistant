const responses = {
    "hello": ["Hi there!", "Hello!", "Greetings!", "Howdy!"],
    "how are you?": ["I'm just a computer program, but thanks for asking!", "Doing well, how about you?", "I'm here to help you!"],
    "what is your name?": ["You can call me Suki!", "My name is Suki, what is yours?"],
    "bye": ["Goodbye!", "See you later!", "Take care!"],
};

function getResponse(userInput) {
    userInput = userInput.toLowerCase();
    for (let key in responses) {
        if (userInput.includes(key)) {
            return responses[key][Math.floor(Math.random() * responses[key].length)];
        }
    }
    return "Sorry, I don't understand that.";
}

async function askChatGPT(question) {
    // Replace with your OpenAI API endpoint
    const response = await fetch('YOUR_OPENAI_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_API_KEY` // Replace with your actual OpenAI API key
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Text-to-Speech function
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

document.getElementById('sendButton').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    // Display user message
    displayMessage(userInput, 'user');

    // Get predefined response or ask OpenAI
    let response = getResponse(userInput);
    if (response === "Sorry, I don't understand that.") {
        response = await askChatGPT(userInput);
    }

    // Display assistant message
    displayMessage(response, 'assistant');
    speak(response); // Call the speak function to read the response aloud
    document.getElementById('userInput').value = '';
});

function displayMessage(message, sender) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto scroll to bottom
}
