# app/utils.py
from langchain.prompts import PromptTemplate

prompt_template = """ Your task is to generate {diagram_type} Mermaid.js code based on the given inputs. Ensure the Mermaid.js code is correct and adheres to the standards for the specified diagram type.

Generate the Mermaid.js code for a {diagram_type} based on the following details:
{details}

Only generate the code as output, nothing extra. Ensure the Mermaid code is correctly formatted. Use '-->' instead of '=>'. Don't use the 'mermaid' keyword in the response.
"""

graph_prompt = PromptTemplate(template=prompt_template)



def extract_mermaid_code(mermaid_code):
    # Remove the enclosing triple backticks and newlines
    mermaid_code = mermaid_code.strip('```').strip()
    mermaid_code = mermaid_code.strip(';').strip()
    mermaid_code = mermaid_code.strip('mermaid\n').strip()
    return mermaid_code


clarification_prompt_template = """
The user has provided the following details for a {diagram_type} diagram:
{details}

So far, we have collected the following parameters:
{parameters}

To generate a meaningful diagram, we need more information. Based on the provided details, identify one key parameter required for a {diagram_type} diagram and formulate a clarifying question to ask the user in simple, non-technical terms. Include an example with the question to help the user understand what is needed.

Question:
"""

clarification_prompt = PromptTemplate(template=clarification_prompt_template)

readiness_prompt_template = """
The user has provided the following details for a {diagram_type} diagram:
{details}

Check if the user has indicated that they want to proceed with generating the diagram now. If they have, return "ready to draw"; otherwise, return "need more details".
"""

readiness_prompt = PromptTemplate(template=readiness_prompt_template)

def get_required_parameters(model, diagram_type):
    # Generate the prompt to get required parameters
    prompt = f"List the key parameters required to create a {diagram_type} diagram."
    response = model.invoke(prompt)  # Synchronous call
    required_parameters = response.content.strip().split("\n")
    
    # Debug: Log the required parameters
    print("Required parameters:", required_parameters)
    
    return required_parameters

def ask_clarifying_question(model, diagram_type, details, collected_parameters):
    # Generate one clarifying question using the model
    formatted_prompt = clarification_prompt.format(
        diagram_type=diagram_type,
        details=details,
        parameters="\n".join(collected_parameters)
    )
    response = model.invoke(formatted_prompt)  # Synchronous call
    
    # Debug: Log the raw response content
    print("Model response content:", response.content)
    
    clarifying_question = response.content.strip()  # Assuming the model returns a single question
    
    # Debug: Log the parsed clarifying question
    print("Parsed clarifying question:", clarifying_question)
    
    return clarifying_question

def check_readiness(model, diagram_type, details):
    # Check if the user indicates readiness to draw the diagram
    formatted_prompt = readiness_prompt.format(
        diagram_type=diagram_type,
        details=details
    )
    response = model.invoke(formatted_prompt)  # Synchronous call
    
    # Debug: Log the raw response content
    print("Readiness check response content:", response.content)
    
    readiness_signal = response.content.strip()  # Assuming the model returns "ready to draw" or "need more details"
    
    # Debug: Log the readiness signal
    print("Readiness signal:", readiness_signal)
    
    return readiness_signal == "ready to draw"

def extract_parameters(details):
    # Simple example: Extract parameters from the details text
    words = details.split()
    return words  # Replace with more sophisticated logic as needed