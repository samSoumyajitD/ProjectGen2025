import os
import time
import json
import re
from json import JSONDecodeError
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Load environment variables
load_dotenv()

# Constants
FAISS_INDEX_PATH = "faiss_index"
PDF_PATH = "scraped_Data_GFG.pdf"
NPTEL_COURSES_PATH = "nptelcourses.json"  # Path to NPTEL courses JSON
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"
MODEL_PATH = "./hf_models/all-mpnet-base-v2"
FAISS_NPTEL_INDEX_PATH = "faiss_nptel_index"  # Path to NPTEL FAISS index

def load_embedding_model():
    """Load sentence transformer model locally or download it."""
    if os.path.exists(MODEL_PATH):
        print("✅ Loading model from local directory...")
        return SentenceTransformer(MODEL_PATH)
    
    print("⚡ Downloading model (this may take a few minutes)...")
    try:
        return SentenceTransformer(EMBEDDING_MODEL, cache_folder="./hf_models")
    except Exception as e:
        print(f"❌ Error: Model download failed - {e}")
        print("➡️ Try manually downloading using:")
        print("   git clone https://huggingface.co/sentence-transformers/all-mpnet-base-v2")
        exit(1)

def load_nptel_courses():
    """Load NPTEL courses from JSON file."""
    if not os.path.exists(NPTEL_COURSES_PATH):
        print("❌ Error: NPTEL course file not found.")
        return []
    
    with open(NPTEL_COURSES_PATH, "r", encoding="utf-8") as f:
        try:
            courses = json.load(f)
            return courses
        except json.JSONDecodeError:
            print("❌ Error: Invalid JSON format in NPTEL file.")
            return []

def generate_embeddings(texts):
    """Generate embeddings for the list of input texts."""
    model = SentenceTransformer(EMBEDDING_MODEL)  # Pre-trained model
    return model.encode(texts)

def create_nptel_faiss_index(courses):
    """Create and populate FAISS index with course embeddings."""
    # Prepare a list of course descriptions (combine discipline and course name)
    course_descriptions = [f"{course['Discipline']} {course['Course Name']}" for course in courses]
    
    # Generate embeddings for course descriptions
    course_embeddings = generate_embeddings(course_descriptions)
    
    # Convert embeddings to numpy array and create FAISS index
    embeddings_np = np.array(course_embeddings).astype(np.float32)
    
    # Create the FAISS index (for cosine similarity, we need to normalize the vectors)
    index = faiss.IndexFlatL2(embeddings_np.shape[1])  # L2 distance (Euclidean distance)
    index.add(embeddings_np)  # Add embeddings to the index
    
    # Save the FAISS index to disk
    faiss.write_index(index, FAISS_NPTEL_INDEX_PATH)
    print(f"✅ NPTEL FAISS index saved at {FAISS_NPTEL_INDEX_PATH}")
    
    return index, courses

def load_nptel_faiss_index():
    """Load NPTEL FAISS index if it exists."""
    if os.path.exists(FAISS_NPTEL_INDEX_PATH):
        print("✅ Loading existing NPTEL FAISS index...")
        index = faiss.read_index(FAISS_NPTEL_INDEX_PATH)
        courses = load_nptel_courses()
        return index, courses
    else:
        print("⚡ Creating a new NPTEL FAISS index...")
        courses = load_nptel_courses()
        return create_nptel_faiss_index(courses)

def search_nptel_faiss_index(user_goal, index, courses, top_k=5):
    """Search NPTEL FAISS index to find the most relevant courses based on user's goal."""
    # Generate embedding for the user's goal
    user_goal_embedding = generate_embeddings([user_goal])[0].astype(np.float32)
    
    # Search the FAISS index
    _, indices = index.search(np.array([user_goal_embedding]), top_k)
    
    # Retrieve the courses corresponding to the top K indices
    relevant_courses = []
    for idx in indices[0]:
        course = courses[idx]
        relevant_courses.append({
            "Course Name": course["Course Name"],
            "Institute": course["Institute"],
            "Duration": course["Duration"],
            "NPTEL URL": course["NPTEL URL"]
        })
    
    return relevant_courses

