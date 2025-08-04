import sys
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

# Function to clean and prepare the skills data
def clean(skills):
    return [s.strip().lower() for s in skills if s.strip()]  # Remove empty strings after cleaning

# Recommendation function to suggest relevant skills
def recommend(user_skills, top_n=5):
    user_input = ", ".join(clean(user_skills))
    user_vec = vectorizer.transform([user_input])
    sims = cosine_similarity(user_vec, X)[0]  # Using sparse matrix for similarity computation
    top_indices = sims.argsort()[::-1]  # Get indices of most similar paths

    recommended = []
    seen_skills = set(clean(user_skills))

    for idx in top_indices:
        job_skills = clean(str(learning_paths[idx]).split(","))
        for skill in job_skills:
            if skill not in seen_skills:
                recommended.append(skill)
                seen_skills.add(skill)
            if len(recommended) >= top_n:
                return recommended

    return recommended

# Entry point for script execution
if __name__ == "__main__":
    try:
        # Check if arguments are passed
        if len(sys.argv) < 3:
            raise ValueError("Please provide both user skills and the CSV file path.")

        user_input_skills = sys.argv[1].split(',')  # Skills passed from Node.js
        csv_path = sys.argv[2]  # Path to the CSV file
        
        # Load only the first 5000 rows of the dataset
        try:
            df = pd.read_csv(csv_path, header=None, nrows=5000)
        except FileNotFoundError:
            print(f"Error: The file at path {csv_path} was not found.", file=sys.stderr)
            sys.exit(1)

        # Replace NaN values with an empty string to avoid TfidfVectorizer errors
        df.fillna("", inplace=True)
        
        # Prepare the learning paths
        learning_paths = df[0].tolist()
        
        # Initialize TF-IDF Vectorizer (use sparse output)
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=5000)  # Limit the features
        X = vectorizer.fit_transform(learning_paths)  # Sparse matrix
        
        # Get recommendations based on user input skills
        recommended_skills = recommend(user_input_skills, top_n=5)
        
        # Output the recommendations in JSON format
        result = {"input": user_input_skills, "recommended": recommended_skills}
        print(json.dumps(result))  # Output JSON for Node.js to process

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
