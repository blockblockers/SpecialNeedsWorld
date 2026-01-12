-- =====================================================
-- MORE STATES - Batch 3
-- Nevada, New Hampshire, New Jersey, New Mexico,
-- North Dakota, Oklahoma, Oregon, Rhode Island,
-- South Carolina, South Dakota
-- =====================================================

-- Add regions
INSERT INTO knowledge_regions (id, name, abbreviation, type, emoji, sort_order, is_active) VALUES
  ('nevada', 'Nevada', 'NV', 'state', '🎰', 40, TRUE),
  ('new-hampshire', 'New Hampshire', 'NH', 'state', '🏔️', 41, TRUE),
  ('new-jersey', 'New Jersey', 'NJ', 'state', '🏖️', 42, TRUE),
  ('new-mexico', 'New Mexico', 'NM', 'state', '🌵', 43, TRUE),
  ('north-dakota', 'North Dakota', 'ND', 'state', '🦬', 44, TRUE),
  ('oklahoma', 'Oklahoma', 'OK', 'state', '🤠', 45, TRUE),
  ('oregon', 'Oregon', 'OR', 'state', '🌲', 46, TRUE),
  ('rhode-island', 'Rhode Island', 'RI', 'state', '⛵', 47, TRUE),
  ('south-carolina', 'South Carolina', 'SC', 'state', '🌴', 48, TRUE),
  ('south-dakota', 'South Dakota', 'SD', 'state', '🗿', 49, TRUE)
ON CONFLICT (id) DO UPDATE SET is_active = TRUE;


-- =====================================================
-- NEVADA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'nevada',
  'education',
  'Nevada Special Education Overview',
  'nv-special-ed-overview',
  'Overview of special education in Nevada, including NDE requirements and state programs.',
  '# Nevada Special Education Overview

## How Nevada Implements IDEA

Nevada implements federal IDEA through the **Nevada Department of Education (NDE)** Office for a Safe and Respectful Learning Environment.

## Key Nevada Agencies

