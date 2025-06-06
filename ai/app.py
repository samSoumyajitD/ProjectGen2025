from flask import Flask, jsonify, request, make_response
from pymongo import MongoClient
from flask_cors import CORS
from langchain.chains import RetrievalQA
from working_perist import extract_roadmap_topics, get_roadmap_data, parse_json_response, create_combine_docs_template, get_mongo_data, get_vectorstore, save_quiz_to_mongo, setup_ai_model, create_personalized_prompt, generate_roadmap, save_roadmap_to_mongo
from bson import ObjectId
from generateQuiz import generate_quiz, parse_quiz_to_json, store_quiz_in_db, roadmap_collection, parse_roadmap
from generateQuiz import setup_ai_model, parse_roadmap, generate_quiz, parse_quiz_to_json, store_quiz_in_db
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers.string import StrOutputParser
from agent import get_agent_instance
from instructions_and_roles import role_evaluator, instructions_evaluator, role_quiz, instructions_quiz, role_structuring, role_text_info, instruction_text_info, instruction_structuring
from utils.yt_script import get_video_list
import json
import traceback
import re
# Initialize Flask app
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=["http://localhost:3000"], supports_credentials=True) 
# MongoDB URI from .env
MONGO_URI = os.getenv("MONGO_URI")

# MongoDB Client Setup
client = MongoClient(MONGO_URI)
db = client["test"]
goals_collection = db["goals"]
roadmap_collection = db["roadmaps"]
quiz_collection = db["quiz"]
eval_collection = db["eval"]


@app.route('/generate-roadmap/<user_id>/<goal_id>', methods=['GET'])
def generate_roadmap_api(user_id:str, goal_id:str):
    
    try:
        user_id = ObjectId(user_id)
        goal_id = ObjectId(goal_id)
        # Fetch user data from MongoDB using user_id
        user_inputs = get_mongo_data(goal_id, user_id)
        
        # Check if the user data was found
        if not user_inputs:
            return jsonify({"error": "User not found"}), 404

        
        
        
        # Create personalized prompt
        personalized_prompt = create_personalized_prompt(user_inputs) #for testing didnt add user_inputs 
        


        #Instantiating agents
        info_agent = get_agent_instance(role_text_info, instruction_text_info)
        structuring_agent = get_agent_instance(role_structuring, instruction_structuring)
        
        #fetching videos related to the topics
        response = info_agent.run(personalized_prompt)
        topic_list = list(response.content.strip('\n').strip().strip('`').split('\n'))
        video_list = get_video_list(topic_list)
        
        #restructuring content to required json.
        content_for_restructuring = response.content + "\n\n\n" + video_list
        restructured_content = structuring_agent.run(content_for_restructuring)
        parsed_response = parse_json_response(restructured_content.content)

        if parsed_response:
            save_roadmap_to_mongo(user_id, goal_id, parsed_response, user_inputs["goal"])
        
        
        return jsonify({"roadmap": parsed_response}), 200
        

    except Exception as err:
        traceback.print_exc()
        print("err : ",err)
        return jsonify({"message":"Something went wrong!Please try again later."}),500

@app.route('/get-roadmap/<user_id>/<goal_id>', methods=["GET"])
def fetch_roadmap_data(user_id:str, goal_id:str):
    try:
        roadmap_data = get_roadmap_data(user_id, goal_id)
        
        return jsonify({"roadmap":roadmap_data}), 200
    except Exception as err:
        print("Error fetching roadmap data: ", err)
        return jsonify({"error":"Something went wrong :("}), 500

