# backend_logic.py: incorporates a lot of the logic for the backend, including file handling, PDF parsing, and interactions with the SBConnector.
#from pdf_handler import PDFHandler
from sb_connector import SBConnector
import random
import json

sb_connector = SBConnector()

def get_owner_id(uname):
    result = sb_connector.pull_column("users", columns="id", criteria={"username": uname})
    if result and result.get("status") == "success" and result.get("data"):
        return result["data"][0]["id"]
    return None
"""
def process_pdf(file_path, username):
    # Step 1: Extract text from PDF
    pdf_handler = PDFHandler(file_path)
    extracted_text = pdf_handler.extract_text()
    
    # Step 2: Store extracted text in Supabase
    owner_id = get_owner_id(username)  # Example user name
    data = {
        "owner_id": owner_id,
        "pathname": f"{file_path}.pdf",
        "raw_text": extracted_text,
    }
    response = sb_connector.insert_data("pdf_data", data)
    
    return response

# will tie in with amd
"""

def pull_lease_data(lease_id, tables=["lease_data"]):
    # for multiple tables, join on lease_id and return combined data
    # for now, just pull from one table
    result = sb_connector.pull_data("lease_data", query={"lease_id": lease_id})
    if result and result.get("status") == "success" and result.get("data"):
        return result["data"][0]
    return None

def query_lease_data(lease_id, query):
    # pull lease data and apply query (e.g., filter for specific clauses)
    lease_data = pull_lease_data(lease_id)
    if not lease_data:
        return None
    
    # Example query processing (this is a placeholder - actual implementation would depend on query structure)
    if query == "rent_amount":
        return lease_data.get("rent_amount")
    elif query == "lease_term":
        return lease_data.get("lease_term")
    else:
        return None

def query_response(response, lease_id=None, new_lease=False, new_lease_data=None):
    # response returns as a json string    
    # json string -> sql_like query
    """
    input data:
    {
        "title": "TITLE OF LEASE / ADDRESS",
        "user": "NAME OF USER",
        "raw_text": "RAW TEXT GIVEN (long form text)"
    }

    output data:
    {
        "title": "TITLE OF LEASE / ADDRESS / USER",
        "user_id": "[do not fill this in, provided in response]",
        "basic_info": {
            "address": "ADDRESS OF PROPERTY"
        },
        "overview": {
            "risk_score": "RISK SCORE BASED ON FACTORS DETERMINED (0-100, INTEGER, HIGHER SCORES=BETTER)",
            "overview_contents": "A 2-minute LONG OVERVIEW OF THE PROS AND CONS OF THE SPECIFIC LEASE, AND HOW THIS MAY AFFECT THE RENTER",
            "rent_monthly": "MONTHLY RENT FROM LEASE (decimal)",
            "down_payment": "SECURITY DEPOSIT (decimal)",
            "duration": "DURATION OF LEASE (IN DAYS, INTEGER)",
            "notice_period": "PERIOD OF WITHDRAWAL NOTICE (IN DAYS, INTEGER)"
        },
        "results": [
            {
                "risk_flag": "RISK LEVEL OF ANNOTATION (enum: either b|m|g, representing red/yellow/green or bad/mixed/good)",
                "risk_score": "RISK SCORE OF ANNOTATION (enum: either H(high), M(medium), or L(low) depending on impact)",
                "risk_title": "TITLE OF CLAUSE/POLICY WHICH CAUSES ANNOTATION",
                "risk_contents": "SHORT, <50 WORD DESCRIPTION JUSTIFYING RISK AND LISTING POTENTIAL IMPACTS",
                "risk_origin": "SPECIFIC TEXT FROM LEASE WHICH CAUSES RISK"
            }
        ],
        "annotations": [
            {"annotation_text": "EXACT TEXT FROM THE LEASE AGREEMENT",
            "annotation_level": "b(bad)|m(medium)|g(good) - RISK LEVEL OF THE ANNOTATION",
            "annotation_desc": "CONCISE DESCRIPTION OF THE ANNOTATION, JUSTIFICATION OF LEVEL+IMPACT"}
        ]
    }
    """
    response = json.loads(response)
    # part 1: lease information (ai_overviews)
    part1response = response["overview"]
    if(not lease_id or new_lease):
        data = {
            "owner_id": new_lease_data["owner_id"],
            "pathname": new_lease_data["pathname"],
            "raw_text": new_lease_data["raw_text"]
        }
        operation_result = sb_connector.insert_data("leases", data)
        if operation_result["status"] == "error":
            raise Exception(f"Error inserting new lease info: {operation_result['message']}")
        pull_result = sb_connector.pull_column("leases", columns="id", criteria={"pathname": new_lease_data["pathname"]})
        if pull_result["status"] == "error":
            raise Exception(f"Error retrieving lease_id: {pull_result['message']}")
        lease_id = pull_result["data"][0]["id"]

    leaseInfo = {
        "lease_id": lease_id,
        "overview_content": part1response["overview_contents"],
        "risk_val": part1response["risk_score"],
        "cost_mo": float(part1response["rent_monthly"]),
        "cost_dep": float(part1response["down_payment"]),
        "duration": int(part1response["duration"]),
        "period": int(part1response["notice_period"])
    }
    operation_result = sb_connector.insert_data("ai_overviews", leaseInfo)
    if operation_result["status"] == "error":
        raise Exception(f"Error inserting lease info: {operation_result['message']}")

    pull_result = sb_connector.pull_column("ai_overviews", columns="ov_id", criteria={"lease_id": lease_id})
    if pull_result["status"] == "error":
        raise Exception(f"Error retrieving overview_id: {pull_result['message']}")
    if not pull_result.get("data"):
        raise Exception("No overview found with the given lease_id")
    overview_id = pull_result["data"][0]["ov_id"]
    # part 2: clause results (ai_annotations)
    # will loop through each annotation and insert into ai_annotations, with foreign key to leases
    for result in response["results"]:
        result["lease_id"] = lease_id
        result["ov_id"] = overview_id
        operation_result = sb_connector.insert_data("overview_results", result)
        if operation_result["status"] == "error":
            raise Exception(f"Error inserting overview result: {operation_result['message']}")
    

    # part 3: annotations (translated will come later, for now just store as is)
    for annotation in response["annotations"]:
        annotation["lease_id"] = lease_id
        operation_result = sb_connector.insert_data("annotations", annotation)
        if operation_result["status"] == "error":
            raise Exception(f"Error inserting annotation: {operation_result['message']}")
    
    # assuming everything works
    return {"status": "success", "lease_id": lease_id}


    



