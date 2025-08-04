import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
import os

# Paths
csv_path = 'D:/skillhive/backend/ml/job_skills.csv'
output_dir = 'D:/skillhive/backend/ml/'

# Load dataset
df = pd.read_csv(csv_path, header=None)

# Clean and format the skill strings
def clean(skills):
    return [s.strip().lower() for s in skills]

# Handle missing values (NaN)
df = df.fillna('')  # Replace NaN with empty strings

learning_paths = df[0].tolist()

# Prepare the data
path_strings = [", ".join(clean(str(row).split(","))) for row in learning_paths]

# Train TF-IDF Vectorizer
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(path_strings)

# Save model components
joblib.dump(vectorizer, os.path.join(output_dir, 'vectorizer.pkl'))
joblib.dump(X, os.path.join(output_dir, 'skills_matrix.pkl'))
joblib.dump(learning_paths, os.path.join(output_dir, 'raw_paths.pkl'))

print("✅ TF-IDF model trained and saved successfully!")
