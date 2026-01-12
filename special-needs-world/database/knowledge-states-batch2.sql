-- =====================================================
-- MORE STATES - Batch 2
-- Kentucky, Louisiana, Maine, Maryland, Massachusetts,
-- Minnesota, Mississippi, Missouri, Montana, Nebraska
-- =====================================================

-- Add regions
INSERT INTO knowledge_regions (id, name, abbreviation, type, emoji, sort_order, is_active) VALUES
  ('kentucky', 'Kentucky', 'KY', 'state', '🐴', 30, TRUE),
  ('louisiana', 'Louisiana', 'LA', 'state', '⚜️', 31, TRUE),
  ('maine', 'Maine', 'ME', 'state', '🦞', 32, TRUE),
  ('maryland', 'Maryland', 'MD', 'state', '🦀', 33, TRUE),
  ('massachusetts', 'Massachusetts', 'MA', 'state', '🍀', 34, TRUE),
  ('minnesota', 'Minnesota', 'MN', 'state', '❄️', 35, TRUE),
  ('mississippi', 'Mississippi', 'MS', 'state', '🎸', 36, TRUE),
  ('missouri', 'Missouri', 'MO', 'state', '🌉', 37, TRUE),
  ('montana', 'Montana', 'MT', 'state', '🦌', 38, TRUE),
  ('nebraska', 'Nebraska', 'NE', 'state', '🌾', 39, TRUE)
ON CONFLICT (id) DO UPDATE SET is_active = TRUE;


-- =====================================================
-- KENTUCKY
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'kentucky',
  'education',
  'Kentucky Special Education Overview',
  'ky-special-ed-overview',
  'Overview of special education in Kentucky, including KDE requirements and ARC process.',
  '# Kentucky Special Education Overview

## How Kentucky Implements IDEA

Kentucky implements federal IDEA through the **Kentucky Department of Education (KDE)** Office of Special Education and Early Learning.

## Key Kentucky Agencies

