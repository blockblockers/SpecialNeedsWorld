-- =====================================================
-- ADDITIONAL STATES - Part 2
-- Illinois, Ohio, Pennsylvania, Georgia, North Carolina, 
-- Michigan, Washington, Colorado
-- =====================================================

-- First, add any missing regions and activate them
INSERT INTO knowledge_regions (id, name, abbreviation, type, emoji, sort_order, is_active)
VALUES 
  ('illinois', 'Illinois', 'IL', 'state', '🌽', 11, TRUE),
  ('ohio', 'Ohio', 'OH', 'state', '🌰', 12, TRUE),
  ('pennsylvania', 'Pennsylvania', 'PA', 'state', '🔔', 13, TRUE),
  ('georgia', 'Georgia', 'GA', 'state', '🍑', 14, TRUE),
  ('north-carolina', 'North Carolina', 'NC', 'state', '🌲', 15, TRUE),
  ('michigan', 'Michigan', 'MI', 'state', '🚗', 16, TRUE),
  ('washington', 'Washington', 'WA', 'state', '🌲', 17, TRUE),
  ('colorado', 'Colorado', 'CO', 'state', '🏔️', 18, TRUE)
ON CONFLICT (id) DO UPDATE SET is_active = TRUE;

-- Update existing inactive states
UPDATE knowledge_regions SET is_active = TRUE WHERE id IN ('illinois', 'ohio', 'pennsylvania', 'georgia', 'north-carolina', 'michigan');


-- =====================================================
-- ILLINOIS
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'illinois',
  'education',
  'Illinois Special Education Overview',
  'il-special-ed-overview',
  'Overview of special education in Illinois, including ISBE requirements and state-specific programs.',
  '# Illinois Special Education Overview

## How Illinois Implements IDEA

Illinois implements federal IDEA through the **Illinois State Board of Education (ISBE)** and local school districts.

## Key Illinois Agencies

