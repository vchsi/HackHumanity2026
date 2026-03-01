from backend_logic import *
import json

ex = json.loads("""
{
  "title": "Urban Residential Lease Contract / 1010 Riverfront Blvd, Apt 14D, Chicago / Daniel Kim",
  "basic_info": {
    "address": "1010 Riverfront Blvd, Apt 14D, Chicago, IL 60605"
  },
  "overview": {
    "risk_score": 71,
    "overview_contents": "This 12-month urban residential lease provides a generally balanced risk profile with several tenant-friendly protections, though it includes a few moderate financial considerations. The monthly rent is aligned with comparable downtown units, and the security deposit is limited to one month’s rent, keeping upfront costs manageable. The fixed-term structure ensures rental price stability for the duration of the agreement, protecting the tenant from mid-term increases.Utilities such as water and internet are included, reducing variable monthly expenses and simplifying budgeting. The lease also contains a clearly defined maintenance response timeframe, which enhances accountability and tenant protection.However, the agreement includes a mandatory professional cleaning fee deducted from the security deposit upon move-out, which may reduce refund amounts regardless of property condition. There is also a subletting restriction requiring landlord approval, potentially limiting flexibility. While late fees are capped, they apply immediately after a short grace period. Overall, the lease offers good cost predictability and reasonable protections, but tenants should be comfortable with moderate flexibility limitations and defined move-out costs.",
    "rent_monthly": 2100.00,
    "down_payment": 2100.00,
    "duration": 365,
    "notice_period": 60
  },
  "results": [
    {
      "risk_flag": "g",
      "risk_score": "L",
      "risk_title": "Included Utilities",
      "risk_contents": "Water and internet included in rent. Reduces monthly variability and improves budgeting predictability.",
      "risk_origin": "Landlord shall provide water service and standard internet access at no additional charge to Tenant."
    },
    {
      "risk_flag": "b",
      "risk_score": "M",
      "risk_title": "Mandatory Cleaning Fee",
      "risk_contents": "Non-negotiable professional cleaning fee deducted from deposit, reducing potential refund regardless of unit condition.",
      "risk_origin": "A mandatory $250 professional cleaning fee shall be deducted from the security deposit upon Tenant’s move-out."
    },
    {
      "risk_flag": "m",
      "risk_score": "M",
      "risk_title": "Subletting Restrictions",
      "risk_contents": "Requires written landlord approval for subleasing. Limits tenant flexibility in relocation scenarios.",
      "risk_origin": "Tenant may not sublease the Premises without prior written consent from Landlord."
    },
    {
      "risk_flag": "m",
      "risk_score": "L",
      "risk_title": "Late Fee After Short Grace Period",
      "risk_contents": "Late fee applied after 3-day grace period. Moderate financial impact if payment timing issues arise.",
      "risk_origin": "If rent is not received within three (3) days of the due date, a late fee of 4% of monthly rent shall apply."
    }
  ],
  "annotations": [
    {
      "annotation_text": "Landlord shall provide water service and standard internet access at no additional charge to Tenant.",
      "annotation_level": "g",
      "annotation_desc": "Included utilities reduce monthly cost uncertainty and enhance overall lease value."
    },
    {
      "annotation_text": "A mandatory $250 professional cleaning fee shall be deducted from the security deposit upon Tenant’s move-out.",
      "annotation_level": "b",
      "annotation_desc": "Automatic deduction reduces deposit refund regardless of property condition."
    },
    {
      "annotation_text": "Tenant may not sublease the Premises without prior written consent from Landlord.",
      "annotation_level": "m",
      "annotation_desc": "Limits flexibility; approval requirement may complicate relocation or temporary absence."
    },
    {
      "annotation_text": "If rent is not received within three (3) days of the due date, a late fee of 4% of monthly rent shall apply.",
      "annotation_level": "m",
      "annotation_desc": "Short grace period increases risk of incurring penalties from minor delays."
    }
  ]
}""")

#print(ex)
new_lease_data = {
    "owner_id": "41416767",
    "pathname": "lease.pdf",
    "raw_text": "Full raw text of the lease agreement goes here..."
}
print(query_response(json.dumps(ex), lease_id=None, new_lease=True, new_lease_data=new_lease_data))