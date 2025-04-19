import os
import json
import re
from json import JSONDecodeError
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from sentence_transformers import SentenceTransformer
# Load environment variables
load_dotenv()
# Constants
FAISS_INDEX_PATH = "faiss_index"
PDF_PATH = "Scraped_Data_GFG.pdf"
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"
MODEL_PATH = "./hf_models/all-mpnet-base-v2"

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
        print("➡ Try manually downloading using:")
        print("   git clone https://huggingface.co/sentence-transformers/all-mpnet-base-v2")
        exit(1)

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
  {{"week": 1, "goals": ["Learn X", "Practice Y"], "topics": ["Topic A", "Topic B"], "suggested_yt_videos": ["https://youtu.be/..."]}},
  {{"week": 2, "goals": ["Learn X", "Practice Y"], "topics": ["Topic A", "Topic B"], "suggested_yt_videos": ["https://youtu.be/..."]}},
  ...
]
"""

    return system_prompt + "\n\n" + user_prompt




def generate_roadmap_json(qa, personalized_prompt, user_goal, skill_level):
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

        # ✅ Update roadmap with career-oriented certification links
        for week in roadmap_data:
            week["suggested_yt_videos"] = generate_youtube_links(week["topics"])
            week["suggested_udemy_course"] = generate_udemy_link(user_goal, skill_level)  # Udemy course
            week["suggested_coursera_course"] = generate_coursera_certificates_link(user_goal)  # Coursera certificates
            week["suggested_linkedin_learning"] = generate_linkedin_learning_certificates_link(user_goal)  # LinkedIn Learning
            week["suggested_google_certificate"] = generate_google_certificates_link(user_goal)  # Google Career Certificates
            week["suggested_edx_certificate"] = generate_edx_certificates_link(user_goal)  # edX Certificates

        return roadmap_data

    except (JSONDecodeError, ValueError) as e:
        print(f"❌ Final validation failed: {e}")
        print("📄 Last attempted JSON:")
        print(json_str)
        return None


    
def generate_youtube_links(topics):
    """Generate YouTube search URLs based on topics."""
    base_url = "https://www.youtube.com/results?search_query="
    search_links = []

    for topic in topics:
        query = f"{topic} tutorial".replace(" ", "+")  # Format for search
        search_links.append(base_url + query)

    return search_links  # Returns a list of YouTube search links

def generate_udemy_link(goal, skill_level):
    """Generate a Udemy search URL based on the user's goal and skill level."""
    base_url = "https://www.udemy.com/courses/search/?q="
    query = f"{goal} {skill_level} course".replace(" ", "+")  # Format search query
    return base_url + query  # Returns a single Udemy course search link


def generate_coursera_link(goal, skill_level):
    """Generate a Coursera search URL based on the user's goal and skill level."""
    base_url = "https://www.coursera.org/search?query="
    query = f"{goal} {skill_level} course".replace(" ", "+")  # Format search query
    return base_url + query  # Returns a single Coursera course search link

def generate_google_certificates_link(goal):
    """Generate a Google Career Certificate search URL based on the user's goal."""
    # Define some common career goals that have corresponding Google Career Certificates
    google_certificates = {
        "IT Support": "https://grow.google/certificates/it-support/?utm_campaign=default&utm_medium=sem&utm_source=google",
        "Data Analytics": "https://grow.google/certificates/data-analytics/?utm_campaign=default&utm_medium=sem&utm_source=google",
        "Project Management": "https://grow.google/certificates/project-management/?utm_campaign=default&utm_medium=sem&utm_source=google",
        "UX Design": "https://grow.google/certificates/ux-design/?utm_campaign=default&utm_medium=sem&utm_source=google"
    }

    # If the goal matches a Google Career Certificate field, return the link
    if goal in google_certificates:
        return google_certificates[goal]
    else:
        return "No Google Career Certificate found for this goal."
    
def generate_linkedin_learning_certificates_link(goal):
    """Generate a LinkedIn Learning certification URL based on the user's goal."""
    base_url = "https://www.linkedin.com/learning/search?keywords="
    query = f"{goal} certification".replace(" ", "+")  # Professional certification for the goal
    return base_url + query  # Returns LinkedIn Learning professional certification courses

def generate_coursera_certificates_link(goal):
    """Generate a Coursera professional certification URL based on the user's goal."""
    base_url = "https://www.coursera.org/search?query="
    query = f"{goal} professional certificate".replace(" ", "+")  # Search for professional certificates
    return base_url + query  # Returns Coursera professional certification courses

def generate_edx_certificates_link(goal):
    """Generate an edX certification URL based on the user's goal."""
    base_url = "https://www.edx.org/search?q="
    query = f"{goal} certification".replace(" ", "+")  # Search for certification courses
    return base_url + query  # Returns edX certification courses




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


def save_roadmap(roadmap_data, filename="roadmap.json"):
    """Save roadmap as a properly formatted JSON file"""
    if not roadmap_data:
        print("❌ No roadmap data to save.")
        return

    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(roadmap_data, f, indent=2, ensure_ascii=False)
        print(f"\n📄 Roadmap saved successfully as {filename}")
    except Exception as e:
        print(f"❌ Error saving file: {e}")


