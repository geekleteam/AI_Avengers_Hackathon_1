import os
import json

BASE_DIR = 'data'

def get_context_file_path(project_id, user_id, conversation_id):
    return os.path.join(BASE_DIR, project_id, user_id, f'{conversation_id}.json')

def save_context(project_id, user_id, conversation_id, context):
    os.makedirs(os.path.join(BASE_DIR, project_id, user_id), exist_ok=True)
    context_file = get_context_file_path(project_id, user_id, conversation_id)
    with open(context_file, 'w') as f:
        json.dump(context, f)

def get_context(project_id, user_id, conversation_id):
    context_file = get_context_file_path(project_id, user_id, conversation_id)
    if os.path.exists(context_file):
        with open(context_file, 'r') as f:
            return json.load(f)
    return None

def delete_context(project_id, user_id, conversation_id):
    context_file = get_context_file_path(project_id, user_id, conversation_id)
    if os.path.exists(context_file):
        os.remove(context_file)

def summarize_contexts(project_id, user_id):
    user_dir = os.path.join(BASE_DIR, project_id, user_id)
    if not os.path.exists(user_dir):
        return None
    
    all_details = []
    for filename in os.listdir(user_dir):
        if filename.endswith(".json"):
            with open(os.path.join(user_dir, filename), 'r') as f:
                context = json.load(f)
                all_details.append(context.get('details', ''))

    summarized_details = " ".join(all_details)
    return summarized_details if summarized_details else None