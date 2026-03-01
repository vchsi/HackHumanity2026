import type { Highlight, DocumentSegment } from '../types';

export const mockResult = {
    summary: [
        "12-month residential lease for an apartment at 1234 Oak Street, Unit 4B.",
        "Total monthly rent is $2,150, with a security deposit of $4,300 (2 months' rent).",
        "Section 14.2 contains a high-penalty early termination clause (3 months).",
        "Section 22.1 includes an automatic 12-month renewal unless 90-day notice is given.",
    ],
    highlights: [
        {
            id: "risk-1",
            startIndex: 350,
            endIndex: 520,
            level: "red" as const,
            category: "Termination",
            title: "Early Termination Penalty",
            explanation: "This clause requires you to pay 3 months' rent if you leave early. Standard fees are usually 1-2 months. This could be very expensive if your plans change.",
            quote: "In the event of early termination by the Tenant prior to the expiration of the Initial Term, Tenant shall be liable for a lump-sum payment equal to three (3) months' rent.",
            pageNumber: 4,
            suggestedQuestions: [
                "Can we reduce the penalty to 1 month's rent?",
                "Is there an option for a replacement tenant to take over the lease instead?"
            ]
        },
        {
            id: "safe-1",
            startIndex: 120,
            endIndex: 280,
            level: "green" as const,
            category: "Maintenance",
            title: "Standard Repair Duty",
            explanation: "The landlord is responsible for major structural repairs and appliance maintenance not caused by tenant negligence. This is a fair and standard clause.",
            quote: "Landlord shall maintain the structural components of the Premises, including roofing, plumbing, and major appliances, in good working order during the lease duration.",
            pageNumber: 2,
            suggestedQuestions: [
                "What is the typical response time for non-emergency maintenance requests?"
            ]
        },
        {
            id: "risk-2",
            startIndex: 700,
            endIndex: 850,
            level: "red" as const,
            category: "Renewal",
            title: "Automatic 12-Month Renewal",
            explanation: "The lease automatically renews for another full year unless you give notice 90 days in advance. Many people miss this deadline and get locked in.",
            quote: "This Agreement shall automatically renew for a successive term of twelve (12) months unless either party provides written notice of non-renewal ninety (90) days prior.",
            pageNumber: 7,
            suggestedQuestions: [
                "Can we change this to a month-to-month renewal after the first year?",
                "Can we shorten the notice period to 60 days?"
            ]
        }
    ]
};

export const mockDocumentSegments: DocumentSegment[] = [
    { text: "RESIDENTIAL LEASE AGREEMENT\n\nThis Agreement is made between Oakwood Properties and the Tenant. " },
    { text: "The Landlord shall maintain the structural components of the Premises, including roofing, plumbing, and major appliances, in good working order during the lease duration, provided such repairs are not necessitated by Tenant's negligence or misuse of property. ", highlightId: "safe-1" },
    { text: "Monthly rent is due on the 1st of each month. A late fee of $75 applies after the 3rd day. " },
    { text: "In the event of early termination by the Tenant prior to the expiration of the Initial Term, Tenant shall be liable for a lump-sum payment equal to three (3) months' rent as a termination penalty, payable within ten days of vacating the premises. ", highlightId: "risk-1" },
    { text: "The security deposit shall be held in escrow. " },
    { text: "This Agreement shall automatically renew for a successive term of twelve (12) months unless either party provides written notice of non-renewal ninety (90) days prior to the expiration of the current term or any renewal term thereof. ", highlightId: "risk-2" },
    { text: "The following rules apply to guests and pets... End of Document." }
];