def object_id_to_str(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

# Route to fetch data by userId
@app.route('/goals/<user_id>', methods=['GET'])
def get_goals(user_id):
    # Query to fetch all goals for a specific userId
    goals_data = goals_collection.find({"userId": ObjectId(user_id)})

    # Convert ObjectId to string for serialization
    goals_list = []
    for goal in goals_data:
        goal['_id'] = object_id_to_str(goal['_id'])
        goal['userId'] = object_id_to_str(goal['userId'])
        goals_list.append(goal)

    # Return the data as JSON
    return jsonify({"goals": goals_list})  # Make sure the data is returned in a "goals" key






# MongoDB Connection (redundant if already in generate_quiz.py, but kept for clarity)

@app.route('/remove-roadmap/<user_id>/<goal_id>', methods=["DELETE"])
def remove_roadmap(user_id:str, goal_id:str):
    try:
        user_id = ObjectId(user_id)
        goal_id = ObjectId(goal_id)

        goals_collection.find_one_and_delete({"_id":goal_id, "userId":user_id})
        roadmap_collection.find_one_and_delete({"userId":user_id, "goalId":goal_id})

        return jsonify({"success":"Goal removed successfully!"})
    except Exception as err:
        print("Error at remove-roadmap endpoint : ",err)
        traceback.print_exc()
        return jsonify({"error":"Something went wrong. Please try again later :("}), 500

@app.route('/generate-quiz/<user_id>/<goal_id>', methods=['POST'])
def generate_quiz_api(user_id:str, goal_id:str):
    """
        Provide the field 'week' in the body of the request if the quiz is being generated for a specific week. 
        For final quiz, simply dont send any body along with the request or an empty body.
    """ 
    try:
        
        user_id = ObjectId(user_id)
        goal_id = ObjectId(goal_id)
        # print("user_id: ", user_id, "goal_id: ", goal_id)
        data = request.get_json()
        week = data.get("week") if data else None
        # print("week : ", week)
        roadmap_document = roadmap_collection.find_one({"userId":user_id, "goalId":goal_id})
        # print(roadmap_document["roadmap"])
        if not roadmap_document :
            return jsonify({"error": "No roadmap found in MongoDB"}), 404
        print("found roadmap")
        
        # print("roadmap: ", roadmap_document["roadmap"])
        topic_list, goal_list = extract_roadmap_topics(roadmap_document["roadmap"], week)
        print("extracted topic lists")
        questions_quantity = '5'
        if not week:
            questions_quantity="10"

        #instantiating agent
        agent = get_agent_instance(role=role_quiz, instructions = instructions_quiz.format(num_questions=questions_quantity))
        
        quiz_prompt = f"""
            Topics_list : {topic_list}
            Goals_list : {goal_list}
            week: {week if week else "final"}
        """
        
        response = agent.run(quiz_prompt)
        print("got llm response.")
        parsed_response = parse_json_response(response.content)
        quiz_document = {"week":(str(week) if week else "final"), "quiz":parsed_response[:len(parsed_response)-1], "correct_answers":parsed_response[-1]["correct_answers"], "goalId":goal_id, "userId":user_id}
        document_id = save_quiz_to_mongo(quiz_document)
        print("storing document to mongo")
        if not document_id:
            raise Exception("Error while storing the quiz data.")

        return jsonify({
            "quizId":str(document_id)
        }),200

        
    except Exception as err:
        traceback.print_exc()
        print("Error generating quiz : ", err)
        return jsonify({"error":"Something went wrong while generating quiz :("}), 500
    # user_id = roadmap_entry["userID"]
    # roadmap_content = roadmap_entry["roadmap"]

    # # Parse and generate quiz
    # week_dict = roadmap_document
    # if not week_dict:
    #     return jsonify({"error": "No valid weekly sections found in roadmap"}), 400

    # first_week = next(iter(week_dict))
    # print(f"Generating quiz for {first_week}...")

    # # Setup AI model using API key from .env
    # chat_model = setup_ai_model(GROQ_API_KEY )

    # # Generate quiz
    # quiz_text = generate_quiz(chat_model, first_week, week_dict[first_week])
    # quiz_data = parse_quiz_to_json(quiz_text)

    # # Store quiz in MongoDB
    # store_quiz_in_db(user_id, quiz_data)

    # return jsonify({"message": "Quiz generated and stored successfully", "quiz_data": quiz_data}), 200

@app.route('/get-quiz/<quiz_id>', methods=['GET'])
def get_quiz(quiz_id:str):
    # Fetch the latest quiz from MongoDB
    try:
        quiz_id = ObjectId(quiz_id)
        quiz_entry = quiz_collection.find_one({"_id":quiz_id})  # Get the most recent quiz
        
        if not quiz_entry:
            return jsonify({"error": "No such quiz found"}), 404

        return jsonify({
            "quiz":quiz_entry["quiz"], 
            "week":quiz_entry["week"],
        }), 200
    except Exception as err:
        print("err: ",err)
        return jsonify({"error":"Something went wrong :("}),500
    
@app.route('/eval/<quiz_id>/<goal_id>', methods=['POST'])
def evaluate(quiz_id:str, goal_id:str):
    try:
        data = request.get_json()
        user_answers = data.get("user_answers")
        quiz_doc = quiz_collection.find_one({"_id":ObjectId(quiz_id)})
        attempt_object = {"quiz":quiz_doc["quiz"], "correct_answers":quiz_doc["correct_answers"], "user_answers":user_answers}

        evaluator = get_agent_instance(role=role_evaluator , instructions = instructions_evaluator)

        response = evaluator.run(str(attempt_object))
        parsed_response = parse_json_response(response.content)
        eval_object = {"evaluation":parsed_response, "goalId":ObjectId(goal_id), "quizId":ObjectId(quiz_id), "week":quiz_doc["week"]}
        save_eval_to_mongo(eval_object)
        return jsonify({"evaluation":parsed_response, "week":quiz_doc["week"]}), 200
    except Exception as err:
        print("Error at evaluation endpoint : ", err)
        return jsonify({"error":"Something went wrong :("}), 500
def save_eval_to_mongo(eval_object):
    try:
        existing_eval = eval_collection.find_one({"quizId":eval_object["quizId"]})
        if existing_eval:
            eval_collection.find_one_and_update(
                {"_id":existing_eval["_id"]}, 
                {"$set":eval_object})
        else:
            eval_collection.insert_one(eval_object)

        return True
    except Exception as err:
        print("Error at evaluation endpoint :",err)
        return False
        # return jsonify({"error":"Something went wrong :("}), 500

@app.route('/get-goal-name/<goal_id>', methods=["GET"])
def get_goal_name(goal_id:str):
    try:
        goal_doc = goals_collection.find_one({"_id":ObjectId(goal_id)})
        return jsonify({"goalName":goal_doc["goal"]}),200
    except Exception as err:
        print("Error at get-goal-name : ", err)
        return jsonify({"error":"Something went wrong :("}),500

@app.route('/get-attempted-quizzes/<goal_id>', methods=["GET"])
def get_all_attempted_quizes(goal_id:str):
    try:
        quizzes = list(eval_collection.find({"goalId":ObjectId(goal_id)}))
        # print(quizzes)
        response=[]
        for quiz in quizzes:

            response.append({"week":quiz["week"], "quizId":str(quiz["quizId"]), "score":quiz["evaluation"][-1]["score"]})
        # for quiz in quizzes:
        print(response)
        return jsonify({"quizzes":response}),200
    except Exception as err:
        print("Error at get-attempted-quizzes : ", err)
        return jsonify({"error":"Something went wrong :("}),500
@app.route("/get-eval/<quiz_id>", methods=["GET"])
def get_eval(quiz_id:str):
    try:
        eval_doc = eval_collection.find_one({"quizId":ObjectId(quiz_id)})
        print(eval_doc)
        return jsonify({
            "evaluation":eval_doc["evaluation"]
        })
    except Exception as err:
        print("Error at get-eval : ", err)
        return jsonify({"error":"Something went wrong :("}),500
def score_threshold_pass(score:str):
    threshold = 70
    print(score)
    percentage = 0
    nums = score.split("/")
    return ((int(nums[0])/int(nums[1]))*100) >= threshold
        

@app.route('/certificate/<goal_id>', methods=["GET"])
def eligibility(goal_id:str):
    try:
        final_eval = eval_collection.find_one({"goalId":ObjectId(goal_id), "week":"final"})
        print(final_eval)
        if final_eval and score_threshold_pass(final_eval["evaluation"][-1]["score"]):
            return jsonify({"verdict":"eligible"}),200
        return jsonify({"verdict":"not eligible"}),200
    except Exception as err:
        print("Error testing eligibility: ",err)
        pass   
if __name__ == '__main__':
    # app.run(debug=True)
    # parser = StrOutputParser()
    # output = generate_roadmap_api("6805f9af2328eebef7cffd50", "67a1fae0cd1963827d5c292e")
    # with open("roadmap_json.json","r") as f:
    #     f.write(output)
    # # parsed_output = parser.invoke(output.content)
    
    # match = re.search(r'```json', parsed_output, re.DOTALL)
    # print(parsed_output)
    # if match:
    #     json_string = parsed_output[match.end():].strip('`')
    #     print(json_string)
    #     json_output = json.loads(json_string)
    #     print(json_output)
    # else:
    #     print("NO json found!")
    # response = generate_roadmap_api()
    # print("response: ",response)
    # parser = StrOutputParser()
    # output = parser.invoke(response.content)
    # print(output)
    # save_roadmap_to_mongo("6805f9af2328eebef7cffd50", , user_inputs["goal"])

    app.run(debug=True)
