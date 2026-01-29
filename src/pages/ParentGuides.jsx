// ParentGuides.jsx - Evidence-based guides for families
// Curated from leading organizations: CDC, AAP, ASHA, Autism Speaks, Zero to Three, CHADD, etc.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, BookOpen, Heart, Star, ExternalLink,
  ChevronDown, ChevronUp, Baby, Brain, MessageCircle, Users,
  Shield, Lightbulb, GraduationCap, Home, Sparkles, CheckCircle,
  Clock, Target, Hand, Eye, Volume2, FileText
} from 'lucide-react';

// Theme color
const THEME_COLOR = '#E86B9A';

// Guide categories
const CATEGORIES = [
  { id: 'all', name: 'All Guides', icon: BookOpen },
  { id: 'getting-started', name: 'Getting Started', icon: Baby },
  { id: 'communication', name: 'Communication', icon: MessageCircle },
  { id: 'behavior', name: 'Behavior', icon: Target },
  { id: 'sensory', name: 'Sensory', icon: Hand },
  { id: 'education', name: 'Education & IEP', icon: GraduationCap },
  { id: 'social', name: 'Social Skills', icon: Users },
  { id: 'daily-life', name: 'Daily Life', icon: Home },
  { id: 'self-care', name: 'Caregiver Support', icon: Heart },
];

