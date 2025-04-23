import json
from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.googlesearch import GoogleSearch
from tools import retrieve_similar_docs, youtube_video_search
from working_perist import parse_roadmap_response
from working_perist import create_personalized_prompt
from instructions_and_roles import role_structuring, role_text_info, instruction_structuring, instruction_text_info
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
        - Learning Goal: Model Context Protocl
        - Time Commitment: 7 hrs per week
        - Preferred Learning Mode: Tutorials and Videos
        - Current Skill Level: Intermediate
        - Deadline: 12 weeks
    """
    agent = get_agent_instance(role=role_text_info, instructions = instruction_text_info)
    response = agent.print_response(personalized_prompt_1, show_reasoning=True)
    pass