def get_vectorstore():
    """Load FAISS index or create a new one if missing"""
    index_file = os.path.join(FAISS_INDEX_PATH, "index.faiss")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"}
    )

    if os.path.exists(index_file):
        print("✅ Loading existing FAISS index...")
        return FAISS.load_local(
            FAISS_INDEX_PATH,
            embeddings,
            allow_dangerous_deserialization=True
        )

    print("⚡ Generating new FAISS index...")
    loader = PyPDFLoader(PDF_PATH)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=30, separator="\n")
    docs = text_splitter.split_documents(documents)
    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local(FAISS_INDEX_PATH)
    print("✅ FAISS index saved successfully.")
    return vectorstore

def setup_ai_model():
    """Initialize Groq AI model"""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("❌ Error: GROQ_API_KEY is missing in .env file")
    return ChatGroq(temperature=0, groq_api_key=api_key, model_name="llama-3.3-70b-versatile")

def self_healing_json(raw_response):
    """Automatically fix common JSON errors, including trailing commas"""

    # Convert dict to string if needed
    if isinstance(raw_response, dict):
        raw_response = json.dumps(raw_response, ensure_ascii=False)

    json_str = raw_response.strip()

    # Remove trailing commas inside JSON objects and arrays
    json_str = re.sub(r',\s*([\]}])', r'\1', json_str)

    # Ensure valid JSON structure by balancing braces
    open_braces = json_str.count('{')
    close_braces = json_str.count('}')
    while open_braces > close_braces:
        json_str += '}'
        close_braces += 1

    open_brackets = json_str.count('[')
    close_brackets = json_str.count(']')
    while open_brackets > close_brackets:
        json_str += ']'
        close_brackets += 1

    return json_str
def validate_structure(data):
    """Ensure JSON is in the correct format and return it as-is.""" 
    if not isinstance(data, list):
        raise ValueError("Root element must be an array (list of weeks).")
    
    for entry in data:
        if not isinstance(entry, dict):
            raise ValueError("Each week entry must be a dictionary.")

        required_keys = {"week", "goals", "topics", "suggested_yt_videos"}
        if not required_keys.issubset(entry.keys()):
            raise ValueError(f"Missing required keys in entry: {entry}")

        if not isinstance(entry["week"], int):
            raise ValueError(f"Invalid week format: {entry['week']}, expected integer.")

        if not all(isinstance(entry[key], list) for key in ["goals", "topics", "suggested_yt_videos"]):
            raise ValueError(f"Invalid format for lists in entry: {entry}")

    return data  # ✅ Now returns the data without unnecessary conversions

def generate_youtube_links(topics):
    """Generate YouTube search URLs based on topics."""
    base_url = "https://www.youtube.com/results?search_query="
    search_links = []

    for topic in topics:
        query = f"{topic} tutorial".replace(" ", "+")  # Format for search
        search_links.append(base_url + query)

    return search_links  # Returns a list of YouTube search links

def create_personalized_prompt(user_inputs):
    """Create a dynamic JSON formatting prompt based on user inputs"""
    
    # Calculate the number of weeks based on the desired timeline (assuming 4 weeks per month)
    timeline_in_months = int(user_inputs["deadline"].split()[0])  # Extract the number of months
    num_weeks = timeline_in_months * 4  # Assuming 4 weeks in a month
    
    # System prompt for JSON structure (rules remain the same)
    system_prompt = """You MUST follow these JSON rules:
1. Output ONLY: [{"week":1,"goals":[],"topics":[],"suggested_yt_videos":[]}...]
2. Week numbers must be integers starting at 1
3. All fields must be arrays of strings
4. No nested objects or additional fields
5. YouTube links must be full URLs"""

    # Create user prompt with dynamic number of weeks
    user_prompt = f"""Create a {user_inputs["deadline"]} roadmap for {user_inputs["goal"]}.
User Profile:
- Level: {user_inputs["skill_level"]}
- Weekly Hours: {user_inputs["time_per_week"]}
- Learning Style: {user_inputs["learning_mode"]}

Generate EXACTLY {num_weeks} weeks following this JSON structure:
[ 
  {{"week": 1, "goals": ["Learn X", "Practice Y",....], "topics": ["Topic A", "Topic B",....], "suggested_yt_videos": ["https://youtu.be/..."]}},
  {{"week": 2, "goals": ["Learn X", "Practice Y",....], "topics": ["Topic A", "Topic B",....], "suggested_yt_videos": ["https://youtu.be/..."]}},
  ...
]"""

    return system_prompt + "\n\n" + user_prompt

