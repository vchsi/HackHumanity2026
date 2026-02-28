from supabase import create_client, Client
import os
from dotenv import load_dotenv


class SBConnector:
    def __init__(self):
        load_dotenv()
        try:
            self.url = os.getenv("SUPABASE_URL")
            self.key = os.getenv("SUPABASE_KEY")
            self.client: Client = create_client(self.url, self.key)
            print("Supabase client initialized successfully.")
        except Exception as e:
            print(f"Error initializing Supabase client: {e}")
            self.client = None
    def insert_data(self, table_name, data):
        if not self.client:
            print("Supabase client not initialized.")
            return None
        try:
            response = self.client.table(table_name).insert(data).execute()
            return response
        except Exception as e:
            print(f"Error inserting data into Supabase: {e}")
            return None
    
    

SBConnector()