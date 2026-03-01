from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pathlib import Path



class SBConnector:
    def __init__(self):
        project_env = Path(__file__).resolve().parent.parent / ".env"
        load_dotenv(dotenv_path=project_env, override=True)
        try:
            self.url = (os.getenv("SUPABASE_URL") or "").strip().strip('"').strip("'").rstrip("/")
            self.key = os.getenv("SUPABASE_KEY")
            #print(self.url, self.key)
            self.client: Client = create_client(self.url, self.key)
            print("Supabase client initialized successfully.")
        except Exception as e:
            print(f"Error initializing Supabase client: {e}")
            self.client = None
    def insert_data(self, table_name, data):
        if not self.client:
            print("Supabase client not initialized.")
            return {"status": "error", "message": "Supabase client not initialized."}
        try:
            response = self.client.table(table_name).insert(data).execute()
            return {"status": "success", "data": response.data}
        except Exception as e:
            print(f"Error inserting data into Supabase: {e}")
            return {"status": "error", "message": str(e)}
            
    def pull_column(self, table_name, columns="*", criteria=""):
        """
        pull_column: Pull specific columns from a Supabase table with optional filtering criteria.
        - table_name: Name of the Supabase table to query.
        - columns: Columns to retrieve (default is "*", which retrieves all columns).
        - criteria: Optional filtering criteria (e.g., {"owner_id": "12345"}
        """
        if not self.client:
            print("Supabase client not initialized.")
            return {"status": "error", "message": "Supabase client not initialized."}
        try:
            if criteria:
                response = self.client.table(table_name).select(columns).match(criteria).execute()
            else:
                response = self.client.table(table_name).select(columns).execute()
            return {"status": "success", "data": response.data}
        except Exception as e:
            print(f"Error pulling data from Supabase: {e}")
            return {"status": "error", "message": str(e)}
        
    def pull_data(self, table_name, query=None):
        if not self.client:
            print("Supabase client not initialized.")
            return {"status": "error", "message": "Supabase client not initialized."}
        try:
            if query:
                response = self.client.table(table_name).select("*").match(query).execute()
            else:
                response = self.client.table(table_name).select("*").execute()
            return {"status": "success", "data": response.data}
        except Exception as e:
            print(f"Error pulling data from Supabase: {e}")
            return {"status": "error", "message": str(e)}
    
    def update_data(self, table_name, query, new_data):
        if not self.client:
            print("Supabase client not initialized.")
            return {"status": "error", "message": "Supabase client not initialized."}
        try:
            response = self.client.table(table_name).update(new_data).match(query).execute()
            return {"status": "success", "data": response.data}
        except Exception as e:
            print(f"Error updating data in Supabase: {e}")
            return {"status": "error", "message": str(e)}
    
    # check if value exists
    def value_exists(self, table_name, column_name, value):
        if not self.client:
            print("Supabase client not initialized.")
            return {"status": "error", "message": "Supabase client not initialized."}
        try:
            response = self.client.table(table_name).select(column_name).eq(column_name, value).execute()
            exists = len(response.data) > 0
            return {"status": "success", "exists": exists}
        except Exception as e:
            print(f"Error checking value existence in Supabase: {e}")
            return {"status": "error", "message": str(e)}