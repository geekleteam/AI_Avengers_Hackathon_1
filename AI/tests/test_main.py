import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert "<title>FastAPI - Swagger UI</title>" in response.text

def test_generate_graph():
    response = client.post("/graph", json={
        "diagram_type": "example_diagram",
        "details": "This is an example detail",
        "project_id": "example_project",
        "conversation_id": "example_conversation",
        "user_id": "example_user"
    })
    assert response.status_code == 200
    assert "mermaid_code" in response.json() or "clarifying_question" in response.json()