def generate_roadmap(qa, personalized_prompt, user_goal, skill_level):
    """Generate a roadmap using AI model and update links for career-oriented certifications."""
    try:
        print("\n🚀 Generating your personalized roadmap...")

        # Use invoke() instead of run()
        response = qa.invoke({"query": personalized_prompt})

        # Ensure response is extracted as text
        if isinstance(response, dict) and "result" in response:
            result = response["result"]
        elif isinstance(response, dict):
            result = json.dumps(response, ensure_ascii=False)
        else:
            result = response

        # Preprocessing and validation
        json_str = self_healing_json(result)
        roadmap_data = validate_structure(json.loads(json_str))

        # ✅ Create FAISS index and fetch relevant NPTEL courses
        index, courses = load_nptel_faiss_index()  # Load or create the index
        relevant_courses = search_nptel_faiss_index(user_goal, index, courses)
        
        # ✅ Update roadmap with relevant NPTEL courses
        for week in roadmap_data:
            week["suggested_yt_videos"] = generate_youtube_links(week["topics"])
            week["suggested_nptel_certifications"] = relevant_courses  

        return roadmap_data

    except (JSONDecodeError, ValueError) as e:
        print(f"❌ Final validation failed: {e}")
        print("📄 Last attempted JSON:")
        print(json_str)
        return None


import asyncio
from motor.motor_asyncio import AsyncIOMotorClient


# MongoDB URI from environment variable
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MongoDB URI is not set in the environment variables")

# Initialize MongoDB client asynchronously
client = AsyncIOMotorClient(MONGO_URI)
db = client["Amdoc"]
goals_collection = db["goals"]
roadmap_collection = db["roadmaps"]

async def fetch_goals():
    """Fetch all goals from the database"""
    cursor = goals_collection.find({})
    return await cursor.to_list(length=None)  # Fetch all documents as a list

async def save_roadmap(roadmap_data):
    """Save or update roadmap in MongoDB"""
    if not roadmap_data:
        print("❌ No roadmap data to save.")
        return

    try:
        # Define the query to find an existing roadmap
        query = {
            "userId": roadmap_data["userId"],
            "goalId": roadmap_data["goalId"]
        }

        # Define the update operation
        update = {
            "$set": roadmap_data
        }

        # Use update_one with upsert=True to update or insert the roadmap
        result = await roadmap_collection.update_one(query, update, upsert=True)

        if result.upserted_id:
            print(f"✅ New roadmap saved successfully in MongoDB for User ID: {roadmap_data['userId']}")
        else:
            print(f"✅ Roadmap updated successfully in MongoDB for User ID: {roadmap_data['userId']}")

    except Exception as e:
        print(f"❌ Error saving/updating roadmap: {e}")

async def process_goals():
    """Fetch goals, generate roadmaps, and store them"""
    print("🎯 Fetching goals from database...")
    goals = await fetch_goals()

    if not goals:
        print("❌ No goals found in the database.")
        return

    # Load vectorstore and chat model
    vectorstore = get_vectorstore()
    chat_model = setup_ai_model()

    # Setup AI-based QA system
    qa = RetrievalQA.from_chain_type(
        llm=chat_model,
        chain_type="stuff",
        retriever=vectorstore.as_retriever()
    )

    for goal_entry in goals:
        user_id = goal_entry["userId"]
        goal_id = goal_entry["_id"]
        goal = goal_entry["goal"]
        time_per_week = goal_entry["time_per_week"]
        learning_mode = goal_entry["learning_mode"]
        skill_level = goal_entry["skill_level"]
        deadline = goal_entry["deadline"]

        # Create personalized prompt
        user_inputs = {
            "goal": goal,
            "time_per_week": time_per_week,
            "learning_mode": learning_mode,
            "skill_level": skill_level,
            "deadline": deadline
        }
        personalized_prompt = create_personalized_prompt(user_inputs)

        # Generate roadmap
        roadmap = generate_roadmap(qa, personalized_prompt, goal, skill_level)

        if roadmap:
            print(f"\n📜 Generated Roadmap for Goal: {goal}")
            print(json.dumps(roadmap, indent=2, ensure_ascii=False))

            # Save roadmap in MongoDB
            roadmap_data = {
                "userId": user_id,
                "goalId": goal_id,
                "goal": goal,
                "roadmap": roadmap
            }
            await save_roadmap(roadmap_data)

async def main():
    await process_goals()

if __name__ == "__main__":
    asyncio.run(main())