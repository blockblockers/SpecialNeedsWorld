-- =====================================================
-- EXPANDED FEDERAL CONTENT
-- =====================================================
-- Run AFTER knowledge-resources-setup.sql

-- FAPE Explained
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'federal',
  'rights',
  'FAPE - Free Appropriate Public Education',
  'fape',
  'Understanding FAPE - the core right under IDEA that guarantees education for children with disabilities.',
  '# FAPE - Free Appropriate Public Education

## What is FAPE?

**FAPE** (Free Appropriate Public Education) is the core guarantee of IDEA. Every child with a disability is entitled to:
- **Free** - At no cost to parents
- **Appropriate** - Designed to meet the child''s unique needs
- **Public** - Provided by the public school system
- **Education** - Including special education and related services

## What Does "Appropriate" Mean?

The U.S. Supreme Court has defined appropriate education:

### Rowley Standard (1982)
- Access to education
- Some educational benefit
- IEP developed according to procedures

### Endrew F. Standard (2017)
- Must be "reasonably calculated to enable a child to make progress appropriate in light of the child''s circumstances"
- More than merely "de minimis" (minimal) progress
- Ambitious but achievable goals

## Key Components of FAPE

### 1. Individualized Education
- Based on the child''s unique needs
- Not a one-size-fits-all approach
- Addresses all areas of need

### 2. Special Education
- Specially designed instruction
- Modified content, methodology, or delivery
- To address the child''s disability

### 3. Related Services
- Services needed to benefit from special education
- Examples: speech therapy, OT, PT, transportation, counseling

### 4. Supplementary Aids and Services
- Supports in general education
- Modifications and accommodations
- Assistive technology

## FAPE Must Be Provided In

- Regular classes
- Special classes
- Special schools
- Home instruction
- Hospital/institution settings

The **Least Restrictive Environment** (LRE) is preferred.

## What FAPE Does NOT Guarantee

- The "best" education possible
- Maximum potential
- Private school if public school offers FAPE
- Specific methodology requested by parents

## FAPE at No Cost

Parents cannot be charged for:
- Special education services
- Related services
- IEP development
- Evaluations
- Transportation (if in IEP)

Districts MAY bill insurance (with parent consent) but parents cannot be charged.

## When FAPE is Denied

If a district fails to provide FAPE, parents may:
- File a state complaint
- Request due process hearing
- Seek compensatory education
- In some cases, seek reimbursement for private placement

## Key Cases

### Board of Education v. Rowley (1982)
Established that FAPE requires "some educational benefit"

