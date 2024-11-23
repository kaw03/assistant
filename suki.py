import random
import pyttsx3
import openai
import os

# Set up OpenAI API with your API key directly
openai.api_key = ""  # Replace with your actual OpenAI API key

# Initialize text-to-speech engine
engine = pyttsx3.init()



# Function to convert text to speech
def speak(text):
    engine.say(text)
    engine.runAndWait()

# Predefined responses
responses = {
    "hello": ["Hi there!", "Hello!", "Greetings!", "Howdy!"],
    "how are you?": ["I'm just a computer program, but thanks for asking!", "Doing well, how about you?", "I'm here to help you!"],
    "what is your name?": ["You can call me Suki!", "my name is suki what is yours."],
    "bye": ["Goodbye!", "See you later!", "Take care!"],
    
}

def get_response(user_input):
    # Normalize the input
    user_input = user_input.lower()
    # Check if the user input matches a known response
    for key in responses.keys():
        if key in user_input:
            return random.choice(responses[key])
    return "Sorry, I don't understand that."

# Function to interact with OpenAI's GPT model (ChatGPT)
def ask_chatgpt(question):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Using the ChatGPT model
            messages=[
                {"role": "user", "content": question}
            ]
        )
        return response.choices[0].message['content'].strip()
    except openai.error.RateLimitError:
        return "You've exceeded your quota. Please check your account limits."
    except Exception as e:
        print(f"Error: {e}")
        return "There was an error connecting to the server."

# Main loop to keep Suki responding to input
def main():
    speak("Hello, I'm Suki, your assistant created by Karl. You can type your questions now.")
    
    while True:
        command = input("You: ")

        if command.lower() == 'bye':
            speak("Goodbye!")
            break

        if command:
            # Check predefined responses first
            response = get_response(command)
            if response == "Sorry, I don't understand that.":
                # If no predefined response, ask OpenAI's GPT model (ChatGPT)
                response = ask_chatgpt(command)

            print(f"Suki: {response}")
            speak(response)

if __name__ == "__main__":
    main()