// Comprehensive parent guides from authoritative sources
const PARENT_GUIDES = [
  // ============================================
  // GETTING STARTED
  // ============================================
  {
    id: 1,
    title: 'Understanding Your Child\'s Diagnosis',
    category: 'getting-started',
    organization: 'Multiple Sources',
    readTime: '10 min',
    isFeatured: true,
    summary: 'A compassionate guide to processing and understanding your child\'s developmental diagnosis.',
    keyPoints: [
      'A diagnosis is a tool for getting support, not a limitation',
      'Every child develops at their own pace with unique strengths',
      'Early intervention leads to better outcomes',
      'You are your child\'s best advocate',
      'It\'s okay to grieve while also celebrating your child',
    ],
    strategies: [
      'Request copies of all evaluation reports and keep them organized',
      'Ask questions until you fully understand the diagnosis',
      'Connect with parent support groups who understand your journey',
      'Focus on your child\'s strengths, not just challenges',
      'Give yourself time to process - there\'s no "right" way to feel',
    ],
    resources: [
      { name: 'CDC - If You\'re Concerned', url: 'https://www.cdc.gov/ncbddd/actearly/concerned.html' },
      { name: 'Understood - After a Diagnosis', url: 'https://www.understood.org/en/articles/after-your-child-is-diagnosed' },
      { name: 'Zero to Three - Understanding Diagnosis', url: 'https://www.zerotothree.org/resource/understanding-your-childs-behavior/' },
    ],
  },
  {
    id: 2,
    title: 'Early Intervention: Why It Matters',
    category: 'getting-started',
    organization: 'CDC / Zero to Three',
    readTime: '8 min',
    isFeatured: true,
    summary: 'Learn why early intervention services (birth to age 3) are crucial and how to access them.',
    keyPoints: [
      'The brain is most adaptable in the first 3 years of life',
      'Early intervention is FREE through your state\'s program',
      'Services come to your home - no need to travel',
      'Any concerned parent can request an evaluation',
      'You don\'t need a diagnosis to receive services',
    ],
    strategies: [
      'Contact your state\'s Early Intervention program directly',
      'Request a developmental evaluation if you have ANY concerns',
      'Don\'t wait for your pediatrician to refer you - you can self-refer',
      'Be specific about your concerns during the evaluation',
      'Ask about all available services: speech, OT, PT, developmental therapy',
    ],
    resources: [
      { name: 'CDC - Early Intervention', url: 'https://www.cdc.gov/ncbddd/actearly/parents/states.html' },
      { name: 'Zero to Three - Early Intervention', url: 'https://www.zerotothree.org/resource/early-intervention/' },
      { name: 'IDEA Infant & Toddler Program', url: 'https://sites.ed.gov/idea/regs/c' },
    ],
  },
  {
    id: 3,
    title: 'Building Your Support Team',
    category: 'getting-started',
    organization: 'AAP / Family Voices',
    readTime: '7 min',
    summary: 'How to assemble and coordinate a team of professionals to support your child\'s development.',
    keyPoints: [
      'Your child may benefit from multiple types of specialists',
      'You are the team leader - don\'t be afraid to ask questions',
      'Good communication between providers improves outcomes',
      'Keep organized records of all appointments and recommendations',
      'Trust your instincts about what\'s working',
    ],
    strategies: [
      'Create a one-page summary of your child to share with new providers',
      'Request that providers communicate with each other',
      'Keep a binder with all reports, evaluations, and recommendations',
      'Prepare questions before appointments',
      'Don\'t hesitate to seek second opinions',
    ],
    resources: [
      { name: 'AAP - Care Coordination', url: 'https://www.aap.org/en/patient-care/medical-home/' },
      { name: 'Family Voices', url: 'https://familyvoices.org/' },
      { name: 'Parent Center Hub', url: 'https://www.parentcenterhub.org/' },
    ],
  },

  // ============================================
  // COMMUNICATION
  // ============================================
  {
    id: 4,
    title: 'Supporting Language Development at Home',
    category: 'communication',
    organization: 'ASHA',
    readTime: '8 min',
    isFeatured: true,
    summary: 'Evidence-based strategies parents can use every day to support speech and language development.',
    keyPoints: [
      'Talk to your child throughout the day during daily routines',
      'Follow your child\'s lead and interests',
      'Respond to ALL communication attempts, including gestures',
      'Read together every day, even for just 5 minutes',
      'Reduce screen time and increase face-to-face interaction',
    ],
    strategies: [
      'Narrate what you\'re doing: "I\'m washing the dishes. The water is warm!"',
      'Expand on what your child says: Child: "Ball!" You: "Yes, the red ball is bouncing!"',
      'Wait at least 5 seconds for your child to respond before jumping in',
      'Use simple language slightly above your child\'s current level',
      'Make it fun - sing songs, play games, be silly!',
    ],
    resources: [
      { name: 'ASHA - Activities to Encourage Speech', url: 'https://www.asha.org/public/speech/development/activities-to-encourage-speech-and-language-development/' },
      { name: 'Hanen Centre - Tips for Parents', url: 'https://www.hanen.org/helpful-info/parent-tips.aspx' },
      { name: 'Speech and Language Kids', url: 'https://www.speechandlanguagekids.com/' },
    ],
  },
  {
    id: 5,
    title: 'Introduction to AAC (Augmentative Communication)',
    category: 'communication',
    organization: 'ASHA / AssistiveWare',
    readTime: '10 min',
    summary: 'Understanding communication tools and strategies for children who need support beyond speech.',
    keyPoints: [
      'AAC does NOT prevent speech development - research shows it helps!',
      'AAC includes low-tech (picture boards) and high-tech (tablets) options',
      'Everyone uses AAC - gestures, facial expressions, writing are all AAC',
      'Start AAC early, don\'t wait for speech to "fail"',
      'Model AAC use yourself to teach your child',
    ],
    strategies: [
      'Use AAC during motivating activities like snack time or play',
      'Model by pointing to symbols while you speak',
      'Accept ALL communication - don\'t require perfect use',
      'Make AAC available everywhere, not just during "practice"',
      'Celebrate every communication attempt',
    ],
    resources: [
      { name: 'ASHA - AAC', url: 'https://www.asha.org/public/speech/disorders/aac/' },
      { name: 'AssistiveWare - Learn AAC', url: 'https://www.assistiveware.com/learn-aac' },
      { name: 'PrAACtical AAC', url: 'https://praacticalaac.org/' },
    ],
  },
  {
    id: 6,
    title: 'Understanding and Supporting Apraxia',
    category: 'communication',
    organization: 'CASANA',
    readTime: '9 min',
    summary: 'What parents need to know about Childhood Apraxia of Speech and how to support progress.',
    keyPoints: [
      'Apraxia is a motor planning disorder, not a cognitive one',
      'Children with apraxia know what they want to say but struggle to coordinate the movements',
      'Frequent, intensive speech therapy is typically needed (3-5x/week)',
      'Progress can be slow but children DO improve with proper therapy',
      'Multi-sensory approaches (visual, tactile cues) are most effective',
    ],
    strategies: [
      'Practice speech targets daily in short, frequent sessions',
      'Use visual and tactile cues as taught by your SLP',
      'Focus on functional words your child is motivated to use',
      'Don\'t ask your child to "say it again" when frustrated',
      'Celebrate effort and approximations, not just perfect productions',
    ],
    resources: [
      { name: 'Apraxia Kids (CASANA)', url: 'https://www.apraxia-kids.org/' },
      { name: 'ASHA - Childhood Apraxia', url: 'https://www.asha.org/public/speech/disorders/childhood-apraxia-of-speech/' },
      { name: 'Child Apraxia Treatment', url: 'https://childapraxiatreatment.org/' },
    ],
  },

  // ============================================
  // BEHAVIOR
  // ============================================
  {
    id: 7,
    title: 'Understanding Behavior as Communication',
    category: 'behavior',
    organization: 'PBIS / Autism Speaks',
    readTime: '8 min',
    isFeatured: true,
    summary: 'Learn to decode what your child\'s behavior is telling you and respond effectively.',
    keyPoints: [
      'All behavior serves a purpose - it\'s communication',
      'Common functions: escape, attention, access to items, sensory needs',
      'Understanding the "why" helps you respond effectively',
      'Prevention is more effective than reaction',
      'Punishment doesn\'t teach replacement skills',
    ],
    strategies: [
      'Keep a behavior log to identify patterns and triggers',
      'Ask: What happened before? What did the child get/avoid after?',
      'Teach replacement behaviors that serve the same function',
      'Increase positive attention for desired behaviors',
      'Modify the environment to prevent triggers when possible',
    ],
    resources: [
      { name: 'PBIS World', url: 'https://www.pbisworld.com/' },
      { name: 'Autism Speaks - Challenging Behaviors Toolkit', url: 'https://www.autismspeaks.org/tool-kit/challenging-behaviors-tool-kit' },
      { name: 'AFIRM Modules', url: 'https://afirm.fpg.unc.edu/' },
    ],
  },
  {
    id: 8,
    title: 'Positive Behavior Support Strategies',
    category: 'behavior',
    organization: 'Center on PBIS',
    readTime: '9 min',
    summary: 'Proactive, positive strategies for supporting behavior at home.',
    keyPoints: [
      'Focus on what you WANT to see, not just what to stop',
      'Clear, consistent expectations reduce challenging behaviors',
      'Praise specific behaviors: "Great job putting your shoes on!"',
      'Routines and visual supports reduce anxiety and meltdowns',
      'Stay calm - your regulation helps your child regulate',
    ],
    strategies: [
      'Create 3-5 clear household expectations (use positive language)',
      'Use visual schedules for daily routines',
      'Give choices to increase cooperation: "Red shirt or blue shirt?"',
      'Use first-then language: "First homework, then tablet"',
      'Catch your child being good - aim for 5 positives to every correction',
    ],
    resources: [
      { name: 'Center on PBIS', url: 'https://www.pbis.org/' },
      { name: 'Understood - Behavior Strategies', url: 'https://www.understood.org/en/articles/behavior-strategies-that-work-at-home' },
      { name: 'CDC - Positive Parenting', url: 'https://www.cdc.gov/parents/essentials/index.html' },
    ],
  },
  {
    id: 9,
    title: 'Managing Meltdowns vs. Tantrums',
    category: 'behavior',
    organization: 'Autism Speaks / Child Mind Institute',
    readTime: '7 min',
    summary: 'Understanding the difference and how to respond to each.',
    keyPoints: [
      'Tantrums are goal-oriented; meltdowns are overwhelming loss of control',
      'During a meltdown, the child CANNOT calm down, not "won\'t"',
      'Meltdowns are often triggered by sensory overload or unexpected changes',
      'Safety is the priority during a meltdown',
      'Post-meltdown is not the time to teach - offer comfort first',
    ],
    strategies: [
      'Learn your child\'s early warning signs',
      'Create a calm-down kit with sensory tools',
      'Reduce demands and stimulation during escalation',
      'Stay calm, speak softly, and provide space if needed',
      'After recovery, problem-solve together (not during!)',
    ],
    resources: [
      { name: 'Autism Speaks - Meltdowns', url: 'https://www.autismspeaks.org/expert-opinion/what-difference-between-meltdown-and-tantrum' },
      { name: 'Child Mind Institute', url: 'https://childmind.org/article/how-to-help-kids-calm-down/' },
      { name: 'The OT Toolbox - Meltdown Strategies', url: 'https://www.theottoolbox.com/' },
    ],
  },

  // ============================================
  // SENSORY
  // ============================================
  {
    id: 10,
    title: 'Understanding Sensory Processing',
    category: 'sensory',
    organization: 'STAR Institute / OT Toolbox',
    readTime: '10 min',
    isFeatured: true,
    summary: 'Learn how sensory processing differences affect your child and how to support them.',
    keyPoints: [
      'We have 8 senses: sight, sound, taste, smell, touch, vestibular, proprioception, interoception',
      'Children may be over-sensitive, under-sensitive, or sensory-seeking',
      'Sensory needs vary by day, time, and context',
      'Sensory differences are real, not behavioral choices',
      'A sensory-friendly environment reduces stress and meltdowns',
    ],
    strategies: [
      'Observe when your child seems most calm vs. most dysregulated',
      'Create a sensory profile with your OT',
      'Build sensory breaks into the daily routine',
      'Offer choices of sensory tools rather than forcing',
      'Advocate for sensory accommodations at school',
    ],
    resources: [
      { name: 'STAR Institute', url: 'https://sensoryhealth.org/' },
      { name: 'The OT Toolbox - Sensory Processing', url: 'https://www.theottoolbox.com/sensory-processing/' },
      { name: 'Understood - Sensory Processing', url: 'https://www.understood.org/en/articles/sensory-processing-issues-explained' },
    ],
  },
  {
    id: 11,
    title: 'Creating a Sensory-Friendly Home',
    category: 'sensory',
    organization: 'OT Toolbox / Your Therapy Source',
    readTime: '8 min',
    summary: 'Practical ways to modify your home environment to support sensory needs.',
    keyPoints: [
      'Reduce clutter and visual "noise" in main living areas',
      'Create a designated calm-down space',
      'Consider lighting - natural light or dimmable options',
      'Have sensory tools accessible throughout the house',
      'Involve your child in creating spaces that feel good to them',
    ],
    strategies: [
      'Create a sensory corner with pillows, weighted blanket, fidgets',
      'Use noise-canceling headphones for auditory sensitivity',
      'Keep clothing tags cut and have soft, comfortable options available',
      'Offer crunchy/chewy snacks for oral sensory input',
      'Schedule "heavy work" activities like carrying groceries or wall pushes',
    ],
    resources: [
      { name: 'Your Therapy Source', url: 'https://www.yourtherapysource.com/' },
      { name: 'The OT Toolbox - Sensory Spaces', url: 'https://www.theottoolbox.com/' },
      { name: 'Autism Speaks - Sensory Toolkit', url: 'https://www.autismspeaks.org/tool-kit/atn-air-p-visual-supports-and-autism-spectrum-disorders' },
    ],
  },
  {
    id: 12,
    title: 'Sensory Diet: What It Is and How to Use It',
    category: 'sensory',
    organization: 'STAR Institute',
    readTime: '7 min',
    summary: 'Understanding and implementing a personalized sensory diet for your child.',
    keyPoints: [
      'A sensory diet is a planned schedule of sensory activities',
      'It\'s designed by an OT based on your child\'s specific needs',
      'The goal is to maintain optimal arousal throughout the day',
      'Proactive sensory input prevents dysregulation',
      'Sensory diets should be adjusted as your child grows',
    ],
    strategies: [
      'Work with an OT to create a personalized plan',
      'Build sensory activities into existing routines',
      'Provide proprioceptive input (heavy work) before challenging tasks',
      'Use alerting activities when your child is sluggish',
      'Use calming activities when your child is overstimulated',
    ],
    resources: [
      { name: 'STAR Institute - Sensory Diet', url: 'https://sensoryhealth.org/' },
      { name: 'The OT Toolbox - Sensory Diet', url: 'https://www.theottoolbox.com/sensory-diet/' },
      { name: 'Understood - Sensory Diet', url: 'https://www.understood.org/en/articles/sensory-diet' },
    ],
  },

  // ============================================
  // EDUCATION & IEP
  // ============================================
  {
    id: 13,
    title: 'IEP 101: Your Complete Guide',
    category: 'education',
    organization: 'Wrightslaw / Understood',
    readTime: '12 min',
    isFeatured: true,
    summary: 'Everything parents need to know about Individualized Education Programs.',
    keyPoints: [
      'IEPs are legally binding documents - schools MUST follow them',
      'You are an equal member of the IEP team',
      'You can request an IEP meeting at any time (in writing)',
      'Goals should be specific, measurable, and time-bound',
      'You have the right to disagree and request changes',
    ],
    strategies: [
      'Request evaluations in writing and keep copies of everything',
      'Bring a support person to IEP meetings',
      'Ask for draft IEP documents before the meeting',
      'Take notes or record the meeting (check your state laws)',
      'Don\'t sign until you\'re comfortable - you can take it home to review',
    ],
    resources: [
      { name: 'Wrightslaw', url: 'https://www.wrightslaw.com/' },
      { name: 'Understood - IEP Guide', url: 'https://www.understood.org/en/articles/iep-guide' },
      { name: 'Parent Center Hub - IEPs', url: 'https://www.parentcenterhub.org/iep-overview/' },
    ],
  },
  {
    id: 14,
    title: '504 Plans Explained',
    category: 'education',
    organization: 'Understood / DREDF',
    readTime: '8 min',
    summary: 'Understanding 504 plans and when they\'re the right choice for your child.',
    keyPoints: [
      '504 plans provide accommodations, not specialized instruction',
      'They\'re appropriate when your child can access grade-level curriculum with support',
      '504 is often faster to obtain than an IEP',
      'Common accommodations: extended time, preferential seating, breaks',
      '504 protections follow your child to college and employment',
    ],
    strategies: [
      'Document how your child\'s disability impacts learning',
      'Request a 504 evaluation in writing',
      'Propose specific accommodations based on your child\'s needs',
      'Review and update the 504 annually',
      'Know when to request an IEP evaluation instead',
    ],
    resources: [
      { name: 'Understood - 504 Plans', url: 'https://www.understood.org/en/articles/504-plan-guide' },
      { name: 'DREDF - 504 Plans', url: 'https://dredf.org/' },
      { name: 'Wrightslaw - Section 504', url: 'https://www.wrightslaw.com/info/sec504.index.htm' },
    ],
  },
  {
    id: 15,
    title: 'Advocating at School',
    category: 'education',
    organization: 'Wrightslaw / Parent Center Hub',
    readTime: '9 min',
    summary: 'Effective strategies for partnering with schools to meet your child\'s needs.',
    keyPoints: [
      'Approach the school as a partner, not an adversary (at first)',
      'Document everything in writing - emails create a paper trail',
      'Know your rights under IDEA and Section 504',
      'Stay focused on your child\'s needs, not personalities',
      'Know when and how to escalate concerns',
    ],
    strategies: [
      'Build relationships with teachers and staff early',
      'Start with "I\'m concerned about..." rather than accusations',
      'Request meetings in writing and confirm in email',
      'Bring data: examples, work samples, outside evaluations',
      'Know your state\'s dispute resolution options',
    ],
    resources: [
      { name: 'Wrightslaw - Advocacy', url: 'https://www.wrightslaw.com/' },
      { name: 'Parent Center Hub', url: 'https://www.parentcenterhub.org/' },
      { name: 'COPAA', url: 'https://www.copaa.org/' },
    ],
  },

  // ============================================
  // SOCIAL SKILLS
  // ============================================
  {
    id: 16,
    title: 'Supporting Social Development',
    category: 'social',
    organization: 'Autism Speaks / Social Thinking',
    readTime: '9 min',
    summary: 'Helping your child build meaningful connections and social understanding.',
    keyPoints: [
      'Social skills can be explicitly taught and practiced',
      'Focus on quality of friendships over quantity',
      'Structured activities make socializing easier',
      'Interest-based activities help kids connect naturally',
      'Social skills develop differently - that\'s okay',
    ],
    strategies: [
      'Arrange structured playdates with clear activities planned',
      'Use Social Stories to prepare for new social situations',
      'Role-play and practice social scenarios at home',
      'Join clubs or groups based on your child\'s interests',
      'Debrief after social interactions without criticism',
    ],
    resources: [
      { name: 'Social Thinking', url: 'https://www.socialthinking.com/' },
      { name: 'Autism Speaks - Social Skills', url: 'https://www.autismspeaks.org/social-skills-and-autism' },
      { name: 'Carol Gray - Social Stories', url: 'https://carolgraysocialstories.com/' },
    ],
  },
  {
    id: 17,
    title: 'Navigating Friendships and Bullying',
    category: 'social',
    organization: 'PACER Center / StopBullying.gov',
    readTime: '8 min',
    summary: 'Supporting your child in building friendships and handling bullying situations.',
    keyPoints: [
      'Children with disabilities are 2-3x more likely to be bullied',
      'Bullying can look different - exclusion and manipulation count',
      'Schools are legally required to address bullying of students with disabilities',
      'Build your child\'s confidence and self-advocacy skills',
      'Help your child identify trusted adults',
    ],
    strategies: [
      'Teach your child to recognize bullying vs. conflict',
      'Role-play responses to common bullying scenarios',
      'Document incidents and report to school in writing',
      'Request bullying prevention be addressed in the IEP if needed',
      'Connect your child with supportive peers and mentors',
    ],
    resources: [
      { name: 'PACER\'s National Bullying Prevention Center', url: 'https://www.pacer.org/bullying/' },
      { name: 'StopBullying.gov', url: 'https://www.stopbullying.gov/' },
      { name: 'Understood - Bullying', url: 'https://www.understood.org/en/articles/bullying-and-learning-differences' },
    ],
  },

  // ============================================
  // DAILY LIFE
  // ============================================
  {
    id: 18,
    title: 'Building Daily Routines',
    category: 'daily-life',
    organization: 'Zero to Three / Autism Speaks',
    readTime: '7 min',
    summary: 'Creating predictable routines that support your child\'s success and independence.',
    keyPoints: [
      'Predictable routines reduce anxiety and challenging behaviors',
      'Visual schedules help children understand expectations',
      'Build in flexibility gradually once routines are established',
      'Routines create opportunities for independence',
      'Involve your child in creating and updating routines',
    ],
    strategies: [
      'Start with one routine at a time (morning OR bedtime)',
      'Use visual schedules with photos or pictures',
      'Keep routines consistent for 2-3 weeks before making changes',
      'Use timers to help with transitions',
      'Celebrate successes - sticker charts work!',
    ],
    resources: [
      { name: 'Zero to Three - Routines', url: 'https://www.zerotothree.org/resource/creating-routines-for-love-and-learning/' },
      { name: 'Autism Speaks - Visual Schedules', url: 'https://www.autismspeaks.org/tool-kit/atn-air-p-visual-supports-and-autism-spectrum-disorders' },
      { name: 'Understood - Daily Routines', url: 'https://www.understood.org/en/articles/daily-routine-tips' },
    ],
  },
  {
    id: 19,
    title: 'Sleep Strategies That Work',
    category: 'daily-life',
    organization: 'AAP / Autism Speaks',
    readTime: '8 min',
    summary: 'Evidence-based approaches to improve sleep for the whole family.',
    keyPoints: [
      'Sleep problems are common but NOT inevitable',
      'Consistent bedtime routines are the foundation',
      'Screen time affects sleep - stop 1-2 hours before bed',
      'Sensory needs may require adjustments (weighted blankets, white noise)',
      'Rule out medical issues like sleep apnea if problems persist',
    ],
    strategies: [
      'Set a consistent bedtime and wake time, even on weekends',
      'Create a calming bedtime routine (bath, book, bed)',
      'Make the bedroom dark, cool, and quiet',
      'Limit caffeine and sugar, especially after noon',
      'Consider melatonin only under medical guidance',
    ],
    resources: [
      { name: 'AAP - Healthy Sleep Habits', url: 'https://www.healthychildren.org/English/healthy-living/sleep/' },
      { name: 'Autism Speaks - Sleep Toolkit', url: 'https://www.autismspeaks.org/tool-kit/atnair-p-strategies-improve-sleep-children-autism' },
      { name: 'Sleep Foundation - Kids', url: 'https://www.sleepfoundation.org/children-and-sleep' },
    ],
  },
  {
    id: 20,
    title: 'Mealtime and Picky Eating',
    category: 'daily-life',
    organization: 'AAP / Ellyn Satter Institute',
    readTime: '8 min',
    summary: 'Supporting healthy eating habits when your child has sensory or behavioral challenges.',
    keyPoints: [
      'Many children go through picky eating phases',
      'Sensory issues can make mealtimes especially challenging',
      'Pressure and power struggles make eating problems worse',
      'Division of responsibility: YOU decide what/when, THEY decide if/how much',
      'Consult a feeding specialist if your child\'s growth is affected',
    ],
    strategies: [
      'Offer new foods alongside accepted foods',
      'Let your child explore food without pressure to eat it',
      'Make mealtimes pleasant - no forcing, bribing, or punishing',
      'Offer the same foods the family eats (modified if needed)',
      'Involve your child in food shopping and preparation',
    ],
    resources: [
      { name: 'Ellyn Satter Institute', url: 'https://www.ellynsatterinstitute.org/' },
      { name: 'AAP - Picky Eaters', url: 'https://www.healthychildren.org/English/ages-stages/toddler/nutrition/Pages/Picky-Eaters.aspx' },
      { name: 'Feeding Matters', url: 'https://www.feedingmatters.org/' },
    ],
  },

  // ============================================
  // CAREGIVER SELF-CARE
  // ============================================
  {
    id: 21,
    title: 'Caregiver Self-Care: Why It Matters',
    category: 'self-care',
    organization: 'ARCH National Respite / Family Caregiver Alliance',
    readTime: '7 min',
    isFeatured: true,
    summary: 'You can\'t pour from an empty cup. Prioritizing your own wellbeing helps your whole family.',
    keyPoints: [
      'Caregiver burnout is real and common - you\'re not alone',
      'Self-care isn\'t selfish - it\'s necessary',
      'Even small breaks make a big difference',
      'Asking for help is a strength, not a weakness',
      'Your mental health matters as much as your child\'s',
    ],
    strategies: [
      'Schedule regular breaks, even just 15 minutes',
      'Build a support network of people who understand',
      'Say "no" to non-essential obligations without guilt',
      'Explore respite care options in your community',
      'Consider therapy or support groups for yourself',
    ],
    resources: [
      { name: 'ARCH National Respite Network', url: 'https://archrespite.org/' },
      { name: 'Family Caregiver Alliance', url: 'https://www.caregiver.org/' },
      { name: 'The Arc - Family Support', url: 'https://thearc.org/' },
    ],
  },
  {
    id: 22,
    title: 'Finding Your Parent Community',
    category: 'self-care',
    organization: 'Parent to Parent USA',
    readTime: '6 min',
    summary: 'Connecting with other parents who truly understand your journey.',
    keyPoints: [
      'Other parents "get it" in ways that well-meaning friends may not',
      'Parent support groups provide emotional support AND practical tips',
      'Online communities can supplement in-person connections',
      'Mentorship from experienced parents is invaluable',
      'You have wisdom to share too, even early in your journey',
    ],
    strategies: [
      'Ask your child\'s providers about local parent groups',
      'Search for Facebook groups related to your child\'s diagnosis',
      'Contact Parent to Parent USA for a trained parent match',
      'Attend conferences and workshops to meet other parents',
      'Consider starting a group if one doesn\'t exist locally',
    ],
    resources: [
      { name: 'Parent to Parent USA', url: 'https://www.p2pusa.org/' },
      { name: 'Family Voices', url: 'https://familyvoices.org/' },
      { name: 'The Mighty', url: 'https://themighty.com/' },
    ],
  },
  {
    id: 23,
    title: 'Managing Sibling Dynamics',
    category: 'self-care',
    organization: 'Sibling Support Project',
    readTime: '7 min',
    summary: 'Supporting siblings of children with disabilities.',
    keyPoints: [
      'Siblings have their own unique experiences and emotions',
      'They may feel proud, protective, embarrassed, or resentful - often all at once',
      'One-on-one time with each child is important',
      'Siblings benefit from connecting with other siblings like them',
      'Age-appropriate information helps siblings understand',
    ],
    strategies: [
      'Schedule regular one-on-one time with each child',
      'Validate siblings\' feelings without judgment',
      'Explain the disability in age-appropriate terms',
      'Don\'t make siblings responsible for caregiving',
      'Connect siblings with SibShops or similar programs',
    ],
    resources: [
      { name: 'Sibling Support Project', url: 'https://siblingsupport.org/' },
      { name: 'SibShops', url: 'https://siblingsupport.org/sibshops/' },
      { name: 'Understood - Siblings', url: 'https://www.understood.org/en/articles/sibling-issues' },
    ],
  },
];

