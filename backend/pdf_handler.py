from Py2PDF2 import PdfReader, PdfWriter
import os

class PDFHandler:
    def __init__(self, file_path="dummy.pdf"):
        self.file_path = file_path
        self.reader = PdfReader(file_path)
    
    def new_pdf(self, file_path):
        self.file_path = file_path
        self.reader = PdfReader(file_path)

    def extract_text(self):
        text = ""
        for page in self.reader.pages:
            text += page.extract_text() + "\n"
        return text

    
    