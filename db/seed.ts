/**
 * ============================================================
 * LEVAV TALENT AFRIKA — SEED DATA
 * ============================================================
 * Populates the database with initial Zambia-focused data:
 *   - Curated profession categories relevant to the Zambian market
 *   - Placeholder for additional seed data as development progresses
 *
 * Run: npx tsx db/seed.ts
 * ============================================================
 */

import { getDb } from "../api/queries/connection";
import { professions } from "./schema";

const db = getDb();

/**
 * Profession seed data — curated for the Zambian and broader African market.
 * Organized by industry/category with professions that represent
 * actual workforce demand across the continent.
 */
const PROFESSION_SEED_DATA = [
  // TECHNOLOGY
  { name: "Software Developer", category: "technology", description: "Designs, codes, tests, and maintains software applications and systems." },
  { name: "Data Analyst", category: "technology", description: "Collects, processes, and performs statistical analyses on large datasets." },
  { name: "Cybersecurity Specialist", category: "technology", description: "Protects systems, networks, and data from digital attacks and unauthorized access." },
  { name: "Network Administrator", category: "technology", description: "Manages and maintains computer networks and communication systems." },
  { name: "UI/UX Designer", category: "technology", description: "Designs user interfaces and experiences for digital products and applications." },
  { name: "Cloud Engineer", category: "technology", description: "Designs, implements, and manages cloud-based infrastructure and services." },
  { name: "IT Support Technician", category: "technology", description: "Provides technical support and troubleshooting for hardware and software systems." },
  { name: "Mobile App Developer", category: "technology", description: "Creates applications for mobile devices on iOS and Android platforms." },
  { name: "Database Administrator", category: "technology", description: "Manages, maintains, and secures organizational databases." },
  { name: "AI/ML Engineer", category: "technology", description: "Builds machine learning models and artificial intelligence solutions." },

  // HEALTHCARE
  { name: "Registered Nurse", category: "healthcare", description: "Provides patient care, administers medications, and supports medical teams." },
  { name: "Community Health Worker", category: "healthcare", description: "Delivers health education and basic care services in communities." },
  { name: "Medical Laboratory Technician", category: "healthcare", description: "Performs laboratory tests and analyses to aid in disease diagnosis." },
  { name: "Pharmacy Technician", category: "healthcare", description: "Assists pharmacists in dispensing medications and managing inventory." },
  { name: "Environmental Health Officer", category: "healthcare", description: "Monitors and enforces public health and sanitation standards." },
  { name: "Clinical Officer", category: "healthcare", description: "Provides primary healthcare services, diagnoses, and treats common conditions." },
  { name: "Mental Health Counselor", category: "healthcare", description: "Provides counseling and therapeutic support for mental health challenges." },
  { name: "Nutritionist", category: "healthcare", description: "Develops meal plans and provides dietary guidance for health and wellness." },

  // AGRICULTURE
  { name: "Agricultural Extension Officer", category: "agriculture", description: "Advises farmers on modern techniques, crop management, and sustainable practices." },
  { name: "Farm Manager", category: "agriculture", description: "Oversees daily farm operations, crop production, and livestock management." },
  { name: "Agronomist", category: "agriculture", description: "Studies soil and crop science to improve agricultural productivity." },
  { name: "Livestock Specialist", category: "agriculture", description: "Manages animal health, breeding programs, and livestock production." },
  { name: "Agricultural Economist", category: "agriculture", description: "Analyzes economic factors affecting agricultural markets and food systems." },
  { name: "Irrigation Technician", category: "agriculture", description: "Designs, installs, and maintains irrigation systems for crop production." },
  { name: "Food Processing Technician", category: "agriculture", description: "Operates and manages equipment for processing raw agricultural products." },

  // ENGINEERING & TRADES
  { name: "Civil Engineer", category: "engineering", description: "Designs, builds, and maintains infrastructure projects like roads, bridges, and buildings." },
  { name: "Electrical Engineer", category: "engineering", description: "Designs and develops electrical systems, equipment, and components." },
  { name: "Mechanical Engineer", category: "engineering", description: "Designs, analyzes, and manufactures mechanical systems and devices." },
  { name: "Solar Energy Technician", category: "engineering", description: "Installs, maintains, and repairs solar power systems and panels." },
  { name: "Plumber", category: "engineering", description: "Installs and repairs water supply, drainage, and sewage systems." },
  { name: "Electrician", category: "engineering", description: "Installs, maintains, and repairs electrical wiring, fixtures, and systems." },
  { name: "Welder/Fabricator", category: "engineering", description: "Joins metal parts using heat and constructs metal structures and equipment." },
  { name: "HVAC Technician", category: "engineering", description: "Installs and maintains heating, ventilation, and air conditioning systems." },
  { name: "Automotive Technician", category: "engineering", description: "Diagnoses, repairs, and maintains vehicles and automotive systems." },
  { name: "Construction Site Supervisor", category: "engineering", description: "Manages construction sites, coordinates workers, and ensures safety compliance." },

  // BUSINESS & FINANCE
  { name: "Accountant", category: "business", description: "Prepares financial statements, manages budgets, and ensures regulatory compliance." },
  { name: "Financial Analyst", category: "business", description: "Analyzes financial data, trends, and investment opportunities." },
  { name: "Business Development Officer", category: "business", description: "Identifies growth opportunities, builds partnerships, and drives revenue." },
  { name: "Human Resources Officer", category: "business", description: "Manages recruitment, employee relations, and organizational development." },
  { name: "Marketing Specialist", category: "business", description: "Develops and executes marketing strategies to promote products and services." },
  { name: "Supply Chain Manager", category: "business", description: "Oversees procurement, logistics, and distribution of goods and services." },
  { name: "Project Manager", category: "business", description: "Plans, executes, and closes projects within scope, timeline, and budget." },
  { name: "Entrepreneur/SME Owner", category: "business", description: "Owns and operates a small or medium-sized enterprise." },

  // EDUCATION
  { name: "Primary School Teacher", category: "education", description: "Delivers foundational education to children in primary grades." },
  { name: "Secondary School Teacher", category: "education", description: "Teaches specialized subjects to students in secondary grades." },
  { name: "Vocational Trainer", category: "education", description: "Delivers hands-on training in trade and technical skills." },
  { name: "Special Education Teacher", category: "education", description: "Provides tailored education for learners with diverse needs." },
  { name: "Education Administrator", category: "education", description: "Manages school operations, curriculum, and staff coordination." },
  { name: "Early Childhood Educator", category: "education", description: "Nurtures and educates young children in pre-primary settings." },

  // CREATIVE & MEDIA
  { name: "Graphic Designer", category: "creative", description: "Creates visual content for print, digital, and multimedia platforms." },
  { name: "Content Creator", category: "creative", description: "Produces written, video, or audio content for digital platforms." },
  { name: "Photographer/Videographer", category: "creative", description: "Captures and edits photographic and video content for various purposes." },
  { name: "Social Media Manager", category: "creative", description: "Manages social media presence, content strategy, and community engagement." },
  { name: "Journalist", category: "creative", description: "Researches, writes, and reports news stories for media outlets." },
  { name: "Event Planner", category: "creative", description: "Plans, organizes, and executes events and special occasions." },

  // LEGAL & GOVERNANCE
  { name: "Legal Officer", category: "legal", description: "Provides legal advice, drafts documents, and ensures regulatory compliance." },
  { name: "Compliance Officer", category: "legal", description: "Ensures organizational adherence to laws, regulations, and internal policies." },
  { name: "Paralegal", category: "legal", description: "Supports lawyers with research, documentation, and case preparation." },
  { name: "Policy Analyst", category: "legal", description: "Researches and analyzes policies to inform government and organizational decisions." },

  // TOURISM & HOSPITALITY
  { name: "Tour Guide", category: "tourism", description: "Leads and educates tourists on cultural, historical, and natural attractions." },
  { name: "Hotel Manager", category: "tourism", description: "Oversees hotel operations, guest services, and staff management." },
  { name: "Travel Consultant", category: "tourism", description: "Plans and books travel arrangements for individuals and groups." },
  { name: "Chef/Cook", category: "tourism", description: "Prepares meals and manages kitchen operations in hospitality settings." },
  { name: "Tourism Marketing Officer", category: "tourism", description: "Promotes tourism destinations and experiences to domestic and international markets." },

  // MINING & NATURAL RESOURCES
  { name: "Mining Engineer", category: "mining", description: "Designs and manages safe and efficient mining operations." },
  { name: "Geologist", category: "mining", description: "Studies the earth's structure, minerals, and resource deposits." },
  { name: "Mine Safety Officer", category: "mining", description: "Ensures compliance with safety regulations in mining environments." },
  { name: "Metallurgist", category: "mining", description: "Extracts and refines metals from ores using chemical and physical processes." },

  // ENVIRONMENT & CONSERVATION
  { name: "Environmental Scientist", category: "environment", description: "Studies environmental problems and develops solutions for conservation." },
  { name: "Wildlife Conservation Officer", category: "environment", description: "Protects wildlife populations and manages conservation programs." },
  { name: "Forestry Technician", category: "environment", description: "Manages forest resources, monitors ecosystems, and prevents deforestation." },
  { name: "Climate Adaptation Specialist", category: "environment", description: "Develops strategies for communities to adapt to climate change impacts." },

  // SOCIAL SERVICES
  { name: "Social Worker", category: "social_services", description: "Supports individuals and communities facing social and economic challenges." },
  { name: "Youth Development Officer", category: "social_services", description: "Designs and implements programs for youth empowerment and development." },
  { name: "Disability Support Worker", category: "social_services", description: "Assists persons with disabilities to live independently and access services." },
  { name: "Gender Equality Officer", category: "social_services", description: "Develops and implements initiatives to promote gender equity and inclusion." },
];

async function seedProfessions() {
  console.log(`[SEED] Inserting ${PROFESSION_SEED_DATA.length} professions...`);

  for (const profession of PROFESSION_SEED_DATA) {
    await db
      .insert(professions)
      .values(profession)
      .onDuplicateKeyUpdate({
        set: {
          description: profession.description,
          isActive: true,
        },
      });
  }

  console.log(`[SEED] Professions seeded successfully.`);
}

async function main() {
  console.log("============================================================");
  console.log("  LEVAV TALENT AFRIKA — DATABASE SEED");
  console.log("============================================================");
  console.log();

  try {
    await seedProfessions();
    console.log();
    console.log("============================================================");
    console.log("  SEED COMPLETE");
    console.log("============================================================");
    process.exit(0);
  } catch (error) {
    console.error("[SEED ERROR]", error);
    process.exit(1);
  }
}

main();