### Illinois State Board of Education (ISBE)
- State oversight of special education
- Phone: (217) 782-4321
- Website: [isbe.net](https://www.isbe.net/Pages/Special-Education.aspx)

### Division of Specialized Care for Children (DSCC)
- Medical services for children with special health needs
- Phone: 1-800-322-3722

## Illinois vs Federal Requirements

| Area | Federal IDEA | Illinois |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days | **Same** |
| Age Range | 3-21 | **3-22** (can stay through school year of 22nd birthday) |

## Illinois Specific Programs

### Early Intervention (EI)
- Birth to age 3
- Through local Child and Family Connections offices
- Phone: 1-800-323-4769

### Illinois School for the Deaf/Visually Impaired
- State schools available
- Outreach services statewide

## Special Education Cooperatives

Many Illinois districts form **cooperatives** to share:
- Specialized staff
- Programs
- Resources

Ask your district which cooperative they belong to.

## Parent Resources

### Illinois Alliance of Administrators of Special Education
- [iaase.org](https://www.iaase.org/)

### Family Resource Center on Disabilities
- PTI for Illinois
- Phone: (312) 939-3513
- Website: [frcd.org](https://www.frcd.org/)

### Equip for Equality
- Free legal advocacy
- Phone: 1-800-537-2632
- Website: [equipforequality.org](https://www.equipforequality.org/)
',
  ARRAY['Illinois', 'ISBE', 'special education'],
  ARRAY['https://www.isbe.net/Pages/Special-Education.aspx', 'https://www.equipforequality.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- OHIO
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'ohio',
  'education',
  'Ohio Special Education Overview',
  'oh-special-ed-overview',
  'Overview of special education in Ohio, including ODE requirements and County Boards of DD.',
  '# Ohio Special Education Overview

## How Ohio Implements IDEA

Ohio implements federal IDEA through the **Ohio Department of Education (ODE)** Office for Exceptional Children.

## Key Ohio Agencies

### Ohio Department of Education - Office for Exceptional Children
- State oversight
- Phone: (877) 644-6338
- Website: [education.ohio.gov](https://education.ohio.gov/Topics/Special-Education)

### County Boards of Developmental Disabilities
- Services for people with developmental disabilities
- 88 county boards across Ohio
- Early intervention and adult services

## Ohio vs Federal Requirements

| Area | Federal IDEA | Ohio |
|------|-------------|------|
| Evaluation Timeline | 60 days | **60 days** |
| ETR (Evaluation Team Report) | IEP Team | **ETR Team then IEP Team** |
| Age Range | 3-21 | **3-22** |

## Ohio Specific Terms

### ETR - Evaluation Team Report
In Ohio, evaluations result in an **ETR** (Evaluation Team Report) that determines eligibility. This is separate from the IEP meeting.

### Operating Standards
Ohio has detailed **Operating Standards** for special education that districts must follow.

## Ohio Specific Programs

### Help Me Grow (Early Intervention)
- Birth to age 3
- Through County DD Boards
- Phone: 1-800-755-GROW (4769)

### Jon Peterson Special Needs Scholarship
- School choice program
- Up to $27,000+ per year
- For students with IEPs

### Autism Scholarship Program
- For students with autism
- Private provider services

## Parent Resources

### Ohio Coalition for the Education of Children with Disabilities (OCECD)
- PTI for Ohio
- Phone: (614) 431-1307
- Website: [ocecd.org](https://www.ocecd.org/)

### Disability Rights Ohio
- Free legal advocacy
- Phone: 1-800-282-9181
- Website: [disabilityrightsohio.org](https://www.disabilityrightsohio.org/)
',
  ARRAY['Ohio', 'ODE', 'special education', 'ETR', 'County DD'],
  ARRAY['https://education.ohio.gov/Topics/Special-Education', 'https://www.ocecd.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- PENNSYLVANIA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'pennsylvania',
  'education',
  'Pennsylvania Special Education Overview',
  'pa-special-ed-overview',
  'Overview of special education in Pennsylvania, including PDE requirements and Intermediate Units.',
  '# Pennsylvania Special Education Overview

## How Pennsylvania Implements IDEA

Pennsylvania implements federal IDEA through the **Pennsylvania Department of Education (PDE)** Bureau of Special Education.

## Key Pennsylvania Agencies

### Pennsylvania Department of Education - Bureau of Special Education
- State oversight
- Phone: (717) 783-6913
- Website: [pde.pa.gov](https://www.education.pa.gov/K-12/Special%20Education/Pages/default.aspx)

### Office of Child Development and Early Learning (OCDEL)
- Early intervention services
- Preschool programs

## Pennsylvania vs Federal Requirements

| Area | Federal IDEA | Pennsylvania |
|------|-------------|--------------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| ER (Evaluation Report) | Evaluation | **ER then IEP** |
| NOREP | Prior Written Notice | **NOREP** required |
| Age Range | 3-21 | **3-21** |

## Pennsylvania Specific Terms

### ER - Evaluation Report
Pennsylvania calls the evaluation document an **ER** (Evaluation Report).

### NOREP - Notice of Recommended Educational Placement
The **NOREP** is Pennsylvania''s prior written notice AND consent document. You must sign or reject the NOREP.

### IU - Intermediate Unit
Pennsylvania has **29 Intermediate Units** that support school districts with:
- Special education services
- Early intervention
- Training

## Pennsylvania Programs

### Early Intervention
- **Infant/Toddler (birth-3)**: Through county EI programs
- **Preschool (3-5)**: Through Intermediate Units

### PA Elwyn (PEAL) Center
- Training and information for families

## Parent Resources

### PEAL Center
- PTI for Pennsylvania
- Phone: (412) 281-4404
- Website: [pealcenter.org](https://www.pealcenter.org/)

### Disability Rights Pennsylvania
- Free legal advocacy
- Phone: 1-800-692-7443
- Website: [disabilityrightspa.org](https://www.disabilityrightspa.org/)

### Parent Education and Advocacy Leadership (PEAL)
- Workshops and support
- Website: [pealcenter.org](https://www.pealcenter.org/)
',
  ARRAY['Pennsylvania', 'PDE', 'special education', 'NOREP', 'IU'],
  ARRAY['https://www.education.pa.gov/K-12/Special%20Education/Pages/default.aspx', 'https://www.pealcenter.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- GEORGIA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'georgia',
  'education',
  'Georgia Special Education Overview',
  'ga-special-ed-overview',
  'Overview of special education in Georgia, including GaDOE requirements and state programs.',
  '# Georgia Special Education Overview

## How Georgia Implements IDEA

Georgia implements federal IDEA through the **Georgia Department of Education (GaDOE)** Division for Special Education Services.

## Key Georgia Agencies

### Georgia Department of Education - Special Education
- State oversight
- Phone: (404) 656-2800
- Website: [gadoe.org](https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/default.aspx)

### Department of Behavioral Health and Developmental Disabilities (DBHDD)
- Services for developmental disabilities
- Adult services

## Georgia vs Federal Requirements

| Area | Federal IDEA | Georgia |
|------|-------------|---------|
| Evaluation Timeline | 60 days | **60 calendar days** from consent |
| IEP Implementation | ASAP | **Same** |
| Age Range | 3-21 | **3-22** |

## Georgia Specific Programs

### Babies Can''t Wait (Early Intervention)
- Birth to age 3
- Through public health departments
- Phone: (404) 651-8890

### Georgia Special Needs Scholarship (GSNS)
- School choice for students with IEPs
- For students who attended public school
- Covers private school tuition

### Georgia GOAL Scholarship
- Tax credit scholarship
- Private school choice option

## Parent Resources

### Parent to Parent of Georgia
- PTI for Georgia
- Phone: 1-800-229-2038
- Website: [p2pga.org](https://www.p2pga.org/)

### Georgia Advocacy Office
- Free legal advocacy
- Phone: 1-800-537-2329
- Website: [thegao.org](https://thegao.org/)

### Georgia Parent Infant Network for Educational Services (Georgia PINES)
- Early intervention support
',
  ARRAY['Georgia', 'GaDOE', 'special education', 'Babies Cant Wait'],
  ARRAY['https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/default.aspx', 'https://www.p2pga.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- NORTH CAROLINA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'north-carolina',
  'education',
  'North Carolina Special Education Overview',
  'nc-special-ed-overview',
  'Overview of special education in North Carolina, including NCDPI requirements and state programs.',
  '# North Carolina Special Education Overview

## How North Carolina Implements IDEA

North Carolina implements federal IDEA through the **NC Department of Public Instruction (NCDPI)** Exceptional Children Division.

## Key North Carolina Agencies

### NC Department of Public Instruction - Exceptional Children Division
- State oversight
- Phone: (919) 807-3969
- Website: [dpi.nc.gov/ec](https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children)

### NC Division of Health Benefits (Medicaid)
- Healthcare coverage
- Website: [ncdhhs.gov](https://www.ncdhhs.gov/)

## North Carolina vs Federal Requirements

| Area | Federal IDEA | North Carolina |
|------|-------------|----------------|
| Evaluation Timeline | 60 days | **90 days** from referral ⚠️ |
| IEP Meeting | 30 days | **Same** |
| Age Range | 3-21 | **3-21** |

⚠️ **Note**: NC has a **90-day** evaluation timeline from referral (not consent).

## North Carolina Programs

### NC Infant-Toddler Program (ITP)
- Birth to age 3
- Through local CDSA offices
- Phone: 1-800-737-3028

### Disability Rights NC
- Opportunity Scholarship
- Special Education Scholarship Grants

## Parent Resources

### Exceptional Children''s Assistance Center (ECAC)
- PTI for North Carolina
- Phone: 1-800-962-6817
- Website: [ecac-parentcenter.org](https://www.ecac-parentcenter.org/)

### Disability Rights North Carolina
- Free legal advocacy
- Phone: 1-877-235-4210
- Website: [disabilityrightsnc.org](https://disabilityrightsnc.org/)
',
  ARRAY['North Carolina', 'NCDPI', 'special education', 'EC'],
  ARRAY['https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children', 'https://www.ecac-parentcenter.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- MICHIGAN
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'michigan',
  'education',
  'Michigan Special Education Overview',
  'mi-special-ed-overview',
  'Overview of special education in Michigan, including MDE requirements and ISDs.',
  '# Michigan Special Education Overview

## How Michigan Implements IDEA

Michigan implements federal IDEA through the **Michigan Department of Education (MDE)** Office of Special Education.

## Key Michigan Agencies

### Michigan Department of Education - Office of Special Education
- State oversight
- Phone: (517) 373-0923
- Website: [michigan.gov/mde](https://www.michigan.gov/mde/services/special-education)

### Intermediate School Districts (ISDs)
- Regional support for local districts
- Special education programs
- 56 ISDs across Michigan

## Michigan vs Federal Requirements

| Area | Federal IDEA | Michigan |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **30 school days** ⚠️ |
| IEP Development | 30 days | **Same** |
| IEPT | IEP Team | **IEPT (Individualized Education Program Team)** |

⚠️ **Note**: Michigan has a shorter **30 school day** evaluation timeline!

## Michigan Specific Terms

### IEPT - Individualized Education Program Team
Michigan calls the IEP team the **IEPT**.

### MET - Multidisciplinary Evaluation Team
Conducts evaluations and determines eligibility.

### ISD - Intermediate School District
Regional educational service agencies that support local districts.

## Michigan Programs

### Early On Michigan (Early Intervention)
- Birth to age 3
- Through local ISDs
- Phone: 1-800-327-5966

### Michigan Administrative Rules for Special Education (MARSE)
- State regulations
- Often more detailed than federal

## Parent Resources

### Michigan Alliance for Families
- PTI for Michigan
- Phone: 1-800-552-4821
- Website: [michiganallianceforfamilies.org](https://www.michiganallianceforfamilies.org/)

### Michigan Protection & Advocacy Service (MPAS)
- Free legal advocacy
- Phone: 1-800-288-5923
- Website: [mpas.org](https://www.mpas.org/)
',
  ARRAY['Michigan', 'MDE', 'special education', 'ISD', 'IEPT'],
  ARRAY['https://www.michigan.gov/mde/services/special-education', 'https://www.michiganallianceforfamilies.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- WASHINGTON
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'washington',
  'education',
  'Washington Special Education Overview',
  'wa-special-ed-overview',
  'Overview of special education in Washington State, including OSPI requirements and state programs.',
  '# Washington State Special Education Overview

## How Washington Implements IDEA

Washington implements federal IDEA through the **Office of Superintendent of Public Instruction (OSPI)** Special Education department.

## Key Washington Agencies

### OSPI - Special Education
- State oversight
- Phone: (360) 725-6075
- Website: [ospi.k12.wa.us](https://ospi.k12.wa.us/student-success/special-education)

### Developmental Disabilities Administration (DDA)
- Services for developmental disabilities
- Through DSHS

## Washington vs Federal Requirements

| Area | Federal IDEA | Washington |
|------|-------------|------------|
| Evaluation Timeline | 60 days | **35 school days** ⚠️ |
| Eligibility Meeting | Part of 60 days | Within **35 school days** |
| IEP Development | 30 days | **30 calendar days** |

⚠️ **Note**: Washington has a **35 school day** evaluation timeline!

## Washington Programs

### Early Support for Infants and Toddlers (ESIT)
- Birth to age 3
- Through local Family Resources Coordinators
- Website: [dcyf.wa.gov/esit](https://www.dcyf.wa.gov/services/child-development-supports/esit)

### Educational Service Districts (ESDs)
- Regional support agencies
- 9 ESDs across Washington

## Parent Resources

### PAVE (Partnerships for Action, Voices for Empowerment)
- PTI for Washington
- Phone: 1-800-572-7368
- Website: [wapave.org](https://wapave.org/)

### Disability Rights Washington
- Free legal advocacy
- Phone: 1-800-562-2702
- Website: [disabilityrightswa.org](https://www.disabilityrightswa.org/)

### Open Doors for Multicultural Families
- Culturally responsive support
- Phone: (253) 216-4479
',
  ARRAY['Washington', 'OSPI', 'special education', 'ESIT'],
  ARRAY['https://ospi.k12.wa.us/student-success/special-education', 'https://wapave.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- COLORADO
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'colorado',
  'education',
  'Colorado Special Education Overview',
  'co-special-ed-overview',
  'Overview of special education in Colorado, including CDE requirements and Administrative Units.',
  '# Colorado Special Education Overview

## How Colorado Implements IDEA

Colorado implements federal IDEA through the **Colorado Department of Education (CDE)** Exceptional Student Services Unit.

## Key Colorado Agencies

### Colorado Department of Education - Exceptional Student Services
- State oversight
- Phone: (303) 866-6694
- Website: [cde.state.co.us](https://www.cde.state.co.us/cdesped)

### Department of Health Care Policy & Financing
- Medicaid services
- Website: [colorado.gov/hcpf](https://hcpf.colorado.gov/)

## Colorado vs Federal Requirements

| Area | Federal IDEA | Colorado |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days | **30 calendar days** |
| Administrative Unit | School District | **AU may cover multiple districts** |

## Colorado Structure

### Administrative Units (AUs)
Colorado organizes special education through **Administrative Units** which may include:
- Single school districts
- Multiple districts (BOCES)
- State agencies

### BOCES - Boards of Cooperative Educational Services
Regional cooperatives that share special education services.

## Colorado Programs

### Early Intervention Colorado
- Birth to age 3
- Through Community Centered Boards
- Phone: 1-888-777-4041

### Community Centered Boards (CCBs)
- Services for developmental disabilities
- 20 CCBs across Colorado

## Parent Resources

### PEAK Parent Center
- PTI for Colorado
- Phone: 1-800-284-0251
- Website: [peakparent.org](https://www.peakparent.org/)

### Disability Law Colorado
- Free legal advocacy
- Phone: 1-800-288-1376
- Website: [disabilitylawco.org](https://disabilitylawco.org/)

### The Arc of Colorado
- Support for I/DD community
- Website: [thearcofco.org](https://thearcofco.org/)
',
  ARRAY['Colorado', 'CDE', 'special education', 'AU', 'CCB'],
  ARRAY['https://www.cde.state.co.us/cdesped', 'https://www.peakparent.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- ADD GLOSSARY TERMS FOR NEW STATES
-- =====================================================

INSERT INTO knowledge_glossary (term, abbreviation, definition, region_id, category_id) VALUES
('Evaluation Team Report', 'ETR', 'Ohio''s evaluation document that determines eligibility for special education.', 'ohio', 'education'),
('Notice of Recommended Educational Placement', 'NOREP', 'Pennsylvania''s prior written notice and consent document for special education placement.', 'pennsylvania', 'education'),
('Intermediate Unit', 'IU', 'Pennsylvania regional educational service agencies supporting school districts.', 'pennsylvania', 'education'),
('Intermediate School District', 'ISD', 'Michigan regional agencies that support local school districts with special education.', 'michigan', 'education'),
('Individualized Education Program Team', 'IEPT', 'Michigan term for the IEP team.', 'michigan', 'education'),
('Educational Service District', 'ESD', 'Washington State regional support agencies for school districts.', 'washington', 'education'),
('Administrative Unit', 'AU', 'Colorado organizational structure for special education, may include multiple districts.', 'colorado', 'education'),
('Boards of Cooperative Educational Services', 'BOCES', 'Colorado regional cooperatives sharing educational services.', 'colorado', 'education'),
('Community Centered Board', 'CCB', 'Colorado agencies providing services for people with developmental disabilities.', 'colorado', 'services')
ON CONFLICT DO NOTHING;