### Endrew F. v. Douglas County (2017)
Raised the standard to "appropriate progress" based on child''s circumstances
',
  ARRAY['FAPE', 'federal', 'IDEA', 'rights', 'Endrew F'],
  ARRAY['https://sites.ed.gov/idea/', 'https://www.wrightslaw.com/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- LRE Explained
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'federal',
  'education',
  'LRE - Least Restrictive Environment',
  'lre',
  'Understanding LRE - the IDEA requirement that children with disabilities be educated with non-disabled peers.',
  '# LRE - Least Restrictive Environment

## What is LRE?

**LRE** (Least Restrictive Environment) is the IDEA requirement that:

> Children with disabilities are educated with children who are non-disabled to the maximum extent appropriate.

## The LRE Requirement

### IDEA States:
- Removal from regular education should occur **only** when education cannot be achieved satisfactorily in regular classes with supplementary aids and services

### This Means:
- Start with general education classroom
- Provide supports to make it work
- Remove only when necessary
- Consider full continuum of placements

## Continuum of Placements

From **least** to **most** restrictive:
1. General education classroom (full time)
2. General education with resource room support
3. Part-time special education classroom
4. Full-time special education classroom
5. Separate special education school
6. Residential facility
7. Home/hospital instruction

## Key Principles

### Presumption of Inclusion
- General education is the starting point
- Must justify any removal

### Supplementary Aids and Services
Before removing a child, the district must try:
- Modifications to curriculum
- Accommodations
- Assistive technology
- Paraprofessional support
- Behavior supports
- Staff training

### Individual Determination
- Based on each child''s needs
- Not on category of disability
- Not on administrative convenience

## The Two-Part Test

Courts often use this test:

### Part 1: Can Education Be Achieved Satisfactorily?
Consider:
- Educational benefits in each setting
- Non-academic benefits (social, communication)
- Effect on other students
- Cost (only if significantly more)

### Part 2: Is Child Mainstreamed to Maximum Extent Appropriate?
Even if separate placement is needed:
- Consider integration for some classes
- Non-academic activities (lunch, recess, assemblies)
- Extracurricular activities

## LRE Does NOT Mean

- ❌ Every child must be in general education
- ❌ Full inclusion is always required
- ❌ Separate placement is never appropriate
- ❌ Parents can demand any placement

## LRE DOES Mean

- ✅ Serious consideration of general education first
- ✅ Supports before removal
- ✅ Individual decision-making
- ✅ Maximum appropriate integration

## Your Rights

- LRE must be considered at every IEP meeting
- Placement decision based on IEP goals
- Placement as close to home as possible
- Access to same activities as non-disabled peers
',
  ARRAY['LRE', 'federal', 'IDEA', 'inclusion', 'placement'],
  ARRAY['https://sites.ed.gov/idea/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- IEP Process
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'federal',
  'education',
  'The IEP Process - Step by Step',
  'iep-process',
  'Complete guide to the IEP process from referral to implementation.',
  '# The IEP Process - Step by Step

## Overview

The IEP process ensures children with disabilities receive individualized special education services.

## Step 1: Child Find & Referral

### Child Find
Schools must identify all children who may have disabilities:
- Screenings
- Teacher observations
- Parent concerns
- Community outreach

### Referral
Anyone can refer a child for evaluation:
- Parent (put in writing!)
- Teacher
- Doctor
- Other professionals

## Step 2: Evaluation

### Timeline
- **60 days** from parent consent (federal)
- Some states have shorter timelines

### Requirements
- Comprehensive evaluation
- All areas of suspected disability
- Multiple sources of information
- No single test determines eligibility

### Areas Assessed May Include
- Academic achievement
- Cognitive ability
- Communication
- Motor skills
- Social-emotional
- Adaptive behavior
- Health/vision/hearing

## Step 3: Eligibility Determination

### Meeting
- Team reviews evaluation results
- Determines if child has a disability
- Determines if child needs special education

### 13 Disability Categories
1. Autism
2. Deaf-blindness
3. Deafness
4. Emotional disturbance
5. Hearing impairment
6. Intellectual disability
7. Multiple disabilities
8. Orthopedic impairment
9. Other health impairment
10. Specific learning disability
11. Speech or language impairment
12. Traumatic brain injury
13. Visual impairment

## Step 4: IEP Development

### Timeline
- Within **30 days** of eligibility determination

### IEP Team Members
- Parent(s)
- Regular education teacher
- Special education teacher
- District representative
- Person to interpret evaluation
- Others as needed
- Student (when appropriate)

### IEP Contents
1. Present levels of performance
2. Measurable annual goals
3. How progress will be measured
4. Special education services
5. Related services
6. Supplementary aids and services
7. Program modifications
8. Participation in general education
9. State/district testing accommodations
10. Dates, frequency, location of services
11. Transition (at age 16)

## Step 5: Placement Decision

### After IEP is Developed
- Team determines placement
- Based on IEP goals and services
- In Least Restrictive Environment
- As close to home as possible

### Parent Consent
- Required for initial placement
- Services cannot begin without consent

## Step 6: Implementation

### IEP Put Into Action
- Services begin as written
- All staff informed of responsibilities
- Progress monitoring begins

## Step 7: Annual Review

### At Least Once Per Year
- Review progress on goals
- Develop new goals
- Adjust services as needed
- Consider current data

## Step 8: Reevaluation

### At Least Every 3 Years
- Determine continued eligibility
- Update evaluation information
- Can be more frequent if needed
- Can be waived by parent and district agreement

## Tips for Parents

✅ **DO:**
- Put referral requests in writing
- Keep copies of everything
- Prepare for meetings
- Ask questions
- Bring support person

❌ **DON''T:**
- Sign if you disagree
- Let timelines slip
- Accept "we don''t do that"
- Give up
',
  ARRAY['IEP', 'federal', 'IDEA', 'process', 'evaluation'],
  ARRAY['https://sites.ed.gov/idea/', 'https://www.parentcenterhub.org/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Parent Rights Federal
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'federal',
  'rights',
  'Federal Parent Rights Under IDEA',
  'federal-parent-rights',
  'Complete guide to parent rights under IDEA - what every parent needs to know.',
  '# Federal Parent Rights Under IDEA

## Procedural Safeguards

IDEA gives parents specific rights called **Procedural Safeguards**. Schools must provide a copy at least once per year.

## Right to Participate

### Equal Team Member
- You are an **equal member** of the IEP team
- Your input must be considered
- Meetings at mutually agreeable times
- Bring anyone you want

### Informed Participation
- Receive evaluation results
- Understand options being considered
- Have information explained

## Right to Notice

### Prior Written Notice (PWN)
Schools must give written notice before:
- Proposing any change
- Refusing any change
- Initiating evaluation
- Changing identification or placement

### Notice Must Include
- What action is proposed/refused
- Why
- Data used for decision
- Other options considered
- Your rights

## Right to Consent

### Consent Required For
- Initial evaluation
- Initial placement
- Reevaluation
- Access to insurance

### You Can
- Give consent
- Refuse consent
- Revoke consent (in writing)

## Right to Evaluation

### Timely Evaluation
- Within **60 days** of consent (federal)
- Comprehensive assessment
- All areas of suspected disability

### Independent Educational Evaluation (IEE)
- If you disagree with school''s evaluation
- Request at public expense
- School must pay OR request due process
- You can always get private evaluation

## Right to Access Records

### Educational Records
- Inspect and review
- Receive copies
- Request explanation
- Request amendments
- Know who accessed records

### Timeline
- Access within **45 days** of request (federal)
- Many states require faster

## Right to Confidentiality

- Records are confidential
- Consent needed to share
- Know who has access
- Destroy records when no longer needed

## Dispute Resolution Rights

### Multiple Options
1. **Mediation** - Voluntary, neutral mediator
2. **State Complaint** - Investigated by state
3. **Due Process** - Formal hearing

### Stay Put
- During disputes, child remains in current placement
- Cannot be moved without consent

## Right to Revoke Consent

- You can revoke consent for special education
- Must be in writing
- Takes effect going forward
- Lose IDEA protections

## Right to Attorneys Fees

If you prevail in due process:
- May recover attorney fees
- May recover expert witness fees (sometimes)

## Important Timelines

| Action | Timeline |
|--------|----------|
| Evaluation | 60 days from consent |
| Eligibility meeting | After evaluation |
| IEP development | 30 days after eligibility |
| Annual IEP review | At least yearly |
| Reevaluation | At least every 3 years |
| State complaint | Within 1 year |
| Due process | Within 2 years |
',
  ARRAY['parent rights', 'federal', 'IDEA', 'procedural safeguards'],
  ARRAY['https://sites.ed.gov/idea/', 'https://www.parentcenterhub.org/procedural-safeguards/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Related Services
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'federal',
  'services',
  'Related Services Under IDEA',
  'related-services',
  'Understanding related services - the supports children need to benefit from special education.',
  '# Related Services Under IDEA

## What Are Related Services?

**Related services** are support services that a child needs to benefit from special education. They are provided at **no cost** to families.

## IDEA Definition

> "Transportation and such developmental, corrective, and other supportive services as are required to assist a child with a disability to benefit from special education."

## Types of Related Services

### Speech-Language Pathology
- Communication assessment
- Speech therapy
- Language intervention
- Augmentative communication

### Occupational Therapy (OT)
- Fine motor skills
- Sensory processing
- Daily living skills
- Handwriting
- Self-care

### Physical Therapy (PT)
- Gross motor skills
- Mobility
- Positioning
- Strength and coordination

### Psychological Services
- Assessment
- Counseling
- Consultation
- Behavior intervention

### Counseling Services
- Individual counseling
- Group counseling
- Social skills training
- Family counseling (school-related)

### School Health Services
- Nursing services
- Health monitoring
- Medication administration
- Medical procedures

### Social Work Services
- Home visits
- Family support
- Crisis intervention
- Resource coordination

### Transportation
- To and from school
- Between schools
- Specialized vehicles
- Aides if needed

### Audiology
- Hearing evaluation
- Hearing aid fitting/maintenance
- Auditory training
- Acoustic modifications

### Interpreting Services
- Sign language interpreters
- Oral interpreters
- Cued language transliterators

### Orientation and Mobility
- For students with visual impairments
- Safe travel skills
- Environmental awareness

### Recreation Services
- Assessment of recreation needs
- Therapeutic recreation
- Leisure education

### Assistive Technology
- Devices
- Services
- Training
- Evaluation

### Parent Counseling and Training
- Understanding disability
- Supporting child''s needs
- Participating in IEP

## How to Get Related Services

### 1. Evaluation
- Request evaluation in specific area
- Comprehensive assessment

### 2. IEP Team Decision
- Team determines need
- Based on evaluation and goals
- Must be needed to benefit from special education

### 3. Written in IEP
- Specific service listed
- Frequency and duration
- Location
- Who provides

## Key Points

### Related Services Are:
- ✅ Based on individual need
- ✅ Provided at no cost
- ✅ Written in IEP
- ✅ Progress monitored

### Related Services Are NOT:
- ❌ Medical services (except evaluation)
- ❌ Surgeries or procedures
- ❌ Services not needed for education
- ❌ Guaranteed regardless of need

## Medical Services Exception

IDEA excludes **medical services** except for evaluation purposes. However, **school health services** provided by a nurse may be required.

The key question: Can a nurse provide it, or does it require a physician?
',
  ARRAY['related services', 'federal', 'IDEA', 'therapy', 'support'],
  ARRAY['https://sites.ed.gov/idea/', 'https://www.parentcenterhub.org/relatedservices/']
) ON CONFLICT (region_id, slug) DO NOTHING;

-- Dispute Resolution
INSERT INTO knowledge_articles (region_id, category_id, title, slug, summary, content, tags, source_urls)
VALUES (
  'federal',
  'rights',
  'IDEA Dispute Resolution Options',
  'dispute-resolution',
  'When you disagree with the school - mediation, state complaints, and due process explained.',
  '# IDEA Dispute Resolution Options

## When You Disagree

If you disagree with the school about your child''s special education, you have several options.

## Option 1: Informal Resolution

### First Steps
- Talk to teacher or case manager
- Request IEP meeting
- Put concerns in writing
- Ask for supervisor involvement

### Benefits
- Quick resolution
- Preserves relationships
- No formal process

## Option 2: IEP Facilitation

### What Is It?
- Neutral facilitator runs IEP meeting
- Helps communication
- Not decision-maker

### Availability
- Not required by IDEA
- Many states offer
- Usually free

## Option 3: Mediation

### What Is It?
- Neutral mediator helps both sides
- Try to reach agreement
- **Voluntary** - both must agree

### Process
1. Request mediation
2. State provides mediator
3. Meet (usually one session)
4. Try to reach agreement
5. Agreement is **legally binding**

### Benefits
- Free
- Faster than due process
- Less adversarial
- Preserves relationships

### Requirements
- Both parties must agree
- Cannot delay other rights
- Discussions confidential

## Option 4: State Complaint

### What Is It?
- Written complaint to state education agency
- Alleging IDEA violation
- State investigates

### Who Can File?
- Anyone (parent, organization, etc.)

### Timeline
- File within **1 year** of alleged violation
- State must resolve within **60 days**

### What to Include
- Description of violation
- Facts supporting complaint
- Child''s name and contact info
- Proposed resolution

### Outcome
- Written decision
- Corrective actions if violation found
- May include compensatory services

## Option 5: Due Process

### What Is It?
- Formal administrative hearing
- Like a mini-trial
- Impartial hearing officer decides

### Timeline
- File within **2 years** of issue
- Resolution meeting within **15 days**
- Hearing within **30 days** (if no resolution)
- Decision within **45 days**

### Process
1. File due process complaint
2. Resolution meeting
3. If unresolved, proceed to hearing
4. Both sides present evidence
5. Hearing officer decides
6. Written decision

### Key Features
- **Stay put** - child remains in placement
- Right to attorney
- Discovery (exchange information)
- Witnesses and evidence
- Appeal to court possible

### Burden of Proof
- Varies by state
- Some: school must prove appropriateness
- Some: parent must prove inappropriateness

## Choosing an Option

### Use Mediation When
- Relationship is important
- Creative solutions possible
- Both sides willing to compromise

### Use State Complaint When
- Clear IDEA violation
- Want investigation
- Systemic issue
- Don''t want formal hearing

### Use Due Process When
- Significant disagreement
- Need formal decision
- Want precedent
- Other options failed

## Can You Use Multiple Options?

Yes!
- Can file complaint AND request mediation
- Can file complaint AND due process
- Mediation can happen during due process

## Getting Help

### Free Resources
- Parent Training and Information Centers (PTI)
- Protection and Advocacy (P&A) organizations
- State education agency

### When to Get Attorney
- Complex case
- Due process hearing
- Significant disagreement
',
  ARRAY['dispute resolution', 'federal', 'IDEA', 'mediation', 'due process', 'complaint'],
  ARRAY['https://sites.ed.gov/idea/', 'https://www.parentcenterhub.org/disputes/']
) ON CONFLICT (region_id, slug) DO NOTHING;
