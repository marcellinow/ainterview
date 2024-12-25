# Additional modules for SpaCy library

#Spacy
import spacy
from spacy.lang.en import English
from spacy.lang.id import Indonesian
from spacy.tokens import Doc
#nltk
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
nltk.download(['stopwords','wordnet'])