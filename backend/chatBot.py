#UNTESTED SO FAR, DONT HAVE API KEY YET
# User will enter their order on the website, after entering their order,
# The website will take the input and pass it to create_message function.
# create_message function will interact with AI assistant and return a message
# message will be displayed on website UI.

import os
from openai import OpenAI
from dotenv import load_dotenv

#Looks for .env file
load_dotenv()

#Loads api key
client = OpenAI(api_key = os.getenv("OPEN_AI_API_KEY"))

chatBot = client.beta.assistants.create(
    name="In-N-Out Assistant",
    instructions=("""You are a cashier at In-N-Out taking customer orders. 
                  Have great customer service, and confirm the customer's orders once they are done."""),
    model="gpt-4o-mini"
)

thread = client.beta.threads.create()

def create_message(prompt):

    #Take user input to send message to In-N-Out assistant
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content= prompt
    )

    #Runs the assistant
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=chatBot.id
    )

    #Wait until assistance is done processing message
    while True:
        run_status = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        if run_status.status == "completed":
            break
    
    #Returns the assistant's response
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    response = messages.data[0].content[0].text.value
    return response

