-- =====================================================
-- KNOWLEDGE RESOURCES SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor
-- Stores federal and state-specific special needs information

-- =====================================================
-- 1. KNOWLEDGE REGIONS (Federal + States)
-- =====================================================

CREATE TABLE IF NOT EXISTS knowledge_regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation TEXT,
  type TEXT NOT NULL, -- 'federal' or 'state'
  emoji TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Federal + States (starting with California)
INSERT INTO knowledge_regions (id, name, abbreviation, type, emoji, sort_order, is_active) VALUES
  ('federal', 'Federal (U.S.)', 'US', 'federal', '🇺🇸', 0, TRUE),
  ('california', 'California', 'CA', 'state', '🌴', 1, TRUE),
  ('texas', 'Texas', 'TX', 'state', '⛵', 2, FALSE),
  ('florida', 'Florida', 'FL', 'state', '🌴', 3, FALSE),
  ('new-york', 'New York', 'NY', 'state', '🗽', 4, FALSE),
  ('illinois', 'Illinois', 'IL', 'state', '🌽', 5, FALSE),
  ('pennsylvania', 'Pennsylvania', 'PA', 'state', '🔔', 6, FALSE),
  ('ohio', 'Ohio', 'OH', 'state', '🌰', 7, FALSE),
  ('georgia', 'Georgia', 'GA', 'state', '🍑', 8, FALSE),
  ('north-carolina', 'North Carolina', 'NC', 'state', '🌲', 9, FALSE),
  ('michigan', 'Michigan', 'MI', 'state', '🚗', 10, FALSE)
ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- 2. KNOWLEDGE CATEGORIES
-- =====================================================

CREATE TABLE IF NOT EXISTS knowledge_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO knowledge_categories (id, name, description, emoji, color, sort_order) VALUES
  ('laws', 'Laws & Regulations', 'Federal and state laws protecting rights', '⚖️', '#8E6BBF', 1),
  ('services', 'Services & Programs', 'Available services and how to access them', '🏥', '#5CB85C', 2),
  ('education', 'Education & IEP', 'School services, IEPs, and educational rights', '🎓', '#4A9FD4', 3),
  ('rights', 'Parent & Child Rights', 'Know your rights and how to advocate', '✊', '#E63B2E', 4),
  ('resources', 'Resources & Contacts', 'Organizations, hotlines, and helpful links', '📞', '#F5A623', 5),
  ('funding', 'Funding & Financial', 'Financial assistance and insurance', '💰', '#5CB85C', 6),
  ('transition', 'Transition Planning', 'Preparing for adulthood', '🎯', '#4A9FD4', 7)
ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- 3. KNOWLEDGE ARTICLES
-- =====================================================

CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Location
  region_id TEXT NOT NULL REFERENCES knowledge_regions(id),
  category_id TEXT NOT NULL REFERENCES knowledge_categories(id),
  
  -- Content
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL, -- Markdown content
  
  -- Federal reference (for state articles that override/extend federal)
  federal_reference_id UUID REFERENCES knowledge_articles(id),
  has_state_differences BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  last_verified_at DATE,
  source_urls TEXT[] DEFAULT '{}',
  
  -- Status
  is_published BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(region_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_region 
  ON knowledge_articles(region_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_articles_category 
  ON knowledge_articles(category_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_articles_slug 
  ON knowledge_articles(slug);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_search 
  ON knowledge_articles USING gin(to_tsvector('english', title || ' ' || COALESCE(summary, '') || ' ' || content));


-- =====================================================
-- 4. GLOSSARY TERMS
-- =====================================================

CREATE TABLE IF NOT EXISTS knowledge_glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  abbreviation TEXT,
  definition TEXT NOT NULL,
  region_id TEXT REFERENCES knowledge_regions(id), -- NULL = applies everywhere
  category_id TEXT REFERENCES knowledge_categories(id),
  related_terms TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_glossary_term 
  ON knowledge_glossary(term);


-- =====================================================
-- 5. RLS POLICIES
-- =====================================================

ALTER TABLE knowledge_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_glossary ENABLE ROW LEVEL SECURITY;

-- Public read access for all knowledge content
CREATE POLICY "Public read access for regions"
  ON knowledge_regions FOR SELECT USING (true);

CREATE POLICY "Public read access for categories"
  ON knowledge_categories FOR SELECT USING (true);

CREATE POLICY "Public read access for articles"
  ON knowledge_articles FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for glossary"
  ON knowledge_glossary FOR SELECT USING (true);


-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Get articles by region and category
CREATE OR REPLACE FUNCTION get_knowledge_articles(
  p_region_id TEXT,
  p_category_id TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  region_id TEXT,
  category_id TEXT,
  title TEXT,
  slug TEXT,
  summary TEXT,
  has_state_differences BOOLEAN,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.region_id,
    a.category_id,
    a.title,
    a.slug,
    a.summary,
    a.has_state_differences,
    a.tags
  FROM knowledge_articles a
  WHERE a.region_id = p_region_id
    AND a.is_published = TRUE
    AND (p_category_id IS NULL OR a.category_id = p_category_id)
  ORDER BY a.title
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search knowledge base
CREATE OR REPLACE FUNCTION search_knowledge(
  p_query TEXT,
  p_region_id TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  region_id TEXT,
  category_id TEXT,
  title TEXT,
  slug TEXT,
  summary TEXT,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.region_id,
    a.category_id,
    a.title,
    a.slug,
    a.summary,
    ts_rank(to_tsvector('english', a.title || ' ' || COALESCE(a.summary, '') || ' ' || a.content), 
            plainto_tsquery('english', p_query)) as relevance
  FROM knowledge_articles a
  WHERE a.is_published = TRUE
    AND (p_region_id IS NULL OR a.region_id = p_region_id)
    AND to_tsvector('english', a.title || ' ' || COALESCE(a.summary, '') || ' ' || a.content) 
        @@ plainto_tsquery('english', p_query)
  ORDER BY relevance DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 7. SEED DATA - FEDERAL LAWS
-- =====================================================

-- IDEA (Individuals with Disabilities Education Act)
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'federal',
  'laws',
  'IDEA - Individuals with Disabilities Education Act',
  'idea',
  'The federal law ensuring services for children with disabilities. Guarantees free appropriate public education (FAPE).',
  '# IDEA - Individuals with Disabilities Education Act

## What is IDEA?

The **Individuals with Disabilities Education Act (IDEA)** is a federal law that ensures students with disabilities are provided with a Free Appropriate Public Education (FAPE) tailored to their individual needs.

## Key Provisions

### Free Appropriate Public Education (FAPE)
- Every child with a disability is entitled to a free public education
- Education must be appropriate to the child''s unique needs
- Provided at no cost to parents

### Least Restrictive Environment (LRE)
- Children with disabilities should be educated with non-disabled peers to the maximum extent appropriate
- Removal from regular education should only occur when education cannot be achieved satisfactorily with supplementary aids and services

### Individualized Education Program (IEP)
- A written document developed for each eligible child
- Includes present levels, goals, services, and accommodations
- Must be reviewed at least annually

### Parent Participation
- Parents are equal members of the IEP team
- Must receive prior written notice of any changes
- Have the right to dispute decisions

## Who is Eligible?

Children ages 3-21 with one or more of these disabilities:
- Autism
- Deaf-blindness
- Deafness
- Emotional disturbance
- Hearing impairment
- Intellectual disability
- Multiple disabilities
- Orthopedic impairment
- Other health impairment
- Specific learning disability
- Speech or language impairment
- Traumatic brain injury
- Visual impairment

## Early Intervention (Part C)

For children birth to age 3:
- Individualized Family Service Plan (IFSP)
- Services provided in natural environments
- Focus on family-centered support

## Your Rights Under IDEA

1. **Evaluation** - Free evaluation to determine eligibility
2. **IEP** - Participate in developing your child''s IEP
3. **Placement** - Be part of placement decisions
4. **Records** - Access to all educational records
5. **Notice** - Written notice before any changes
6. **Consent** - Your consent required for evaluations and initial services
7. **Dispute Resolution** - Mediation, due process, and complaints

## Important Timelines

- **Initial Evaluation**: Must be completed within 60 days of consent
- **IEP Meeting**: Within 30 days of eligibility determination
- **Annual Review**: IEP reviewed at least once per year
- **Reevaluation**: At least every 3 years (triennial)

## Resources

- [IDEA Full Text](https://sites.ed.gov/idea/)
- [Parent Center Hub](https://www.parentcenterhub.org/)
- [Wrightslaw](https://www.wrightslaw.com/)
',
  ARRAY['IDEA', 'FAPE', 'IEP', 'special education', 'federal law'],
  ARRAY['https://sites.ed.gov/idea/', 'https://www.parentcenterhub.org/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Section 504
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'federal',
  'laws',
  'Section 504 of the Rehabilitation Act',
  'section-504',
  'Civil rights law prohibiting discrimination against individuals with disabilities. Provides accommodations in schools.',
  '# Section 504 of the Rehabilitation Act

## What is Section 504?

**Section 504** is a civil rights law that prohibits discrimination against individuals with disabilities in programs receiving federal funding, including public schools.

## How is it Different from IDEA?

| Aspect | IDEA | Section 504 |
|--------|------|-------------|
| Type of Law | Education law | Civil rights law |
| Eligibility | Specific disability categories | Any physical or mental impairment |
| Plan | IEP (detailed) | 504 Plan (accommodations) |
| Funding | Provides funding | No additional funding |
| Services | Specialized instruction | Accommodations only |

## Who Qualifies?

A person with a **physical or mental impairment** that **substantially limits** one or more **major life activities**, including:
- Learning
- Reading
- Concentrating
- Thinking
- Communicating
- Walking
- Breathing
- Seeing
- Hearing

## Common 504 Accommodations

- Extended time on tests
- Preferential seating
- Breaks during class
- Modified assignments
- Assistive technology
- Audio books
- Note-taking assistance
- Reduced homework

## 504 Plan Process

1. **Referral** - Parent, teacher, or other staff request evaluation
2. **Evaluation** - School gathers information about the disability
3. **Eligibility** - Team determines if child qualifies
4. **Plan Development** - Create accommodation plan
5. **Implementation** - Put accommodations in place
6. **Review** - Periodic review (typically annual)

## Your Rights

- Free evaluation
- Participate in decisions
- Access to records
- Grievance procedures
- Office for Civil Rights (OCR) complaint

## When to Choose 504 vs. IEP

**504 may be appropriate when:**
- Child has a disability but doesn''t need specialized instruction
- Child needs accommodations only
- Disability doesn''t fit IDEA categories but still impacts learning

**IEP may be better when:**
- Child needs specialized instruction
- Child needs related services (speech, OT, etc.)
- More detailed goals and progress monitoring needed
',
  ARRAY['504', 'accommodations', 'civil rights', 'disability'],
  ARRAY['https://www.hhs.gov/ocr/504']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- ADA
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'federal',
  'laws',
  'Americans with Disabilities Act (ADA)',
  'ada',
  'Comprehensive civil rights law prohibiting discrimination against individuals with disabilities in all areas of public life.',
  '# Americans with Disabilities Act (ADA)

## What is the ADA?

The **Americans with Disabilities Act (ADA)** is a comprehensive civil rights law enacted in 1990 that prohibits discrimination against individuals with disabilities in all areas of public life.

## Five Titles of the ADA

### Title I - Employment
- Employers with 15+ employees must provide reasonable accommodations
- Cannot discriminate in hiring, firing, promotions, or pay
- Job requirements must be essential functions

### Title II - Public Services
- State and local governments must be accessible
- Public transportation must be accessible
- Includes public schools

### Title III - Public Accommodations
- Private businesses open to the public must be accessible
- Includes restaurants, stores, doctors'' offices, schools
- Must remove barriers when readily achievable

### Title IV - Telecommunications
- Telephone companies must provide relay services
- Closed captioning requirements

### Title V - Miscellaneous
- Prohibits retaliation
- Attorney''s fees provisions

## How ADA Relates to Special Needs Children

- **Schools** must be physically accessible
- **Medical facilities** must provide accommodations
- **Businesses** must accommodate families
- **Public spaces** (parks, playgrounds) must be accessible

## Reasonable Accommodations

Employers and businesses must provide reasonable accommodations unless it causes **undue hardship**, such as:
- Modified work schedules
- Assistive technology
- Accessible facilities
- Service animals allowed

## Filing a Complaint

1. **Employment** - Equal Employment Opportunity Commission (EEOC)
2. **Public Services** - Department of Justice or relevant agency
3. **Public Accommodations** - Department of Justice

## Resources

- [ADA.gov](https://www.ada.gov/)
- [ADA National Network](https://adata.org/)
',
  ARRAY['ADA', 'civil rights', 'accessibility', 'discrimination'],
  ARRAY['https://www.ada.gov/']
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- 8. SEED DATA - CALIFORNIA SPECIFIC
-- =====================================================

-- California Special Education Overview
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'california',
  'education',
  'California Special Education Overview',
  'ca-special-ed-overview',
  'Overview of special education in California, including SELPAs, state laws, and how they work with federal IDEA.',
  '# California Special Education Overview

## How California Implements IDEA

California implements the federal IDEA through the **California Education Code** and regulations from the **California Department of Education (CDE)**. 

## Key California Differences from Federal Law

⚠️ **California often provides MORE protections than federal law requires:**

| Area | Federal IDEA | California |
|------|-------------|------------|
| Evaluation Timeline | 60 days | **60 days** (same) |
| IEP Meeting Notice | Reasonable time | **At least 10 days** |
| Assessment Plan | 15 days to respond | **15 days** (same) |
| Stay Put | During disputes | **Same + additional protections** |
| Independent Evaluation | Parent right | **Must inform of right** |

## SELPAs - Special Education Local Plan Areas

California organizes special education through **SELPAs** (Special Education Local Plan Areas).

### What is a SELPA?

- Regional consortium of school districts
- Develops local plans for special education services
- Ensures all students have access to services
- May serve single large districts or multiple small districts

### Finding Your SELPA

Your school district belongs to a SELPA. Common SELPAs include:
- Los Angeles Unified SELPA
- San Diego Unified SELPA
- Fresno Unified SELPA
- [Find Your SELPA](https://www.cde.ca.gov/sp/se/as/caselpas.asp)

## California Education Code References

Key sections for special education:
- **EC 56000-56885** - Special Education Programs
- **EC 56040** - Equal access rights
- **EC 56341** - IEP team members
- **EC 56344** - IEP content requirements

## State Resources

- **California Department of Education Special Education Division**
  - Website: [cde.ca.gov/sp/se](https://www.cde.ca.gov/sp/se/)
  - Phone: (916) 327-3870

- **Disability Rights California**
  - Free legal advocacy
  - Website: [disabilityrightsca.org](https://www.disabilityrightsca.org/)
  - Phone: 1-800-776-5746

- **Community Advisory Committee (CAC)**
  - Parent advisory group for each SELPA
  - Ask your district for CAC contact info

## California-Specific Programs

### California Children''s Services (CCS)
- Medical services for children with certain conditions
- Therapy, equipment, and medical care
- Income requirements may apply

### Regional Centers
- Services for developmental disabilities
- Birth through entire lifespan
- 21 Regional Centers statewide
- [Find Your Regional Center](https://www.dds.ca.gov/rc/)

### Early Start Program
- California''s early intervention (Part C of IDEA)
- Birth to 36 months
- Coordinated through Regional Centers
',
  ARRAY['California', 'SELPA', 'special education', 'CDE'],
  ARRAY['https://www.cde.ca.gov/sp/se/', 'https://www.disabilityrightsca.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;

-- SELPA Detailed Article
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'california',
  'education',
  'Understanding SELPAs in California',
  'selpa-guide',
  'Complete guide to Special Education Local Plan Areas (SELPAs) - what they are, how they work, and how to work with them.',
  '# Understanding SELPAs in California

## What is a SELPA?

A **Special Education Local Plan Area (SELPA)** is a regional consortium that coordinates and provides special education services for school districts in California.

## Why Do SELPAs Exist?

California is divided into SELPAs to:
- **Pool resources** - Small districts can share specialists
- **Ensure equity** - All students have access to services
- **Coordinate services** - Standardize processes across districts
- **Manage funding** - Distribute state and federal special education funds

## Types of SELPAs

### Single-District SELPAs
Large districts that operate independently:
- Los Angeles Unified
- San Diego Unified
- Fresno Unified

### Multi-District SELPAs
Multiple smaller districts working together:
- West Contra Costa SELPA (multiple districts)
- Tulare County SELPA (county-wide)

### County Office SELPAs
Run by County Offices of Education:
- Provide services county-wide
- Support smaller districts

## SELPA Structure

### SELPA Administrator
- Oversees special education services
- Manages funding allocation
- Coordinates with districts

### Community Advisory Committee (CAC)
- **Required by law**
- Majority must be parents of students with disabilities
- Advises SELPA on policies and programs
- Reviews and comments on Local Plan

### Local Plan
Each SELPA must have a **Local Plan** that describes:
- How services will be provided
- Governance structure
- Funding distribution
- Dispute resolution procedures

## SELPA Responsibilities

1. **Child Find** - Identifying all children who may need services
2. **Assessment** - Coordinating evaluations
3. **Program Options** - Ensuring range of services available
4. **Staff Development** - Training for educators
5. **Data Collection** - Tracking student outcomes
6. **Compliance** - Meeting state and federal requirements

## How to Work with Your SELPA

### Get Involved
- Join the Community Advisory Committee (CAC)
- Attend SELPA board meetings (usually public)
- Participate in Local Plan review

### Request Information
You have the right to:
- Copy of the Local Plan
- SELPA policies and procedures
- Budget information (public record)

### File Complaints
If district isn''t providing services:
1. Start with school/district
2. Contact SELPA Administrator
3. File with California Department of Education
4. Request due process hearing

## Finding Your SELPA

**Online:**
[CDE SELPA Directory](https://www.cde.ca.gov/sp/se/as/caselpas.asp)

**By Phone:**
Call your school district and ask which SELPA they belong to

## SELPA Funding

SELPAs receive funding from:
- Federal IDEA grants
- California state funds
- Local property taxes

The SELPA allocates funding to member districts based on the **Local Plan** funding formula.
',
  ARRAY['SELPA', 'California', 'special education', 'Local Plan', 'CAC'],
  ARRAY['https://www.cde.ca.gov/sp/se/as/caselpas.asp']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Regional Centers
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'california',
  'services',
  'California Regional Centers',
  'regional-centers',
  'Comprehensive guide to Regional Centers - services for people with developmental disabilities from birth through adulthood.',
  '# California Regional Centers

## What are Regional Centers?

Regional Centers are **nonprofit organizations** contracted by the California Department of Developmental Services (DDS) to coordinate services for people with developmental disabilities.

## Who is Eligible?

To qualify, a person must have a **developmental disability** that:
- Began before age 18
- Is expected to continue indefinitely
- Constitutes a substantial disability

### Qualifying Conditions
- Intellectual disability
- Cerebral palsy
- Epilepsy
- Autism
- Conditions requiring similar services

### Early Start (Ages 0-3)
Infants and toddlers may qualify if they have:
- Developmental delay
- Established risk condition
- High risk of developmental disability

## Services Provided

Regional Centers provide or coordinate:

### Assessment & Planning
- Intake and assessment
- Individual Program Plan (IPP)
- Service coordination

### Early Intervention
- Infant development programs
- Early Start services
- Family support

### Living Support
- Independent living services
- Supported living
- Residential facilities (when needed)

### Day Programs
- Day programs
- Work activity programs
- Supported employment

### Family Support
- Respite care
- Parent training
- Sibling support
- Family counseling

### Health Services
- Medical referrals
- Therapy coordination
- Equipment and supplies

## The 21 Regional Centers

| Regional Center | Counties Served | Phone |
|----------------|-----------------|-------|
| Alta California | Sacramento area | (916) 978-6400 |
| Central Valley | Fresno, Merced, etc. | (559) 276-4300 |
| East Bay | Alameda, Contra Costa | (510) 618-6100 |
| Far Northern | Shasta, Butte, etc. | (530) 222-4791 |
| Frank D. Lanterman | Glendale, Pasadena | (818) 243-4703 |
| Golden Gate | San Francisco, Marin | (415) 546-9222 |
| Harbor | Long Beach, Torrance | (310) 540-1711 |
| Inland | Riverside, San Bernardino | (951) 782-7200 |
| Kern | Kern County | (661) 327-8531 |
| North Bay | Sonoma, Napa, Solano | (707) 256-1100 |
| North Los Angeles | San Fernando Valley | (818) 778-1900 |
| Orange County | Orange County | (714) 796-5100 |
| Redwood Coast | Humboldt, Del Norte | (707) 445-0893 |
| San Andreas | Santa Clara, etc. | (408) 374-9960 |
| San Diego | San Diego, Imperial | (858) 576-2996 |
| San Gabriel/Pomona | East LA County | (626) 299-4700 |
| South Central | South LA | (213) 744-7000 |
| Tri-Counties | Ventura, Santa Barbara | (805) 962-7881 |
| Valley Mountain | Stockton, Modesto | (209) 473-0951 |
| Westside | West LA | (310) 258-4000 |

## How to Apply

1. **Contact your Regional Center** - Find yours at [dds.ca.gov/rc](https://www.dds.ca.gov/rc/)
2. **Request intake appointment**
3. **Provide documentation** - Medical records, school records, etc.
4. **Assessment** - Regional Center evaluates eligibility
5. **Eligibility determination** - Within 120 days
6. **IPP meeting** - Develop service plan if eligible

## Individual Program Plan (IPP)

The IPP is your **service plan** that includes:
- Goals and objectives
- Services to be provided
- Who will provide them
- Timelines

**You have the right to:**
- Participate in IPP development
- Choose services and providers
- Appeal decisions you disagree with

## Rights & Advocacy

If you disagree with Regional Center decisions:
1. **Informal meeting** with Service Coordinator
2. **Fair Hearing** - Request within 30 days
3. **Office of Clients'' Rights Advocacy (OCRA)** - Free legal help
   - Phone: 1-800-390-7032

## Funding Note

Regional Center services are **free** regardless of income for eligible individuals. Some services may require family cost participation based on income.
',
  ARRAY['Regional Center', 'California', 'developmental disabilities', 'DDS', 'IPP'],
  ARRAY['https://www.dds.ca.gov/rc/', 'https://www.dds.ca.gov/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- California IEP Guide
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'california',
  'education',
  'California IEP Guide',
  'ca-iep-guide',
  'Complete guide to the IEP process in California, including state-specific requirements and parent rights.',
  '# California IEP Guide

## California IEP Requirements

California follows federal IDEA requirements but has some **additional protections** for families.

## Key California Differences

### IEP Meeting Notice
- **Federal**: Reasonable advance notice
- **California**: At least **10 days** before meeting (unless parent waives)

### Assessment Plan
- Must be provided within **15 days** of referral
- Parent has **15 days** to respond
- Assessment completed within **60 days** of consent

### Translation Requirements
California requires:
- IEP documents in parent''s primary language
- Interpreter at IEP meetings if needed
- **Free** translation services

## IEP Team Members (California)

Required participants:
- Parent/guardian
- Regular education teacher (if in general ed)
- Special education teacher
- District representative (can authorize services)
- Person who can interpret assessments
- Student (when appropriate, **required at age 16+**)
- Others at parent or district request

## California IEP Content

The IEP must include:
1. Present levels of performance
2. Measurable annual goals
3. How progress will be measured
4. Special education services
5. Related services
6. Supplementary aids and services
7. Program modifications
8. Extended School Year (ESY) consideration
9. **Transition services (starting at age 16)**
10. **Behavioral support plan** (if behavior impedes learning)

## Extended School Year (ESY)

California requires IEP teams to consider ESY for all students. ESY may be needed if:
- Significant regression during breaks
- Limited recoupment ability
- Critical skill development period
- Interfering behaviors

## Parent Rights in California

### Before the IEP Meeting
- 10-day written notice
- Copy of procedural safeguards
- Assessment results before meeting
- Right to bring advocates or attorneys

### During the IEP Meeting
- Equal participation in decisions
- Audio record the meeting (with 24-hour notice to district)
- Request breaks or continue another day
- Disagree and note dissent on IEP

### After the IEP Meeting
- Receive copy of IEP immediately
- Consent before services begin
- Request changes anytime
- File complaints if services not provided

## Dispute Resolution Options

### 1. Informal Resolution
- Talk to teacher, case manager, principal
- Request IEP meeting to discuss concerns

### 2. Alternative Dispute Resolution (ADR)
- Free facilitated IEP meetings
- Voluntary for both parties

### 3. Mediation
- Free through CDE
- Neutral mediator helps reach agreement
- No obligation to settle

### 4. State Compliance Complaint
- File with CDE
- Investigated within 60 days
- Can result in corrective action

### 5. Due Process Hearing
- Formal legal proceeding
- Request within 2 years of issue
- Decision within 45 days

## California IEP Tips

✅ **DO:**
- Request ALL assessments you think are needed
- Ask questions until you understand
- Get everything in writing
- Bring a support person
- Request to audio record

❌ **DON''T:**
- Sign if you don''t agree
- Let them rush you
- Accept "we don''t do that here"
- Give up your rights

## Resources

- **Disability Rights California**: 1-800-776-5746
- **Parent Training and Information Centers**
- **SELPA Community Advisory Committee**
- **CA Department of Education**: [cde.ca.gov/sp/se](https://www.cde.ca.gov/sp/se/)
',
  ARRAY['IEP', 'California', 'special education', 'parent rights', 'assessment'],
  ARRAY['https://www.cde.ca.gov/sp/se/', 'https://www.disabilityrightsca.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- 9. GLOSSARY TERMS
-- =====================================================

INSERT INTO knowledge_glossary (term, abbreviation, definition, category_id) VALUES
('Free Appropriate Public Education', 'FAPE', 'The right of every child with a disability to receive special education and related services at no cost, designed to meet their unique needs.', 'laws'),
('Individualized Education Program', 'IEP', 'A written document that outlines the special education services a child will receive, including goals, accommodations, and placement.', 'education'),
('Least Restrictive Environment', 'LRE', 'The IDEA requirement that children with disabilities be educated with non-disabled peers to the maximum extent appropriate.', 'education'),
('Special Education Local Plan Area', 'SELPA', 'California regional consortiums of school districts that coordinate special education services.', 'education'),
('Individual Program Plan', 'IPP', 'The service plan developed by California Regional Centers for individuals with developmental disabilities.', 'services'),
('Individuals with Disabilities Education Act', 'IDEA', 'The federal law ensuring services for children with disabilities, guaranteeing FAPE.', 'laws'),
('Extended School Year', 'ESY', 'Special education services provided beyond the regular school year for eligible students.', 'education'),
('Related Services', NULL, 'Support services needed for a child to benefit from special education, such as speech therapy, OT, PT, transportation.', 'services'),
('Due Process', NULL, 'A formal procedure to resolve disputes between parents and school districts about special education.', 'rights'),
('Procedural Safeguards', NULL, 'Legal rights given to parents under IDEA, including notice, consent, and dispute resolution options.', 'rights')
ON CONFLICT DO NOTHING;


-- =====================================================
-- 10. UPDATE TIMESTAMP TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_knowledge_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_articles_updated
  BEFORE UPDATE ON knowledge_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_timestamp();