### Nevada Department of Education - Special Education
- State oversight
- Phone: (775) 687-9171
- Website: [doe.nv.gov](https://doe.nv.gov/Special_Education/Home/)

### Aging and Disability Services Division (ADSD)
- Services for developmental disabilities
- Phone: (775) 687-4210

## Nevada vs Federal Requirements

| Area | Federal IDEA | Nevada |
|------|-------------|--------|
| Evaluation Timeline | 60 days | **45 school days** ⚠️ |
| IEP Meeting | 30 days | **30 calendar days** |
| Age Range | 3-21 | **Birth-22** |

⚠️ Nevada has a **45 school day** evaluation timeline.

## Nevada Programs

### Early Intervention Services
- Birth to age 3
- Through ADSD
- Phone: (775) 687-4210

### Nevada Opportunity Scholarship
- School choice program

## Parent Resources

### Nevada PEP (Parents Encouraging Parents)
- PTI for Nevada
- Phone: 1-800-216-5188
- Website: [nvpep.org](https://www.nvpep.org/)

### Nevada Disability Advocacy and Law Center
- Free legal advocacy
- Phone: 1-888-349-3843
- Website: [ndalc.org](https://www.ndalc.org/)
',
  ARRAY['Nevada', 'NDE', 'special education'],
  ARRAY['https://doe.nv.gov/Special_Education/Home/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- NEW HAMPSHIRE
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'new-hampshire',
  'education',
  'New Hampshire Special Education Overview',
  'nh-special-ed-overview',
  'Overview of special education in New Hampshire, including DOE requirements and state programs.',
  '# New Hampshire Special Education Overview

## How New Hampshire Implements IDEA

New Hampshire implements federal IDEA through the **NH Department of Education** Bureau of Special Education.

## Key New Hampshire Agencies

### NH Department of Education - Bureau of Special Education
- State oversight
- Phone: (603) 271-3741
- Website: [education.nh.gov](https://www.education.nh.gov/who-we-are/division-of-learner-support/bureau-of-special-education)

### Bureau of Developmental Services
- Services for developmental disabilities
- Phone: (603) 271-5034

## New Hampshire vs Federal Requirements

| Area | Federal IDEA | New Hampshire |
|------|-------------|---------------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## New Hampshire Programs

### Family-Centered Early Supports & Services
- Birth to age 3
- Phone: 1-800-852-3345

### Special Education Dispute Resolution
- State-level resolution options

## Parent Resources

### Parent Information Center (PIC)
- PTI for New Hampshire
- Phone: (603) 224-7005
- Website: [picnh.org](https://www.picnh.org/)

### Disabilities Rights Center
- Free legal advocacy
- Phone: (603) 228-0432
- Website: [drcnh.org](https://www.drcnh.org/)
',
  ARRAY['New Hampshire', 'DOE', 'special education'],
  ARRAY['https://www.education.nh.gov/who-we-are/division-of-learner-support/bureau-of-special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- NEW JERSEY
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'new-jersey',
  'education',
  'New Jersey Special Education Overview',
  'nj-special-ed-overview',
  'Overview of special education in New Jersey, including NJDOE requirements and CST process.',
  '# New Jersey Special Education Overview

## How New Jersey Implements IDEA

New Jersey implements federal IDEA through the **NJ Department of Education (NJDOE)** Office of Special Education.

## Key New Jersey Agencies

### NJ Department of Education - Office of Special Education
- State oversight
- Phone: (609) 376-9060
- Website: [nj.gov/education](https://www.nj.gov/education/specialed/)

### Division of Developmental Disabilities (DDD)
- Services for developmental disabilities
- Phone: 1-800-832-9173

## New Jersey Specific Terms

### CST - Child Study Team
New Jersey requires a **Child Study Team** for evaluations:
- School psychologist
- Learning disabilities teacher-consultant
- School social worker

## New Jersey vs Federal Requirements

| Area | Federal IDEA | New Jersey |
|------|-------------|------------|
| Evaluation Timeline | 60 days | **90 calendar days** ⚠️ |
| IEP Meeting | 30 days | **90 days from referral** |
| Age Range | 3-21 | **3-21** |

⚠️ New Jersey has a **90 day** timeline from referral.

## New Jersey Programs

### Early Intervention System (EIS)
- Birth to age 3
- Phone: 1-888-653-4463
- Website: [nj.gov/health/fhs/eis](https://www.nj.gov/health/fhs/eis/)

### Garden State Scholarships
- School choice scholarship program

## Parent Resources

### SPAN Parent Advocacy Network
- PTI for New Jersey
- Phone: 1-800-654-7726
- Website: [spanadvocacy.org](https://www.spanadvocacy.org/)

### Disability Rights New Jersey
- Free legal advocacy
- Phone: 1-800-922-7233
- Website: [drnj.org](https://www.drnj.org/)
',
  ARRAY['New Jersey', 'NJDOE', 'special education', 'CST'],
  ARRAY['https://www.nj.gov/education/specialed/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- NEW MEXICO
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'new-mexico',
  'education',
  'New Mexico Special Education Overview',
  'nm-special-ed-overview',
  'Overview of special education in New Mexico, including PED requirements and state programs.',
  '# New Mexico Special Education Overview

## How New Mexico Implements IDEA

New Mexico implements federal IDEA through the **Public Education Department (PED)** Special Education Bureau.

## Key New Mexico Agencies

### NM Public Education Department - Special Education Bureau
- State oversight
- Phone: (505) 827-1457
- Website: [webnew.ped.state.nm.us](https://webnew.ped.state.nm.us/bureaus/special-education/)

### Developmental Disabilities Planning Council
- Services coordination
- Phone: (505) 841-4519

## New Mexico vs Federal Requirements

| Area | Federal IDEA | New Mexico |
|------|-------------|------------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-22** |

## New Mexico Programs

### Family Infant Toddler (FIT) Program
- Birth to age 3
- Phone: 1-877-696-1472
- Website: [nmhealth.org/fit](https://nmhealth.org/about/ddsd/pgsv/fit/)

### Regional Education Cooperatives (RECs)
- Support for rural districts

## Parent Resources

### Parents Reaching Out (PRO)
- PTI for New Mexico
- Phone: 1-800-524-5176
- Website: [parentsreachingout.org](https://www.parentsreachingout.org/)

### Disability Rights New Mexico
- Free legal advocacy
- Phone: 1-800-432-4682
- Website: [drnm.org](https://www.drnm.org/)
',
  ARRAY['New Mexico', 'PED', 'special education', 'FIT'],
  ARRAY['https://webnew.ped.state.nm.us/bureaus/special-education/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- NORTH DAKOTA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'north-dakota',
  'education',
  'North Dakota Special Education Overview',
  'nd-special-ed-overview',
  'Overview of special education in North Dakota, including DPI requirements and rural considerations.',
  '# North Dakota Special Education Overview

## How North Dakota Implements IDEA

North Dakota implements federal IDEA through the **Department of Public Instruction (DPI)** Office of Special Education.

## Key North Dakota Agencies

### ND Department of Public Instruction - Office of Special Education
- State oversight
- Phone: (701) 328-2277
- Website: [nd.gov/dpi](https://www.nd.gov/dpi/education-programs/special-education)

### Developmental Disabilities Division
- Services for developmental disabilities
- Phone: (701) 328-8930

## North Dakota vs Federal Requirements

| Area | Federal IDEA | North Dakota |
|------|-------------|--------------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Rural Considerations

North Dakota is largely rural:
- Multi-district special education units
- Distance-based services
- Regional coordination

## North Dakota Programs

### Early Intervention Program
- Birth to age 3
- Through Human Services
- Phone: 1-800-755-8529

### Special Education Units
- Regional cooperatives serve multiple districts

## Parent Resources

### Pathfinder Parent Center
- PTI for North Dakota
- Phone: 1-800-245-5840
- Website: [pathfinder-nd.org](https://www.pathfinder-nd.org/)

### Protection & Advocacy Project
- Free legal advocacy
- Phone: 1-800-472-2670
- Website: [ndpanda.org](https://www.ndpanda.org/)
',
  ARRAY['North Dakota', 'DPI', 'special education', 'rural'],
  ARRAY['https://www.nd.gov/dpi/education-programs/special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- OKLAHOMA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'oklahoma',
  'education',
  'Oklahoma Special Education Overview',
  'ok-special-ed-overview',
  'Overview of special education in Oklahoma, including SDE requirements and state programs.',
  '# Oklahoma Special Education Overview

## How Oklahoma Implements IDEA

Oklahoma implements federal IDEA through the **Oklahoma State Department of Education (OSDE)** Special Education Services.

## Key Oklahoma Agencies

### Oklahoma State Department of Education - Special Education Services
- State oversight
- Phone: (405) 521-3351
- Website: [sde.ok.gov](https://sde.ok.gov/special-education)

### Department of Human Services - Developmental Disabilities Services
- Services for developmental disabilities
- Phone: (405) 521-3571

## Oklahoma vs Federal Requirements

| Area | Federal IDEA | Oklahoma |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **45 school days** ⚠️ |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

⚠️ Oklahoma has a **45 school day** evaluation timeline.

## Oklahoma Programs

### SoonerStart (Early Intervention)
- Birth to age 3
- Phone: 1-800-426-2747
- Website: [sde.ok.gov/soonerstart](https://sde.ok.gov/soonerstart)

### Oklahoma School for the Deaf / Blind
- Statewide services

### Lindsey Nicole Henry Scholarship
- School choice for students with IEPs

## Parent Resources

### Oklahoma Parents Center
- PTI for Oklahoma
- Phone: (405) 271-5072
- Website: [okparents.org](https://www.okparents.org/)

### Disability Law Center
- Free legal advocacy
- Phone: 1-800-880-7755
- Website: [okdlc.org](https://www.okdlc.org/)
',
  ARRAY['Oklahoma', 'OSDE', 'special education', 'SoonerStart'],
  ARRAY['https://sde.ok.gov/special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- OREGON
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'oregon',
  'education',
  'Oregon Special Education Overview',
  'or-special-ed-overview',
  'Overview of special education in Oregon, including ODE requirements and ESDs.',
  '# Oregon Special Education Overview

## How Oregon Implements IDEA

Oregon implements federal IDEA through the **Oregon Department of Education (ODE)** Office of Enhancing Student Opportunities.

## Key Oregon Agencies

### Oregon Department of Education - Special Education
- State oversight
- Phone: (503) 947-5600
- Website: [oregon.gov/ode](https://www.oregon.gov/ode/students-and-family/specialeducation/Pages/default.aspx)

### Office of Developmental Disabilities Services (ODDS)
- Services for developmental disabilities
- Phone: 1-800-282-8096

## Oregon Structure

### ESDs - Education Service Districts
Oregon has **19 ESDs** providing special education support and services.

## Oregon vs Federal Requirements

| Area | Federal IDEA | Oregon |
|------|-------------|--------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Oregon Programs

### Early Intervention/Early Childhood Special Education (EI/ECSE)
- Birth to age 5
- Through ESDs
- Phone varies by region

### Oregon School for the Deaf
- Statewide services

## Parent Resources

### Oregon Family to Family Health Information Center
- PTI for Oregon
- Phone: 1-855-323-6744
- Website: [oregonfamily2family.org](https://oregonfamily2family.org/)

### Disability Rights Oregon
- Free legal advocacy
- Phone: 1-800-452-1694
- Website: [droregon.org](https://www.droregon.org/)
',
  ARRAY['Oregon', 'ODE', 'special education', 'ESD'],
  ARRAY['https://www.oregon.gov/ode/students-and-family/specialeducation/Pages/default.aspx'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- RHODE ISLAND
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'rhode-island',
  'education',
  'Rhode Island Special Education Overview',
  'ri-special-ed-overview',
  'Overview of special education in Rhode Island, including RIDE requirements and state programs.',
  '# Rhode Island Special Education Overview

## How Rhode Island Implements IDEA

Rhode Island implements federal IDEA through the **Rhode Island Department of Education (RIDE)** Office of Student, Community & Academic Supports.

## Key Rhode Island Agencies

### Rhode Island Department of Education - Special Education
- State oversight
- Phone: (401) 222-4600
- Website: [ride.ri.gov](https://www.ride.ri.gov/StudentsFamilies/SpecialEducation.aspx)

### Division of Developmental Disabilities
- Services for developmental disabilities
- Phone: (401) 462-3421

## Rhode Island vs Federal Requirements

| Area | Federal IDEA | Rhode Island |
|------|-------------|--------------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Rhode Island Programs

### Early Intervention Program
- Birth to age 3
- Phone: (401) 462-0318
- Website: [health.ri.gov/ei](https://health.ri.gov/programs/detail.php?pgm_id=1095)

### Davies Career and Technical High School
- Regional career/technical education

## Parent Resources

### Rhode Island Parent Information Network (RIPIN)
- PTI for Rhode Island
- Phone: (401) 270-0101
- Website: [ripin.org](https://www.ripin.org/)

### Disability Rights Rhode Island
- Free legal advocacy
- Phone: (401) 831-3150
- Website: [drri.org](https://www.drri.org/)
',
  ARRAY['Rhode Island', 'RIDE', 'special education'],
  ARRAY['https://www.ride.ri.gov/StudentsFamilies/SpecialEducation.aspx'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- SOUTH CAROLINA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'south-carolina',
  'education',
  'South Carolina Special Education Overview',
  'sc-special-ed-overview',
  'Overview of special education in South Carolina, including SCDE requirements and state programs.',
  '# South Carolina Special Education Overview

## How South Carolina Implements IDEA

South Carolina implements federal IDEA through the **SC Department of Education (SCDE)** Office of Special Education Services.

## Key South Carolina Agencies

### SC Department of Education - Office of Special Education Services
- State oversight
- Phone: (803) 734-8224
- Website: [ed.sc.gov](https://ed.sc.gov/instruction/special-education-services/)

### Department of Disabilities and Special Needs (DDSN)
- Services for developmental disabilities
- Phone: (803) 898-9600

## South Carolina vs Federal Requirements

| Area | Federal IDEA | South Carolina |
|------|-------------|----------------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## South Carolina Programs

### BabyNet (Early Intervention)
- Birth to age 3
- Phone: 1-800-868-0404
- Website: [scdhhs.gov/babynet](https://www.scdhhs.gov/babynet)

### SC School for the Deaf and Blind
- Statewide services

### Exceptional SC
- School choice for special needs

## Parent Resources

### Family Connection of South Carolina
- PTI for South Carolina
- Phone: 1-800-578-8750
- Website: [familyconnectionsc.org](https://www.familyconnectionsc.org/)

### Protection & Advocacy for People with Disabilities
- Free legal advocacy
- Phone: 1-866-275-7273
- Website: [pandasc.org](https://www.pandasc.org/)
',
  ARRAY['South Carolina', 'SCDE', 'special education', 'BabyNet'],
  ARRAY['https://ed.sc.gov/instruction/special-education-services/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- SOUTH DAKOTA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'south-dakota',
  'education',
  'South Dakota Special Education Overview',
  'sd-special-ed-overview',
  'Overview of special education in South Dakota, including DOE requirements and rural considerations.',
  '# South Dakota Special Education Overview

## How South Dakota Implements IDEA

South Dakota implements federal IDEA through the **SD Department of Education** Office of Special Education.

## Key South Dakota Agencies

### SD Department of Education - Office of Special Education
- State oversight
- Phone: (605) 773-3678
- Website: [doe.sd.gov](https://doe.sd.gov/specialed/)

### Division of Developmental Disabilities
- Services for developmental disabilities
- Phone: (605) 773-3438

## South Dakota vs Federal Requirements

| Area | Federal IDEA | South Dakota |
|------|-------------|--------------|
| Evaluation Timeline | 60 days | **25 school days** ⚠️ |
| IEP Meeting | 30 days | **Within evaluation timeline** |
| Age Range | 3-21 | **Birth-21** |

⚠️ South Dakota has a very short **25 school day** evaluation timeline!

## Rural Considerations

South Dakota is largely rural:
- Educational cooperatives
- Distance services
- Multi-district coordination

## South Dakota Programs

### Birth to Three Program
- Early intervention
- Phone: 1-800-305-3064
- Website: [doe.sd.gov/birthto3](https://doe.sd.gov/birthto3/)

### South Dakota School for the Deaf / Blind
- Statewide services

## Parent Resources

### South Dakota Parent Connection
- PTI for South Dakota
- Phone: 1-800-640-4553
- Website: [sdparent.org](https://www.sdparent.org/)

### Disability Rights South Dakota
- Free legal advocacy
- Phone: 1-800-658-4782
- Website: [drsdlaw.org](https://www.drsdlaw.org/)
',
  ARRAY['South Dakota', 'DOE', 'special education', 'rural'],
  ARRAY['https://doe.sd.gov/specialed/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- Add glossary terms
INSERT INTO knowledge_glossary (term, abbreviation, definition, region_id, category_id) VALUES
('Child Study Team', 'CST', 'New Jersey''s multidisciplinary team that conducts evaluations for special education.', 'new-jersey', 'education'),
('Education Service District', 'ESD', 'Oregon regional service agencies supporting school districts.', 'oregon', 'education')
ON CONFLICT DO NOTHING;
