import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
load_dotenv()
api_key = os.getenv("YOUTUBE_API_KEY")

def yt_api_search(youtube, video_topic):
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
    return video_list

def get_video_list(topics:list[str]) -> list:
    """
        Input: List of topics
        Output: List of dictionaries in the format {title:video_title, url:video_url}
    """
    youtube = build("youtube", "v3", developerKey=api_key)
    final_list=[]
    for topic in topics:
        result = yt_api_search(youtube, topic)
        final_list.extend(result)
    return str(final_list)

if __name__ == "__main__":
    results = get_video_list(["Linear Regression", "Artificial Neural Network", "Gradient Descent"])
    print("results: ",results)