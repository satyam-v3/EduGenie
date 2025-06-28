from flask import Flask, request, jsonify, render_template
import os
from dotenv import load_dotenv
from boltiotai import openai

load_dotenv()
app = Flask(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_content():
    data = request.get_json()
    course_title = data.get("course_title")

    if not course_title:
        return jsonify({"error": "No course title provided"}), 400

    prompt = f"""
Generate structured educational content for a course titled "{course_title}". Include:
1. Course Objective
2. Sample Syllabus (5 modules)
3. 3 Measurable Learning Outcomes (Bloom's Taxonomy)
4. Assessment Methods
5. Recommended Readings
"""

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        content = response['choices'][0]['message']['content']
        return jsonify({"result": content})
    except Exception as e:
        print(f"Error during course content generation: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)