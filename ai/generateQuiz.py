import re
import json
import pymongo
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
# MongoDB Connection
MONGO_URI = "mongodb+srv://amdocs:dtTKgMTMAAaHH9D8@cluster0.ktvj9.mongodb.net/Amdoc?retryWrites=true&w=majority&appName=Cluster0"
client = pymongo.MongoClient(MONGO_URI)
db = client["Amdoc"]
roadmap_collection = db["Roadmap"]
quiz_collection = db["KnowledgeAssessment"]
api_key='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'
# AI Model Setup
def setup_ai_model():
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    return llm
    # return ChatGroq(temperature=0.2, groq_api_key=api_key, model_name="mixtral-8x7b-32768")

# Parse Roadmap from MongoDB
def parse_roadmap(roadmap_text):
    week_patterns = [r'Week (\d+.*?):']
    week_sections = {}
    last_week = None
    lines = roadmap_text.split("\n")

    for line in lines:
        for pattern in week_patterns:
            match = re.search(pattern, line)
            if match:
                last_week = f"Week {match.group(1)}"
                week_sections[last_week] = []
                break
        else:
            if last_week:
                week_sections[last_week].append(line.strip())

    return {week: "\n".join(content).strip() for week, content in week_sections.items() if content}

# Generate Quiz Using AI
def generate_quiz(chat_model, week, content):
    quiz_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert educational content creator. Generate a 10-question multiple-choice quiz."),
        ("human", f"""Create a quiz for {week} with these requirements:
        - 10 questions total
        - 4 options per question (A-D)
        - Mark correct answer with 'Correct answer: X' on a new line
        - Format each question like:
            1. [Question text]
            A) [Option A]
            B) [Option B]
            C) [Option C]
            D) [Option D]
            Correct answer: [Letter]
        
        Week Content: {content}""")
    ])
    
    chain = quiz_prompt | chat_model
    response = chain.invoke({})
    return response.content

# Convert Quiz to JSON
def parse_quiz_to_json(quiz_text):
    questions = re.split(r'\n(?=\d+\. )', quiz_text.strip())
    quiz_data = []

    for q in questions:
        lines = q.strip().split("\n")
        if len(lines) < 6:
            continue
        
        question_text = lines[0]
        options = {
            "A": lines[1][3:].strip(),
            "B": lines[2][3:].strip(),
            "C": lines[3][3:].strip(),
            "D": lines[4][3:].strip()
        }
        correct_match = re.search(r'Correct answer:\s*([A-D])', lines[5])
        correct_answer = correct_match.group(1).upper() if correct_match else "?"

        quiz_data.append({
            "question_number": len(quiz_data) + 1,
            "question_text": question_text,
            "options": options,
            "correct_answer": correct_answer
        })

    return quiz_data

# Store Quiz in MongoDB
def store_quiz_in_db(user_id, quiz_data):
    quiz_document = {
        "userID": user_id,
        "quiz": quiz_data
    }
    quiz_collection.insert_one(quiz_document)
    print(f"Quiz stored in 'KnowledgeAssessment' for userID: {user_id}")

# Main Function
def main():
    api_key = "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"  # Replace with your actual API key
    chat_model = setup_ai_model(api_key)

    # Fetch roadmap from MongoDB
    roadmap_entry = roadmap_collection.find_one({}, {"userID": 1, "roadmap": 1})
    if not roadmap_entry:
        print("No roadmap found in MongoDB")
        return
    
    user_id = roadmap_entry["userID"]
    roadmap_content = roadmap_entry["roadmap"]

    # Parse and generate quiz
    week_dict = parse_roadmap(roadmap_content)
    if not week_dict:
        print("No valid weekly sections found in roadmap")
        return

    first_week = next(iter(week_dict))
    print(f"Generating quiz for {first_week}...")

    quiz_text = generate_quiz(chat_model, first_week, week_dict[first_week])
    quiz_data = parse_quiz_to_json(quiz_text)

    # Store quiz in MongoDB
    store_quiz_in_db(user_id, quiz_data)


if __name__ == "__main__":
    main()
