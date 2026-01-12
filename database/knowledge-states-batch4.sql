-- =====================================================
-- MORE STATES - Batch 4 (Final)
-- Tennessee, Utah, Vermont, Virginia, West Virginia,
-- Wisconsin, Wyoming, District of Columbia
-- =====================================================

-- Add regions
INSERT INTO knowledge_regions (id, name, abbreviation, type, emoji, sort_order, is_active) VALUES
  ('tennessee', 'Tennessee', 'TN', 'state', '🎸', 50, TRUE),
  ('utah', 'Utah', 'UT', 'state', '🏔️', 51, TRUE),
  ('vermont', 'Vermont', 'VT', 'state', '🍁', 52, TRUE),
  ('virginia', 'Virginia', 'VA', 'state', '🏛️', 53, TRUE),
  ('west-virginia', 'West Virginia', 'WV', 'state', '⛰️', 54, TRUE),
  ('wisconsin', 'Wisconsin', 'WI', 'state', '🧀', 55, TRUE),
  ('wyoming', 'Wyoming', 'WY', 'state', '🦬', 56, TRUE),
  ('district-of-columbia', 'District of Columbia', 'DC', 'state', '🏛️', 57, TRUE)
ON CONFLICT (id) DO UPDATE SET is_active = TRUE;


-- =====================================================
-- TENNESSEE
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'tennessee',
  'education',
  'Tennessee Special Education Overview',
  'tn-special-ed-overview',
  'Overview of special education in Tennessee, including TDOE requirements and state programs.',
  '# Tennessee Special Education Overview

## How Tennessee Implements IDEA

Tennessee implements federal IDEA through the **Tennessee Department of Education (TDOE)** Division of Special Populations.

## Key Tennessee Agencies

