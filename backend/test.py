from backend_logic import *
import json

ex = json.loads("""
{
  "title": "downtown_residential_lease_2026.pdf",
  "text_incomplete": false,
  "basic_info": {
    "address": {
      "value": "789 Market Street, Apt 12C, San Francisco, CA 94103",
      "evidence_quote": "The Landlord hereby leases to Tenant the premises located at 789 Market Street, Apt 12C, San Francisco, CA 94103.",
      "missing_reason": null
    }
  },
  "overview": {
    "risk_score": 68,
    "overview_contents": "This 12-month fixed-term lease offers predictable housing costs and includes certain tenant-friendly provisions such as included water and trash services. The security deposit is limited to one month’s rent, reducing upfront burden. However, the lease contains a strict early termination clause requiring payment of two months’ rent as liquidated damages, and imposes late fees after a short grace period. Overall, the lease presents moderate financial risk with limited flexibility for early relocation.",
    "rent_monthly": {
      "value": 3200,
      "evidence_quote": "Monthly Rent: $3,200.00 due on the 1st day of each month.",
      "missing_reason": null,
      "ambiguous": false
    },
    "security_deposit": {
      "value": 3200,
      "evidence_quote": "Tenant shall pay a security deposit of $3,200.00 prior to move-in.",
      "missing_reason": null,
      "ambiguous": false
    },
    "lease_term_days": {
      "value": 365,
      "evidence_quote": "Lease Term: July 1, 2026 through June 30, 2027.",
      "missing_reason": null,
      "ambiguous": false
    },
    "notice_period": {
      "value": "30 days written notice required for non-renewal after fixed term.",
      "evidence_quote": "After expiration of the initial term, tenancy shall convert to month-to-month unless either party provides thirty (30) days written notice.",
      "missing_reason": null
    },
    "late_fees": {
      "value": "5% of monthly rent after 3-day grace period.",
      "evidence_quote": "If rent is not received within three (3) days of the due date, Tenant shall pay a late charge equal to five percent (5%) of the monthly rent.",
      "missing_reason": null
    },
    "early_termination": {
      "value": "Two months' rent required as liquidated damages for early termination.",
      "evidence_quote": "In the event Tenant terminates this Agreement prior to expiration of the Lease Term, Tenant shall pay liquidated damages equal to two (2) months' rent.",
      "missing_reason": null
    },
    "utilities": {
      "value": "Tenant responsible for electricity and gas; Landlord covers water and trash.",
      "evidence_quote": "Tenant shall be responsible for electricity and gas service. Landlord shall provide water and trash service.",
      "missing_reason": null
    }
  },
  "results": [
    {
      "annotationText": "Monthly Rent: $3,200.00 due on the 1st day of each month.",
      "annotationLevel": "mix",
      "annotationDesc": "Clear rent amount and due date provide predictability, but payment timing is strict and may incur penalties if delayed.",
      "risk_title": "Rent Obligation",
      "severity": "MEDIUM",
      "evidence_location_hint": "Section 3 – Rent"
    },
    {
      "annotationText": "Tenant shall pay a security deposit of $3,200.00 prior to move-in.",
      "annotationLevel": "good",
      "annotationDesc": "Deposit equals one month’s rent, which is standard and financially reasonable for this market.",
      "risk_title": "Security Deposit Amount",
      "severity": "LOW",
      "evidence_location_hint": "Section 4 – Security Deposit"
    },
    {
      "annotationText": "In the event Tenant terminates this Agreement prior to expiration of the Lease Term, Tenant shall pay liquidated damages equal to two (2) months' rent.",
      "annotationLevel": "bad",
      "annotationDesc": "Early termination penalty is substantial and may create financial hardship if relocation becomes necessary.",
      "risk_title": "Early Termination Penalty",
      "severity": "HIGH",
      "evidence_location_hint": "Section 12 – Early Termination"
    },
    {
      "annotationText": "If rent is not received within three (3) days of the due date, Tenant shall pay a late charge equal to five percent (5%) of the monthly rent.",
      "annotationLevel": "mix",
      "annotationDesc": "Short grace period combined with percentage-based late fee increases financial risk from minor delays.",
      "risk_title": "Late Fee Policy",
      "severity": "MEDIUM",
      "evidence_location_hint": "Section 3 – Rent"
    },
    {
      "annotationText": "Tenant shall be responsible for electricity and gas service. Landlord shall provide water and trash service.",
      "annotationLevel": "good",
      "annotationDesc": "Clearly defined utility allocation reduces ambiguity and budgeting uncertainty.",
      "risk_title": "Utility Allocation",
      "severity": "LOW",
      "evidence_location_hint": "Section 6 – Utilities"
    }
  ]
}""")

#print(ex)
new_lease_data = {
    "owner_id": "vchsiao36@gmail.com",
    "pathname": "lease.pdf",
    "raw_text": "Full raw text of the lease agreement goes here..."
}
#print(query_response(json.dumps(ex), lease_id=None, new_lease=True, new_lease_data=new_lease_data))
#print(check_lease(46))
#print(pull_report_data(46))
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
#print(get_translated_report_data(18, "es"))
