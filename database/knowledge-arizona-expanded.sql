-- =====================================================
-- EXPANDED ARIZONA CONTENT
-- =====================================================
-- Run AFTER knowledge-resources-setup.sql and knowledge-states-additional.sql

-- Arizona Parent Rights
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'arizona',
  'rights',
  'Arizona Parent Rights in Special Education',
  'az-parent-rights',
  'Comprehensive guide to parent rights under Arizona special education law.',
  '# Arizona Parent Rights in Special Education

## Your Rights Under Arizona Law

Arizona follows federal IDEA requirements. Here are your key rights.

## Evaluation Rights

### Request an Evaluation
- You can request evaluation **in writing**
- School must respond within **reasonable time**
- Evaluation completed within **60 days** of consent
- Must assess all areas of suspected disability

### Independent Educational Evaluation (IEE)
- Right to IEE if you disagree with school''s evaluation
- Request IEE **at public expense**
- District must pay OR request due process
- You can always get private evaluation at your expense

## IEP Meeting Rights

### Notice
- Written notice of IEP meeting
- Mutually agreeable time and place
- You can bring anyone to support you

### Participation
- **Equal member** of IEP team
- Your input must be considered
- You can disagree with proposals

### Recording
- You may audio record meetings
- Notify district in advance
- District may also record

## Consent Rights

### Consent Required For
- Initial evaluation
- Initial placement in special education
- Reevaluation
- Changes in placement

### You Can
- Give consent
- Refuse consent
- Revoke consent (in writing)

## Prior Written Notice

District must give you written notice before:
- Changing identification or placement
- Refusing to change identification or placement
- Any change to IEP services

## Stay Put

During disputes:
- Child stays in current placement
- Cannot be moved without consent
- Applies during due process

## Dispute Resolution

### 1. Informal Resolution
- Talk to school staff
- Request IEP meeting

### 2. Facilitated IEP
- Free from ADE
- Neutral facilitator

### 3. Mediation
- Free from ADE
- Voluntary process
- Agreements are binding

### 4. State Complaint
- File with ADE within 1 year
- Investigated within 60 days

### 5. Due Process
- Formal hearing
- File within 2 years
- Heard by impartial officer

## Records Rights

- Access to all educational records
- Request copies
- Request amendments
- Records must be confidential

## Arizona Specific Options

### Empowerment Scholarship Account (ESA)
- Alternative to public school
- State funding for private options
- Must give up IDEA rights in public school
- See ESA article for details

## Resources

### Raising Special Kids
- Arizona PTI
- Phone: (602) 242-4366
- Free parent support

