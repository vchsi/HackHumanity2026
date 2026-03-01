from backend_logic import *
import json

ex = json.loads("""
{
  "title": "Downtown Residential Lease Agreement / 350 Market Street, Unit 22B, Seattle / Olivia Chen",
  "user_id": "",
  "basic_info": {
    "address": "350 Market Street, Unit 22B, Seattle, WA 98101"
  },
  "overview": {
    "risk_score": 74,
    "overview_contents": "This 12-month residential lease offers a generally favorable structure with balanced risk allocation and predictable housing costs. The monthly rent is competitive for the downtown area, and the security deposit is limited to one month of rent, which keeps upfront expenses manageable. The fixed lease term protects the tenant from rent increases during the contract period, providing stability and clearer financial planning. Water and trash services are included, reducing monthly cost variability and simplifying budgeting. The agreement also outlines a defined maintenance response timeframe, improving landlord accountability. However, there are moderate concerns. The lease includes a one-month early termination fee, which creates some financial exposure if relocation becomes necessary. There is also a clause requiring landlord approval for any subleasing, which may reduce flexibility. Additionally, a move-out administrative fee is deducted from the security deposit regardless of unit condition. Overall, this lease is well structured for tenants planning to stay the full term, but renters seeking maximum flexibility should carefully review termination and subletting conditions.",
    "rent_monthly": 2400.00,
    "down_payment": 2400.00,
    "duration": 365,
    "notice_period": 45
  },
  "results": [
    {
      "risk_flag": "g",
      "risk_score": "L",
      "risk_title": "Included Water and Trash Services",
      "risk_contents": "Utilities included in rent reduce monthly variability and support predictable budgeting.",
      "risk_origin": "Landlord shall provide water and trash collection services at no additional cost to Tenant."
    },
    {
      "risk_flag": "m",
      "risk_score": "M",
      "risk_title": "Early Termination Fee",
      "risk_contents": "Requires payment of one month rent to terminate early, limiting flexibility and increasing relocation costs.",
      "risk_origin": "Tenant may terminate this Lease early upon payment of a fee equal to one month rent with forty five days written notice."
    },
    {
      "risk_flag": "b",
      "risk_score": "M",
      "risk_title": "Mandatory Move Out Administrative Fee",
      "risk_contents": "Non refundable administrative fee deducted from deposit regardless of property condition.",
      "risk_origin": "A non refundable move out administrative fee of 300 dollars shall be deducted from the security deposit."
    },
    {
      "risk_flag": "m",
      "risk_score": "L",
      "risk_title": "Subletting Approval Requirement",
      "risk_contents": "Requires written landlord approval before subleasing, reducing tenant flexibility.",
      "risk_origin": "Tenant shall not sublease the Premises without prior written consent from Landlord."
    }
  ],
  "annotations": [
    {
      "annotation_text": "Landlord shall provide water and trash collection services at no additional cost to Tenant.",
      "annotation_level": "g",
      "annotation_desc": "Included utilities lower financial uncertainty and improve overall lease value."
    },
    {
      "annotation_text": "Tenant may terminate this Lease early upon payment of a fee equal to one month rent with forty five days written notice.",
      "annotation_level": "m",
      "annotation_desc": "Moderate financial penalty reduces flexibility in case of unexpected relocation."
    },
    {
      "annotation_text": "A non refundable move out administrative fee of 300 dollars shall be deducted from the security deposit.",
      "annotation_level": "b",
      "annotation_desc": "Automatic deduction reduces deposit return regardless of unit condition."
    },
    {
      "annotation_text": "Tenant shall not sublease the Premises without prior written consent from Landlord.",
      "annotation_level": "m",
      "annotation_desc": "Limits tenant flexibility and may complicate temporary relocation."
    }
  ],
  "questions": [
    {
      "question_priority": "h",
      "question_title": "Can the early termination fee be reduced or waived if a replacement tenant is found?",
      "question_explaination": "Understanding whether the landlord allows mitigation through replacement tenants could significantly reduce financial risk if relocation becomes necessary."
    },
    {
      "question_priority": "m",
      "question_title": "Is the move out administrative fee negotiable or condition based?",
      "question_explaination": "Clarifying whether the fee applies regardless of unit condition helps determine expected deposit recovery."
    },
    {
      "question_priority": "m",
      "question_title": "What criteria are used to approve a sublease request?",
      "question_explaination": "Knowing the approval standards reduces uncertainty and helps assess practical flexibility under the lease."
    }
  ]
}""")