const ParentGuides = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGuide, setExpandedGuide] = useState(null);
  const [savedGuides, setSavedGuides] = useState(() => {
    const saved = localStorage.getItem('atlasassist_saved_guides');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter guides
  const filteredGuides = PARENT_GUIDES.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured guides
  const featuredGuides = PARENT_GUIDES.filter(g => g.isFeatured);

  // Toggle save
  const toggleSave = (guideId) => {
    const newSaved = savedGuides.includes(guideId)
      ? savedGuides.filter(id => id !== guideId)
      : [...savedGuides, guideId];
    setSavedGuides(newSaved);
    localStorage.setItem('atlasassist_saved_guides', JSON.stringify(newSaved));
  };

  // Get category info
  const getCategoryInfo = (categoryId) => CATEGORIES.find(c => c.id === categoryId);

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4" style={{ borderColor: THEME_COLOR }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 rounded-xl font-display font-bold transition-all shadow-md hover:scale-105"
            style={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display flex items-center gap-2" style={{ color: THEME_COLOR }}>
              <BookOpen size={24} />
              Parent Guides
            </h1>
            <p className="text-sm text-gray-500 font-crayon">{PARENT_GUIDES.length} evidence-based guides</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides..."
            className="w-full pl-10 pr-4 py-3 border-3 border-gray-200 rounded-xl font-crayon focus:border-pink-400 focus:outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-6 scrollbar-hide">
          {CATEGORIES.map(category => {
            const Icon = category.icon;
            const count = category.id === 'all' 
              ? PARENT_GUIDES.length 
              : PARENT_GUIDES.filter(g => g.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap font-crayon text-sm transition-all
                  ${selectedCategory === category.id 
                    ? 'bg-pink-100 text-pink-700 border-2 border-pink-400' 
                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'}`}
              >
                <Icon size={16} />
                {category.name}
                <span className="text-xs opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Featured Section - only on "all" without search */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              Essential Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuredGuides.slice(0, 4).map(guide => {
                const catInfo = getCategoryInfo(guide.category);
                const CatIcon = catInfo?.icon || BookOpen;
                return (
                  <button
                    key={guide.id}
                    onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                    className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border-3 border-pink-300 p-4 text-left hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-200 flex items-center justify-center flex-shrink-0">
                        <CatIcon size={20} className="text-pink-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm text-gray-800 line-clamp-2">{guide.title}</h3>
                        <p className="text-xs text-pink-600 font-crayon">{guide.organization}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Guides */}
        <div className="space-y-4">
          {filteredGuides.map(guide => {
            const catInfo = getCategoryInfo(guide.category);
            const CatIcon = catInfo?.icon || BookOpen;
            const isExpanded = expandedGuide === guide.id;
            const isSaved = savedGuides.includes(guide.id);

            return (
              <div
                key={guide.id}
                className="bg-white rounded-2xl border-3 border-gray-200 shadow-md overflow-hidden"
              >
                {/* Header - Always visible */}
                <button
                  onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: THEME_COLOR + '20' }}
                    >
                      <CatIcon size={24} style={{ color: THEME_COLOR }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-gray-800">{guide.title}</h3>
                        {guide.isFeatured && (
                          <Star size={14} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-crayon">
                        <span style={{ color: THEME_COLOR }}>{guide.organization}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {guide.readTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-crayon mt-2 line-clamp-2">
                        {guide.summary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(guide.id); }}
                        className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400 hover:text-pink-500'}`}
                      >
                        <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                      {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {/* Key Points */}
                    <div className="mt-4">
                      <h4 className="font-display text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <Lightbulb size={16} className="text-yellow-500" />
                        Key Points
                      </h4>
                      <ul className="space-y-2">
                        {guide.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-crayon">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Strategies */}
                    <div className="mt-4">
                      <h4 className="font-display text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <Target size={16} style={{ color: THEME_COLOR }} />
                        Strategies to Try
                      </h4>
                      <ul className="space-y-2">
                        {guide.strategies.map((strategy, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-crayon">
                            <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                              {i + 1}
                            </span>
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div className="mt-4">
                      <h4 className="font-display text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <ExternalLink size={16} className="text-blue-500" />
                        Learn More
                      </h4>
                      <div className="space-y-2">
                        {guide.resources.map((resource, i) => (
                          <a
                            key={i}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                          >
                            <FileText size={14} className="text-blue-500" />
                            <span className="text-sm text-blue-700 font-crayon flex-1">{resource.name}</span>
                            <ExternalLink size={12} className="text-blue-400 group-hover:text-blue-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-crayon text-gray-500">No guides found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or category</p>
          </div>
        )}

        {/* About Section */}
        <div className="mt-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Heart size={28} />
            <h3 className="text-xl font-display">About These Guides</h3>
          </div>
          <p className="font-crayon text-white/90 mb-4">
            These guides are curated from leading organizations including CDC, AAP, ASHA, Autism Speaks, 
            Zero to Three, Wrightslaw, and more. They represent current best practices and evidence-based 
            approaches for supporting neurodiverse children and their families.
          </p>
          <p className="font-crayon text-white/80 text-sm">
            Always consult with your child's healthcare providers for personalized advice.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ParentGuides;
