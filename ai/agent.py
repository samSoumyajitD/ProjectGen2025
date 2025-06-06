import json
from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.googlesearch import GoogleSearch
from tools import retrieve_similar_docs, youtube_video_search
from working_perist import parse_json_response
from working_perist import create_personalized_prompt
from instructions_and_roles import role_evaluator, instructions_evaluator, role_quiz, instructions_quiz, role_structuring, role_text_info, instruction_structuring, instruction_text_info
from quiz_sample_response import sample_quiz
from attempted_quiz_sample import attempted_sample_quiz
def get_agent_instance(role:str, instructions:str): 
    return Agent(
                tools=[GoogleSearch("google_search"), retrieve_similar_docs], 
                model = Gemini(id="gemini-2.0-flash"), 
                markdown=True, 
                description=role,
                instructions = instructions,
                show_tool_calls=True
            )

if __name__ == "__main__": 
    personalized_prompt_1 = """
        - Learning Goal: Natural Language Processing
        - Time Commitment: 7 hrs per week
        - Preferred Learning Mode: Tutorials and Videos
        - Current Skill Level: Intermediate
        - Deadline: within 4 weeks
    """
    # topic_list = [
    #     "Basics of C++",
    #     "Pointers in C++",
    #     "Dynamic Memory Allocation"
    # ]

    # goal_list = [
    #     "Understand the basics of C++ for DSA",
    #     "Learn about pointers and dynamic memory allocation"
    # ]
    # topics_list_prompt = f"""
    #     Topics_list = {topic_list}
    #     Goals_list = {goal_list}
    # """
    # # agent = get_agent_instance(role=role_text_info, instructions = instruction_text_info)
    # agent = get_agent_instance(role = role_quiz, instructions = instructions_quiz.format(num_questions="10"))
    # response = agent.run(topics_list_prompt)
    # parsed_response = parse_json_response(response.content)
    # print(parsed_response)
    # agent.print_response()
    attempt_object = attempted_sample_quiz
    agent = get_agent_instance(role = role_evaluator, instructions=instructions_evaluator)
    str_attempt_object = str(attempt_object)
    # print(str_attempt_object, type(str_attempt_object))
    response = agent.run(str(attempted_sample_quiz))
    parsed_response = parse_json_response(response.content)

    print(parsed_response)
    pass