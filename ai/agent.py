import json
from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.googlesearch import GoogleSearch
from tools import retrieve_similar_docs, youtube_video_search
from working_perist import parse_roadmap_response
from working_perist import create_personalized_prompt

def get_agent_instance(): 
    return Agent(
                tools=[GoogleSearch(), retrieve_similar_docs], 
                model = Gemini(id="gemini-2.0-flash"), 
                markdown=True, 
                description="You are a professional programming instructor well versed in competitive programming, machine learning and web development. You have the experience of a senior software engineer and also well versed with a lot of software design patterns.",
                instructions = """
                You must provide a list of topics to learn that strictly adheres to the following constraints from the user:

                1. **Learning Goal**.
                2. **Time Commitment**
                3. **Preferred Learning Mode**
                4. **Current Skill Level**
                5. **Deadline**
                
                ### Information Gathering:
                - **Always** use the **GoogleSearch** tool to find the latest and most up-to-date information about the topic, including best practices, new features, and recent advancements.
                
                - **Use the retriever_tool** to fetch relevant documents and existing knowledge on the topic. This will provide context from previously gathered materials and also provide an idea on how to help the user learn the topic step by step.

                
                ### Response Guidelines:
                - Ensure that every suggested topic, resource, or milestone aligns with the user’s constraints.
                - Do **not** suggest generic learning paths—customize the plan specifically for the user’s preferences.
                - If an external resource does not fit the user’s learning style, modify the approach to maintain alignment.
                - Prioritize **practical projects** over theory and integrate them into the roadmap.
                
                - **ONLY PROVIDE A LIST OF TOPICS THAT THE USER NEEDS TO LEARN** according to the user's requirements.**NO NEED TO WRITE ANYTHING ELSE. STRICTLY JUST THE LIST OF TOPICS**
                
                - **ONLY PROVIDE THE LIST IN PLAIN TEXT. NO NEED TO HIGHLIGHT ANYTHING USING STARS OR MARKDOWN.**
                
                - **THE RESPONSE SHOULD BE IN THE FOLLOWING FORMAT: **
                1.Topic1
                2.Topic2
                ...
                
                - **THERE SHOULD ONLY BE A SINGLE TOPIC IN EVERY LINE NOT MULTIPLE TOPICS IN ONE LINE**
                - **INCLUDE ALL TOPICS WHICH ARE REQUIRED**.The number of topics can surpass the number of weeks.

                Strictly follow these guidelines to provide a structured and **personalized** learning experience.""",
            )
def get_structuring_agent_instance():
    return Agent(
        tools=[],
        model=Gemini(id="gemini-2.0-flash"),
        markdown=True,
        description="You are an expert at structuring information into JSON format.",
        instructions="""
        #PROVIDED INFO/CONTENT:
        - You will be provided a list of topics and a list of youtube videos with their titles and URLS.
        - Some user requirements in the following format: 
          1. **Learning Goal**.
          2. **Time Commitment**
          3. **Preferred Learning Mode**
          4. **Current Skill Level**
          5. **Deadline**

        #STRUCTURING OF THE CONTENT
        You MUST format this content into a JSON structure that adheres to the following rules:

        1.  Output : [ {"week":"1","goals":[],"topics":[],"suggested_yt_videos":[]}, ...]
        2.  Week numbers must be integers starting at 1.
        3.  All fields (goals, topics, suggested_yt_videos) must be arrays of strings.
        4.  There should be no nested objects or additional fields.
        5.  **DO NOT generate youtube links by yourself.**Only use the urls provided in the content you are given.

        #RESPONSE GUIDELINES
        IMPORTANT:
        You MUST generate a response following this JSON structure:
        [
            {
                "week": 1,
                "goals": ["Learn X", "Practice Y"],
                "topics": ["Topic A", "Topic B"],
                "suggested_yt_videos": [url1, url2 , ...]
            },
            {
                "week": 2,
                "goals": ["Learn X", "Practice Y"],
                "topics": ["Topic A", "Topic B"],
                "suggested_yt_videos": [url1, url2, ...]
            },
            ...
        ]

        IMPORTANT:
        **DO NOT alter any content (text or video) in the structuring process**
        REPEAT: This JSON structure MUST be FOLLOWED WITHOUT FAIL. Provide the response as a JSON embedded in the response string. Wrap the JSON in triple backticks.
        """,
        show_tool_calls=True,
    )

def get_video_agent_instance():
    return Agent(
        tools=[youtube_video_search],
        tool_call_limit=100,
        model=Gemini(id="gemini-2.0-flash"),
        markdown=True,
        description="You are an agent designed to search for relevant YouTube videos based on user prompts.",
        instructions="""
            #PROVIDED INFO:
            You will be provided a list of topics.

            #INFORMATION GATHERING
            **ALWAYS USE the youtube_video_search tool** to find the urls of videos which are relatable to the topics mentioned.

            #RESPONSE GUIDELINES
            **Provide a list of titles of vidoes  PAIRED WITH the URLS** in the following format: 
            1.Title1: corresponding_video_url
            2.Title2: corresponding_video_url
            **No need to print anything else.**

            #REPEAT: THE ABOVE FORMAT SHOULD BE STRICTLY FOLLOWED. MOREOVER VIDEOS SHOULD ALWAYS BE FOUND USING the youtube_video_search tool.
            ...
        """,
        show_tool_calls=False

    )

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

    yt_agent = get_video_agent_instance()
    yt_videos = yt_agent.run(contents)

    with open("./video_list.txt", "w") as f:
        f.write(yt_videos.content)


    # print("video list: ", yt_videos.content)