### Arizona Center for Disability Law
- Free legal advocacy
- Phone: (602) 274-6287
',
  ARRAY['Arizona', 'parent rights', 'IEP', 'advocacy'],
  ARRAY['https://raisingspecialkids.org/', 'https://www.azdisabilitylaw.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Arizona Early Intervention (AzEIP)
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'arizona',
  'services',
  'Arizona Early Intervention Program (AzEIP)',
  'arizona-azeip',
  'Early intervention services for infants and toddlers birth to age 3 in Arizona.',
  '# Arizona Early Intervention Program (AzEIP)

## What is AzEIP?

The **Arizona Early Intervention Program (AzEIP)** provides services for infants and toddlers (birth to age 3) with developmental delays or disabilities.

## Who is Eligible?

### Children who have
- **25% delay** in one or more developmental areas, OR
- **Established condition** likely to result in delay (e.g., Down syndrome, hearing loss)

### Developmental Areas
- Cognitive (thinking, learning)
- Physical (movement, motor skills)
- Communication (talking, understanding)
- Social-emotional (relating to others)
- Adaptive (self-help skills)

## How to Make a Referral

Anyone can refer a child:
- Parents
- Doctors
- Child care providers
- Family members

### Contact
- Phone: **1-888-439-5609**
- Website: [azdes.gov/azeip](https://des.az.gov/services/disabilities/arizona-early-intervention-program)

## The Process

### 1. Referral
- Call AzEIP or submit online
- Information gathered about concerns

### 2. Evaluation
- Comprehensive developmental assessment
- Completed within **45 days**
- Team of qualified professionals
- Family interview

### 3. IFSP Meeting
- If eligible, develop Individualized Family Service Plan
- Family''s concerns and priorities
- Outcomes and services

### 4. Services Begin
- Services in natural environments (home, child care)
- Ongoing support

## Services Provided

### Core Services (Free)
- Service coordination
- Developmental assessment
- IFSP development

### Early Intervention Services
- Special instruction
- Speech-language therapy
- Occupational therapy
- Physical therapy
- Family training
- Assistive technology
- Vision/hearing services
- Social work services

## Where Services Happen

Services are provided in **natural environments**:
- Your home
- Child care centers
- Community locations
- Where child naturally spends time

## Cost

- **No cost** for core AzEIP services
- Other services based on ability to pay
- Cannot be denied due to inability to pay
- Insurance may be billed (with consent)

## The IFSP

The **Individualized Family Service Plan** includes:
- Child''s current development levels
- Family''s concerns and priorities
- Outcomes to be achieved
- Services to be provided
- Who provides services
- When and where services happen

### IFSP Reviews
- At least every **6 months**
- Annual IFSP meeting
- Can request review anytime

## Transition to Preschool

### At Age 3
Children transition from AzEIP to:
- Preschool special education (school district), OR
- DDD services (if eligible), OR
- Community programs

### Transition Planning
- Begins at **2 years, 9 months**
- Transition conference held
- Smooth handoff to new services

## Your Rights

- Informed consent
- Participate in all decisions
- Accept or decline services
- Access to records
- Confidentiality
- Dispute resolution

## Contact AzEIP

- **Phone**: 1-888-439-5609
- **Website**: [des.az.gov/azeip](https://des.az.gov/services/disabilities/arizona-early-intervention-program)
- **Email**: AzEIP@azdes.gov
',
  ARRAY['AzEIP', 'Arizona', 'early intervention', 'birth to 3', 'IFSP'],
  ARRAY['https://des.az.gov/services/disabilities/arizona-early-intervention-program']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Arizona Transition Services
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'arizona',
  'transition',
  'Arizona Transition Services (Age 16-22)',
  'az-transition',
  'Planning for life after high school in Arizona - employment, education, and independent living.',
  '# Arizona Transition Services

## What is Transition?

Transition planning helps students prepare for life after high school, including:
- Employment
- Education/training
- Independent living

## When Does It Start?

### In Arizona
- Transition planning required by age **16**
- Can start earlier if appropriate
- Must be part of IEP

## IEP Transition Requirements

### Post-Secondary Goals
Measurable goals for after high school:
- Education or training
- Employment
- Independent living (where appropriate)

### Transition Services
Activities to reach goals:
- Instruction
- Related services
- Community experiences
- Job exploration

### Assessments
- Interest inventories
- Career assessments
- Skills evaluations

## Arizona Agencies

### Vocational Rehabilitation (VR)
- Job training and placement
- Assistive technology for work
- College support services
- Contact at age 16
- Phone: 1-800-563-1221
- Website: [azdes.gov/vr](https://des.az.gov/services/employment/rehabilitation-services)

### Division of Developmental Disabilities (DDD)
- For individuals with developmental disabilities
- Adult services after high school
- Supported employment
- Day programs
- Phone: (844) 770-9500

### Arizona@Work
- Employment services for all
- Job search assistance
- Training programs
- Website: [arizonaatwork.com](https://www.arizonaatwork.com/)

## Student Involvement

### Required at Age 16
- Student must be invited to IEP
- Should participate in planning
- Self-advocacy skills important

### At Age 18
- **Transfer of rights** to student
- Student makes educational decisions
- Unless guardianship established

## Diploma Options

### High School Diploma
- Meet all graduation requirements
- Ends IDEA eligibility
- Standard diploma

### Certificate of Completion
- Complete IEP goals
- Does not end eligibility
- Can stay until age 22

### Staying Until 22
- Can stay through school year of 22nd birthday
- Continue transition services
- Focus on employment/independence

## Post-Secondary Education

### Community Colleges
- Disability Resources offices
- Accommodations available
- Apply early for services

### Universities (ASU, NAU, U of A)
- Disability Resource Centers
- Register before classes start
- Provide documentation

### Trade Schools
- Many options in Arizona
- VR can help fund training

## Employment

### Competitive Employment
- Real jobs in community
- Minimum wage or higher
- VR support available

### Supported Employment
- Job coaching
- Ongoing support
- Through DDD or VR

### Project SEARCH
- Internship program
- High school students
- Available at some Arizona sites

## Independent Living

### Arizona Bridge to Independent Living (ABIL)
- Phoenix area
- (602) 256-2245
- [abil.org](https://abil.org/)

### DIRECT Center for Independence
- Tucson area
- (520) 624-6452
- [directilc.org](https://www.directilc.org/)

## Financial Planning

### SSI/SSDI
- Apply before turning 18
- Contact Social Security

### ABLE Account
- Tax-advantaged savings
- Doesn''t affect benefits
- [AzABLE.gov](https://www.azable.gov/)

## Timeline

| Age | Action |
|-----|--------|
| 14 | Career exploration |
| 16 | Formal transition plan, contact VR |
| 17 | Apply for SSI, healthcare planning |
| 18 | Transfer of rights |
| 18-22 | Continue services |
| 22 | Exit school, adult services |

## Resources

### Raising Special Kids
- Transition support
- (602) 242-4366

### Arizona Vocational Rehabilitation
- 1-800-563-1221
- [des.az.gov/vr](https://des.az.gov/services/employment/rehabilitation-services)
',
  ARRAY['transition', 'Arizona', 'employment', 'VR', 'age 22'],
  ARRAY['https://des.az.gov/services/employment/rehabilitation-services', 'https://raisingspecialkids.org/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Arizona Contacts
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'arizona',
  'resources',
  'Arizona Special Needs Contacts & Resources',
  'az-contacts',
  'Important phone numbers, websites, and organizations for Arizona families.',
  '# Arizona Special Needs Contacts & Resources

## State Agencies

### Arizona Department of Education - ESS
- Exceptional Student Services
- Phone: (602) 542-4013
- Website: [azed.gov/specialeducation](https://www.azed.gov/specialeducation/)

### Division of Developmental Disabilities (DDD)
- Phone: (844) 770-9500
- Website: [des.az.gov/ddd](https://des.az.gov/services/disabilities/developmental-disabilities)

### Arizona Early Intervention (AzEIP)
- Phone: 1-888-439-5609
- Website: [des.az.gov/azeip](https://des.az.gov/services/disabilities/arizona-early-intervention-program)

### Vocational Rehabilitation
- Phone: 1-800-563-1221
- Website: [des.az.gov/vr](https://des.az.gov/services/employment/rehabilitation-services)

## Advocacy & Legal

### Arizona Center for Disability Law
- **Free legal advocacy**
- Phone: (602) 274-6287
- Toll-free: 1-800-927-2260
- Website: [azdisabilitylaw.org](https://www.azdisabilitylaw.org/)

### Raising Special Kids (PTI)
- **Parent training and support**
- Phone: (602) 242-4366
- Toll-free: 1-800-237-3007
- Website: [raisingspecialkids.org](https://raisingspecialkids.org/)

### Arizona Center for Law in the Public Interest
- Phone: (602) 258-8850
- Public interest legal cases

## DDD District Offices

| District | Counties | Phone |
|----------|----------|-------|
| District Central | Maricopa | (602) 771-1900 |
| District South | Pima, Cochise, Santa Cruz, Yuma, Pinal | (520) 770-3900 |
| District North | Apache, Coconino, Mohave, Navajo, Yavapai | (928) 774-9253 |
| District East | Gila, Graham, Greenlee, La Paz | (520) 866-3420 |

## Crisis Lines

### 988 Suicide & Crisis Lifeline
- Call or text **988**
- 24/7 support

### Arizona Crisis Line
- 1-800-631-1314
- 24/7 behavioral health crisis

### Child Protective Services
- 1-888-SOS-CHILD (1-888-767-2445)

## Insurance & Benefits

### AHCCCS (Arizona Medicaid)
- Phone: (602) 417-4000
- Website: [azahcccs.gov](https://www.azahcccs.gov/)

### Social Security Administration
- Phone: 1-800-772-1213
- Website: [ssa.gov](https://www.ssa.gov/)

### KidsCare (CHIP)
- Phone: 1-877-764-5437
- Health insurance for children

## Parent Support

### Raising Special Kids
- Parent matching
- Training workshops
- IEP support
- Phone: (602) 242-4366

### The Arc of Arizona
- Phone: (602) 234-2721
- Website: [arcarizona.org](https://arcarizona.org/)

### Autism Society of Greater Phoenix
- Phone: (480) 940-1093
- Website: [phxautism.org](https://www.phxautism.org/)

## Independent Living Centers

### ABIL (Phoenix)
- Phone: (602) 256-2245
- Website: [abil.org](https://abil.org/)

### DIRECT Center (Tucson)
- Phone: (520) 624-6452
- Website: [directilc.org](https://www.directilc.org/)

### ASSIST to Independence (Yuma)
- Phone: (928) 305-9015

### New Horizons (Prescott)
- Phone: (928) 772-1266

### Arizona Bridge to Independent Living (Statewide)
- Phone: 1-800-280-2245

## School Choice

### Empowerment Scholarship Account (ESA)
- Phone: (602) 542-8293
- Website: [azed.gov/esa](https://www.azed.gov/esa/)

## General Resources

### 211 Arizona
- Dial **211**
- Or text zip code to 898-211
- Resource information

### Arizona Family Health Partnership
- Phone: 1-800-231-8326
- Family support services

### Southwest Human Development
- Phone: (602) 266-5976
- Early childhood services
- Website: [swhd.org](https://www.swhd.org/)
',
  ARRAY['Arizona', 'contacts', 'resources', 'phone numbers'],
  ARRAY['https://raisingspecialkids.org/', 'https://www.azdisabilitylaw.org/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Arizona Funding
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'arizona',
  'funding',
  'Arizona Financial Resources for Families',
  'az-financial',
  'Financial assistance programs and funding sources for Arizona families with special needs children.',
  '# Arizona Financial Resources

## AHCCCS (Arizona Medicaid)

### What is AHCCCS?
Arizona''s Medicaid program - Arizona Health Care Cost Containment System.

### Who Qualifies?
- Income-based eligibility
- Children under 19
- Pregnant women
- Adults (with limits)
- SSI recipients

### What Does AHCCCS Cover?
- Doctor visits
- Hospital stays
- Prescriptions
- Therapies (OT, PT, Speech)
- Behavioral health
- Dental
- Vision
- Medical equipment

### How to Apply
- Online: [healthearizonaplus.gov](https://www.healthearizonaplus.gov/)
- Phone: (602) 417-4000

## ALTCS (Long Term Care)

### Arizona Long Term Care System
For people who need long-term services:
- Nursing home level of care needed
- Can receive services at home
- Administered through DDD for developmental disabilities

### Services Include
- Personal care
- Respite
- Therapies
- Day programs
- Residential (if needed)

## KidsCare (CHIP)

### Children''s Health Insurance
For children not eligible for AHCCCS:
- Up to 209% federal poverty level
- Monthly premiums (low cost)
- Comprehensive coverage

### Apply
- Phone: 1-877-764-5437
- Website: [azahcccs.gov/kidscare](https://www.azahcccs.gov/Members/GetCovered/Categories/KidsCare.html)

## Supplemental Security Income (SSI)

### What is SSI?
Federal cash assistance for people with disabilities.

### Child SSI
- Child must have disability
- Family income/resources considered
- Can apply at any age

### At Age 18
- Only child''s income counts
- Many more qualify as adults
- Apply before 18th birthday

### Amount
- Approximately $943/month federal (2024)
- Arizona has no state supplement

### Apply
- Social Security: 1-800-772-1213
- Website: [ssa.gov](https://www.ssa.gov/)

## DDD Funding

### Division of Developmental Disabilities
For eligible individuals, DDD funds:
- Respite care
- Habilitation
- Day programs
- Therapies
- Supported employment
- Supported living

### Family Support
- May have sliding scale fees
- Based on ability to pay

## ABLE Accounts

### AzABLE
- Tax-advantaged savings
- Disability-related expenses
- Doesn''t affect benefits (up to $100k)

### Website
[AzABLE.gov](https://www.azable.gov/)

### Eligible Expenses
- Education
- Housing
- Transportation
- Therapies
- Assistive technology
- Employment support

## Empowerment Scholarship Account

### School Choice Funding
- For students with disabilities (and others)
- $6,500 - $40,000+ per year
- Based on disability category

### Use For
- Private school tuition
- Therapies
- Curriculum
- Tutoring

### More Info
[azed.gov/esa](https://www.azed.gov/esa/)

## Tax Benefits

### Federal
- Child Tax Credit
- Earned Income Tax Credit
- Medical Expense Deduction
- Dependent Care Credit

### Arizona
- Working Poor Tax Credit
- Various exemptions

## Resources

### 211 Arizona
- Dial 211
- Resource referrals

### Arizona Self Help
- [arizonaselfhelp.org](https://arizonaselfhelp.org/)
- Benefits screening

### Benefits.gov
- [benefits.gov](https://www.benefits.gov/)
- Federal benefit finder
',
  ARRAY['Arizona', 'funding', 'AHCCCS', 'SSI', 'ALTCS', 'ABLE'],
  ARRAY['https://www.azahcccs.gov/', 'https://www.azable.gov/']
) ON CONFLICT (region_id, slug) DO NOTHING;