### Kentucky Department of Education - Office of Special Education and Early Learning
- State oversight
- Phone: (502) 564-4970
- Website: [education.ky.gov](https://education.ky.gov/specialed/Pages/default.aspx)

### Department for Behavioral Health, Developmental and Intellectual Disabilities
- Services for developmental disabilities
- Phone: (502) 564-4527

## Kentucky Specific Terms

### ARC - Admissions and Release Committee
Kentucky calls the IEP team the **ARC** (Admissions and Release Committee).

## Kentucky vs Federal Requirements

| Area | Federal IDEA | Kentucky |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **60 school days** |
| ARC/IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Kentucky Programs

### First Steps (Early Intervention)
- Birth to age 3
- Phone: 1-877-417-5615
- Website: [chfs.ky.gov/firststeps](https://chfs.ky.gov/agencies/dph/dmch/ecdb/Pages/firststeps.aspx)

### Kentucky School for the Deaf / Blind
- Statewide services

### Kentucky Special Education Cooperatives
- Regional cooperatives support districts

## Parent Resources

### Kentucky Special Parent Involvement Network (KY-SPIN)
- PTI for Kentucky
- Phone: 1-800-525-7746
- Website: [kyspin.com](https://www.kyspin.com/)

### Protection and Advocacy
- Free legal advocacy
- Phone: 1-800-372-2988
- Website: [kypa.net](https://www.kypa.net/)
',
  ARRAY['Kentucky', 'KDE', 'special education', 'ARC'],
  ARRAY['https://education.ky.gov/specialed/Pages/default.aspx'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- LOUISIANA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'louisiana',
  'education',
  'Louisiana Special Education Overview',
  'la-special-ed-overview',
  'Overview of special education in Louisiana, including LDOE requirements and state programs.',
  '# Louisiana Special Education Overview

## How Louisiana Implements IDEA

Louisiana implements federal IDEA through the **Louisiana Department of Education (LDOE)** Office of Special Education Services.

## Key Louisiana Agencies

### Louisiana Department of Education - Office of Special Education Services
- State oversight
- Phone: 1-877-453-2721
- Website: [louisianabelieves.com](https://www.louisianabelieves.com/students/special-education)

### Office for Citizens with Developmental Disabilities (OCDD)
- Services for developmental disabilities
- Phone: (225) 342-0095

## Louisiana vs Federal Requirements

| Area | Federal IDEA | Louisiana |
|------|-------------|-----------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** (through 22nd birthday) |

## Louisiana Programs

### EarlySteps (Early Intervention)
- Birth to age 3
- Phone: 1-866-327-5978
- Website: [ldh.la.gov/earlysteps](https://ldh.la.gov/earlysteps)

### Louisiana Schools for the Deaf and Visually Impaired
- Statewide services

### Louisiana Scholarship Program
- School choice for some students with disabilities

## Parent Resources

### Families Helping Families
- PTI centers across Louisiana
- Multiple regional centers
- Website: [fhfofgno.org](https://fhfofgno.org/)

### Advocacy Center
- Free legal advocacy
- Phone: 1-800-960-7705
- Website: [advocacyla.org](https://www.advocacyla.org/)
',
  ARRAY['Louisiana', 'LDOE', 'special education', 'EarlySteps'],
  ARRAY['https://www.louisianabelieves.com/students/special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- MAINE
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'maine',
  'education',
  'Maine Special Education Overview',
  'me-special-ed-overview',
  'Overview of special education in Maine, including DOE requirements and PET process.',
  '# Maine Special Education Overview

## How Maine Implements IDEA

Maine implements federal IDEA through the **Maine Department of Education (DOE)** Office of Special Services.

## Key Maine Agencies

### Maine Department of Education - Office of Special Services
- State oversight
- Phone: (207) 624-6600
- Website: [maine.gov/doe/learning/specialed](https://www.maine.gov/doe/learning/specialed)

### Office of Aging and Disability Services
- Services for developmental disabilities
- Phone: 1-800-262-2232

## Maine Specific Terms

### PET - Pupil Evaluation Team
Maine calls the IEP team the **PET** (Pupil Evaluation Team).

## Maine vs Federal Requirements

| Area | Federal IDEA | Maine |
|------|-------------|-------|
| Evaluation Timeline | 60 days | **45 school days** ⚠️ |
| PET/IEP Meeting | 30 days | **Within 45 days** |
| Age Range | 3-21 | **3-20** ⚠️ |

⚠️ Maine has shorter timeline and provides services through age **20**.

## Maine Programs

### Child Development Services (CDS)
- Birth to age 5
- Phone: 1-877-231-3747
- Website: [maine.gov/doe/cds](https://www.maine.gov/doe/cds)

## Parent Resources

### Maine Parent Federation
- PTI for Maine
- Phone: 1-800-870-7746
- Website: [mpf.org](https://www.mpf.org/)

### Disability Rights Maine
- Free legal advocacy
- Phone: 1-800-452-1948
- Website: [drme.org](https://drme.org/)
',
  ARRAY['Maine', 'DOE', 'special education', 'PET'],
  ARRAY['https://www.maine.gov/doe/learning/specialed'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- MARYLAND
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'maryland',
  'education',
  'Maryland Special Education Overview',
  'md-special-ed-overview',
  'Overview of special education in Maryland, including MSDE requirements and state programs.',
  '# Maryland Special Education Overview

## How Maryland Implements IDEA

Maryland implements federal IDEA through the **Maryland State Department of Education (MSDE)** Division of Early Intervention and Special Education Services.

## Key Maryland Agencies

### Maryland State Department of Education - Division of Early Intervention/Special Education
- State oversight
- Phone: (410) 767-0100
- Website: [marylandpublicschools.org](https://marylandpublicschools.org/programs/Pages/Special-Education/index.aspx)

### Developmental Disabilities Administration (DDA)
- Services for developmental disabilities
- Phone: (410) 767-5600

## Maryland vs Federal Requirements

| Area | Federal IDEA | Maryland |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **60 days from referral** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **Birth-21** ⚠️ |

⚠️ Maryland provides services from **birth**.

## Maryland Programs

### Maryland Infants and Toddlers Program
- Birth to age 3
- Extended IFSP option to age 4
- Phone: 1-800-535-0182

### SEED School of Maryland
- Public boarding school option for at-risk youth

### EXCELS Scholarship
- School choice scholarship program

## Parent Resources

### Parents'' Place of Maryland
- PTI for Maryland
- Phone: (410) 768-9100
- Website: [ppmd.org](https://www.ppmd.org/)

### Maryland Disability Law Center
- Free legal advocacy
- Phone: (410) 727-6352
- Website: [disabilityrightsmd.org](https://www.disabilityrightsmd.org/)
',
  ARRAY['Maryland', 'MSDE', 'special education'],
  ARRAY['https://marylandpublicschools.org/programs/Pages/Special-Education/index.aspx'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- MASSACHUSETTS
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'massachusetts',
  'education',
  'Massachusetts Special Education Overview',
  'ma-special-ed-overview',
  'Overview of special education in Massachusetts, including DESE requirements and strong state protections.',
  '# Massachusetts Special Education Overview

## How Massachusetts Implements IDEA

Massachusetts implements federal IDEA through the **Department of Elementary and Secondary Education (DESE)** Office of Special Education.

## Key Massachusetts Agencies

### DESE - Office of Special Education
- State oversight
- Phone: (781) 338-3000
- Website: [doe.mass.edu](https://www.doe.mass.edu/sped/)

### Department of Developmental Services (DDS)
- Services for developmental disabilities
- Phone: (617) 727-5608

## Massachusetts Has Strong Protections

Massachusetts often provides **more protections** than federal IDEA requires.

## Massachusetts vs Federal Requirements

| Area | Federal IDEA | Massachusetts |
|------|-------------|---------------|
| Evaluation Timeline | 60 days | **30 school days** ⚠️ |
| IEP Meeting | 30 days | **Within evaluation timeline** |
| Age Range | 3-21 | **3-22** |
| Class Size | No limit | **State maximums** |

⚠️ Massachusetts has a shorter **30 school day** evaluation timeline!

## Massachusetts Specific Terms

### TEAM - Team Evaluation Assessment Meeting
Massachusetts uses specific evaluation meeting terminology.

### Maximum Feasible Benefit
Massachusetts standard is **maximum feasible benefit**, potentially higher than federal "appropriate" standard.

## Massachusetts Programs

### Early Intervention (EI)
- Birth to age 3
- Phone: (617) 624-5900
- Website: [mass.gov/ei](https://www.mass.gov/orgs/early-intervention-division)

### Collaborative Programs
- Regional educational collaboratives provide specialized services

## Parent Resources

### Federation for Children with Special Needs
- PTI for Massachusetts
- Phone: (617) 236-7210
- Website: [fcsn.org](https://fcsn.org/)

### Disability Law Center
- Free legal advocacy
- Phone: (617) 723-8455
- Website: [dlc-ma.org](https://www.dlc-ma.org/)
',
  ARRAY['Massachusetts', 'DESE', 'special education', 'strong protections'],
  ARRAY['https://www.doe.mass.edu/sped/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- MINNESOTA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'minnesota',
  'education',
  'Minnesota Special Education Overview',
  'mn-special-ed-overview',
  'Overview of special education in Minnesota, including MDE requirements and TSES system.',
  '# Minnesota Special Education Overview

## How Minnesota Implements IDEA

Minnesota implements federal IDEA through the **Minnesota Department of Education (MDE)** Division of Compliance and Assistance.

## Key Minnesota Agencies

### Minnesota Department of Education - Special Education
- State oversight
- Phone: (651) 582-8200
- Website: [education.mn.gov](https://education.mn.gov/MDE/dse/sped/)

### Department of Human Services - Disability Services Division
- Services for developmental disabilities
- Phone: (651) 431-4300

## Minnesota vs Federal Requirements

| Area | Federal IDEA | Minnesota |
|------|-------------|-----------|
| Evaluation Timeline | 60 days | **30 school days** ⚠️ |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **Birth-21** ⚠️ |

⚠️ Minnesota has a **30 school day** evaluation timeline and serves from birth.

## Minnesota Specific Terms

### TSES - Total Special Education System
Minnesota''s comprehensive special education data system.

### IIIP - Individual Interagency Intervention Plan
For students needing multi-agency coordination.

## Minnesota Programs

### Interagency Early Intervention System
- Birth to age 3
- Phone: (651) 582-8473

### Special Education Service Cooperatives
- Regional cooperatives support districts

### Special Education Aid
- Strong state funding formula

## Parent Resources

### PACER Center
- PTI for Minnesota (one of the original PTIs!)
- Phone: (952) 838-9000
- Website: [pacer.org](https://www.pacer.org/)
- National resources too!

### Minnesota Disability Law Center
- Free legal advocacy
- Phone: (612) 334-5970
- Website: [mndlc.org](https://www.mndlc.org/)
',
  ARRAY['Minnesota', 'MDE', 'special education', 'PACER'],
  ARRAY['https://education.mn.gov/MDE/dse/sped/', 'https://www.pacer.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- MISSISSIPPI
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'mississippi',
  'education',
  'Mississippi Special Education Overview',
  'ms-special-ed-overview',
  'Overview of special education in Mississippi, including MDE requirements and state programs.',
  '# Mississippi Special Education Overview

## How Mississippi Implements IDEA

Mississippi implements federal IDEA through the **Mississippi Department of Education (MDE)** Office of Special Education.

## Key Mississippi Agencies

### Mississippi Department of Education - Office of Special Education
- State oversight
- Phone: (601) 359-3498
- Website: [mdek12.org](https://www.mdek12.org/OSE)

### Department of Mental Health - Bureau of Intellectual and Developmental Disabilities
- Services for developmental disabilities
- Phone: (601) 359-1288

## Mississippi vs Federal Requirements

| Area | Federal IDEA | Mississippi |
|------|-------------|-------------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Mississippi Programs

### First Steps Early Intervention
- Birth to age 3
- Phone: 1-800-451-3903
- Website: [msdh.ms.gov](https://msdh.ms.gov/page/41,0,76,75.html)

### Mississippi Schools for the Deaf and Blind
- Statewide services

### Special Education Scholarship Program
- School choice for students with disabilities

## Parent Resources

### EMPOWER Mississippi
- PTI for Mississippi
- Phone: (601) 981-1618
- Website: [empowerms.org](https://www.empowerms.org/)

### Disability Rights Mississippi
- Free legal advocacy
- Phone: 1-800-772-4057
- Website: [drms.ms](https://www.drms.ms/)
',
  ARRAY['Mississippi', 'MDE', 'special education'],
  ARRAY['https://www.mdek12.org/OSE'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- MISSOURI
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'missouri',
  'education',
  'Missouri Special Education Overview',
  'mo-special-ed-overview',
  'Overview of special education in Missouri, including DESE requirements and RPDCs.',
  '# Missouri Special Education Overview

## How Missouri Implements IDEA

Missouri implements federal IDEA through the **Department of Elementary and Secondary Education (DESE)** Office of Special Education.

## Key Missouri Agencies

### Missouri DESE - Office of Special Education
- State oversight
- Phone: (573) 751-0699
- Website: [dese.mo.gov](https://dese.mo.gov/special-education)

### Division of Developmental Disabilities (DD)
- Services for developmental disabilities
- Phone: (573) 751-8676

## Missouri vs Federal Requirements

| Area | Federal IDEA | Missouri |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Missouri Structure

### RPDCs - Regional Professional Development Centers
Nine regions providing training and support for special education.

### Special School Districts
Some areas have dedicated special school districts (e.g., SSD of St. Louis County).

## Missouri Programs

### First Steps (Early Intervention)
- Birth to age 3
- Phone: 1-866-583-2392
- Website: [mofirststeps.com](https://www.mofirststeps.com/)

### Missouri Schools for the Severely Disabled (MSSD)
- Services for students with significant needs

## Parent Resources

### Missouri Parents Act (MPACT)
- PTI for Missouri
- Phone: 1-800-743-7634
- Website: [missouriparentsact.org](https://www.missouriparentsact.org/)

### Disability Rights Missouri (MO Protection & Advocacy)
- Free legal advocacy
- Phone: 1-800-392-8667
- Website: [moadvocacy.org](https://www.moadvocacy.org/)
',
  ARRAY['Missouri', 'DESE', 'special education', 'RPDC'],
  ARRAY['https://dese.mo.gov/special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- MONTANA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'montana',
  'education',
  'Montana Special Education Overview',
  'mt-special-ed-overview',
  'Overview of special education in Montana, including OPI requirements and rural considerations.',
  '# Montana Special Education Overview

## How Montana Implements IDEA

Montana implements federal IDEA through the **Office of Public Instruction (OPI)** Division of Educational Opportunity and Equity.

## Key Montana Agencies

### Montana OPI - Special Education
- State oversight
- Phone: (406) 444-5661
- Website: [opi.mt.gov](https://opi.mt.gov/Educators/Teaching-Learning/Special-Education)

### Developmental Disabilities Program
- Services for developmental disabilities
- Phone: (406) 444-2995

## Montana vs Federal Requirements

| Area | Federal IDEA | Montana |
|------|-------------|---------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-18** (extended to 21 available) ⚠️ |

⚠️ Montana''s base age is 3-18, with extension to 21 available.

## Rural Considerations

Montana is large and rural:
- Distance learning options
- Itinerant service providers
- Regional cooperatives

## Montana Programs

### Part C Early Intervention
- Birth to age 3
- Through Family Support Services
- Phone: (406) 444-5647

### Montana School for the Deaf and Blind
- Statewide services
- Outreach programs

### Special Education Cooperatives
- Regional cooperatives serve rural areas

## Parent Resources

### Parents Let''s Unite for Kids (PLUK)
- PTI for Montana
- Phone: 1-800-222-7585
- Website: [pluk.org](https://www.pluk.org/)

### Disability Rights Montana
- Free legal advocacy
- Phone: 1-800-245-4743
- Website: [disabilityrightsmt.org](https://www.disabilityrightsmt.org/)
',
  ARRAY['Montana', 'OPI', 'special education', 'rural'],
  ARRAY['https://opi.mt.gov/Educators/Teaching-Learning/Special-Education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- NEBRASKA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'nebraska',
  'education',
  'Nebraska Special Education Overview',
  'ne-special-ed-overview',
  'Overview of special education in Nebraska, including NDE requirements and ESUs.',
  '# Nebraska Special Education Overview

## How Nebraska Implements IDEA

Nebraska implements federal IDEA through the **Nebraska Department of Education (NDE)** Office of Special Education.

## Key Nebraska Agencies

### Nebraska Department of Education - Office of Special Education
- State oversight
- Phone: (402) 471-2471
- Website: [education.ne.gov](https://www.education.ne.gov/sped/)

### Division of Developmental Disabilities (DDD)
- Services for developmental disabilities
- Phone: (402) 471-3121

## Nebraska Structure

### ESUs - Educational Service Units
Nebraska has **17 ESUs** (Educational Service Units) providing:
- Special education support
- Staff training
- Cooperative services

## Nebraska vs Federal Requirements

| Area | Federal IDEA | Nebraska |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **45 school days** ⚠️ |
| MDT/IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **Birth-21** |

⚠️ Nebraska has a **45 school day** evaluation timeline.

### MDT - Multidisciplinary Team
Nebraska term for the evaluation team.

## Nebraska Programs

### Early Development Network (EDN)
- Birth to age 3
- Phone: (402) 471-2471
- Website: [edn.ne.gov](https://edn.ne.gov/)

### Nebraska Schools for the Deaf and Visually Impaired
- Statewide services

## Parent Resources

### PTI Nebraska
- Parent training center
- Phone: (402) 346-0525
- Website: [pti-nebraska.org](https://www.pti-nebraska.org/)

### Disability Rights Nebraska
- Free legal advocacy
- Phone: 1-800-422-6691
- Website: [disabilityrightsnebraska.org](https://www.disabilityrightsnebraska.org/)
',
  ARRAY['Nebraska', 'NDE', 'special education', 'ESU'],
  ARRAY['https://www.education.ne.gov/sped/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- Add glossary terms
INSERT INTO knowledge_glossary (term, abbreviation, definition, region_id, category_id) VALUES
('Admissions and Release Committee', 'ARC', 'Kentucky term for the IEP team.', 'kentucky', 'education'),
('Pupil Evaluation Team', 'PET', 'Maine term for the IEP team.', 'maine', 'education'),
('Educational Service Unit', 'ESU', 'Nebraska regional service agencies supporting school districts.', 'nebraska', 'education'),
('Regional Professional Development Center', 'RPDC', 'Missouri regional centers providing special education training and support.', 'missouri', 'education')
ON CONFLICT DO NOTHING;
