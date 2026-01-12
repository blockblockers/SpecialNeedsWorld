-- =====================================================
-- ADDITIONAL STATES KNOWLEDGE CONTENT
-- =====================================================
-- Run this AFTER knowledge-resources-setup.sql
-- Adds: Arizona, Texas, Florida, New York

-- =====================================================
-- 1. UPDATE REGIONS TO ACTIVE
-- =====================================================

UPDATE knowledge_regions SET is_active = TRUE WHERE id = 'arizona';
UPDATE knowledge_regions SET is_active = TRUE WHERE id = 'texas';
UPDATE knowledge_regions SET is_active = TRUE WHERE id = 'florida';
UPDATE knowledge_regions SET is_active = TRUE WHERE id = 'new-york';

-- Add Arizona if not exists
INSERT INTO knowledge_regions (id, name, abbreviation, type, emoji, sort_order, is_active)
VALUES ('arizona', 'Arizona', 'AZ', 'state', '🌵', 2, TRUE)
ON CONFLICT (id) DO UPDATE SET is_active = TRUE;


-- =====================================================
-- 2. ARIZONA CONTENT
-- =====================================================

-- Arizona Special Education Overview
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'arizona',
  'education',
  'Arizona Special Education Overview',
  'az-special-ed-overview',
  'Overview of special education in Arizona, including ADE requirements, ESS, and state-specific programs.',
  '# Arizona Special Education Overview

## How Arizona Implements IDEA

Arizona implements federal IDEA through the **Arizona Department of Education (ADE)** Exceptional Student Services (ESS) unit.

## Key Arizona Agencies

