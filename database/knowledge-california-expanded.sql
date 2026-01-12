-- =====================================================
-- EXPANDED CALIFORNIA CONTENT
-- =====================================================
-- Run AFTER knowledge-resources-setup.sql

-- California Parent Rights
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls, has_state_differences)
VALUES (
  'california',
  'rights',
  'California Parent Rights in Special Education',
  'ca-parent-rights',
  'Comprehensive guide to parent rights under California special education law.',
  '# California Parent Rights in Special Education

## Your Rights Under California Law

California provides **additional protections** beyond federal IDEA. Know your rights!

## Before Evaluation

### Right to Request Evaluation
- You can request an evaluation **in writing** at any time
- School must respond within **15 days** with assessment plan
- You have **15 days** to consent to the plan
- Evaluation must be completed within **60 days** of your consent

### Assessment Plan Must Include
- Tests to be used
- Areas to be assessed
- Personnel who will conduct assessments
- Your rights explained

## IEP Meeting Rights

### Scheduling
- **10 days written notice** required (unless you waive)
- Meeting at mutually agreeable time and place
- You can request to reschedule
- Virtual participation allowed

### Participation
- You are an **equal member** of the IEP team
- Bring anyone you want (advocate, friend, attorney)
- Bring an interpreter if needed (district must provide)
- Request breaks or continue another day

### Recording
- You may **audio record** the IEP meeting
- Must give **24-hour notice** to district
- District may also record with notice
- Video recording requires mutual consent

## During the IEP Process

### Prior Written Notice
District must give written notice before:
- Proposing to change identification or placement
- Refusing to change identification or placement
- Any change to IEP services

### Informed Consent Required For
- Initial evaluation
- Initial placement in special education
- Reevaluation
- Changes in placement

### Your Right to Disagree
- You do NOT have to sign the IEP
- Write your disagreement on the IEP document
- Request another meeting
- Consent to part of the IEP (partial consent)

## Independent Educational Evaluation (IEE)

### Your Right to IEE
- If you disagree with district''s evaluation
- Request IEE **at public expense**
- District must either pay for IEE OR request due process
- You can get private evaluation at your own expense anytime

### IEE Requirements
- Evaluator must meet district qualifications
- District can set cost limits (but must be reasonable)
- Must be considered by IEP team

## Records Rights

### Access to Records
- Right to **inspect and review** all educational records
- Within **5 business days** of request
- Right to copies (may charge reasonable fee)
- Right to explanation of records

### Amend Records
- Request to change inaccurate information
- District must respond within 30 days
- If refused, you can add statement to file

## Dispute Resolution Rights

### Informal Resolution
- Talk to teacher, case manager, principal
- Request IEP meeting
- Contact SELPA

### Formal Options
1. **Alternative Dispute Resolution (ADR)**
   - Free IEP facilitation
   - Voluntary for both parties

2. **Mediation**
   - Free through California Department of Education
   - Neutral mediator
   - Agreements are legally binding

3. **State Compliance Complaint**
   - File with CDE within 1 year
   - Investigated within 60 days
   - Written decision with corrective actions

4. **Due Process Hearing**
   - File within 2 years
   - Formal legal proceeding
   - Decision within 45 days
   - Can appeal to court

## Stay Put Rights

During disputes:
- Child **stays in current placement**
- Cannot be moved without your consent
- Applies during due process and appeals
- Exception: weapons, drugs, serious injury

## Compensatory Education

If district failed to provide FAPE:
- You may be entitled to **make-up services**
- Can request through IEP, complaint, or due process
- No specific time limit in California

## Translation Rights

### Documents
- IEP and notices in your **primary language**
- Assessment reports translated
- Procedural safeguards in your language

### Meetings
- Free interpreter provided
- Must request if needed
- Cannot use child as interpreter

## Resources for Parents

### Disability Rights California
- Free legal advocacy
- Phone: 1-800-776-5746
- Website: [disabilityrightsca.org](https://www.disabilityrightsca.org/)

### Community Advisory Committee (CAC)
- Parent advisory group in each SELPA
- Ask district for contact information

### Office of Administrative Hearings
- Due process filings
- Phone: (916) 263-0880
',
  ARRAY['California', 'parent rights', 'IEP', 'due process', 'advocacy'],
  ARRAY['https://www.disabilityrightsca.org/', 'https://www.cde.ca.gov/sp/se/qa/pssummary.asp'],
  TRUE
) ON CONFLICT (region_id, slug) DO NOTHING;

-- California Early Intervention
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'california',
  'services',
  'California Early Start Program (Birth to 3)',
  'ca-early-start',
  'Early intervention services for infants and toddlers with disabilities or delays in California.',
  '# California Early Start Program

## What is Early Start?

**Early Start** is California''s early intervention program for infants and toddlers (birth to 36 months) who have disabilities or are at risk of developmental delays. It implements Part C of IDEA.

## Who is Eligible?

### Automatic Eligibility
Children with established risk conditions:
- Down syndrome
- Cerebral palsy
- Hearing or vision impairment
- Other diagnosed conditions

### Developmental Delay
Children with significant delay in one or more areas:
- Cognitive development
- Physical development (fine/gross motor)
- Communication
- Social/emotional development
- Adaptive (self-help) skills

### High Risk
Children at high risk for delays due to:
- Very low birth weight
- Prenatal substance exposure
- Medical complications

## Who Provides Services?

### Regional Centers
- 21 Regional Centers across California
- Coordinate Early Start services
- Provide service coordination
- [Find your Regional Center](https://www.dds.ca.gov/rc/)

### Local Educational Agencies (LEAs)
- School districts may also provide services
- Especially for children with solely low-incidence disabilities

## The IFSP - Individualized Family Service Plan

The IFSP is the early intervention equivalent of an IEP.

### IFSP Must Include
- Child''s present levels of development
- Family concerns, priorities, resources
- Outcomes expected
- Early intervention services
- Service coordinator name
- Transition plan (to preschool)

### IFSP Process
1. Referral (anyone can refer)
2. Evaluation within **45 days**
3. IFSP meeting
4. Services begin
5. Review every **6 months** (minimum)
6. Annual IFSP meeting

## Early Start Services

Services are provided in **natural environments**:
- Home
- Child care
- Community settings

### Available Services
- Special instruction
- Speech therapy
- Occupational therapy
- Physical therapy
- Family training/counseling
- Service coordination
- Assistive technology
- Vision/hearing services
- Nutrition services
- Social work services

## Cost

- **No cost** to families for core Early Start services
- Some services may require insurance billing
- Cannot deny services due to inability to pay

## Transition to Preschool

At age 3, children transition from Early Start to preschool special education.

### Transition Timeline
- Begin planning at **2 years, 6 months**
- Transition conference before 3rd birthday
- IEP developed before age 3
- Seamless transition goal

### Options at Age 3
- Special education preschool (through school district)
- Continue with Regional Center (if eligible for Lanterman Act)
- Community preschool with supports

## How to Get Started

### Step 1: Contact Regional Center
- Call your local Regional Center
- Request Early Start evaluation
- Phone: [Find your RC](https://www.dds.ca.gov/rc/)

### Step 2: Evaluation
- Comprehensive developmental assessment
- Family assessment (optional)
- Completed within 45 days

### Step 3: IFSP Meeting
- Develop service plan
- Choose services and providers
- Begin services

## Parent Rights in Early Start

- Informed consent for evaluation and services
- Participate in all decisions
- Accept or decline services
- Access to records
- Confidentiality protections
- Dispute resolution options

## Resources

### Family Resource Centers Network
- [frcnca.org](https://frcnca.org/)
- Support for families in Early Start

### California Department of Developmental Services
- [dds.ca.gov](https://www.dds.ca.gov/)
- Early Start information

### WarmLine Family Resource Center
- Phone: 1-800-660-4Academy
- Information and referral
',
  ARRAY['Early Start', 'California', 'early intervention', 'IFSP', 'birth to 3', 'Regional Center'],
  ARRAY['https://www.dds.ca.gov/services/early-start/', 'https://frcnca.org/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- California Transition Services
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'california',
  'transition',
  'California Transition Services (Age 16-22)',
  'ca-transition',
  'Planning for life after high school - employment, education, and independent living in California.',
  '# California Transition Services

## What is Transition?

**Transition services** help students with disabilities prepare for life after high school, including:
- Employment
- Post-secondary education
- Independent living
- Community participation

## When Does Transition Planning Start?

### Federal Requirement
- Begin at age **16** (or younger if appropriate)

### California Recommendation
- Begin discussions at age **14**
- Formal planning at age 16

## Transition IEP Requirements

Starting at age 16, the IEP must include:

### Measurable Post-Secondary Goals
Goals for after high school in these areas:
- **Education/Training** - College, trade school, job training
- **Employment** - Competitive work, supported employment
- **Independent Living** - Where applicable

### Transition Services
Activities to help reach goals:
- Instruction
- Related services
- Community experiences
- Employment objectives
- Daily living skills (if needed)
- Functional vocational evaluation (if needed)

### Age-Appropriate Assessments
- Interest inventories
- Career assessments
- Independent living assessments
- Used to develop post-secondary goals

## California Transition Agencies

### Department of Rehabilitation (DOR)
- Vocational rehabilitation services
- Job training and placement
- Assistive technology for work
- **Contact DOR at age 16**
- Website: [dor.ca.gov](https://www.dor.ca.gov/)

### Regional Centers
- For individuals with developmental disabilities
- Adult services after age 22
- Supported employment
- Day programs
- Independent living support

### WorkAbility I
- School-based work experience
- Job coaching
- Career exploration
- Ask your school about this program

## Student Involvement

### Invite Student to IEP
- **Required** at age 16
- Student should lead parts of meeting
- Self-advocacy skill development

### Student Rights at Age 18
- **Transfer of rights** at age 18
- Student becomes own educational decision-maker
- Unless conservatorship established
- Parent can still attend and support

## Diploma Options in California

### High School Diploma
- Meet all graduation requirements
- Pass required courses
- **Ends IDEA eligibility**

### Certificate of Completion
- Complete IEP goals
- Does not end IDEA eligibility
- Student can stay until age 22

### Staying Until 22
- Students can stay through the school year they turn 22
- Continue transition services
- Work on employment and independence

## College and Career Readiness

### Community College
- **Disabled Students Programs and Services (DSPS)**
- Accommodations and support
- Priority registration
- No IEP in college (use disability services)

### California State University / UC
- Disability Resource Centers
- Request accommodations with documentation
- Different process than K-12

### Trade Schools & Apprenticeships
- Many options available
- DOR can help fund training
- WorkAbility programs

## Employment Services

### Competitive Integrated Employment
- Goal is real jobs in the community
- Minimum wage or higher
- Working alongside non-disabled coworkers

### Supported Employment
- Job coaching
- On-the-job support
- Through Regional Center or DOR

### Paid Internship Program (PIP)
- Through DOR
- Work experience with pay
- Pathway to employment

## Independent Living Centers

California has Independent Living Centers that help with:
- Housing
- Transportation
- Benefits counseling
- Self-advocacy
- Peer support

Find your local ILC: [calsilc.org](https://calsilc.org/)

## Timeline for Transition Planning

| Age | Actions |
|-----|---------|
| 14 | Begin informal career exploration |
| 16 | Formal transition plan in IEP, invite DOR |
| 17 | Apply for SSI if needed, plan for healthcare |
| 18 | Transfer of rights, register to vote |
| 18-22 | Continue transition services |
| 22 | Exit school, adult services begin |

## Resources

### California Transition Alliance
- [catransitionalliance.org](https://catransitionalliance.org/)

### Department of Rehabilitation
- [dor.ca.gov](https://www.dor.ca.gov/)
- Phone: 1-800-952-5544

### Regional Center (for eligible individuals)
- [dds.ca.gov/rc](https://www.dds.ca.gov/rc/)
',
  ARRAY['transition', 'California', 'employment', 'college', 'DOR', 'age 22'],
  ARRAY['https://www.dor.ca.gov/', 'https://catransitionalliance.org/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- California Funding & Financial Help
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'california',
  'funding',
  'California Financial Resources for Families',
  'ca-financial-resources',
  'Financial assistance programs, insurance, and funding sources for families of children with special needs in California.',
  '# California Financial Resources

## Medi-Cal (California Medicaid)

### What is Medi-Cal?
California''s Medicaid program providing healthcare coverage.

### Who Qualifies?
- Income-based eligibility
- Children in foster care
- SSI recipients (automatic)
- Pregnant women
- Some working adults

### What Does Medi-Cal Cover?
- Doctor visits
- Hospital stays
- Prescriptions
- Therapies (OT, PT, Speech)
- Durable medical equipment
- Mental health services
- Dental (Denti-Cal)

### How to Apply
- Online: [coveredca.com](https://www.coveredca.com/) or [benefitscal.com](https://benefitscal.com/)
- Phone: 1-800-541-5555
- In person: County social services office

## California Children''s Services (CCS)

### What is CCS?
Program for children with certain physical conditions needing specialized care.

### Who Qualifies?
- Under age 21
- Have an eligible medical condition
- California resident
- Meet income guidelines (or have condition on no-income list)

### CCS Covers
- Specialty medical care
- Physical and occupational therapy
- Medical equipment
- Case management

### Eligible Conditions Include
- Cerebral palsy
- Hemophilia
- Heart conditions
- Cancer
- Cystic fibrosis
- Many orthopedic conditions

### How to Apply
- Through county CCS program
- Referral from doctor
- Phone: Contact your county CCS office

## In-Home Supportive Services (IHSS)

### What is IHSS?
Program that pays for in-home care so people can remain safely at home.

### Who Qualifies?
- Medi-Cal eligible
- Need help with daily activities
- Live at home (not in facility)

### Services Covered
- Bathing, grooming, dressing
- Meal preparation
- Housework and laundry
- Shopping and errands
- Transportation to medical appointments
- Protective supervision (for some)

### Who Can Be the Provider?
- Family member (including parent for child under 18 in some cases)
- Friend
- Professional caregiver

### How to Apply
- Contact county social services
- Request IHSS application
- In-home assessment scheduled

## Supplemental Security Income (SSI)

### What is SSI?
Federal cash assistance for people with disabilities with limited income.

### Child SSI
- Child must have a disability
- Family must have limited income and resources
- Can apply at any age

### Adult SSI
- At age 18, child''s income/resources considered (not parents'')
- Many more qualify as adults
- Apply before 18th birthday

### SSI Amount (2024)
- Approximately $943/month (federal)
- California adds State Supplementary Payment (SSP)
- Total varies

### How to Apply
- Social Security Administration
- Online: [ssa.gov](https://www.ssa.gov/)
- Phone: 1-800-772-1213
- In person: Local SSA office

## Regional Center Funding

### For Eligible Individuals
Regional Centers provide or fund many services:
- Respite care
- Day programs
- Supported living
- Transportation
- Behavioral services
- And more

### Family Cost Participation
- Some services have sliding scale fees
- Based on family income
- Many services are free

## ABLE Accounts

### What is ABLE?
Tax-advantaged savings account for people with disabilities.

### Benefits
- Save money without losing SSI/Medi-Cal
- Up to $100,000 without affecting SSI
- Tax-free growth
- Use for disability-related expenses

### California ABLE (CalABLE)
- Website: [calable.ca.gov](https://www.calable.ca.gov/)
- No minimum to open
- Low fees

### Eligible Expenses
- Education
- Housing
- Transportation
- Assistive technology
- Healthcare
- Employment support

## Special Needs Trusts

### Purpose
Protect assets while maintaining benefit eligibility.

### Types
- **First-Party Trust** - Funded with individual''s own money
- **Third-Party Trust** - Funded by family/others
- **Pooled Trust** - Managed by nonprofit

### When to Consider
- Receiving inheritance
- Personal injury settlement
- Saving for future needs

### Get Legal Help
- Special needs planning attorney
- Regional Center can provide referrals

## Tax Benefits

### Federal
- **Child Tax Credit**
- **Earned Income Tax Credit**
- **Medical Expense Deduction** (over 7.5% of AGI)
- **Child and Dependent Care Credit**

### California
- **CA Earned Income Tax Credit**
- **Young Child Tax Credit**
- Medical expense deductions

## Resources

### Disability Rights California
- Benefits assistance
- Phone: 1-800-776-5746

### Family Resource Centers
- Help navigating systems
- [frcnca.org](https://frcnca.org/)

### 211
- Dial 211 for local resources
- Or [211.org](https://www.211.org/)
',
  ARRAY['California', 'funding', 'Medi-Cal', 'SSI', 'IHSS', 'CCS', 'ABLE'],
  ARRAY['https://www.dhcs.ca.gov/', 'https://www.cdss.ca.gov/in-home-supportive-services']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- California Helpful Contacts
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'california',
  'resources',
  'California Special Needs Contacts & Hotlines',
  'ca-contacts',
  'Important phone numbers, websites, and organizations for families in California.',
  '# California Special Needs Contacts & Hotlines

## Emergency & Crisis

### 988 Suicide & Crisis Lifeline
- **Call or text 988**
- 24/7 mental health crisis support

### California Youth Crisis Line
- **1-800-843-5200**
- 24/7 for youth in crisis

### Child Protective Services
- Contact your county CPS
- Or call 911 for immediate danger

## State Agencies

### California Department of Education - Special Education
- Phone: (916) 327-3870
- Website: [cde.ca.gov/sp/se](https://www.cde.ca.gov/sp/se/)

### Department of Developmental Services (DDS)
- Phone: (916) 654-1690
- Website: [dds.ca.gov](https://www.dds.ca.gov/)

### Department of Rehabilitation (DOR)
- Phone: 1-800-952-5544
- Website: [dor.ca.gov](https://www.dor.ca.gov/)

### Department of Health Care Services (Medi-Cal)
- Phone: 1-800-541-5555
- Website: [dhcs.ca.gov](https://www.dhcs.ca.gov/)

## Advocacy Organizations

### Disability Rights California
- **1-800-776-5746**
- Free legal advocacy
- [disabilityrightsca.org](https://www.disabilityrightsca.org/)

### Protection & Advocacy, Inc. (PAI)
- Part of Disability Rights California
- Abuse/neglect investigations

### Office of Clients'' Rights Advocacy (OCRA)
- **1-800-390-7032**
- Advocates for Regional Center clients

## Parent Support

### Family Resource Centers Network of California
- [frcnca.org](https://frcnca.org/)
- Local support across California

### Parent Training and Information Centers

#### Matrix Parent Network
- Phone: (800) 578-2592
- Northern California
- [matrixparents.org](https://www.matrixparents.org/)

#### TASK (Team of Advocates for Special Kids)
- Phone: (714) 533-8275
- Southern California
- [taskca.org](https://www.taskca.org/)

#### Parque Unidos (Spanish language)
- Phone: (909) 985-9895
- [parqueunidos.org](https://parqueunidos.org/)

### Support Groups
- Ask your Regional Center
- Ask school district
- Check local hospitals
- Facebook groups for specific conditions

## Regional Centers

### Find Your Regional Center
- Website: [dds.ca.gov/rc](https://www.dds.ca.gov/rc/)
- 21 Regional Centers statewide

### Major Regional Centers

| Regional Center | Phone |
|-----------------|-------|
| Alta California (Sacramento) | (916) 978-6400 |
| East Bay | (510) 618-6100 |
| Golden Gate (SF) | (415) 546-9222 |
| Harbor (South Bay LA) | (310) 540-1711 |
| Inland (Riverside/SB) | (951) 782-7200 |
| North Los Angeles | (818) 778-1900 |
| Orange County | (714) 796-5100 |
| San Diego | (858) 576-2996 |
| Westside (LA) | (310) 258-4000 |

## Legal Help

### Disability Rights California
- Free legal services
- 1-800-776-5746

### Public Counsel
- Pro bono legal help (LA)
- (213) 385-2977

### Bay Area Legal Aid
- Northern California
- (800) 551-5554

## Insurance & Benefits

### Covered California
- Health insurance marketplace
- 1-800-300-1506
- [coveredca.com](https://www.coveredca.com/)

### Social Security Administration
- SSI/SSDI
- 1-800-772-1213
- [ssa.gov](https://www.ssa.gov/)

### CalFresh (Food Stamps)
- [getcalfresh.org](https://www.getcalfresh.org/)

## Condition-Specific Organizations

### Autism Society of California
- [autismsocietyca.org](https://www.autismsocietyca.org/)

### United Cerebral Palsy of California
- [ucpcalifornia.org](https://ucpcalifornia.org/)

### The Arc of California
- [thearcca.org](https://thearcca.org/)
- Intellectual/developmental disabilities

### Epilepsy Foundation of Greater Los Angeles
- 1-800-564-0445

### California Down Syndrome Connection
- [cdsc.org](https://www.cdsc.org/)

## General Resources

### 211
- Dial **211** or visit [211.org](https://www.211.org/)
- Local resource information

### BenefitsCal
- [benefitscal.com](https://benefitscal.com/)
- Apply for multiple benefits

### California Parent Center
- [php.com](https://www.php.com/)
- Parent support and training
',
  ARRAY['California', 'contacts', 'hotlines', 'resources', 'phone numbers'],
  ARRAY['https://www.disabilityrightsca.org/', 'https://www.dds.ca.gov/rc/']
) ON CONFLICT (region_id, slug) DO NOTHING;
