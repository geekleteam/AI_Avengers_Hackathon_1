from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from app.file_utils import save_context, summarize_contexts
from app.utils import graph_prompt, extract_mermaid_code, ask_clarifying_question, check_readiness, get_required_parameters, extract_parameters
from app.models import model
from datetime import datetime
import json

router = APIRouter()

collected_parameters = []
clarification_attempts = 0

@router.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")

@router.post("/graph")
async def generate_graph(request: Request):
    global collected_parameters, clarification_attempts

    # Debugging: Log the raw request body
    raw_body = await request.body()
    print("Raw request body:", raw_body.decode())

    try:
        input_data = await request.json()
    except json.JSONDecodeError as e:
        print("JSON decoding error:", e)
        return {"error": "Invalid JSON in request body"}

    diagram_type = input_data.get("diagram_type")
    details = input_data.get("details")
    project_id = input_data.get("project_id")
    conversation_id = input_data.get("conversation_id")
    user_id = input_data.get("user_id")
    new_parameter = input_data.get("new_parameter")

    # Validate the required fields
    if not diagram_type or not details or not project_id or not conversation_id:
        return {"error": "diagram_type, details, project_id, and conversation_id are required fields"}

    # Summarize existing context for the user and project
    summarized_context = summarize_contexts(project_id, user_id)
    if summarized_context:
        details = summarized_context + " " + details

  

    # Check if the user is ready to draw the diagram
    if check_readiness(model, diagram_type, details + " " + " ".join(collected_parameters)):
        clarification_attempts = 5  # Skip further clarifications

    # Get required parameters for the diagram type
    required_parameters = get_required_parameters(model, diagram_type)
    provided_parameters = extract_parameters(details)

    # Check if we have enough parameters or if we have asked enough clarification questions
    if len(collected_parameters) >= 10 or clarification_attempts >= 5 or len(provided_parameters) >= len(required_parameters):
        # If enough parameters are provided, generate the diagram
        formatted_prompt = graph_prompt.format(
            diagram_type=diagram_type,
            details=details + " " + " ".join(collected_parameters)
        )

        # Invoke the model
        try:
            response = model.invoke(formatted_prompt)  # Synchronous call
            response_content = response.content.strip()
            response_content = extract_mermaid_code(response_content)
            
            # Debugging: Log the response content
            print("LLM response content:", response_content)

            # Reset collected parameters and attempts
            collected_parameters = []
            clarification_attempts = 0

            return {
                "mermaid_code": response_content, 
                "diagram_type": diagram_type,
                "details": details,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            print("Error invoking model:", e)
            return {"error": str(e)}
    else:
        # If not enough parameters are provided, ask clarifying questions
        clarification_attempts += 1
        clarifying_question = ask_clarifying_question(model, diagram_type, details, collected_parameters)
        
        if clarifying_question:
            return {"clarifying_question": clarifying_question}
        else:
            return {"clarifying_question": "Could you please provide more details about the flow and specific steps involved in your process?"}