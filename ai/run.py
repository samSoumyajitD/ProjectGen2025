from quart import Quart, jsonify, abort
from motor.motor_asyncio import AsyncIOMotorClient
from langchain.chains import RetrievalQA
from bson import ObjectId
from dotenv import load_dotenv
from StudentCareer import generate_roadmap_json,create_personalized_prompt,setup_ai_model,get_vectorstore
import os

# Load environment variables from .env file
load_dotenv()

app = Quart(__name__)

# MongoDB URI from environment variable
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MongoDB URI is not set in the environment variables")

# Initialize MongoDB client asynchronously
client = AsyncIOMotorClient(MONGO_URI)
db = client["Amdoc"]
goals_collection = db["goals"]
roadmap_collection = db['roadmaps']

# Helper function to convert ObjectId to string
def object_id_converter(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError("ObjectId not found")

# Quart route to fetch the goal based on user_id and _id
@app.route('/getroadMap/<user_id>/<goal_id>', methods=['GET'])
async def main(user_id, goal_id):
    print("🎯 Welcome to SaarthiAI Roadmap Generator!")
    
    goal = await goals_collection.find_one({
        "userId": ObjectId(user_id),
        "_id": ObjectId(goal_id)
    })
    
    if goal is None:
        abort(404,description="Goal not found")
    goal['_id'] = str(goal['_id'])
    goal['userId'] = str(goal['userId'])

    
    # Extract user inputs from goal document
    user_inputs = {
        'goal': goal.get("goal", "Unknown"),
        'time_per_week': goal.get("time_per_week", "Unknown"),
        'learning_mode': goal.get("learning_mode", "Unknown"),
        'skill_level': goal.get("skill_level", "Unknown"),
        'deadline': goal.get("deadline", "Unknown")
    }
    
    # Load vector store and AI model
    vectorstore = get_vectorstore()
    chat_model = setup_ai_model()

    # Setup QA chain
    qa = RetrievalQA.from_chain_type(
        llm=chat_model,
        chain_type="stuff",
        retriever=vectorstore.as_retriever()
    )
    
    # Create personalized prompt
    personalized_prompt = create_personalized_prompt(user_inputs)
    
    # Generate roadmap
    roadmap = generate_roadmap_json(qa, personalized_prompt, user_inputs["goal"], user_inputs["skill_level"])
    
    existing_roadmap = await roadmap_collection.find_one({
        "userId": ObjectId(user_id),
        "goalId": ObjectId(goal_id)
    })
    
    if existing_roadmap:
        # If the roadmap already exists, update it
        await roadmap_collection.update_one(
            {"_id": existing_roadmap["_id"]},  # Filter by the existing document _id
            {"$set": {"roadmap": roadmap}}  # Update the roadmap field
        )
        response_message = "Roadmap updated successfully."
    else:
        # Insert new roadmap
        roadmap_doc = {
            "userId": ObjectId(user_id),
            "goalId": ObjectId(goal_id),
            "goal": goal['goal'],
            "roadmap": roadmap
        }
        await roadmap_collection.insert_one(roadmap_doc)
        response_message = "Roadmap created successfully."
    
    return jsonify({
        "userID": str(goal.get("userId")),
        "goal": goal.get("goal", "Unknown"),
        "roadmap": roadmap,
        "message": response_message
    })
if __name__ == "__main__":
    app.run(debug=True)

