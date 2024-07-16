# app/models.py
from langchain_openai import ChatOpenAI
from app.config import Config

api_key = Config.OPENAI_API_KEY
model = ChatOpenAI(api_key=api_key)