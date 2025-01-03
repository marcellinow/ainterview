from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from io import BytesIO
import fitz  # PyMuPDF
import os
from supabase import create_client, Client
import spacy
from datetime import datetime

# FastAPI instance
app = FastAPI()
# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti "*" dengan URL frontend tertentu jika ingin lebih aman
    allow_credentials=True,
    allow_methods=["*"],  # Mengizinkan semua metode HTTP
    allow_headers=["*"],  # Mengizinkan semua header
)

# Define input model for CV Data
class CVData(BaseModel):
    user_id: str
    cv_link: str

class CVResponse(BaseModel):
    user_id: str
    question_id: int
    response: str

class CareerData(BaseModel):
    user_id: str
    career_path: str
    created_at: str

class MultipleUserResponses(BaseModel):
    user_id: str
    responses: dict

# Supabase URL and Key (make sure to set environment variables)
url: str = os.environ.get("SUPABASE_URL", "https://ffqmshntftrbvolsudtt.supabase.co")
key: str = os.environ.get("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcW1zaG50ZnRyYnZvbHN1ZHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDM3ODgsImV4cCI6MjA1MDE3OTc4OH0.29Slsj3k-osTaU3A8SwSQw8Suho0rJ-TXZjISum_Pjc")
supabase: Client = create_client(url, key)

# Temporary storage for user responses
temporary_responses = {}

# Function to fetch CV URL from Supabase
def get_file_url(user_id: str):
    print(f"Fetching CV URL for user_id: {user_id}")
    
    # Query Supabase
    response = supabase.table('cv_upload').select('cv_link').eq('user_id', str(user_id)).execute()
    
    # Debugging log
    print(f"Supabase response data: {response.data}")
    
    # Check if response contains data
    if response.data and len(response.data) > 0:
        return response.data[0]['cv_link']
    else:
        # Raise an error if no data is found
        print("No data found for the given user_id.")
        raise HTTPException(status_code=404, detail="No file found for the given user_id")

# Function to process the CV and extract text from the PDF
def process_cv_file(file_url: str):
    response = requests.get(file_url)
    print(f"Fetching file from {file_url} - Status code: {response.status_code}")
    
    if response.status_code == 200:
        pdf_file = BytesIO(response.content)
        try:
            doc = fitz.open(stream=pdf_file)
            text = "".join(page.get_text("text") for page in doc)
            return text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    else:
        raise HTTPException(status_code=404, detail=f"Failed to fetch file: {response.status_code}")

# Function to generate questions based on CV content
def generate_questions(text: str):
    nlp = spacy.load("en_core_web_lg")
    sent = nlp(text)
    questions = []
    questions.append("Tell me about your childhood?")
    questions.append("What is your the most memorable thing?")

    for ent in sent.ents:
        if ent.label_ == "PERSON":
            questions.append(f"Can you tell us more about {ent.text}?")
        elif ent.label_ == "ORG":
            questions.append(f"What is your experience with {ent.text}?")
        elif ent.label_ == "GPE":
            questions.append(f"Why did you live or work in {ent.text}?")
        elif ent.label_ == "SKILL":
            questions.append(f"How did you learn {ent.text}?")


    return questions

# Endpoint to process CV and generate questions
@app.post("/process_cv/")
async def process_cv(cv_data: CVData):
    try:
        print(f"Received user_id: {cv_data.user_id}")
        print(f"Received public_url: {cv_data.cv_link}")

        # Step 1: Check if the CV already exists for the user
        existing_cv = supabase.table('cv_upload').select('cv_link').eq('user_id', cv_data.user_id).execute()
        print(f"responses: {existing_cv}\n")
        if existing_cv.data:
            # Update the existing CV link
            print("apdet")
            response = supabase.table('cv_upload').update({'cv_link': cv_data.cv_link}).eq('user_id', cv_data.user_id).execute()
            print(f"Updated CV link for user_id: {cv_data.user_id}")
        else:
            print("insert")
            # Insert a new CV link
            response = supabase.table('cv_upload').insert({'user_id': cv_data.user_id, 'cv_link': cv_data.cv_link}).execute()
            print(f"Inserted new CV link for user_id: {cv_data.user_id}")

        # Step 2: Process CV file and extract text
        print("Processing CV file...")
        cv_text = process_cv_file(cv_data.cv_link)
        # print(f"Extracted text: {cv_text[:100]}...")  # Log first 100 characters

        # Step 3: Generate questions
        print("Generating questions...")
        questions = generate_questions(cv_text)
        print(f"Questions generated: {questions}")

        return {"message": "Model processed successfully", "questions": questions}
    except Exception as e:
        print(f"Error: {e}")  # Log the actual error
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save_response/")
async def save_response(response: CVResponse):
    try:
        print(f"Received user_id: {response.user_id}")
        print(f"Received question_id: {response.question_id}")
        print(f"Received response: {response.response}")

        # Save response temporarily in memory
        if response.user_id not in temporary_responses:
            temporary_responses[response.user_id] = {}
        temporary_responses[response.user_id][response.question_id] = response.response

        print(f"Temporary responses: {temporary_responses}")

        return {"message": "Response saved temporarily"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/save_career/")
async def save_career(career_data: CareerData):
    try:
        print(f"Received user_id: {career_data.user_id}")
        print(f"Received career_path: {career_data.career_path}")
        print(f"Received created_at: {career_data.created_at}")

        # Save career data to Supabase
        career_data = {
            "user_id": career_data.user_id,
            "career_path": career_data.career_path,
            "created_at": career_data.created_at
        }
        response = supabase.table('user_career').insert(career_data).execute()
        print(f"Supabase response: {response}")

        return {"message": "Career path saved successfully"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/save_responses/")
async def save_responses(multiple_user_responses: MultipleUserResponses):
    try:
        print(f"Received data: {multiple_user_responses}")
        user_id = multiple_user_responses.user_id
        if user_id not in temporary_responses:
            raise HTTPException(status_code=404, detail="No temporary responses found for the user")

        # Insert multiple user responses into the database
        for question_id, response in temporary_responses[user_id].items():
            supabase.table('user_responses').insert({
                "user_id": user_id,
                "question_id": int(question_id),
                "response": response,
                "created_at": datetime.utcnow().isoformat()  # Convert datetime to string
            }).execute()

        # Clear temporary responses after saving to database
        del temporary_responses[user_id]

        return {"message": "Responses saved successfully"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
# Run the FastAPI app with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='127.0.0.1',port=8000)