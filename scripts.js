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
document.getElementById('userInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('sendButton').click();
    }
});
function getResponse(userInput) {
    userInput = userInput.toLowerCase();
    for (let key in responses) {
        if (userInput.includes(key) || new RegExp(key, 'i').test(userInput)) {
            return responses[key][Math.floor(Math.random() * responses[key].length)];
        }
    }
    return "Sorry, I don't understand that.";
}
// Typing indicator
function displayTypingIndicator() {
    const messagesDiv = document.getElementById('messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message assistant typing';
    typingIndicator.textContent = '...';
    messagesDiv.appendChild(typingIndicator);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return typingIndicator;
}

function removeTypingIndicator(typingIndicator) {
    typingIndicator.remove();
}

document.getElementById('sendButton').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    displayMessage(userInput, 'user');
    const typingIndicator = displayTypingIndicator();
    const response = getResponse(userInput);

    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        displayMessage(response, 'assistant');
        speak(response);
    }, 1000); // Simulating a delay for response
});
document.getElementById('sendButton').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) return;
    displayMessage(userInput, 'user');
    const response = getResponse(userInput);
    displayMessage(response, 'assistant');
    speak(response);
    document.getElementById('userInput').value = '';
});
function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    history.forEach(msg => displayMessage(msg.text, msg.sender));
}

function saveChatHistory(message, sender) {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    history.push({ text: message, sender });
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

document.getElementById('sendButton').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) return;

    displayMessage(userInput, 'user');
    saveChatHistory(userInput, 'user');
    
    const response = getResponse(userInput);
    displayMessage(response, 'assistant');
    saveChatHistory(response, 'assistant');
    
    speak(response);
    document.getElementById('userInput').value = '';
});
