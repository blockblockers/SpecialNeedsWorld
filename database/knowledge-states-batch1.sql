-- =====================================================
-- MORE STATES - Batch 1
-- Alabama, Alaska, Arkansas, Connecticut, Delaware,
-- Hawaii, Idaho, Indiana, Iowa, Kansas
-- =====================================================

-- Add regions
INSERT INTO knowledge_regions (id, name, abbreviation, type, emoji, sort_order, is_active) VALUES
  ('alabama', 'Alabama', 'AL', 'state', '🌺', 20, TRUE),
  ('alaska', 'Alaska', 'AK', 'state', '🐻', 21, TRUE),
  ('arkansas', 'Arkansas', 'AR', 'state', '💎', 22, TRUE),
  ('connecticut', 'Connecticut', 'CT', 'state', '🍂', 23, TRUE),
  ('delaware', 'Delaware', 'DE', 'state', '🐓', 24, TRUE),
  ('hawaii', 'Hawaii', 'HI', 'state', '🌺', 25, TRUE),
  ('idaho', 'Idaho', 'ID', 'state', '🥔', 26, TRUE),
  ('indiana', 'Indiana', 'IN', 'state', '🏎️', 27, TRUE),
  ('iowa', 'Iowa', 'IA', 'state', '🌽', 28, TRUE),
  ('kansas', 'Kansas', 'KS', 'state', '🌻', 29, TRUE)
ON CONFLICT (id) DO UPDATE SET is_active = TRUE;


-- =====================================================
-- ALABAMA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'alabama',
  'education',
  'Alabama Special Education Overview',
  'al-special-ed-overview',
  'Overview of special education in Alabama, including ALSDE requirements and state programs.',
  '# Alabama Special Education Overview

## How Alabama Implements IDEA

Alabama implements federal IDEA through the **Alabama State Department of Education (ALSDE)** Special Education Services section.

## Key Alabama Agencies