### Arizona Department of Education - Exceptional Student Services (ESS)
- Oversees all special education in Arizona
- Website: [azed.gov/specialeducation](https://www.azed.gov/specialeducation/)
- Phone: (602) 542-4013

### Arizona Early Intervention Program (AzEIP)
- Early intervention for children birth to 3
- Part C of IDEA
- Website: [azdes.gov/azeip](https://des.az.gov/services/disabilities/arizona-early-intervention-program)

## Arizona vs Federal Requirements

| Area | Federal IDEA | Arizona |
|------|-------------|---------|
| Evaluation Timeline | 60 days | **60 days** (same) |
| IEP Meeting | Within 30 days of eligibility | **Same** |
| Reevaluation | Every 3 years | **Same** |
| Age Range | 3-21 | **3-22** (can stay until 22nd birthday) |

## Arizona Specific Programs

### Arizona Empowerment Scholarship Account (ESA)
- School choice program for students with disabilities
- Provides funding for private school, therapy, curriculum
- Must have IEP or 504 plan, OR be in foster care, military family, or other categories
- Website: [azed.gov/esa](https://www.azed.gov/esa/)

### Division of Developmental Disabilities (DDD)
- Services for individuals with developmental disabilities
- Similar to California Regional Centers
- Provides: therapies, respite, habilitation, support coordination
- Website: [azdes.gov/ddd](https://des.az.gov/services/disabilities/developmental-disabilities)
- Phone: (844) 770-9500

### Arizona Long Term Care System (ALTCS)
- Medicaid program for people with disabilities
- Covers medical and long-term care services
- Managed through DDD for developmental disabilities

## School Districts & Special Education

Arizona does NOT have SELPAs like California. Each school district:
- Operates its own special education program
- Reports directly to ADE
- Must follow state and federal requirements

### Charter Schools
- Must provide special education services
- Some specialize in serving students with disabilities
- Same IEP requirements as district schools

## Parent Rights in Arizona

Arizona parents have all federal IDEA rights plus:
- Right to Independent Educational Evaluation (IEE) at public expense
- Right to request ESA funding for private options
- Access to Parent Information Network (PIN)

## Resources

### Arizona Parent Information Network (PIN)
- Parent training and information center
- Free support for families
- Phone: 1-800-237-3007

### Raising Special Kids
- Arizona PTI (Parent Training and Information)
- Website: [raisingspecialkids.org](https://raisingspecialkids.org/)
- Phone: (602) 242-4366

### Arizona Center for Disability Law
- Free legal advocacy
- Website: [azdisabilitylaw.org](https://www.azdisabilitylaw.org/)
- Phone: (602) 274-6287
',
  ARRAY['Arizona', 'ADE', 'ESS', 'special education', 'DDD', 'ESA'],
  ARRAY['https://www.azed.gov/specialeducation/', 'https://raisingspecialkids.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Arizona DDD Guide
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'arizona',
  'services',
  'Arizona Division of Developmental Disabilities (DDD)',
  'arizona-ddd',
  'Complete guide to DDD services in Arizona - eligibility, services, and how to apply.',
  '# Arizona Division of Developmental Disabilities (DDD)

## What is DDD?

The **Division of Developmental Disabilities (DDD)** is part of the Arizona Department of Economic Security (DES). It provides services and supports to individuals with developmental disabilities.

## Who is Eligible?

To qualify for DDD, a person must have a **developmental disability** that:
- Began before age 18
- Is expected to continue indefinitely
- Results in substantial functional limitations

### Qualifying Conditions
- Intellectual disability
- Cerebral palsy
- Epilepsy
- Autism
- Conditions closely related to intellectual disability

### Children Under 6
May qualify if they have a developmental delay without a specific diagnosis.

## Services Provided

### Support Coordination
- Assigned Support Coordinator
- Develops Individual Support Plan (ISP)
- Connects you to services

### Therapies
- Speech therapy
- Occupational therapy
- Physical therapy
- Behavioral health services

### Respite Care
- Temporary relief for caregivers
- In-home or out-of-home options
- Planned or emergency respite

### Day Programs
- Day Treatment and Training (DTT)
- Employment services
- Community-based activities

### Residential Services
- Group homes
- Supported living
- In-home support

### Habilitation
- Skills training
- Community living support
- Personal care assistance

### Medical Services
- Through ALTCS (Arizona Long Term Care System)
- Covers medical, dental, vision
- Therapies and equipment

## How to Apply

### Step 1: Contact DDD
- Phone: (844) 770-9500
- Online: [azdes.gov/ddd](https://des.az.gov/services/disabilities/developmental-disabilities)

### Step 2: Complete Application
- Provide documentation of disability
- Medical records, evaluations, school records

### Step 3: Eligibility Determination
- DDD reviews documentation
- May request additional evaluation
- Decision within 60 days

### Step 4: Enrollment
- If eligible, assigned Support Coordinator
- Develop Individual Support Plan (ISP)
- Begin receiving services

## Individual Support Plan (ISP)

The ISP is your service plan that includes:
- Goals and objectives
- Services to be provided
- Who provides them
- How often

**You have the right to:**
- Participate in ISP development
- Choose your service providers
- Request changes anytime
- Appeal decisions

## DDD District Offices

| District | Counties | Phone |
|----------|----------|-------|
| District Central | Maricopa | (602) 771-1900 |
| District South | Pima, Cochise, Santa Cruz | (520) 770-3900 |
| District North | All northern counties | (928) 774-9253 |
| District East | Gila, Graham, Greenlee, Pinal | (520) 866-3420 |

## ALTCS - Arizona Long Term Care System

Most DDD members also receive **ALTCS** benefits:
- Medicaid coverage
- Long-term care services
- Managed by DDD for developmental disabilities

### ALTCS Covers:
- Doctor visits
- Hospital stays
- Prescriptions
- Therapies
- Durable medical equipment
- Dental and vision (limited)

## Rights & Advocacy

### If You Disagree with DDD
1. Talk to your Support Coordinator
2. Request a meeting with supervisor
3. File a grievance
4. Request a Fair Hearing

### Arizona Center for Disability Law
- Free legal advocacy
- Phone: (602) 274-6287
- Can help with DDD issues

## Important Notes

- DDD services are **free** for eligible individuals
- No income requirements for eligibility
- ALTCS has income/asset limits but many qualify
- Services available across the lifespan
',
  ARRAY['DDD', 'Arizona', 'developmental disabilities', 'ALTCS', 'ISP'],
  ARRAY['https://des.az.gov/services/disabilities/developmental-disabilities']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Arizona ESA Program
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'arizona',
  'funding',
  'Arizona Empowerment Scholarship Account (ESA)',
  'arizona-esa',
  'School choice funding for students with disabilities - how ESA works and how to apply.',
  '# Arizona Empowerment Scholarship Account (ESA)

## What is ESA?

The **Empowerment Scholarship Account (ESA)** is Arizona''s school choice program. It provides state funding directly to families to use for educational expenses.

## Who is Eligible?

Students who:
- Have a disability and have/had an IEP or 504 plan
- Are in foster care
- Have a parent in military
- Live on Native American reservation
- Attend a D or F rated school
- Have a sibling with ESA
- **As of 2022: ALL Arizona students are eligible**

## How Much Funding?

The amount varies by student but is approximately:
- **$6,500 - $7,000** for general education students
- **$25,000 - $40,000+** for students with disabilities (based on disability category)

Students with more significant disabilities receive higher funding.

## What Can ESA Pay For?

### Tuition
- Private school tuition
- Online school programs
- Microschools

### Therapies
- Speech therapy
- Occupational therapy
- Physical therapy
- ABA therapy
- Counseling

### Curriculum & Materials
- Textbooks
- Educational software
- Curriculum packages
- Educational apps

### Services
- Tutoring
- Educational therapies
- Testing fees

### Special Needs Services
- Specialized instruction
- Paraprofessional services
- Assistive technology

## What ESA Cannot Pay For

- Non-educational expenses
- Toys or games (unless educational)
- Food or clothing
- Transportation (with some exceptions)
- Services from family members

## How to Apply

### Step 1: Create ClassWallet Account
- ESA uses ClassWallet for payments
- Website: [azed.gov/esa](https://www.azed.gov/esa/)

### Step 2: Submit Application
- Online through ESA portal
- Include required documentation:
  - Proof of Arizona residency
  - Birth certificate
  - IEP or 504 plan (for disability category)

### Step 3: Sign Contract
- Review and sign ESA contract
- Agree to terms and conditions

### Step 4: Withdraw from Public School
- Must withdraw from public school to receive ESA
- Cannot receive ESA and attend public school

### Step 5: Receive Funds
- Quarterly deposits to ClassWallet
- Use for approved expenses
- Keep receipts!

## Important Considerations

### Giving Up IDEA Rights
⚠️ **When you accept ESA and leave public school:**
- You give up right to FAPE (Free Appropriate Public Education)
- Private schools don''t have to follow IEP
- No due process rights at private school
- Can return to public school, but new IEP process starts

### Private School IEPs
- Private schools may offer their own service plans
- These are NOT legal IEPs
- Less accountability than public school

### When ESA Makes Sense
✅ Good fit if:
- Public school isn''t meeting needs despite advocacy
- Found a private program that specializes in your child''s needs
- Want more control over therapies and providers
- Need ABA or other services not provided by district

❌ Consider carefully if:
- Public school is working well
- Need the legal protections of IDEA
- Private options in your area are limited

## Managing Your ESA

### ClassWallet
- Online portal for purchases
- Pre-approval needed for some expenses
- Must submit receipts
- Regular audits by ADE

### Quarterly Funding
- Funds deposited 4 times per year
- Must use within the year
- Can roll over up to $10,000

### Record Keeping
- Keep all receipts
- Document educational purpose
- Be prepared for audits

## Resources

- **ADE ESA Office**: (602) 542-8293
- **ESA Website**: [azed.gov/esa](https://www.azed.gov/esa/)
- **ClassWallet Support**: Available through portal
',
  ARRAY['ESA', 'Arizona', 'school choice', 'funding', 'private school'],
  ARRAY['https://www.azed.gov/esa/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Arizona IEP Guide
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'arizona',
  'education',
  'Arizona IEP Guide',
  'az-iep-guide',
  'Arizona-specific IEP information including state requirements and parent rights.',
  '# Arizona IEP Guide

## Arizona IEP Requirements

Arizona follows federal IDEA requirements with some state-specific procedures.

## Key Arizona Differences

### Extended Age Range
- **Federal**: Services until age 21
- **Arizona**: Services until **22nd birthday** (can stay through the school year in which they turn 22)

### Summer Services
Arizona requires consideration of Extended School Year (ESY) services for all students with IEPs.

## IEP Team Members

Required in Arizona:
- Parent/guardian
- Regular education teacher
- Special education teacher
- LEA representative (district)
- Person to interpret evaluations
- Student (when appropriate, required for transition)
- Others as needed

## Arizona IEP Process

### Referral
- Anyone can refer a child for evaluation
- School must respond within **reasonable time**
- Written notice to parents required

### Evaluation
- Parent consent required
- Completed within **60 calendar days**
- Comprehensive, non-discriminatory assessment

### Eligibility Meeting
- Within **30 days** of evaluation completion
- Team determines if child qualifies
- 13 disability categories (same as federal)

### IEP Development
- If eligible, IEP developed within **30 days**
- Parent is equal team member
- IEP implemented immediately after consent

## Arizona Specific Procedures

### Prior Written Notice
Arizona requires written notice before:
- Proposing to change identification, evaluation, or placement
- Refusing to change identification, evaluation, or placement
- Must include explanation and data used

### Consent Requirements
Parent consent needed for:
- Initial evaluation
- Initial services
- Reevaluation (in most cases)
- Any change in placement

## Transition Services in Arizona

Starting at **age 16** (or younger if appropriate):
- Transition goals required in IEP
- Post-secondary goals for education, employment, independent living
- Invite student to IEP meetings
- Coordinate with adult service agencies

### Arizona Transition Agencies
- Vocational Rehabilitation (VR)
- DDD (for eligible individuals)
- Arizona@Work

## Dispute Resolution in Arizona

### 1. IEP Facilitation
- Free service from ADE
- Neutral facilitator helps IEP meeting
- Request through ADE ESS

### 2. Mediation
- Free, voluntary process
- Neutral mediator
- Agreements are binding

### 3. State Complaint
- File with ADE within 1 year
- Investigated within 60 days
- Can result in corrective action

### 4. Due Process Hearing
- Formal legal proceeding
- File within 2 years
- Heard by impartial hearing officer

## Parent Rights in Arizona

All federal IDEA rights apply, plus:
- Right to receive IEP in primary language
- Right to interpreter at meetings
- Right to request ESA as alternative

## Arizona Resources

### Raising Special Kids (PTI)
- Parent training center
- Phone: (602) 242-4366
- Website: [raisingspecialkids.org](https://raisingspecialkids.org/)

### Arizona Center for Disability Law
- Free legal advocacy
- Phone: (602) 274-6287

### ADE Exceptional Student Services
- State oversight
- Phone: (602) 542-4013
- Website: [azed.gov/specialeducation](https://www.azed.gov/specialeducation/)

## Tips for Arizona Families

✅ **DO:**
- Keep copies of all documents
- Know your timeline rights
- Use Raising Special Kids for support
- Consider ESA if public school isn''t working

❌ **DON''T:**
- Let timelines slip without documentation
- Sign IEP if you disagree (write disagreement)
- Give up - you have rights!
',
  ARRAY['IEP', 'Arizona', 'special education', 'parent rights'],
  ARRAY['https://www.azed.gov/specialeducation/', 'https://raisingspecialkids.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- 3. TEXAS CONTENT
-- =====================================================

-- Texas Special Education Overview
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'texas',
  'education',
  'Texas Special Education Overview',
  'tx-special-ed-overview',
  'Overview of special education in Texas, including TEA requirements, ESCs, and state programs.',
  '# Texas Special Education Overview

## How Texas Implements IDEA

Texas implements federal IDEA through the **Texas Education Agency (TEA)** and 20 regional **Education Service Centers (ESCs)**.

## Key Texas Agencies

### Texas Education Agency (TEA)
- State education agency
- Oversees special education compliance
- Website: [tea.texas.gov/specialed](https://tea.texas.gov/academics/special-student-populations/special-education)

### Education Service Centers (ESCs)
- 20 regional centers across Texas
- Provide training and support to districts
- Help with evaluations and services
- [Find your ESC](https://tea.texas.gov/about-tea/other-services/education-service-centers)

## Texas vs Federal Requirements

| Area | Federal IDEA | Texas |
|------|-------------|-------|
| Evaluation Timeline | 60 days | **45 school days** ⚠️ |
| IEP Meeting | 30 days after eligibility | **30 calendar days** |
| Annual Review | At least annually | **Same** |
| ARD Committee | IEP Team | **Called ARD** (Admission, Review, Dismissal) |

⚠️ **Important**: Texas has a **shorter evaluation timeline** than federal law!

## Texas Specific Terms

In Texas, the IEP team is called the **ARD Committee** (Admission, Review, Dismissal):
- Same function as IEP team
- ARD meeting = IEP meeting
- ARD document = IEP document

## Texas Specific Programs

### Health and Human Services Commission (HHSC)
- Oversees disability services
- Medicaid programs
- Long-term care

### CLASS Program
- Community Living Assistance and Support Services
- Waiver program for people with disabilities
- Home and community-based services

### MDCP (Medically Dependent Children Program)
- For children who are medically fragile
- Home-based care alternative to nursing facility

### HCS (Home and Community-based Services)
- For individuals with intellectual disabilities
- Waiver program with various services

## Parent Rights Specific to Texas

### 10-Day Rule
- Parents must receive ARD notice at least **5 school days** before meeting
- Can waive with mutual agreement

### Audio Recording
- Either party may record ARD meetings
- Must give 24-hour notice

### Recess ARD
- If agreement isn''t reached, either party can recess
- Must reconvene within **10 school days**

## Resources

### Texas Partners Resource Network
- Parent training center
- Phone: 1-800-866-4726
- Website: [partnerstx.org](https://www.partnerstx.org/)

### Disability Rights Texas
- Free legal advocacy
- Phone: 1-800-252-9108
- Website: [disabilityrightstx.org](https://www.disabilityrightstx.org/)

### SPEDTex
- TEA special education website
- Website: [spedtex.org](https://www.spedtex.org/)
',
  ARRAY['Texas', 'TEA', 'ARD', 'special education', 'ESC'],
  ARRAY['https://tea.texas.gov/academics/special-student-populations/special-education', 'https://www.spedtex.org/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Texas ARD Guide
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'texas',
  'education',
  'Texas ARD Meeting Guide',
  'tx-ard-guide',
  'Guide to ARD (Admission, Review, Dismissal) meetings in Texas - the state''s IEP process.',
  '# Texas ARD Meeting Guide

## What is an ARD?

In Texas, the **ARD Committee** (Admission, Review, Dismissal) is equivalent to the IEP team in other states. The ARD meeting is where the IEP is developed.

## ARD Committee Members

Required members:
- Parent/guardian
- Regular education teacher
- Special education teacher
- District representative (can commit resources)
- Person to interpret evaluations
- Student (when appropriate, required at age 14+ for transition)
- Others as requested

## Types of ARD Meetings

### Initial ARD
- First meeting after evaluation
- Determines eligibility
- Develops first IEP if eligible

### Annual ARD
- At least once per year
- Reviews and updates IEP
- Checks progress on goals

### Review ARD
- Requested by parent or school
- Address concerns or changes
- Can happen anytime

### Dismissal ARD
- When student no longer qualifies
- Or when student graduates/ages out

## Texas ARD Timeline

1. **Referral received**
2. **Notice sent** - within reasonable time
3. **Consent obtained** - from parent
4. **Evaluation completed** - within **45 school days** ⚠️
5. **ARD meeting** - within **30 calendar days** of eligibility

## Your Rights at ARD Meetings

### Before the Meeting
- Receive notice **5 school days** in advance
- Request meeting at mutually agreeable time
- Bring advocates, attorneys, or support persons
- Review evaluation reports before meeting

### During the Meeting
- Be an equal participant
- Ask questions
- Disagree and discuss
- Request recess if needed
- Audio record (with 24-hour notice)

### After the Meeting
- Receive copy of IEP
- Don''t have to sign if you disagree
- Can write disagreement on IEP
- Request reconvene within 10 days

## The 10-Day Recess Rule

If you cannot reach agreement:
1. Either party can request to **recess** the ARD
2. Must **reconvene within 10 school days**
3. Use time to gather information, consult experts
4. If still no agreement, district implements its proposal
5. Parent can file for due process

## Consensus vs. Agreement

- ARD decisions should be by **consensus** when possible
- If no consensus, **district makes final decision**
- Parent can disagree and pursue dispute resolution
- Student stays in current placement during disputes (stay put)

## Tips for Successful ARDs

### Preparation
- Review current IEP and progress reports
- List your concerns and questions
- Bring documentation to support requests
- Consider bringing a support person

### During Meeting
- Stay calm and focused on child''s needs
- Take notes or record
- Ask for clarification when needed
- Don''t be rushed - request recess if needed

### Disagreements
- Clearly state your disagreement
- Write it on the IEP document
- Don''t sign agreement page if you disagree
- Know your dispute resolution options

## Dispute Resolution Options

1. **Request reconvened ARD** - Try again with more information
2. **Facilitated ARD** - Neutral facilitator helps (free from TEA)
3. **Mediation** - Neutral mediator (free from TEA)
4. **State Complaint** - File with TEA
5. **Due Process Hearing** - Formal legal proceeding

## Resources

- **Texas Partners Resource Network**: 1-800-866-4726
- **Disability Rights Texas**: 1-800-252-9108
- **TEA Special Education**: [tea.texas.gov/specialed](https://tea.texas.gov/academics/special-student-populations/special-education)
',
  ARRAY['ARD', 'Texas', 'IEP', 'special education'],
  ARRAY['https://tea.texas.gov/academics/special-student-populations/special-education'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- 4. FLORIDA CONTENT
-- =====================================================

-- Florida Special Education Overview
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'florida',
  'education',
  'Florida Special Education Overview',
  'fl-special-ed-overview',
  'Overview of special education in Florida, including FDOE requirements, ESE, and state programs.',
  '# Florida Special Education Overview

## How Florida Implements IDEA

Florida implements federal IDEA through the **Florida Department of Education (FDOE)** Bureau of Exceptional Education and Student Services (BEESS).

## Key Terms in Florida

Florida uses **ESE** (Exceptional Student Education) instead of "special education":
- ESE = Special Education
- ESE Student = Student with disability
- ESE Services = Special education services

## Key Florida Agencies

### Florida Department of Education - BEESS
- State oversight of exceptional education
- Website: [fldoe.org/ese](https://www.fldoe.org/academics/exceptional-student-edu/)
- Phone: (850) 245-0475

### Agency for Persons with Disabilities (APD)
- Services for developmental disabilities
- Similar to Regional Centers (CA) or DDD (AZ)
- Website: [apd.myflorida.com](https://apd.myflorida.com/)

## Florida vs Federal Requirements

| Area | Federal IDEA | Florida |
|------|-------------|---------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days after eligibility | **30 calendar days** |
| Reevaluation | Every 3 years | **Same** |
| Age Range | 3-21 | **3-22** (through school year of 22nd birthday) |

## Florida Specific Programs

### Gardiner Scholarship (ESA)
- School choice for students with disabilities
- Tax-credit scholarship program
- Covers: private school, therapy, curriculum
- Website: [stepupforstudents.org](https://www.stepupforstudents.org/)

### Family Care Council
- Regional councils for APD families
- Advocacy and support
- 15 councils statewide

### Florida Diagnostic and Learning Resources System (FDLRS)
- Support for districts and families
- 19 centers across Florida
- Assistive technology, training

## McKay Scholarship Program

Now part of the **Family Empowerment Scholarship** program:
- For students with IEPs
- Covers private school tuition
- Can include transportation

## Parent Rights in Florida

### Matrix of Services
Florida requires a **Matrix of Services** level (251-255) be determined:
- Used for funding allocation
- Higher numbers = more intensive needs
- Doesn''t determine services (IEP does)

### 10-Day Rule
- Schools must provide IEP within **10 school days** of eligibility determination

## Resources

### Florida Parent Training and Information Center
- Parent support and training
- Website: [fldoe.org/ese/parent](https://www.fldoe.org/academics/exceptional-student-edu/parent-info/)

### Disability Rights Florida
- Free legal advocacy
- Phone: 1-800-342-0823
- Website: [disabilityrightsflorida.org](https://disabilityrightsflorida.org/)

### Family Network on Disabilities
- Parent training center
- Phone: 1-800-825-5736
- Website: [fndusa.org](https://fndusa.org/)
',
  ARRAY['Florida', 'ESE', 'FDOE', 'special education', 'Gardiner'],
  ARRAY['https://www.fldoe.org/academics/exceptional-student-edu/', 'https://apd.myflorida.com/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- 5. NEW YORK CONTENT
-- =====================================================

-- New York Special Education Overview
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'new-york',
  'education',
  'New York Special Education Overview',
  'ny-special-ed-overview',
  'Overview of special education in New York, including NYSED requirements, CPSE/CSE, and state programs.',
  '# New York Special Education Overview

## How New York Implements IDEA

New York implements federal IDEA through the **New York State Education Department (NYSED)** Office of Special Education.

## Key Terms in New York

### CPSE - Committee on Preschool Special Education
- For children ages 3-5
- County-based (not school district)

### CSE - Committee on Special Education
- For school-age students (5-21)
- School district-based
- Equivalent to IEP team

## New York vs Federal Requirements

| Area | Federal IDEA | New York |
|------|-------------|----------|
| Evaluation Timeline | 60 days | **60 school days** |
| IEP Meeting | 30 days | **60 school days from consent** |
| Preschool | Part B at age 3 | **CPSE system** (county-based) |
| Reevaluation | Every 3 years | **Same** |

## New York Specific Structure

### Preschool (Ages 3-5) - CPSE
- Administered by **county** (not school district)
- County pays for services
- Services often provided by approved agencies
- Transition to CSE at age 5

### School Age (5-21) - CSE
- Administered by school district
- Committee includes: parent, teacher, district rep, parent member
- **Parent Member**: A parent of another student with disability in the district

## Committee Members

### CPSE (Preschool)
- Parent
- Regular education teacher (if applicable)
- Special education teacher
- County representative
- Evaluator(s)
- Others as needed

### CSE (School Age)
- Parent
- Regular education teacher
- Special education teacher
- District representative
- Parent Member (another parent)
- Student (when appropriate)
- Others as needed

## New York Specific Programs

### OPWDD (Office for People With Developmental Disabilities)
- Services for developmental disabilities
- Similar to Regional Centers
- Website: [opwdd.ny.gov](https://opwdd.ny.gov/)

### Medicaid Service Coordination
- For OPWDD-eligible individuals
- Helps coordinate services

### NYS Special Education Impartial Hearing System
- Due process hearings
- More formal than some states

## Parent Rights in New York

### 12-Month Services
New York requires consideration of **12-month services** (extended school year) for students who would significantly regress.

### Declassification Support Services
When a student exits special education, they may receive support services for up to 1 year.

### 5-Day Notice
Parents must receive notice at least **5 days** before CSE meeting (can waive).

## Resources

### Parent to Parent NY
- Parent matching program
- Website: [parenttoparentnys.org](https://parenttoparentnys.org/)

### Advocates for Children of New York
- Free legal advocacy (NYC)
- Website: [advocatesforchildren.org](https://www.advocatesforchildren.org/)

### NYSED Special Education
- State resources
- Website: [nysed.gov/specialeducation](http://www.nysed.gov/special-education)

### INCLUDEnyc
- NYC family resource center
- Website: [includenyc.org](https://includenyc.org/)
',
  ARRAY['New York', 'NYSED', 'CSE', 'CPSE', 'special education', 'OPWDD'],
  ARRAY['http://www.nysed.gov/special-education', 'https://opwdd.ny.gov/'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;


-- =====================================================
-- 6. ADD MORE GLOSSARY TERMS
-- =====================================================

INSERT INTO knowledge_glossary (term, abbreviation, definition, region_id, category_id) VALUES
('Admission, Review, and Dismissal', 'ARD', 'Texas term for the IEP team and IEP meeting process.', 'texas', 'education'),
('Exceptional Student Education', 'ESE', 'Florida term for special education services.', 'florida', 'education'),
('Committee on Special Education', 'CSE', 'New York school-age IEP team (ages 5-21).', 'new-york', 'education'),
('Committee on Preschool Special Education', 'CPSE', 'New York preschool IEP team (ages 3-5).', 'new-york', 'education'),
('Education Service Center', 'ESC', 'Texas regional support centers for school districts.', 'texas', 'education'),
('Division of Developmental Disabilities', 'DDD', 'Arizona agency providing services for people with developmental disabilities.', 'arizona', 'services'),
('Empowerment Scholarship Account', 'ESA', 'Arizona school choice program providing education funding directly to families.', 'arizona', 'funding'),
('Agency for Persons with Disabilities', 'APD', 'Florida agency serving people with developmental disabilities.', 'florida', 'services'),
('Office for People With Developmental Disabilities', 'OPWDD', 'New York agency serving people with developmental disabilities.', 'new-york', 'services'),
('Gardiner Scholarship', NULL, 'Florida school choice scholarship for students with disabilities.', 'florida', 'funding')
ON CONFLICT DO NOTHING;
