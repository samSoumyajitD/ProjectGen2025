import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

FAISS_INDEX_PATH = "student_faiss_index"
PDF_PATH = "scrapped_GfG.pdf"
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"

def get_vectorstore():
    index_file = os.path.join("student_faiss_index", "index.faiss")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2", model_kwargs={"device": "cpu"})

    if os.path.exists(index_file):
        return FAISS.load_local("student_faiss_index", embeddings, allow_dangerous_deserialization=True)

    # Create new FAISS index
    loader = PyPDFLoader("scrapped_GfG.pdf")
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=30, separator="\n")
    docs = text_splitter.split_documents(documents)

    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local("student_faiss_index")

    return vectorstore

# Function to initialize the AI model
def setup_ai_model():
    api_key = os.getenv("GROQ_API_KEY")
    return ChatGroq(temperature=0, groq_api_key=api_key, model_name="mixtral-8x7b-32768")

# Function to create personalized prompt for the roadmap
def create_personalized_prompt(user_inputs):
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

# Function to generate the learning roadmap
def generate_roadmap(user_inputs):
    try:
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

        # Create personalized prompt
        personalized_prompt = create_personalized_prompt(user_inputs)

        # Generate roadmap
        roadmap = chat_model.invoke(personalized_prompt.format_messages()[1].content)
        youtube_link = f"https://www.youtube.com/results?search_query={user_inputs['goal'].replace(' ', '+')}"
        return f"{roadmap.content}\n\n🔗 Explore related videos: {youtube_link}"

    except Exception as e:
        return f"Error: {e}"