import os
from flask import Flask, jsonify
from pymongo import MongoClient
from datetime import datetime
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from bson import ObjectId
# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Fetch MongoDB Connection URI and API key from environment variables
MONGO_URI = os.getenv("MONGO_URI")
FAISS_INDEX_PATH = "student_faiss_index"
PDF_PATH = "scrapped_GfG.pdf"
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["Amdoc"]
goals_collection = db["goals"]
roadmap_collection = db["Roadmap"]

def get_mongo_data(user_id, goal_id):
    """Fetch the user's goal data from MongoDB using user_id and goal_id"""
    goal_data = goals_collection.find_one({"userId": user_id, "_id": ObjectId(goal_id)})
    print(goal_data)  # Log the data
    if not goal_data:
        return None
    return {
        "userID": str(goal_data.get("userId")),
        "goal": goal_data.get("goal", "Unknown"),
        "time_per_week": goal_data.get("time_per_week", "Unknown"),
        "learning_mode": goal_data.get("learning_mode", "Unknown"),
        "skill_level": goal_data.get("skill_level", "Unknown"),
        "deadline": goal_data.get("deadline", "Unknown")
    }


def get_vectorstore():
    """Load or create FAISS index"""
    index_file = os.path.join(FAISS_INDEX_PATH, "index.faiss")
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL, model_kwargs={"device": "cpu"})

    if os.path.exists(index_file):
        return FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)

    # Create new FAISS index
    loader = PyPDFLoader(PDF_PATH)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=30, separator="\n")
    docs = text_splitter.split_documents(documents)

    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local(FAISS_INDEX_PATH)

    return vectorstore

def setup_ai_model():
    """Initialize AI model"""
    api_key = os.getenv("GROQ_API_KEY")
    return ChatGroq(temperature=0, groq_api_key=api_key, model_name="mixtral-8x7b-32768")

def create_personalized_prompt(user_inputs):
    """Generate prompt for personalized roadmap"""
    system_prompt = """
    You are SaarthiAI, an AI tutor specializing in personalized learning roadmaps.
    Responsibilities:
    - Breakdown learning goals into structured weekly plans.
    - Recommend trusted resources like courses and projects.
    - Provide study strategies and progress tracking suggestions.
    """

    user_prompt = f"""
Based on the user's details:
- Learning Goal: {user_inputs['goal']}
- Time Commitment: {user_inputs['time_per_week']} hours per week
- Preferred Learning Mode: {user_inputs['learning_mode']}
- Skill Level: {user_inputs['skill_level']}
- Deadline: {user_inputs['deadline']} months

Create a structured roadmap including:
1. Weekly study plan with milestones.
2. Recommended study materials (books, courses, videos).
3. Practical projects and assessments.
4. Motivation and productivity tips.
"""

    return ChatPromptTemplate.from_messages([ 
        ("system", system_prompt), 
        ("human", user_prompt)
    ])

def generate_roadmap(chat_model, personalized_prompt, user_goal):
    """Generate roadmap using LLM"""
    try:
        roadmap = chat_model.invoke(personalized_prompt.format_messages()[1].content)
        youtube_link = f"https://www.youtube.com/results?search_query={user_goal.replace(' ', '+')}"
        return f"{roadmap.content}\n\n🔗 Explore related videos: {youtube_link}"
    except Exception as e:
        return f"Error: {e}"

def save_roadmap_to_mongo(user_id, roadmap, goal):
    """Save the roadmap to MongoDB"""
    existing_roadmap = roadmap_collection.find_one({"userID": user_id, "goal": goal})

    roadmap_data = {
        "userID": user_id,
        "roadmap": roadmap,
        "goal": goal,
        "timestamp": datetime.utcnow()
    }

    if existing_roadmap:
        roadmap_collection.update_one({"_id": existing_roadmap["_id"]}, {"$set": roadmap_data})
    else:
        roadmap_collection.insert_one(roadmap_data)

@app.route('/generate-roadmap/<user_id>/<goal_id>', methods=['POST'])
def generate_roadmap_api(user_id, goal_id):
    try:
        # Fetch user data from MongoDB using user_id and goal_id
        user_inputs = get_mongo_data(user_id, goal_id)  # Pass both user_id and goal_id
        
        # Check if the user data was found
        if not user_inputs:
            return jsonify({"error": "User or Goal not found"}), 404

        # Load/create FAISS index
        vectorstore = get_vectorstore()
        retriever = vectorstore.as_retriever()

        # Initialize AI model
        chat_model = setup_ai_model()

        # Create RetrievalQA chain
        qa = RetrievalQA.from_chain_type(
            llm=chat_model,
            chain_type="stuff",
            retriever=retriever
        )

        # Create personalized prompt and generate roadmap
        personalized_prompt = create_personalized_prompt(user_inputs)
        roadmap = generate_roadmap(qa, personalized_prompt, user_inputs.get("goal", ""))

        # Save roadmap to MongoDB (including the goal)
        save_roadmap_to_mongo(user_id, roadmap, user_inputs["goal"])

        # Return the generated roadmap
        return jsonify({"roadmap": roadmap}), 200

    except Exception as e:
        # Return error message if something goes wrong
        return jsonify({"error": str(e)}), 500



def object_id_to_str(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

if __name__ == "__main__":
    app.run(debug=True)
