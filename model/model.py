#!/usr/bin/env python
# coding: utf-8

# # Model to get a Resume Analysis
# reference: https://deepnote.com/app/abid/spaCy-Resume-Analysis-81ba1e4b-7fa8-45fe-ac7a-0b7bf3da7826

# Import Relevant Libraries
import pandas as pd
import numpy as np
import spacy
from spacy.pipeline import EntityRuler
from spacy.lang.en import English
from spacy.lang.id import Indonesian
from spacy.tokens import Doc
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import plotly.express as px
from supabase import create_client, Client
import requests
from io import BytesIO
import os
import fitz

# Download necessary NLTK resources
nltk.download(['stopwords','wordnet'])

# Initialize SpaCy model and Ruler
nlp = spacy.load("en_core_web_lg")
skill_patern_path = "dataset/jz_skill_patterns.jsonl"
ruler = nlp.add_pipe("entity_ruler")
ruler.from_disk(skill_patern_path)

# Function to load and clean dataset
def load_and_clean_data():
    df = pd.read_csv('dataset/Resume.csv')
    df = df.reindex(np.random.permutation(df.index))
    data = df.copy().iloc[0:500]

    clean = []
    for i in range(data.shape[0]):
        review = re.sub(
            '(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)|^rt|http.+?"', 
            " ", 
            data["Resume_str"].iloc[i]
        )
        review = review.lower()
        review = review.split()
        lm = WordNetLemmatizer()
        review = [lm.lemmatize(word) for word in review if word not in set(stopwords.words("english"))]
        review = " ".join(review)
        clean.append(review)
        
    data['Cleaned_Resume'] = clean
    return data

# Function to extract skills from resume text using SpaCy
def get_skills(text):
    doc = nlp(text)
    skills = [ent.text for ent in doc.ents if ent.label_ == "SKILL"]
    return skills

# Function to get unique skills
def unique_skills(x):
    return list(set(x))

# Function to process and clean resumes and extract skills
def process_resumes(data):
    data['skills'] = data['Cleaned_Resume'].str.lower().apply(get_skills)
    data['skills'] = data['skills'].apply(unique_skills)
    return data

# Function to generate questions based on the resume's named entities
def generate_questions(text):
    sent = nlp(text)
    questions = []
    
    for ent in sent.ents:
        if ent.label_ == "PERSON":
            questions.append(f"Can you tell us more about {ent.text}?")
        elif ent.label_ == "ORG":
            questions.append(f"What is your experience with {ent.text}?")
        elif ent.label_ == "GPE":
            questions.append(f"Where did you live or work in {ent.text}?")
        elif ent.label_ == "SKILL":
            questions.append(f"How did you learn {ent.text}?")
    
    # Add general questions
    questions.append("Tell me about your childhood?")
    questions.append("What is your most recent work experience?")
    questions.append("Where did you study?")
    
    return questions

# Function to visualize job distribution
def visualize_job_distribution(data):
    fig = px.histogram(
        data, x="Category", title="Distribution of Jobs Categories"
    ).update_xaxes(categoryorder="total descending")
    fig.show()

# Function to visualize skills distribution for a specific category
def visualize_skills_distribution(data, selected_value="ALL"):
    Total_skills = []
    if selected_value != "ALL":
        fltr = data[data["Category"] == selected_value]["skills"]
        for x in fltr:
            for i in x:
                Total_skills.append(i)
    else:
        fltr = data["skills"]
        for x in fltr:
            for i in x:
                Total_skills.append(i)

    fig = px.histogram(
        x=Total_skills,
        labels={"x": "Skills"},
        title=f"{selected_value} Distribution of Skills",
    ).update_xaxes(categoryorder="total descending")
    fig.show()

# Function to create a word cloud for the most used words in resumes
def generate_word_cloud(data, selected_value="ALL"):
    text = ""
    for i in data[data["Category"] == selected_value]["Cleaned_Resume"].values:
        text += i + " "

    plt.figure(figsize=(8, 8))
    x, y = np.ogrid[:300, :300]
    mask = (x - 150) ** 2 + (y - 150) ** 2 > 130 ** (2)
    mask = 255 * mask.astype(int)

    wc = WordCloud(
        width=800,
        height=800,
        background_color="white",
        min_font_size=6,
        repeat=True,
        mask=mask,
    )
    wc.generate(text)

    plt.axis("off")
    plt.imshow(wc, interpolation="bilinear")
    plt.title(f"Most Used Words in {selected_value} Resume", fontsize=20)
    plt.show()

# Function to get the CV URL from Supabase
def get_file_url(user_id):
    url: str = os.environ.get("SUPABASE_URL", "https://ffqmshntftrbvolsudtt.supabase.co")
    key: str = os.environ.get("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcW1zaG50ZnRyYnZvbHN1ZHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDM3ODgsImV4cCI6MjA1MDE3OTc4OH0.29Slsj3k-osTaU3A8SwSQw8Suho0rJ-TXZjISum_Pjc")
    supabase: Client = create_client(url, key)
    
    response = supabase.table('cv_upload').select('cv_link').eq('user_id', user_id).limit(1).execute()
    if response.data:
        return response.data[0]['cv_link']
    else:
        raise ValueError("No file found for the given user_id")

# Function to extract text from the CV PDF
def extract_text_from_cv(cv_url):
    response = requests.get(cv_url)
    if response.status_code == 200:
        pdf_file = BytesIO(response.content)
        doc = fitz.open(stream=pdf_file)
        text = ""
        for page in doc:
            text += page.get_text("text")
        return text
    else:
        raise ValueError(f"Failed to fetch the file. Status code: {response.status_code}")