#print(ex)
new_lease_data = {
    "owner_id": "41416767",
    "pathname": "lease.pdf",
    "raw_text": "Full raw text of the lease agreement goes here..."
}
#print(query_response(json.dumps(ex), lease_id=None, new_lease=True, new_lease_data=new_lease_data))
#print(check_lease(18))
#print(pull_report_data(18))
"""print(add_translations(18, [("r", 17, "Servicios de agua y basura incluidos|Los servicios incluidos en la renta reducen la variabilidad mensual y facilitan una presupuestación predecible|El arrendador proporcionará servicios de agua y recolección de basura sin costo adicional para el inquilino"),
    ("r", 18, "Cargo por terminación anticipada|Requiere el pago de un mes de renta para finalizar antes de tiempo, lo que limita la flexibilidad y aumenta los costos de reubicación|El inquilino podrá terminar este contrato anticipadamente mediante el pago de una suma equivalente a un mes de renta con un aviso por escrito de cuarenta y cinco días"),
    ("r", 19, "Cargo administrativo obligatorio por mudanza|Cuota administrativa no reembolsable deducida del depósito independientemente del estado de la propiedad|Se deducirá del depósito de seguridad una cuota administrativa no reembolsable de 300 dólares por concepto de mudanza"),
    ("r", 20, "Requisito de aprobación para subarrendar|Requiere aprobación previa por escrito del arrendador antes de subarrendar, lo que reduce la flexibilidad del inquilino|El inquilino no podrá subarrendar la propiedad sin el consentimiento previo y por escrito del arrendador"),
    ("o", 13, "Este contrato de arrendamiento residencial de 12 meses ofrece una estructura generalmente favorable con una distribución equilibrada de riesgos y costos de vivienda predecibles|La renta mensual es competitiva para el área céntrica y el depósito de seguridad se limita a un mes de renta, lo que mantiene manejables los gastos iniciales|El plazo fijo protege al inquilino de aumentos de renta durante la vigencia del contrato, proporcionando estabilidad y una planificación financiera más clara|Los servicios de agua y basura están incluidos, lo que reduce la variabilidad mensual y simplifica el presupuesto|El acuerdo también establece un plazo definido para la respuesta a solicitudes de mantenimiento, lo que mejora la responsabilidad del arrendador|Sin embargo, existen preocupaciones moderadas|El contrato incluye un cargo equivalente a un mes de renta por terminación anticipada, lo que genera cierta exposición financiera si es necesaria una reubicación|También requiere la aprobación del arrendador para cualquier subarrendamiento, lo que puede reducir la flexibilidad|Además, se deduce una cuota administrativa por mudanza del depósito de seguridad independientemente del estado de la unidad|En general, este contrato está bien estructurado para inquilinos que planean permanecer durante todo el plazo, pero quienes busquen máxima flexibilidad deben revisar cuidadosamente las condiciones de terminación y subarrendamiento"),
    ("a", 17, "El arrendador proporcionará servicios de agua y recolección de basura sin costo adicional para el inquilino|Los servicios incluidos reducen la incertidumbre financiera y mejoran el valor general del contrato"),
    ("a", 18, "El inquilino podrá terminar este contrato anticipadamente mediante el pago de una suma equivalente a un mes de renta con un aviso por escrito de cuarenta y cinco días|La penalización financiera moderada reduce la flexibilidad en caso de reubicación inesperada"),
    ("a", 19, "Se deducirá del depósito de seguridad una cuota administrativa no reembolsable de 300 dólares por concepto de mudanza|La deducción automática reduce el monto reembolsable del depósito independientemente del estado de la propiedad"),
    ("a", 20, "El inquilino no podrá subarrendar la propiedad sin el consentimiento previo y por escrito del arrendador|Limita la flexibilidad del inquilino y puede complicar una reubicación temporal"),
    ("q", 4, "¿Puede reducirse o eliminarse el cargo por terminación anticipada si se encuentra un inquilino de reemplazo?|Comprender si el arrendador permite mitigar el costo mediante un reemplazo puede reducir significativamente el riesgo financiero en caso de reubicación"),
    ("q", 5, "¿La cuota administrativa por mudanza es negociable o depende del estado de la unidad?|Aclarar si la cuota se aplica independientemente de las condiciones ayuda a estimar cuánto del depósito será recuperado"),
    ("q", 6, "¿Qué criterios se utilizan para aprobar una solicitud de subarrendamiento?|Conocer los estándares de aprobación reduce la incertidumbre y permite evaluar la flexibilidad real del contrato")], "es"))"""
print(get_translated_report_data(18, "es"))
