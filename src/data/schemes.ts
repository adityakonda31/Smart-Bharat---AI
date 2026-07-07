export interface Scheme {
  id: string;
  name: string;
  description: string;
  benefits: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    maxIncome?: number;
    occupations?: string[];
    genders?: string[];
    states?: string[];
    isStudent?: boolean;
    isFarmer?: boolean;
    isBusiness?: boolean;
    isSeniorCitizen?: boolean;
    isDisabled?: boolean;
    categories?: string[];
  };
  docsRequired: string[];
  officialLink: string;
  category: string;
}

export const schemesData: Scheme[] = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description: "An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments to all small and marginal landholding farmer families.",
    benefits: "Direct income support of ₹6,000 per year paid in three equal installments of ₹2,000 directly into the bank accounts of farmers.",
    eligibility: {
      isFarmer: true,
      maxIncome: 300000,
      minAge: 18
    },
    docsRequired: ["Aadhaar Card", "Land Ownership Documents (Khatauni)", "Bank Account Details", "Mobile Number linked with Aadhaar"],
    officialLink: "https://pmkisan.gov.in/",
    category: "Agriculture & Farmers Welfare"
  },
  {
    id: "pmay-g",
    name: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    description: "A social welfare program to provide pucca houses with basic amenities to all houseless householders and those households living in dilapidated houses in rural areas.",
    benefits: "Financial assistance of ₹1.2 Lakh in plains and ₹1.3 Lakh in hilly/difficult areas for constructing a quality permanent house.",
    eligibility: {
      maxIncome: 180000,
      minAge: 18,
      states: ["All States"]
    },
    docsRequired: ["Aadhaar Card", "Job Card Number (MGNREGA)", "Bank Passbook", "Swachh Bharat Mission Number", "Income Certificate"],
    officialLink: "https://pmayg.nic.in/",
    category: "Housing & Urban Affairs"
  },
  {
    id: "pm-jay",
    name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    description: "The largest health assurance scheme in the world, aiming to provide free health cover of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization.",
    benefits: "Cashless and paperless access to healthcare services up to ₹5,00,000 per family per year at all paneled private and public hospitals.",
    eligibility: {
      maxIncome: 250000,
      categories: ["SC", "ST", "OBC", "General"]
    },
    docsRequired: ["Aadhaar Card/Ration Card", "Identity Proof", "Family Member Verification List Document"],
    officialLink: "https://dashboard.pmjay.gov.in/",
    category: "Health & Family Welfare"
  },
  {
    id: "mudra",
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    description: "A scheme to provide loans up to ₹10 Lakh to non-corporate, non-farm small/micro enterprises. Divided into Shishu (up to ₹50k), Kishor (₹50k-₹5L), and Tarun (₹5L-₹10L).",
    benefits: "Collateral-free business loans up to ₹10 Lakh for starting or expanding micro-enterprises, with low interest rates and flexible tenures.",
    eligibility: {
      isBusiness: true,
      minAge: 18,
      maxAge: 65
    },
    docsRequired: ["Aadhaar/PAN Card", "Business Registration Proof", "Project Report/Business Plan", "Last 6 Months Bank Statement"],
    officialLink: "https://www.mudra.org.in/",
    category: "Finance & Banking"
  },
  {
    id: "pm-scholarship",
    name: "Central Sector Scheme of Scholarship for College and University Students",
    description: "Provides financial assistance to meritorious students from low-income families to meet a part of their day-to-day expenses while pursuing higher studies.",
    benefits: "Scholarship of ₹12,000 per annum for graduation (first 3 years) and ₹20,000 per annum for post-graduation.",
    eligibility: {
      isStudent: true,
      maxIncome: 450000,
      minAge: 17,
      maxAge: 25
    },
    docsRequired: ["Class XII Marksheet", "Income Certificate", "Aadhaar Card", "College Fee Receipt & Bonafide Certificate"],
    officialLink: "https://scholarships.gov.in/",
    category: "Education & Youth"
  },
  {
    id: "apy",
    name: "Atal Pension Yojana (APY)",
    description: "A pension scheme focused on the unorganized sector workers, offering a guaranteed minimum pension of ₹1,000 to ₹5,000 per month after the age of 60.",
    benefits: "Guaranteed monthly pension after age 60, ranging from ₹1,000 to ₹5,000 depending on the contribution made.",
    eligibility: {
      minAge: 18,
      maxAge: 40
    },
    docsRequired: ["Aadhaar Card", "Savings Bank Account", "Mobile Number"],
    officialLink: "https://www.npscra.nsdl.co.in/",
    category: "Social Security & Pension"
  },
  {
    id: "standup-india",
    name: "Stand-Up India Scheme",
    description: "Promotes entrepreneurship among women and SC/ST communities by facilitating bank loans between ₹10 Lakh and ₹1 Crore to start greenfield enterprises.",
    benefits: "Bank loans from ₹10 Lakh up to ₹1 Crore covering 75% of the project cost, with handholding support and a credit guarantee scheme.",
    eligibility: {
      isBusiness: true,
      genders: ["Female"],
      categories: ["SC", "ST", "General"],
      minAge: 18
    },
    docsRequired: ["Aadhaar/PAN Card", "Category Certificate (SC/ST)", "Business Entity Proof", "Pollution Control Clearance (if applicable)"],
    officialLink: "https://www.standupmitra.in/",
    category: "Finance & Banking"
  },
  {
    id: "pm-svanidhi",
    name: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    description: "A special micro-credit facility scheme for providing affordable working capital loans to street vendors to resume their livelihoods post-pandemic.",
    benefits: "First loan up to ₹10,000, interest subsidy @ 7% per annum on timely repayment, cashback up to ₹1,200 per year on digital transactions.",
    eligibility: {
      minAge: 18,
      occupations: ["Street Vendor", "Hawker", "Service Provider"]
    },
    docsRequired: ["Aadhaar Card/Voter ID", "Certificate of Vending (CoV)", "Letter of Recommendation from Local Body"],
    officialLink: "https://pmsvanidhi.mohua.gov.in/",
    category: "Housing & Urban Affairs"
  },
  {
    id: "pmyuy",
    name: "Pradhan Mantri Yuva Udyamita Vikas Abhiyan",
    description: "Supports young entrepreneurs in setting up businesses through training, mentorship, and easier access to credit.",
    benefits: "Entrepreneurship education, training courses, startup mentoring, and guidance to formal credit channels.",
    eligibility: {
      isStudent: true,
      minAge: 18,
      maxAge: 35
    },
    docsRequired: ["Educational Certificates", "Aadhaar Card", "Business Pitch Document"],
    officialLink: "https://www.msde.gov.in/",
    category: "Education & Youth"
  },
  {
    id: "pm-vibhag-divyang",
    name: "Deendayal Disabled Rehabilitation Scheme (DDRS)",
    description: "To create an enabling environment that ensures equal opportunities, equity, social justice, and empowerment of persons with disabilities.",
    benefits: "Financial grants for rehabilitation programs, vocational training, purchasing assistive devices, and educational support.",
    eligibility: {
      isDisabled: true,
      minAge: 5
    },
    docsRequired: ["Disability Certificate (UDID)", "Aadhaar Card", "Income Certificate", "Residential Certificate"],
    officialLink: "https://disabilityaffairs.gov.in/",
    category: "Social Security & Pension"
  }
];
