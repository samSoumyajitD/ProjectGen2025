from phi.tools import Toolkit
from langchain.chains.retrieval import create_retrieval_chain
from langchain_core.runnables import Runnable, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from working_perist import create_combine_docs_template, get_vectorstore, setup_ai_model
from langchain.chains.combine_documents.stuff import create_stuff_documents_chain
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("YOUTUBE_API_KEY")


def youtube_video_search(video_topic:str):
    youtube = build("youtube", "v3", developerKey=api_key)
    request = youtube.search().list(
    q=video_topic,
    part="snippet",
    type="video",
    maxResults=2
    )
    response = request.execute()
    
    video_list=[]
    for item in response["items"]:
        video_title = item['snippet']['title']
        video_id = item['id']['videoId']
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        video_list.append({"title": video_title, "url": video_url})
    return str(video_list)


def retrieve_similar_docs(user_prompt:str):
        vector_store = get_vectorstore()
        similar_docs = vector_store.similarity_search(user_prompt)
        # output="##"
        output=""
        # print(len(similar_docs))
        for doc in similar_docs:
            output += doc.page_content
            output += "\n"
        return output



def google_search_tool():
    pass

if __name__ == "__main__":
    output = youtube_video_search("MCP servers")
    print(output)