### Alabama State Department of Education - Special Education Services
- State oversight
- Phone: (334) 694-4782
- Website: [alsde.edu](https://www.alsde.edu/sec/ses/Pages/home.aspx)

### Alabama Department of Mental Health - Developmental Disabilities Division
- Services for developmental disabilities
- Phone: (334) 242-3454

### Alabama''s Early Intervention System (AEIS)
- Birth to age 3 services
- Phone: 1-800-543-3098

## Alabama vs Federal Requirements

| Area | Federal IDEA | Alabama |
|------|-------------|---------|
| Evaluation Timeline | 60 days | **60 calendar days** from consent |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Alabama Programs

### Alabama''s Early Intervention System (AEIS)
- Birth to age 3
- Family-centered services
- Phone: 1-800-543-3098

### Alabama Disabilities Advocacy Program (ADAP)
- Protection and advocacy
- Phone: 1-800-826-1675

## Parent Resources

### Special Education Action Committee (SEAC)
- PTI for Alabama
- Phone: (205) 478-1208
- Website: [seacalabama.org](https://www.seacalabama.org/)

### Alabama Disabilities Advocacy Program
- Free legal advocacy
- Phone: 1-800-826-1675
- Website: [adap.ua.edu](https://adap.ua.edu/)
',
  ARRAY['Alabama', 'ALSDE', 'special education'],
  ARRAY['https://www.alsde.edu/sec/ses/Pages/home.aspx'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- ALASKA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'alaska',
  'education',
  'Alaska Special Education Overview',
  'ak-special-ed-overview',
  'Overview of special education in Alaska, including DEED requirements and unique rural considerations.',
  '# Alaska Special Education Overview

## How Alaska Implements IDEA

Alaska implements federal IDEA through the **Alaska Department of Education and Early Development (DEED)**.

## Key Alaska Agencies

### Alaska DEED - Special Education
- State oversight
- Phone: (907) 465-2972
- Website: [education.alaska.gov](https://education.alaska.gov/sped)

### Alaska Division of Senior and Disabilities Services
- Developmental disabilities services
- Phone: (907) 465-3372

## Alaska vs Federal Requirements

| Area | Federal IDEA | Alaska |
|------|-------------|--------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Development | 30 days | **30 days** |
| Age Range | 3-21 | **3-22** |

## Unique Alaska Considerations

### Rural and Remote Areas
- Many communities accessible only by air or water
- Distance learning options
- Itinerant specialists serve multiple communities
- Technology-based services common

### Alaska Native Populations
- Cultural considerations in services
- Tribal consultation requirements
- Indigenous language supports

## Alaska Programs

### Infant Learning Program (ILP)
- Birth to age 3
- Early intervention services
- Phone: (907) 465-2972

## Parent Resources

### PRIOR (Parents'' Roles in Obtaining Results)
- Parent information center
- Phone: (907) 456-8994

### Disability Law Center of Alaska
- Free legal advocacy
- Phone: 1-800-478-1234
- Website: [dlcak.org](https://www.dlcak.org/)

### Stone Soup Group
- PTI for Alaska
- Phone: (907) 561-3701
- Website: [stonesoupgroup.org](https://www.stonesoupgroup.org/)
',
  ARRAY['Alaska', 'DEED', 'special education', 'rural'],
  ARRAY['https://education.alaska.gov/sped'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- ARKANSAS
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'arkansas',
  'education',
  'Arkansas Special Education Overview',
  'ar-special-ed-overview',
  'Overview of special education in Arkansas, including ADE requirements and state programs.',
  '# Arkansas Special Education Overview

## How Arkansas Implements IDEA

Arkansas implements federal IDEA through the **Arkansas Department of Education (ADE)** Special Education Unit.

## Key Arkansas Agencies

### Arkansas Department of Education - Special Education Unit
- State oversight
- Phone: (501) 682-4221
- Website: [dese.ade.arkansas.gov](https://dese.ade.arkansas.gov/Offices/special-education)

### Arkansas Division of Developmental Disabilities Services (DDS)
- Services for developmental disabilities
- Phone: (501) 682-8699

## Arkansas vs Federal Requirements

| Area | Federal IDEA | Arkansas |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Arkansas Programs

### First Connections (Early Intervention)
- Birth to age 3
- Phone: 1-800-643-8258
- Website: [arkansas.gov/dhs/ddds/FirstConnect](https://humanservices.arkansas.gov/divisions-shared-services/developmental-disabilities-services/first-connections/)

### Arkansas Educational Cooperatives
- 15 regional cooperatives
- Support local districts

### Succeed Scholarship
- School choice for students with IEPs
- Private school option

## Parent Resources

### Arkansas Parent Training and Information (PTI)
- Parent support
- Phone: (501) 364-7580

### Disability Rights Arkansas
- Free legal advocacy
- Phone: 1-800-482-1174
- Website: [disabilityrightsar.org](https://disabilityrightsar.org/)

### Arkansas Support Network
- Family support
- Phone: (479) 927-4100
',
  ARRAY['Arkansas', 'ADE', 'special education'],
  ARRAY['https://dese.ade.arkansas.gov/Offices/special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- CONNECTICUT
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'connecticut',
  'education',
  'Connecticut Special Education Overview',
  'ct-special-ed-overview',
  'Overview of special education in Connecticut, including CSDE requirements and PPT process.',
  '# Connecticut Special Education Overview

## How Connecticut Implements IDEA

Connecticut implements federal IDEA through the **Connecticut State Department of Education (CSDE)** Bureau of Special Education.

## Key Connecticut Agencies

### Connecticut State Department of Education - Bureau of Special Education
- State oversight
- Phone: (860) 713-6910
- Website: [portal.ct.gov/sde](https://portal.ct.gov/SDE/Special-Education/Bureau-of-Special-Education)

### Department of Developmental Services (DDS)
- Services for developmental disabilities
- Phone: (860) 418-6000

## Connecticut vs Federal Requirements

| Area | Federal IDEA | Connecticut |
|------|-------------|-------------|
| Evaluation Timeline | 60 days | **45 school days** ⚠️ |
| PPT/IEP Meeting | 30 days | **45 school days** from referral |
| Age Range | 3-21 | **3-21** |

⚠️ Connecticut has a **45 school day** timeline for referral to PPT.

## Connecticut Specific Terms

### PPT - Planning and Placement Team
Connecticut calls the IEP team the **PPT** (Planning and Placement Team).

### RESC - Regional Educational Service Centers
Six regional centers supporting local districts.

## Connecticut Programs

### Birth to Three System
- Early intervention
- Phone: 1-800-505-7000
- Website: [birth23.org](https://www.birth23.org/)

## Parent Resources

### Connecticut Parent Advocacy Center (CPAC)
- PTI for Connecticut
- Phone: 1-800-445-2722
- Website: [cpacinc.org](https://www.cpacinc.org/)

### Disability Rights Connecticut
- Free legal advocacy
- Phone: 1-800-842-7303
- Website: [disrightsct.org](https://www.disrightsct.org/)
',
  ARRAY['Connecticut', 'CSDE', 'special education', 'PPT'],
  ARRAY['https://portal.ct.gov/SDE/Special-Education/Bureau-of-Special-Education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- DELAWARE
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'delaware',
  'education',
  'Delaware Special Education Overview',
  'de-special-ed-overview',
  'Overview of special education in Delaware, including DDOE requirements and state programs.',
  '# Delaware Special Education Overview

## How Delaware Implements IDEA

Delaware implements federal IDEA through the **Delaware Department of Education (DDOE)** Exceptional Children Resources.

## Key Delaware Agencies

### Delaware Department of Education - Exceptional Children Resources
- State oversight
- Phone: (302) 735-4210
- Website: [doe.k12.de.us](https://www.doe.k12.de.us/Page/2519)

### Division of Developmental Disabilities Services (DDDS)
- Services for developmental disabilities
- Phone: (302) 744-9600

## Delaware vs Federal Requirements

| Area | Federal IDEA | Delaware |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **45 school days** ⚠️ |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

⚠️ Delaware has a **45 school day** evaluation timeline.

## Delaware Programs

### Child Development Watch (CDW)
- Birth to age 3 early intervention
- Phone: 1-800-palpalBABY (1-800-671-0050)

### Delaware Autism Program
- Statewide autism services
- Through Christina School District

## Parent Resources

### Parent Information Center of Delaware (PIC)
- PTI for Delaware
- Phone: 1-888-547-4412
- Website: [picofdel.org](https://www.picofdel.org/)

### Disabilities Law Program
- Free legal advocacy
- Phone: (302) 575-0660
- Website: [declasi.org](https://www.declasi.org/)
',
  ARRAY['Delaware', 'DDOE', 'special education'],
  ARRAY['https://www.doe.k12.de.us/Page/2519'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- HAWAII
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'hawaii',
  'education',
  'Hawaii Special Education Overview',
  'hi-special-ed-overview',
  'Overview of special education in Hawaii - the only state with a single statewide school district.',
  '# Hawaii Special Education Overview

## How Hawaii Implements IDEA

Hawaii implements federal IDEA through the **Hawaii Department of Education (HIDOE)**. Hawaii is unique as the **only state with a single, statewide school district**.

## Key Hawaii Agencies

### Hawaii Department of Education - Special Education Section
- State oversight (and the only district!)
- Phone: (808) 203-5500
- Website: [hawaiipublicschools.org](https://www.hawaiipublicschools.org/TeachingAndLearning/SpecializedPrograms/SpecialEducation/Pages/home.aspx)

### Developmental Disabilities Division (DDD)
- Services for developmental disabilities
- Phone: (808) 586-5840

## Hawaii''s Unique Structure

### Single Statewide District
- No local school districts
- One unified system
- Complex areas serve as administrative regions

### Felix Consent Decree
Hawaii operated under a federal consent decree (Felix) for many years, which shaped its special education system.

## Hawaii vs Federal Requirements

| Area | Federal IDEA | Hawaii |
|------|-------------|--------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-20** ⚠️ |

⚠️ Hawaii provides services through age **20** (not 21).

## Hawaii Programs

### Early Intervention Section
- Birth to age 3
- Phone: (808) 594-0066
- Website: [earlyintervention.hawaii.gov](https://earlyintervention.hawaii.gov/)

## Parent Resources

### Learning Disabilities Association of Hawaii (LDAH)
- PTI for Hawaii
- Phone: (808) 536-9684
- Website: [ldahawaii.org](https://www.ldahawaii.org/)

### Hawaii Disability Rights Center
- Free legal advocacy
- Phone: 1-800-882-1057
- Website: [hawaiidisabilityrights.org](https://www.hawaiidisabilityrights.org/)
',
  ARRAY['Hawaii', 'HIDOE', 'special education', 'statewide district'],
  ARRAY['https://www.hawaiipublicschools.org/TeachingAndLearning/SpecializedPrograms/SpecialEducation/Pages/home.aspx'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- IDAHO
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'idaho',
  'education',
  'Idaho Special Education Overview',
  'id-special-ed-overview',
  'Overview of special education in Idaho, including SDE requirements and state programs.',
  '# Idaho Special Education Overview

## How Idaho Implements IDEA

Idaho implements federal IDEA through the **Idaho State Department of Education (SDE)** Special Education team.

## Key Idaho Agencies

### Idaho State Department of Education - Special Education
- State oversight
- Phone: (208) 332-6806
- Website: [sde.idaho.gov](https://www.sde.idaho.gov/sped/)

### Division of Behavioral Health - Developmental Disabilities Program
- Services for developmental disabilities
- Phone: (208) 334-5500

## Idaho vs Federal Requirements

| Area | Federal IDEA | Idaho |
|------|-------------|-------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **Within evaluation timeline** |
| Age Range | 3-21 | **3-21** |

## Idaho Programs

### Infant Toddler Program
- Birth to age 3
- Phone: (208) 334-5523
- Website: [healthandwelfare.idaho.gov](https://healthandwelfare.idaho.gov/Children/InfantToddlerProgram/tabid/76/Default.aspx)

### Idaho Educational Services for the Deaf and Blind (IESDB)
- Statewide services
- Website: [iesdb.org](https://www.iesdb.org/)

## Parent Resources

### Idaho Parents Unlimited (IPUL)
- PTI for Idaho
- Phone: 1-800-242-4785
- Website: [ipulidaho.org](https://www.ipulidaho.org/)

### Disability Rights Idaho
- Free legal advocacy
- Phone: 1-800-632-5125
- Website: [disabilityrightsidaho.org](https://www.disabilityrightsidaho.org/)
',
  ARRAY['Idaho', 'SDE', 'special education'],
  ARRAY['https://www.sde.idaho.gov/sped/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- INDIANA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'indiana',
  'education',
  'Indiana Special Education Overview',
  'in-special-ed-overview',
  'Overview of special education in Indiana, including DOE requirements and Article 7.',
  '# Indiana Special Education Overview

## How Indiana Implements IDEA

Indiana implements federal IDEA through the **Indiana Department of Education (IDOE)** Office of Special Education.

## Key Indiana Agencies

### Indiana Department of Education - Office of Special Education
- State oversight
- Phone: (317) 232-0570
- Website: [doe.in.gov](https://www.in.gov/doe/students/special-education/)

### Bureau of Developmental Disabilities Services (BDDS)
- Services for developmental disabilities
- Phone: 1-800-545-7763

## Indiana Specific Rules

### Article 7
Indiana''s special education regulations are known as **Article 7** (511 IAC 7).

## Indiana vs Federal Requirements

| Area | Federal IDEA | Indiana |
|------|-------------|---------|
| Evaluation Timeline | 60 days | **50 instructional days** ⚠️ |
| CCC Meeting | IEP Team | **Case Conference Committee (CCC)** |
| Age Range | 3-21 | **3-22** |

⚠️ Indiana uses **50 instructional days** for evaluation timeline.

## Indiana Specific Terms

### CCC - Case Conference Committee
Indiana calls the IEP team the **CCC** (Case Conference Committee).

## Indiana Programs

### First Steps (Early Intervention)
- Birth to age 3
- Phone: 1-800-441-7837
- Website: [in.gov/fssa/firststeps](https://www.in.gov/fssa/firststeps/)

### Indiana School for the Deaf / Blind
- Statewide services available

### Indiana Choice Scholarship
- School choice program
- Students with IEPs eligible

## Parent Resources

### IN*SOURCE
- PTI for Indiana
- Phone: 1-800-332-4433
- Website: [insource.org](https://www.insource.org/)

### Indiana Disability Rights
- Free legal advocacy
- Phone: 1-800-622-4845
- Website: [indianadisabilityrights.org](https://www.indianadisabilityrights.org/)
',
  ARRAY['Indiana', 'IDOE', 'special education', 'Article 7', 'CCC'],
  ARRAY['https://www.in.gov/doe/students/special-education/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- IOWA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'iowa',
  'education',
  'Iowa Special Education Overview',
  'ia-special-ed-overview',
  'Overview of special education in Iowa, including DOE requirements and AEAs.',
  '# Iowa Special Education Overview

## How Iowa Implements IDEA

Iowa implements federal IDEA through the **Iowa Department of Education** and **Area Education Agencies (AEAs)**.

## Key Iowa Agencies

### Iowa Department of Education - Special Education
- State oversight
- Phone: (515) 281-5294
- Website: [educateiowa.gov](https://educateiowa.gov/pk-12/special-education)

### Area Education Agencies (AEAs)
- 9 regional AEAs provide special education support
- Assessment, consulting, direct services

## Iowa''s AEA System

### What Are AEAs?
**Area Education Agencies** are regional service agencies that:
- Conduct evaluations
- Provide specialized staff
- Support local districts
- Deliver direct services

### 9 AEAs in Iowa
Each AEA serves multiple districts and provides special education support.

## Iowa vs Federal Requirements

| Area | Federal IDEA | Iowa |
|------|-------------|------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **Birth-21** ⚠️ |

⚠️ Iowa provides services from **birth** (not just age 3).

## Iowa Programs

### Early ACCESS (Early Intervention)
- Birth to age 3
- Phone: 1-888-425-4371
- Website: [earlyaccessiowa.org](https://www.earlyaccessiowa.org/)

### Iowa Educational Services for the Blind and Visually Impaired
- Statewide services

## Parent Resources

### ASK Resource Center
- PTI for Iowa
- Phone: 1-800-450-8667
- Website: [askresource.org](https://www.askresource.org/)

### Disability Rights Iowa
- Free legal advocacy
- Phone: 1-800-779-2502
- Website: [disabilityrightsiowa.org](https://www.disabilityrightsiowa.org/)
',
  ARRAY['Iowa', 'DOE', 'special education', 'AEA'],
  ARRAY['https://educateiowa.gov/pk-12/special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- KANSAS
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'kansas',
  'education',
  'Kansas Special Education Overview',
  'ks-special-ed-overview',
  'Overview of special education in Kansas, including KSDE requirements and state programs.',
  '# Kansas Special Education Overview

## How Kansas Implements IDEA

Kansas implements federal IDEA through the **Kansas State Department of Education (KSDE)** Special Education and Title Services team.

## Key Kansas Agencies

### Kansas State Department of Education - Special Education and Title Services
- State oversight
- Phone: (785) 296-3201
- Website: [ksde.org](https://www.ksde.org/Agency/Division-of-Learning-Services/Special-Education-and-Title-Services)

### Kansas Department for Aging and Disability Services (KDADS)
- Services for developmental disabilities
- Phone: 1-800-432-3535

## Kansas vs Federal Requirements

| Area | Federal IDEA | Kansas |
|------|-------------|--------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **Birth-21** ⚠️ |

⚠️ Kansas provides services from **birth**.

## Kansas Programs

### Infant-Toddler Services (tiny-k)
- Birth to age 3
- Phone: 1-800-332-6262
- Website: [ksits.org](https://www.ksits.org/)

### Kansas School for the Deaf / Blind
- Statewide services

### Interlocal/Cooperatives
- Many Kansas districts form cooperatives for special education

## Parent Resources

### Families Together, Inc.
- PTI for Kansas
- Phone: 1-800-264-6343
- Website: [familiestogetherinc.org](https://www.familiestogetherinc.org/)

### Disability Rights Center of Kansas
- Free legal advocacy
- Phone: 1-877-776-1541
- Website: [drckansas.org](https://www.drckansas.org/)
',
  ARRAY['Kansas', 'KSDE', 'special education', 'tiny-k'],
  ARRAY['https://www.ksde.org/Agency/Division-of-Learning-Services/Special-Education-and-Title-Services'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- Add glossary terms
INSERT INTO knowledge_glossary (term, abbreviation, definition, region_id, category_id) VALUES
('Planning and Placement Team', 'PPT', 'Connecticut term for the IEP team.', 'connecticut', 'education'),
('Case Conference Committee', 'CCC', 'Indiana term for the IEP team.', 'indiana', 'education'),
('Area Education Agency', 'AEA', 'Iowa regional service agencies providing special education support.', 'iowa', 'education'),
('Article 7', NULL, 'Indiana special education regulations (511 IAC 7).', 'indiana', 'education')
ON CONFLICT DO NOTHING;
