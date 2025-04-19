import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# Setup AI Model
def setup_ai_model(api_key):
    return ChatGroq(temperature=0.2, groq_api_key=api_key, model_name="mixtral-8x7b-32768")

# Load quiz from JSON file
def load_quiz(filename="quiz.json"):
    with open(filename, "r", encoding="utf-8") as file:
        return json.load(file)

# Load user answers from JSON file
def load_quiz_answers(json_file="answers.json"):
    try:
        with open(json_file, "r", encoding="utf-8") as f:
            answers = json.load(f)
            if not isinstance(answers, list):
                raise ValueError("JSON file should contain an array of answers")
                
            validated = []
            for idx, answer in enumerate(answers, 1):
                ans = str(answer).upper()
                if ans not in ['A', 'B', 'C', 'D']:
                    raise ValueError(f"Invalid answer '{answer}' at position {idx}. Must be A/B/C/D.")
                validated.append(ans)
            return validated
            
    except FileNotFoundError:
        raise FileNotFoundError("Answers file not found. Please create an 'answers.json' file.")
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON format in answers file")

# Evaluate quiz
def evaluate_quiz(quiz, answers):
    if len(answers) != len(quiz):
        raise ValueError(f"Mismatched answers/questions: {len(answers)} answers vs {len(quiz)} questions")

    score = 0
    results = []
    
    for idx, (q, user_answer) in enumerate(zip(quiz, answers), 1):
        correct_answer = q["correct_answer"]
        is_correct = user_answer.upper() == correct_answer

        if is_correct:
            score += 1

        results.append({
            "question_number": idx,
            "question_text": q["question_text"],
            "user_answer": user_answer.upper(),
            "correct_answer": correct_answer,
            "is_correct": is_correct
        })

    return {
        "score": score,
        "total_questions": len(quiz),
        "accuracy": f"{(score/len(quiz))*100:.2f}%",
        "detailed_results": results
    }

# Load roadmap for updating
def load_full_roadmap(filename="roadmap.txt"):
    with open(filename, "r", encoding="utf-8") as file:
        return file.read()

# Generate feedback and update roadmap
def generate_feedback_and_update(chat_model, quiz_results, roadmap_content):
    feedback_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert educational content creator. Analyze quiz results and provide:
        - Weak area identification
        - Learning resource suggestions
        - Roadmap improvements
        Maintain the original roadmap structure while adding suggestions."""),
        ("human", """Quiz Results:
        {results}
        
        Current Roadmap:
        {roadmap}
        
        Provide detailed feedback and an updated roadmap with integrated improvements.""")
    ])
    
    chain = feedback_prompt | chat_model
    response = chain.invoke({
        "results": json.dumps(quiz_results, indent=2),
        "roadmap": roadmap_content
    })
    return response.content

# Save updated roadmap
def save_updated_roadmap(updated_roadmap, filename="updated_roadmap.txt"):
    with open(filename, "w", encoding="utf-8") as file:
        file.write(updated_roadmap)
    print(f"\nUpdated roadmap saved to {filename}")

# Main execution
def main():
    api_key = "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"
    chat_model = setup_ai_model(api_key)

    try:
        # Load quiz and answers
        quiz = load_quiz()
        answers = load_quiz_answers()
        results = evaluate_quiz(quiz, answers)

        # Display results
        print("\nQuiz Evaluation Results:")
        print(f"Score: {results['score']}/{results['total_questions']}")
        print(f"Accuracy: {results['accuracy']}")

        # Generate feedback & update roadmap
        roadmap_content = load_full_roadmap()
        print("\nGenerating personalized roadmap updates...")
        updated_roadmap = generate_feedback_and_update(chat_model, results, roadmap_content)
        save_updated_roadmap(updated_roadmap)

    except Exception as e:
        print(f"Error: {str(e)}")
if __name__ == "__main__":
    main()