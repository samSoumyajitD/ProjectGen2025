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
                tools=[GoogleSearch(), retrieve_similar_docs], 
                model = Gemini(id="gemini-2.0-flash"), 
                markdown=True, 
                description=role,
                instructions = instructions,
            )
# def get_structuring_agent_instance():
#     return Agent(
#         tools=[],
#         model=Gemini(id="gemini-2.0-flash"),
#         markdown=True,
#         description="You are an expert at structuring information into JSON format.",
#         instructions=,
#         show_tool_calls=True,
#     )

# def get_video_agent_instance():
#     return Agent(
#         tools=[youtube_video_search],
#         tool_call_limit=100,
#         model=Gemini(id="gemini-2.0-flash"),
#         markdown=True,
#         description="You are an agent designed to search for relevant YouTube videos based on user prompts.",
#         instructions="""
#             #PROVIDED INFO:
#             You will be provided a list of topics.

#             #INFORMATION GATHERING
#             **ALWAYS USE the youtube_video_search tool** to find the urls of videos which are relatable to the topics mentioned.

#             #RESPONSE GUIDELINES
#             **Provide a list of titles of vidoes  PAIRED WITH the URLS** in the following format: 
#             1.Title1: corresponding_video_url
#             2.Title2: corresponding_video_url
#             **No need to print anything else.**

#             #REPEAT: THE ABOVE FORMAT SHOULD BE STRICTLY FOLLOWED. MOREOVER VIDEOS SHOULD ALWAYS BE FOUND USING the youtube_video_search tool.
#             ...
#         """,
#         show_tool_calls=False

#     )

if __name__ == "__main__": 
    personalized_prompt_1 = """
        - Learning Goal: Machine Learning 
        - Time Commitment: 7 hrs per week
        - Preferred Learning Mode: Tutorials and Videos
        - Current Skill Level: Intermediate
        - Deadline: 12 weeks
    """

    # agent = get_agent_instance() 
    # response = agent.run(personalized_prompt_1)
    # print("response: ",response.content)
    # with open("./response.txt","w") as f:
    #     f.write(response.content)

    # contents="""
    # """
    with open("./response.txt","r") as f:
        contents = f.read()

    # yt_agent = get_agent_instance()
    # yt_videos = yt_agent.run(contents)

    # with open("./video_list.txt", "w") as f:
    #     f.write(yt_videos.content)


    # print("video list: ", yt_videos.content)