### Tennessee Department of Education - Division of Special Populations
- State oversight
- Phone: (615) 741-2851
- Website: [tn.gov/education](https://www.tn.gov/education/families/student-support/special-education.html)

### Department of Intellectual and Developmental Disabilities (DIDD)
- Services for developmental disabilities
- Phone: 1-800-535-9725

## Tennessee vs Federal Requirements

| Area | Federal IDEA | Tennessee |
|------|-------------|-----------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-22** |

## Tennessee Programs

### Tennessee Early Intervention System (TEIS)
- Birth to age 3
- Phone: 1-800-852-7157
- Website: [tn.gov/didd/teis](https://www.tn.gov/didd/for-consumers/tennessee-early-intervention-system-teis.html)

### Tennessee School for the Deaf / Blind
- Statewide services

### Individualized Education Account (IEA) Program
- School choice savings account

## Parent Resources

### STEP (Support and Training for Exceptional Parents)
- PTI for Tennessee
- Phone: 1-800-280-7837
- Website: [tnstep.org](https://www.tnstep.org/)

### Disability Rights Tennessee
- Free legal advocacy
- Phone: 1-800-287-9636
- Website: [disabilityrightstn.org](https://www.disabilityrightstn.org/)
',
  ARRAY['Tennessee', 'TDOE', 'special education', 'TEIS'],
  ARRAY['https://www.tn.gov/education/families/student-support/special-education.html'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- UTAH
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'utah',
  'education',
  'Utah Special Education Overview',
  'ut-special-ed-overview',
  'Overview of special education in Utah, including USBE requirements and state programs.',
  '# Utah Special Education Overview

## How Utah Implements IDEA

Utah implements federal IDEA through the **Utah State Board of Education (USBE)** Special Education Services.

## Key Utah Agencies

### Utah State Board of Education - Special Education Services
- State oversight
- Phone: (801) 538-7587
- Website: [schools.utah.gov](https://www.schools.utah.gov/specialeducation)

### Division of Services for People with Disabilities (DSPD)
- Services for developmental disabilities
- Phone: 1-800-837-6811

## Utah vs Federal Requirements

| Area | Federal IDEA | Utah |
|------|-------------|------|
| Evaluation Timeline | 60 days | **45 school days** ⚠️ |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-22** |

⚠️ Utah has a **45 school day** evaluation timeline.

## Utah Programs

### Baby Watch Early Intervention
- Birth to age 3
- Phone: 1-800-961-4226
- Website: [babywatch.utah.gov](https://babywatch.utah.gov/)

### Utah Schools for the Deaf and Blind (USDB)
- Statewide services and outreach

### Carson Smith Special Needs Scholarship
- School choice for students with disabilities
- Covers private school tuition

## Parent Resources

### Utah Parent Center
- PTI for Utah
- Phone: 1-800-468-1160
- Website: [utahparentcenter.org](https://www.utahparentcenter.org/)

### Disability Law Center
- Free legal advocacy
- Phone: 1-800-662-9080
- Website: [disabilitylawcenter.org](https://www.disabilitylawcenter.org/)
',
  ARRAY['Utah', 'USBE', 'special education', 'Carson Smith'],
  ARRAY['https://www.schools.utah.gov/specialeducation'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- VERMONT
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'vermont',
  'education',
  'Vermont Special Education Overview',
  'vt-special-ed-overview',
  'Overview of special education in Vermont, including AOE requirements and EST process.',
  '# Vermont Special Education Overview

## How Vermont Implements IDEA

Vermont implements federal IDEA through the **Agency of Education (AOE)** Student Support Services.

## Key Vermont Agencies

### Vermont Agency of Education - Student Support Services
- State oversight
- Phone: (802) 828-5114
- Website: [education.vermont.gov](https://education.vermont.gov/student-support/vermont-special-education)

### Department of Disabilities, Aging and Independent Living (DAIL)
- Services for developmental disabilities
- Phone: (802) 241-0220

## Vermont Specific Terms

### EST - Educational Support Team
Vermont uses **Educational Support Teams** (EST) as part of the referral and support process.

## Vermont vs Federal Requirements

| Area | Federal IDEA | Vermont |
|------|-------------|---------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Vermont Programs

### Children''s Integrated Services (CIS) - Early Intervention
- Birth to age 3
- Phone: (802) 863-7200

### Supervisory Unions
- Vermont uses supervisory unions for special education administration

## Parent Resources

### Vermont Family Network
- PTI for Vermont
- Phone: 1-800-800-4005
- Website: [vermontfamilynetwork.org](https://www.vermontfamilynetwork.org/)

### Disability Rights Vermont
- Free legal advocacy
- Phone: 1-800-834-7890
- Website: [disabilityrightsvt.org](https://www.disabilityrightsvt.org/)
',
  ARRAY['Vermont', 'AOE', 'special education', 'EST'],
  ARRAY['https://education.vermont.gov/student-support/vermont-special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- VIRGINIA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'virginia',
  'education',
  'Virginia Special Education Overview',
  'va-special-ed-overview',
  'Overview of special education in Virginia, including VDOE requirements and state programs.',
  '# Virginia Special Education Overview

## How Virginia Implements IDEA

Virginia implements federal IDEA through the **Virginia Department of Education (VDOE)** Office of Special Education and Student Services.

## Key Virginia Agencies

### Virginia Department of Education - Office of Special Education
- State oversight
- Phone: (804) 225-2402
- Website: [doe.virginia.gov](https://www.doe.virginia.gov/teaching-learning-assessment/specialized-instruction/special-education)

### Department for Aging and Rehabilitative Services (DARS)
- Includes developmental disability services
- Phone: 1-800-552-5019

## Virginia vs Federal Requirements

| Area | Federal IDEA | Virginia |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **65 business days** |
| IEP Meeting | 30 days | **30 calendar days** |
| Age Range | 3-21 | **2-21** ⚠️ |

⚠️ Virginia provides services starting at age **2** for eligible children.

## Virginia Programs

### Infant & Toddler Connection of Virginia
- Birth to age 3
- Phone: 1-800-234-1448
- Website: [infantva.org](https://www.infantva.org/)

### Virginia School for the Deaf and Blind
- Statewide services

### Education Improvement Scholarships
- Tax credit scholarship program

## Parent Resources

### Parent Educational Advocacy Training Center (PEATC)
- PTI for Virginia
- Phone: 1-800-869-6782
- Website: [peatc.org](https://www.peatc.org/)

### disAbility Law Center of Virginia
- Free legal advocacy
- Phone: 1-800-552-3962
- Website: [dlcv.org](https://www.dlcv.org/)
',
  ARRAY['Virginia', 'VDOE', 'special education'],
  ARRAY['https://www.doe.virginia.gov/teaching-learning-assessment/specialized-instruction/special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- WEST VIRGINIA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'west-virginia',
  'education',
  'West Virginia Special Education Overview',
  'wv-special-ed-overview',
  'Overview of special education in West Virginia, including WVDE requirements and state programs.',
  '# West Virginia Special Education Overview

## How West Virginia Implements IDEA

West Virginia implements federal IDEA through the **WV Department of Education (WVDE)** Office of Special Education.

## Key West Virginia Agencies

### WV Department of Education - Office of Special Education
- State oversight
- Phone: (304) 558-2696
- Website: [wvde.us](https://wvde.us/special-education/)

### Division of Developmental Disabilities
- Services for developmental disabilities
- Phone: (304) 356-4811

## West Virginia vs Federal Requirements

| Area | Federal IDEA | West Virginia |
|------|-------------|---------------|
| Evaluation Timeline | 60 days | **80 calendar days** ⚠️ |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **Birth-21** |

⚠️ West Virginia has an extended **80 day** evaluation timeline.

## West Virginia Programs

### WV Birth to Three Program
- Early intervention
- Phone: (304) 558-5388
- Website: [wvdhhr.org/birth23](https://dhhr.wv.gov/birth23/Pages/default.aspx)

### WV Schools for the Deaf and Blind
- Statewide services

### Regional Education Service Agencies (RESAs)
- Eight RESAs support districts

## Parent Resources

### WV Parent Training and Information (WVPTI)
- PTI for West Virginia
- Phone: 1-800-281-1436
- Website: [wvpti.org](https://www.wvpti.org/)

### Disability Rights of West Virginia
- Free legal advocacy
- Phone: 1-800-950-5250
- Website: [drofwv.org](https://www.drofwv.org/)
',
  ARRAY['West Virginia', 'WVDE', 'special education', 'RESA'],
  ARRAY['https://wvde.us/special-education/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- WISCONSIN
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'wisconsin',
  'education',
  'Wisconsin Special Education Overview',
  'wi-special-ed-overview',
  'Overview of special education in Wisconsin, including DPI requirements and CESAs.',
  '# Wisconsin Special Education Overview

## How Wisconsin Implements IDEA

Wisconsin implements federal IDEA through the **Department of Public Instruction (DPI)** Special Education Team.

## Key Wisconsin Agencies

### Wisconsin DPI - Special Education Team
- State oversight
- Phone: (608) 266-1649
- Website: [dpi.wi.gov](https://dpi.wi.gov/sped)

### Division of Medicaid Services
- Long-term care and disability services
- Phone: 1-800-362-3002

## Wisconsin Structure

### CESAs - Cooperative Educational Service Agencies
Wisconsin has **12 CESAs** providing regional support for special education.

## Wisconsin vs Federal Requirements

| Area | Federal IDEA | Wisconsin |
|------|-------------|-----------|
| Evaluation Timeline | 60 days | **60 days from consent** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **Birth-21** |

## Wisconsin Programs

### Birth to 3 Program
- Early intervention
- Phone: 1-800-642-7837
- Website: [dhs.wisconsin.gov/birthto3](https://www.dhs.wisconsin.gov/birthto3/index.htm)

### Wisconsin School for the Deaf / Visually Impaired
- Statewide services and outreach

### Special Needs Scholarship Program
- School choice for students with disabilities

## Parent Resources

### Wisconsin FACETS
- PTI for Wisconsin
- Phone: 1-877-374-0511
- Website: [wifacets.org](https://www.wifacets.org/)

### Disability Rights Wisconsin
- Free legal advocacy
- Phone: 1-800-928-8778
- Website: [disabilityrightswi.org](https://www.disabilityrightswi.org/)
',
  ARRAY['Wisconsin', 'DPI', 'special education', 'CESA'],
  ARRAY['https://dpi.wi.gov/sped'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- WYOMING
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'wyoming',
  'education',
  'Wyoming Special Education Overview',
  'wy-special-ed-overview',
  'Overview of special education in Wyoming, including WDE requirements and rural considerations.',
  '# Wyoming Special Education Overview

## How Wyoming Implements IDEA

Wyoming implements federal IDEA through the **Wyoming Department of Education (WDE)** Special Programs Unit.

## Key Wyoming Agencies

### Wyoming Department of Education - Special Programs
- State oversight
- Phone: (307) 777-7417
- Website: [edu.wyoming.gov](https://edu.wyoming.gov/for-district-leadership/special-programs/)

### Developmental Disabilities Division
- Services for developmental disabilities
- Phone: (307) 777-5246

## Wyoming vs Federal Requirements

| Area | Federal IDEA | Wyoming |
|------|-------------|---------|
| Evaluation Timeline | 60 days | **60 calendar days** |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-21** |

## Rural Considerations

Wyoming is the least populous state:
- Small districts
- Distance-based services
- BOCES cooperatives

### BOCES
Wyoming uses **Boards of Cooperative Educational Services** (BOCES) for regional special education support.

## Wyoming Programs

### Child Development Services (Early Intervention)
- Birth to age 3
- Through Department of Health
- Phone: (307) 777-6972

## Parent Resources

### Parent Information Center
- PTI for Wyoming
- Phone: 1-800-660-9742
- Website: [wpic.org](https://www.wpic.org/)

### Protection & Advocacy System
- Free legal advocacy
- Phone: 1-800-624-7648
- Website: [wypanda.com](https://wypanda.com/)
',
  ARRAY['Wyoming', 'WDE', 'special education', 'rural', 'BOCES'],
  ARRAY['https://edu.wyoming.gov/for-district-leadership/special-programs/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- DISTRICT OF COLUMBIA
-- =====================================================

INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'district-of-columbia',
  'education',
  'District of Columbia Special Education Overview',
  'dc-special-ed-overview',
  'Overview of special education in Washington, DC, including OSSE requirements and unique federal city status.',
  '# District of Columbia Special Education Overview

## How DC Implements IDEA

The District of Columbia implements federal IDEA through the **Office of the State Superintendent of Education (OSSE)** Division of Special Education.

## Key DC Agencies

### Office of the State Superintendent of Education (OSSE)
- State education agency
- Phone: (202) 727-6436
- Website: [osse.dc.gov](https://osse.dc.gov/service/special-education)

### DC Public Schools (DCPS)
- Local school district
- Phone: (202) 442-5885

### Department on Disability Services (DDS)
- Services for developmental disabilities
- Phone: (202) 730-1700

## DC vs Federal Requirements

| Area | Federal IDEA | District of Columbia |
|------|-------------|---------------------|
| Evaluation Timeline | 60 days | **120 calendar days** (with exceptions) ⚠️ |
| IEP Meeting | 30 days | **30 days** |
| Age Range | 3-21 | **3-22** |

⚠️ DC has unique timeline requirements - consult OSSE for details.

## DC Structure

### Nonpublic Schools
DC has a significant nonpublic school program for students whose needs cannot be met in DCPS.

### Public Charter LEAs
Many DC charter schools serve as their own LEAs for special education.

## DC Programs

### Strong Start DC Early Intervention
- Birth to age 3
- Phone: (202) 727-3665
- Website: [osse.dc.gov/strongstart](https://osse.dc.gov/service/strong-start-dc-early-intervention-program)

### Special Education Cooperative
- Supports charter schools

### Opportunity Scholarship Program
- School choice (federally funded)

## Parent Resources

### Advocates for Justice and Education (AJE)
- PTI for DC
- Phone: (202) 678-8060
- Website: [aje-dc.org](https://www.aje-dc.org/)

### University Legal Services (Protection & Advocacy)
- Free legal advocacy
- Phone: (202) 547-4747
- Website: [uls-dc.org](https://www.uls-dc.org/)

### DC Special Education Hub
- Website: [dcspecialeducation.com](https://dcspecialeducation.com/)
',
  ARRAY['DC', 'District of Columbia', 'OSSE', 'special education'],
  ARRAY['https://osse.dc.gov/service/special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- Add glossary terms
INSERT INTO knowledge_glossary (term, abbreviation, definition, region_id, category_id) VALUES
('Educational Support Team', 'EST', 'Vermont''s school-based team for student support and referrals.', 'vermont', 'education'),
('Cooperative Educational Service Agency', 'CESA', 'Wisconsin regional agencies supporting school districts.', 'wisconsin', 'education'),
('Regional Education Service Agency', 'RESA', 'West Virginia regional agencies supporting school districts.', 'west-virginia', 'education')
ON CONFLICT DO NOTHING;
