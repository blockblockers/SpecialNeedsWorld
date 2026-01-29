// TherapyMaterialsLibrary.jsx - Evidence-based therapy materials library
// Curated resources from authoritative organizations and professional bodies
// FIXED: Correct import path for supabase

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Download, Star, ExternalLink,
  Layers, FileText, Target, BookOpen, BarChart3,
  Mic, MessageCircle, Brain, Sparkles, ChevronRight,
  Grid3X3, List, Heart, Users, Baby, Volume2,
  Globe, Bookmark, Clock, CheckCircle, Hand, Eye,
  Activity, Puzzle, Home, GraduationCap, X, Maximize2, 
  Minimize2, Share2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../App';

// Material categories - EXPANDED
const CATEGORIES = [
  { id: 'all', name: 'All Resources', icon: Grid3X3 },
  { id: 'favorites', name: 'My Favorites', icon: Heart },
  { id: 'aac', name: 'AAC & Communication', icon: MessageCircle },
  { id: 'articulation', name: 'Articulation', icon: Mic },
  { id: 'language', name: 'Language', icon: BookOpen },
  { id: 'fluency', name: 'Fluency/Stuttering', icon: Sparkles },
  { id: 'apraxia', name: 'Apraxia (CAS)', icon: Brain },
  { id: 'social', name: 'Social Skills', icon: Users },
  { id: 'developmental', name: 'Development', icon: Baby },
  { id: 'autism', name: 'Autism Resources', icon: Heart },
  { id: 'sensory', name: 'Sensory Processing', icon: Hand },
  { id: 'motor', name: 'Fine Motor/Handwriting', icon: Eye },
  { id: 'behavior', name: 'Behavior Support', icon: Target },
  { id: 'adult', name: 'Adult/Medical SLP', icon: Activity },
  { id: 'parent', name: 'Parent Resources', icon: Home },
];

// Resource types
const RESOURCE_TYPES = [
  { id: 'pdf', name: 'PDF Downloads', icon: FileText, color: '#E63B2E' },
  { id: 'website', name: 'Websites', icon: Globe, color: '#4A9FD4' },
  { id: 'tool', name: 'Online Tools', icon: Layers, color: '#10B981' },
  { id: 'guide', name: 'Guides', icon: BookOpen, color: '#F5A623' },
  { id: 'training', name: 'Free Training', icon: GraduationCap, color: '#8B5CF6' },
];

// EXPANDED Curated therapy materials - 73 resources
const THERAPY_MATERIALS = [
  // ============================================
  // AAC & COMMUNICATION (8 resources)
  // ============================================
  {
    id: 1,
    title: 'AssistiveWare Core Word Boards',
    organization: 'AssistiveWare',
    type: 'pdf',
    category: 'aac',
    description: 'Free printable core word communication boards for AAC users. Available in multiple languages.',
    url: 'https://www.assistiveware.com/learn-aac/quick-communication-boards',
    directDownload: 'https://download.assistiveware.com/aac/quick-communication-boards.pdf',
    canPreview: true,
    rating: 4.9,
    isFeatured: true,
    isFree: true,
  },
  {
    id: 2,
    title: 'Core Word Classroom Resources',
    organization: 'AssistiveWare',
    type: 'website',
    category: 'aac',
    description: 'Comprehensive AAC implementation resources including planners, modeling guides, and display materials.',
    url: 'https://www.assistiveware.com/blog/assistiveware-core-word-classroom',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 3,
    title: 'Lingraphica Communication Boards',
    organization: 'Lingraphica',
    type: 'pdf',
    category: 'aac',
    description: 'Free communication boards for basic wants/needs and hospital settings. English and Spanish versions.',
    url: 'https://lingraphica.com/free-communication-boards/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 4,
    title: 'Project Core Universal Vocabulary',
    organization: 'UNC Chapel Hill',
    type: 'website',
    category: 'aac',
    description: 'Research-based universal core vocabulary and implementation resources for students with complex needs.',
    url: 'https://www.project-core.com/',
    rating: 4.9,
    isFeatured: true,
    isFree: true,
  },
  {
    id: 5,
    title: 'Medical SLPs AAC Board',
    organization: 'Medical SLPs',
    type: 'pdf',
    category: 'aac',
    description: 'Free printable AAC communication board with high-quality images for various settings.',
    url: 'https://medicalslps.com/speech-therapy-materials/worksheets/aac-communication-board/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 6,
    title: 'Cboard - Free AAC App',
    organization: 'Cboard',
    type: 'tool',
    category: 'aac',
    description: 'Free, open-source AAC web app that works on any device. Fully customizable with offline support.',
    url: 'https://www.cboard.io/',
    rating: 4.5,
    isFree: true,
  },
  {
    id: 7,
    title: 'AAC Language Lab Resources',
    organization: 'PRC-Saltillo',
    type: 'website',
    category: 'aac',
    description: 'Free AAC implementation resources, lesson plans, and core vocabulary activities.',
    url: 'https://aaclanguagelab.com/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 8,
    title: 'NWACS Light-Tech Boards',
    organization: 'Northwest ACS',
    type: 'website',
    category: 'aac',
    description: 'Comprehensive collection of free low-tech communication board resources from multiple sources.',
    url: 'https://nwacs.info/lighttech-communication-boards',
    rating: 4.6,
    isFree: true,
  },

  // ============================================
  // ARTICULATION (6 resources)
  // ============================================
  {
    id: 9,
    title: 'Free Articulation Worksheets',
    organization: "Heather's Speech Therapy",
    type: 'pdf',
    category: 'articulation',
    description: 'Comprehensive collection of free worksheets for all speech sounds at word, phrase, and sentence levels.',
    url: 'https://heatherspeechtherapy.com/free-worksheets/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 10,
    title: 'Communication Community Worksheets',
    organization: 'Communication Community',
    type: 'website',
    category: 'articulation',
    description: '20+ free speech therapy worksheets and printables for articulation, language, and AAC.',
    url: 'https://www.communicationcommunity.com/free-speech-therapy-worksheets-and-printables/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 11,
    title: 'Bilinguistics Free Materials',
    organization: 'Bilinguistics',
    type: 'website',
    category: 'articulation',
    description: 'Free speech therapy materials including bilingual resources for Spanish-English speakers.',
    url: 'https://bilinguistics.com/speech-therapy-materials/',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 12,
    title: 'Free SLP Articulation Games',
    organization: 'Free SLP',
    type: 'tool',
    category: 'articulation',
    description: 'Over 1000 free materials including articulation games, flashcards, and interactive activities.',
    url: 'https://freeslp.com/',
    rating: 4.8,
    isFeatured: true,
    isFree: true,
  },
  {
    id: 13,
    title: 'Speechy Musings Free Resources',
    organization: 'Speechy Musings',
    type: 'website',
    category: 'articulation',
    description: '194+ free speech therapy materials including articulation worksheets and therapy tools.',
    url: 'https://speechymusings.com/my-favorite-free-tpt-downloads/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 14,
    title: 'Anna Dee SLP Free Resources',
    organization: 'Anna Dee SLP',
    type: 'website',
    category: 'articulation',
    description: 'Free speech therapy resources including Boom Cards, play-based activities, and assessment tools.',
    url: 'https://www.annadeeslp.com/blog/mega-list-of-free-speech-therapy-resources',
    rating: 4.5,
    isFree: true,
  },

  // ============================================
  // LANGUAGE DEVELOPMENT (6 resources)
  // ============================================
  {
    id: 15,
    title: 'Following Directions Data Collection',
    organization: 'Bilinguistics',
    type: 'pdf',
    category: 'language',
    description: 'Free worksheet for tracking progress on following directions goals in speech therapy.',
    url: 'https://bilinguistics.com/speech-therapy-materials/',
    rating: 4.5,
    isFree: true,
  },
  {
    id: 16,
    title: 'Vocabulary Building Worksheet',
    organization: 'Bilinguistics',
    type: 'pdf',
    category: 'language',
    description: 'Free vocabulary building activities and worksheets for speech-language therapy.',
    url: 'https://bilinguistics.com/speech-therapy-materials/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 17,
    title: 'HappyNeuron Speech Worksheets',
    organization: 'HappyNeuron Pro',
    type: 'pdf',
    category: 'language',
    description: 'Language-based PDF worksheets for adults including auditory memory and word retrieval exercises.',
    url: 'https://worksheets.happyneuronpro.com/speech-therapy-worksheets/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 18,
    title: 'Medical SLP Free Materials',
    organization: 'Medical SLPs',
    type: 'website',
    category: 'language',
    description: 'Free worksheets including communication boards, automatic speech routines, and SFA activities.',
    url: 'https://medicalslps.com/speech-therapy-materials/free/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 19,
    title: 'Speech and Language Kids',
    organization: 'Speech And Language Kids',
    type: 'website',
    category: 'language',
    description: 'Extensive free resources for language therapy including printables, guides, and video tutorials.',
    url: 'https://www.speechandlanguagekids.com/',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 20,
    title: 'PBS Kids Learning Games',
    organization: 'PBS',
    type: 'tool',
    category: 'language',
    description: 'Free educational games for targeting basic concepts, following directions, and narrative building.',
    url: 'https://pbskids.org/games/',
    rating: 4.7,
    isFree: true,
  },

  // ============================================
  // FLUENCY/STUTTERING (6 resources)
  // ============================================
  {
    id: 21,
    title: 'Stuttering Foundation Brochures',
    organization: 'Stuttering Foundation',
    type: 'pdf',
    category: 'fluency',
    description: 'Free downloadable brochures on stuttering for parents, teachers, SLPs, and people who stutter.',
    url: 'https://www.stutteringhelp.org/brochures',
    rating: 4.9,
    isFeatured: true,
    isFree: true,
  },
  {
    id: 22,
    title: 'Free Stuttering E-Books',
    organization: 'Stuttering Foundation',
    type: 'pdf',
    category: 'fluency',
    description: 'Free e-books including "If Your Child Stutters: A Guide for Parents" in English and Spanish.',
    url: 'https://www.stutteringhelp.org/free-e-books',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 23,
    title: 'NSA Printable Resources',
    organization: 'National Stuttering Association',
    type: 'pdf',
    category: 'fluency',
    description: 'Free brochures, awareness cards, and educational materials about stuttering.',
    url: 'https://westutter.org/free-printables-brochures/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 24,
    title: 'Stuttering Disclosure ID Card',
    organization: 'National Stuttering Association',
    type: 'pdf',
    category: 'fluency',
    description: 'Printable card for self-advocacy in challenging situations like traffic stops or fast-paced interactions.',
    url: 'https://westutter.org/free-printables-brochures/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 25,
    title: 'Stuttering Therapy Resources',
    organization: 'Stuttering Therapy Resources',
    type: 'website',
    category: 'fluency',
    description: 'Free resources including OASES assessment tool and educational videos for stuttering therapy.',
    url: 'https://www.stutteringtherapyresources.com/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 26,
    title: 'FRIENDS Young People Who Stutter',
    organization: 'FRIENDS',
    type: 'website',
    category: 'fluency',
    description: 'Resources and support network for children and teens who stutter and their families.',
    url: 'https://www.friendswhostutter.org/',
    rating: 4.6,
    isFree: true,
  },

  // ============================================
  // APRAXIA / CAS (6 resources)
  // ============================================
  {
    id: 27,
    title: 'Apraxia Kids Resources',
    organization: 'CASANA',
    type: 'website',
    category: 'apraxia',
    description: 'Comprehensive resources for families and SLPs on childhood apraxia of speech from the leading nonprofit.',
    url: 'https://www.apraxia-kids.org/',
    rating: 4.9,
    isFeatured: true,
    isFree: true,
  },
  {
    id: 28,
    title: 'CASANA Treatment Approaches PDF',
    organization: 'CASANA',
    type: 'pdf',
    category: 'apraxia',
    description: 'Free fact sheet on evidence-based treatment approaches for children with CAS.',
    url: 'https://www.apraxia-kids.org/wp-content/uploads/2013/01/BSHM_Factsheet2.pdf',
    directDownload: 'https://www.apraxia-kids.org/wp-content/uploads/2013/01/BSHM_Factsheet2.pdf',
    canPreview: true,
    rating: 4.8,
    isFree: true,
  },
  {
    id: 29,
    title: 'Child Apraxia Treatment',
    organization: 'Once Upon a Time Foundation',
    type: 'training',
    category: 'apraxia',
    description: 'Free online courses, videos, and workshops on evidence-based CAS treatment including DTTC.',
    url: 'https://childapraxiatreatment.org/',
    rating: 4.9,
    isFree: true,
  },
  {
    id: 30,
    title: 'ReST Treatment Free Training',
    organization: 'University of Sydney',
    type: 'training',
    category: 'apraxia',
    description: 'Free self-directed learning package for SLPs on Rapid Syllable Transition Treatment for CAS.',
    url: 'https://www.sydney.edu.au/health-sciences/rest/',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 31,
    title: 'CAS Research Summary',
    organization: 'University of Sydney',
    type: 'pdf',
    category: 'apraxia',
    description: 'Free summary document of current evidence on assessment, diagnosis, and treatment of CAS.',
    url: 'https://www.sydney.edu.au/health-sciences/rest/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 32,
    title: 'ASHA Evidence Map for CAS',
    organization: 'ASHA',
    type: 'website',
    category: 'apraxia',
    description: "ASHA's evidence-based resource for assessment and treatment of childhood apraxia of speech.",
    url: 'https://www.asha.org/evidence-maps/',
    rating: 4.9,
    isFree: true,
  },

  // ============================================
  // SOCIAL SKILLS (5 resources)
  // ============================================
  {
    id: 33,
    title: 'Social Story Library',
    organization: 'Autism Little Learners',
    type: 'pdf',
    category: 'social',
    description: 'Free downloadable social stories for home, school, and community settings.',
    url: 'https://autismlittlelearners.com/the-social-story-library/',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 34,
    title: 'Social Stories for School',
    organization: 'Autism Little Learners',
    type: 'pdf',
    category: 'social',
    description: 'Evidence-based social stories specifically designed for classroom situations.',
    url: 'https://autismlittlelearners.com/social-stories-for-school/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 35,
    title: 'Free Social Stories Library',
    organization: 'Autism Behavior Services',
    type: 'website',
    category: 'social',
    description: 'Collection of free social stories for various situations commonly encountered by children with autism.',
    url: 'https://autismbehaviorservices.com/social-stories/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 36,
    title: 'Do2Learn Social Skills',
    organization: 'Do2Learn',
    type: 'website',
    category: 'social',
    description: 'Free social skills activities, games, and learning resources for children with special needs.',
    url: 'https://do2learn.com/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 37,
    title: 'Carol Gray Social Stories',
    organization: 'Carol Gray',
    type: 'website',
    category: 'social',
    description: 'Official resources from the creator of Social Stories with free samples and implementation guides.',
    url: 'https://carolgraysocialstories.com/',
    rating: 4.8,
    isFree: true,
  },

  // ============================================
  // DEVELOPMENTAL MILESTONES (4 resources)
  // ============================================
  {
    id: 38,
    title: 'CDC Milestone Checklists',
    organization: 'Centers for Disease Control',
    type: 'pdf',
    category: 'developmental',
    description: 'Official developmental milestone checklists from 2 months to 5 years. Available in multiple languages.',
    url: 'https://www.cdc.gov/act-early/milestones/index.html',
    directDownload: 'https://www.cdc.gov/ncbddd/actearly/pdf/FULL-LIST-CDC_LTSAE-Checklists2021_Eng_FNL2_508.pdf',
    canPreview: true,
    rating: 5.0,
    isFeatured: true,
    isFree: true,
  },
  {
    id: 39,
    title: 'Milestone Tracker App',
    organization: 'CDC',
    type: 'tool',
    category: 'developmental',
    description: 'Free app to track child development milestones and share with healthcare providers.',
    url: 'https://www.cdc.gov/act-early/milestones/index.html',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 40,
    title: 'Learn the Signs. Act Early.',
    organization: 'CDC',
    type: 'website',
    category: 'developmental',
    description: 'Comprehensive resources for developmental monitoring including tips and activities by age.',
    url: 'https://www.cdc.gov/act-early/index.html',
    rating: 4.9,
    isFree: true,
  },
  {
    id: 41,
    title: 'ASHA Developmental Norms',
    organization: 'ASHA',
    type: 'website',
    category: 'developmental',
    description: 'Speech and language developmental norms and milestones from ASHA for professionals and families.',
    url: 'https://www.asha.org/public/speech/development/',
    rating: 4.8,
    isFree: true,
  },

  // ============================================
  // AUTISM RESOURCES (6 resources)
  // ============================================
  {
    id: 42,
    title: 'ARASAAC Pictogram Library',
    organization: 'ARASAAC',
    type: 'tool',
    category: 'autism',
    description: 'Free library of 12,000+ pictograms for AAC and visual supports. Creative Commons licensed.',
    url: 'https://arasaac.org/',
    rating: 4.9,
    isFeatured: true,
    isFree: true,
  },
  {
    id: 43,
    title: 'Do2Learn Picture Cards',
    organization: 'Do2Learn',
    type: 'website',
    category: 'autism',
    description: 'Free picture communication cards, social skills activities, and learning games.',
    url: 'https://do2learn.com/picturecards/printcards/index.htm',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 44,
    title: 'Visual Supports Toolkit',
    organization: 'Autism Speaks ATN',
    type: 'pdf',
    category: 'autism',
    description: 'Comprehensive toolkit for implementing visual supports including schedules, choice boards, and more.',
    url: 'https://www.autismspeaks.org/tool-kit/atn-air-p-visual-supports-and-autism-spectrum-disorders',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 45,
    title: 'Free Visual Supports Starter Set',
    organization: 'Autism Little Learners',
    type: 'pdf',
    category: 'autism',
    description: 'Free starter kit including first-then boards, visual schedules, and token boards.',
    url: 'https://autismlittlelearners.com/free-visual-supports/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 46,
    title: 'Noodle Nook Visual Supports',
    organization: 'Noodle Nook',
    type: 'website',
    category: 'autism',
    description: 'Visual schedules, token boards, choice boards, and social stories for autism classrooms.',
    url: 'https://www.noodlenook.net/printable-visuals-for-autism/',
    rating: 4.5,
    isFree: true,
  },
  {
    id: 47,
    title: 'Monarch Visual Supports Bank',
    organization: 'Monarch Center for Autism',
    type: 'website',
    category: 'autism',
    description: 'Interactive searchable bank of visual supports with free PDF downloads by category.',
    url: 'https://www.monarchcenterforautism.org/visualsupports',
    rating: 4.6,
    isFree: true,
  },

  // ============================================
  // SENSORY PROCESSING (6 resources)
  // ============================================
  {
    id: 48,
    title: 'OT Toolbox Sensory Resources',
    organization: 'The OT Toolbox',
    type: 'website',
    category: 'sensory',
    description: 'Free sensory processing resources including SPD chart, checklists, and strategy toolkit.',
    url: 'https://www.theottoolbox.com/free-sensory-processing-disorder/',
    rating: 4.8,
    isFeatured: true,
    isFree: true,
  },
  {
    id: 49,
    title: 'Sensory Processing Booklet',
    organization: 'The OT Toolbox',
    type: 'pdf',
    category: 'sensory',
    description: 'Free printable SPD information booklet for parents, teachers, and professionals.',
    url: 'https://www.theottoolbox.com/sensory-processing-disorder-information/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 50,
    title: 'Heavy Work Activities',
    organization: 'The OT Toolbox',
    type: 'pdf',
    category: 'sensory',
    description: 'Free printable packet of heavy work activities for proprioceptive input and self-regulation.',
    url: 'https://www.theottoolbox.com/heavy-work-activities/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 51,
    title: 'Your Therapy Source Free Sensory',
    organization: 'Your Therapy Source',
    type: 'website',
    category: 'sensory',
    description: 'Free sensory processing worksheets, calming strategies, and self-regulation activities.',
    url: 'https://www.yourtherapysource.com/freestuff/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 52,
    title: 'Tools to Grow Sensory Resources',
    organization: 'Tools to Grow',
    type: 'website',
    category: 'sensory',
    description: 'Free sensory processing resources including sensory diet tools and challenge strategies.',
    url: 'https://www.toolstogrowot.com/free-therapy-resources',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 53,
    title: 'Sensory Toolkit PDF',
    organization: 'Ohio State Nisonger Center',
    type: 'pdf',
    category: 'sensory',
    description: 'Evidence-based sensory toolkit with research summaries and intervention strategies.',
    url: 'https://nisonger.osu.edu/wp-content/uploads/2020/03/Sensory-Toolkit-Final-LS-002.pdf',
    directDownload: 'https://nisonger.osu.edu/wp-content/uploads/2020/03/Sensory-Toolkit-Final-LS-002.pdf',
    canPreview: true,
    rating: 4.8,
    isFree: true,
  },

  // ============================================
  // FINE MOTOR / HANDWRITING (5 resources)
  // ============================================
  {
    id: 54,
    title: 'Fine Motor Worksheets',
    organization: 'Superstar Worksheets',
    type: 'pdf',
    category: 'motor',
    description: 'Free printable fine motor worksheets including tracing, cutting, mazes, and pencil control.',
    url: 'https://superstarworksheets.com/preschool-worksheets/fine-motor-worksheets/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 55,
    title: 'Your Therapy Source Fine Motor',
    organization: 'Your Therapy Source',
    type: 'website',
    category: 'motor',
    description: 'Collection of free fine motor activities and printable worksheets for children.',
    url: 'https://www.yourtherapysource.com/fine-motor-activities-free-stuff/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 56,
    title: 'OT Toolbox Spring Fine Motor',
    organization: 'The OT Toolbox',
    type: 'pdf',
    category: 'motor',
    description: 'Free fine motor and handwriting worksheets with play dough activities and precision tasks.',
    url: 'https://www.theottoolbox.com/spring-worksheets-for-fine-motor-skills-and-handwriting/',
    rating: 4.5,
    isFree: true,
  },
  {
    id: 57,
    title: 'Free4Classrooms Fine Motor',
    organization: 'Free4Classrooms',
    type: 'pdf',
    category: 'motor',
    description: 'Free fine motor worksheets including tracing, cutting, dot markers - no login required.',
    url: 'https://free4classrooms.com/fine-motor-skills/',
    rating: 4.5,
    isFree: true,
  },
  {
    id: 58,
    title: 'Tools to Grow Fine Motor',
    organization: 'Tools to Grow',
    type: 'website',
    category: 'motor',
    description: 'Free fine motor resources including scissor skills, handwriting activities, and visual motor tasks.',
    url: 'https://www.toolstogrowot.com/therapy-resources/fine-motor',
    rating: 4.6,
    isFree: true,
  },

  // ============================================
  // BEHAVIOR SUPPORT (5 resources)
  // ============================================
  {
    id: 59,
    title: 'PBIS World Resources',
    organization: 'PBIS World',
    type: 'website',
    category: 'behavior',
    description: 'Complete Tier 1-3 positive behavior interventions with free data collection tools and strategies.',
    url: 'https://www.pbisworld.com/',
    rating: 4.8,
    isFeatured: true,
    isFree: true,
  },
  {
    id: 60,
    title: 'Center on PBIS Resources',
    organization: 'Center on PBIS',
    type: 'pdf',
    category: 'behavior',
    description: 'Evidence-based PBIS resources including support for students with autism spectrum disorders.',
    url: 'https://www.pbis.org/resource/supporting-students-with-autism-spectrum-disorders-through-school-wide-positive-behavior-interventions-and-supports',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 61,
    title: 'Autism PLUS IL Resources',
    organization: 'Autism PLUS IL',
    type: 'website',
    category: 'behavior',
    description: 'Free behavior support resources including ABC data forms, behavior charts, and visual supports.',
    url: 'https://autismplusil.org/resources',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 62,
    title: 'Visual Supports for Behavior',
    organization: 'Vanderbilt Kennedy Center',
    type: 'pdf',
    category: 'behavior',
    description: 'Free guide on using visual supports for behavior management with children with autism.',
    url: 'https://vkc.vumc.org/assets/files/resources/visualsupports.pdf',
    directDownload: 'https://vkc.vumc.org/assets/files/resources/visualsupports.pdf',
    canPreview: true,
    rating: 4.7,
    isFree: true,
  },
  {
    id: 63,
    title: 'AFIRM Modules',
    organization: 'AFIRM',
    type: 'training',
    category: 'behavior',
    description: 'Free evidence-based practice modules for autism intervention including behavior strategies.',
    url: 'https://afirm.fpg.unc.edu/',
    rating: 4.9,
    isFree: true,
  },

  // ============================================
  // ADULT / MEDICAL SLP (5 resources)
  // ============================================
  {
    id: 64,
    title: 'Aphasia Therapy Online',
    organization: 'Aphasia Therapy Online',
    type: 'tool',
    category: 'adult',
    description: 'Free online speech therapy website for aphasia. No signup required.',
    url: 'https://www.aphasiatherapyonline.com/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 65,
    title: 'Aphasia Treatment Approaches',
    organization: 'Adult Speech Therapy',
    type: 'guide',
    category: 'adult',
    description: 'Step-by-step guides for evidence-based aphasia treatment with free PDFs and videos.',
    url: 'https://theadultspeechtherapyworkbook.com/aphasia-treatment-approaches/',
    rating: 4.8,
    isFree: true,
  },
  {
    id: 66,
    title: '55 Aphasia Treatment Activities',
    organization: 'Adult Speech Therapy',
    type: 'guide',
    category: 'adult',
    description: 'Comprehensive list of free aphasia activities for fluent and nonfluent presentations.',
    url: 'https://theadultspeechtherapyworkbook.com/55-aphasia-treatment-activities/',
    rating: 4.7,
    isFree: true,
  },
  {
    id: 67,
    title: 'Aphasia Institute Free Resources',
    organization: 'Aphasia Institute',
    type: 'website',
    category: 'adult',
    description: 'Free communication tools and SCA™ resources for people with aphasia and healthcare providers.',
    url: 'https://www.aphasia.ca/health-care-providers/resources-and-tools/free-resources/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 68,
    title: 'Tactus Therapy Free Downloads',
    organization: 'Tactus Therapy',
    type: 'pdf',
    category: 'adult',
    description: 'Free evidence-based aphasia therapy list and resources for stroke survivors.',
    url: 'https://tactustherapy.com/free-download-slps-aphasia-stroke/',
    rating: 4.7,
    isFree: true,
  },

  // ============================================
  // PARENT RESOURCES (5 resources)
  // ============================================
  {
    id: 69,
    title: 'ASHA Parent Resources',
    organization: 'ASHA',
    type: 'website',
    category: 'parent',
    description: 'Evidence-based resources for parents on speech, language, and communication development.',
    url: 'https://www.asha.org/public/',
    rating: 4.9,
    isFree: true,
  },
  {
    id: 70,
    title: 'Home Speech Home',
    organization: 'Home Speech Home',
    type: 'website',
    category: 'parent',
    description: 'Free word lists, tips, activities, and flashcards for parents to use at home.',
    url: 'https://www.home-speech-home.com/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 71,
    title: 'Autism Family Printables',
    organization: 'Kori at Home',
    type: 'website',
    category: 'parent',
    description: 'Free printable worksheets, daily routine charts, social stories, and sensory-friendly tools.',
    url: 'https://koriathome.com/free-printables-for-autistic-children/',
    rating: 4.6,
    isFree: true,
  },
  {
    id: 72,
    title: 'TPT Free Speech Resources',
    organization: 'Teachers Pay Teachers',
    type: 'website',
    category: 'parent',
    description: 'Curated list of 100+ free speech therapy resources from Teachers Pay Teachers.',
    url: 'https://www.teacherspayteachers.com/Browse/Search:free%20speech%20therapy',
    rating: 4.5,
    isFree: true,
  },
  {
    id: 73,
    title: 'SimplePractice SLP Resources',
    organization: 'SimplePractice',
    type: 'website',
    category: 'parent',
    description: "Curated list of speech therapy resources and materials organized by ASHA's Big Nine.",
    url: 'https://www.simplepractice.com/resource/speech-therapy-resources-materials/',
    rating: 4.5,
    isFree: true,
  },
];

// PDF Viewer Modal Component
const PDFViewerModal = ({ material, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const pdfUrl = material.directDownload;
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${material.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: material.title,
          text: `${material.title} - ${material.organization}`,
          url: material.url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(material.url);
        }
      }
    } else {
      navigator.clipboard.writeText(material.url);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4">
      <div className={`bg-white rounded-2xl overflow-hidden flex flex-col ${
        isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b bg-gray-50">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm text-gray-800 truncate">{material.title}</h3>
            <p className="text-xs text-gray-500 font-crayon">{material.organization}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-blue-600"
              title="Download PDF"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors hidden sm:block"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className="flex-1 relative bg-gray-100">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="font-crayon text-gray-500">Loading PDF...</p>
              </div>
            </div>
          )}
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="font-crayon text-gray-500 mb-4">Unable to preview PDF</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-[#10B981] text-white rounded-lg font-crayon flex items-center gap-2"
                  >
                    <Download size={16} /> Download PDF
                  </button>
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-crayon flex items-center gap-2"
                  >
                    <ExternalLink size={16} /> Open Source
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={viewerUrl}
              className="w-full h-full border-0"
              title={material.title}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-crayon">
            Source: <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{material.organization}</a>
          </p>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-[#10B981] text-white rounded-lg font-crayon text-sm flex items-center gap-2 hover:bg-[#059669]"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const TherapyMaterialsLibrary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [viewingPDF, setViewingPDF] = useState(null);
  const [toast, setToast] = useState(null);

  // Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      // Try Supabase first
      if (isSupabaseConfigured() && user && !user.isGuest) {
        try {
          const { data, error } = await supabase
            .from('therapy_material_favorites')
            .select('material_id')
            .eq('user_id', user.id);
          
          if (!error && data) {
            setFavorites(data.map(f => f.material_id));
            return;
          }
        } catch (e) {
          console.error('Error loading favorites from Supabase:', e);
        }
      }
      
      // Fall back to localStorage
      const saved = localStorage.getItem('therapy_material_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    };
    
    loadFavorites();
  }, [user]);

  // Show toast
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Toggle favorite
  const toggleFavorite = async (materialId) => {
    const isFavorited = favorites.includes(materialId);
    const newFavorites = isFavorited
      ? favorites.filter(id => id !== materialId)
      : [...favorites, materialId];
    
    setFavorites(newFavorites);
    localStorage.setItem('therapy_material_favorites', JSON.stringify(newFavorites));
    
    showToast(isFavorited ? 'Removed from favorites' : 'Added to favorites ❤️');
    
    // Sync to Supabase
    if (isSupabaseConfigured() && user && !user.isGuest) {
      try {
        if (isFavorited) {
          await supabase
            .from('therapy_material_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('material_id', materialId);
        } else {
          await supabase
            .from('therapy_material_favorites')
            .insert({ user_id: user.id, material_id: materialId });
        }
      } catch (e) {
        console.error('Error syncing favorite:', e);
      }
    }
  };

  // Filter materials
  const filteredMaterials = THERAPY_MATERIALS.filter(material => {
    // Handle favorites category
    if (selectedCategory === 'favorites') {
      if (!favorites.includes(material.id)) return false;
    } else {
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
      if (!matchesCategory) return false;
    }
    
    const matchesType = !selectedType || material.type === selectedType;
    const matchesFree = !showFreeOnly || material.isFree;
    const matchesSearch = !searchQuery || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesFree && matchesSearch;
  });

  // Get type info
  const getTypeInfo = (typeId) => RESOURCE_TYPES.find(t => t.id === typeId);

  // Handle resource click
  const handleResourceClick = (material) => {
    if (material.canPreview && material.directDownload) {
      setViewingPDF(material);
    } else if (material.directDownload) {
      window.open(material.directDownload, '_blank');
    } else {
      window.open(material.url, '_blank');
    }
  };

  // Get category count
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return THERAPY_MATERIALS.length;
    if (categoryId === 'favorites') return favorites.length;
    return THERAPY_MATERIALS.filter(m => m.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFEF5]/95 backdrop-blur-sm border-b-4 border-[#10B981]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-4 border-[#10B981] 
                       rounded-xl font-display font-bold text-[#10B981] hover:bg-[#10B981] 
                       hover:text-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-display text-[#10B981] flex items-center gap-2">
              <Layers size={24} />
              Therapy Materials Library
            </h1>
            <p className="text-sm text-gray-500 font-crayon">
              {THERAPY_MATERIALS.length} curated resources
              {favorites.length > 0 && ` • ${favorites.length} saved`}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border-4 border-[#10B981] p-4 mb-6 shadow-lg">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search materials, organizations..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl font-crayon
                         focus:border-[#10B981] focus:outline-none"
            />
          </div>

          {/* Resource Type filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1.5 rounded-full font-crayon text-sm transition-all
                ${!selectedType 
                  ? 'bg-[#10B981] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Types
            </button>
            {RESOURCE_TYPES.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                  className={`px-3 py-1.5 rounded-full font-crayon text-sm flex items-center gap-1.5 transition-all
                    ${selectedType === type.id 
                      ? 'text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={selectedType === type.id ? { backgroundColor: type.color } : {}}
                >
                  <Icon size={14} />
                  {type.name}
                </button>
              );
            })}
            
            {/* Free only toggle */}
            <button
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              className={`px-3 py-1.5 rounded-full font-crayon text-sm flex items-center gap-1.5 transition-all ml-auto
                ${showFreeOnly 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <CheckCircle size={14} />
              Free Only
            </button>
          </div>

          {/* Category tabs - scrollable */}
          <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
            {CATEGORIES.map(category => {
              const Icon = category.icon;
              const count = getCategoryCount(category.id);
              const isFavorites = category.id === 'favorites';
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap font-crayon text-sm transition-all
                    ${selectedCategory === category.id 
                      ? isFavorites
                        ? 'bg-pink-100 text-pink-600 border-2 border-pink-400'
                        : 'bg-[#10B981]/10 text-[#10B981] border-2 border-[#10B981]' 
                      : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'}`}
                >
                  <Icon size={14} className={isFavorites && selectedCategory === category.id ? 'text-pink-500' : ''} />
                  {category.name}
                  <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-crayon text-gray-600">
            {filteredMaterials.length} resources found
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#10B981] text-white' : 'bg-gray-100'}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#10B981] text-white' : 'bg-gray-100'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Favorites empty state */}
        {selectedCategory === 'favorites' && favorites.length === 0 && (
          <div className="text-center py-12 bg-pink-50 rounded-2xl border-2 border-pink-200 mb-6">
            <Heart size={48} className="mx-auto text-pink-300 mb-4" />
            <p className="font-display text-pink-600 mb-2">No favorites yet</p>
            <p className="text-sm text-gray-500 font-crayon">Tap the ❤️ on any resource to save it here</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg font-crayon text-sm"
            >
              Browse Resources
            </button>
          </div>
        )}

        {/* Featured Resources - Only show on "all" category */}
        {selectedCategory === 'all' && !searchQuery && !selectedType && (
          <div className="mb-6">
            <h2 className="font-display text-lg text-gray-700 mb-3 flex items-center gap-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              Featured Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THERAPY_MATERIALS.filter(m => m.isFeatured).slice(0, 6).map(material => {
                const typeInfo = getTypeInfo(material.type);
                const TypeIcon = typeInfo?.icon || FileText;
                const isFavorited = favorites.includes(material.id);
                return (
                  <button
                    key={material.id}
                    onClick={() => handleResourceClick(material)}
                    className="bg-gradient-to-br from-[#10B981]/10 to-[#059669]/10 rounded-2xl border-3 
                               border-[#10B981] p-4 text-left hover:shadow-lg transition-all group relative"
                  >
                    {/* Favorite button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(material.id); }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                        isFavorited ? 'bg-pink-100 text-pink-500' : 'bg-white/80 text-gray-300 hover:text-pink-400'
                      }`}
                    >
                      <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
                    </button>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                        <TypeIcon size={20} className="text-[#10B981]" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-sm text-gray-800 truncate">{material.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          {material.isFree && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Free</span>
                          )}
                          {material.canPreview && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Preview</span>
                          )}
                        </div>
                        <p className="text-xs text-[#10B981] font-crayon mb-1">{material.organization}</p>
                        <p className="text-xs text-gray-500 font-crayon line-clamp-2">{material.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Materials Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' 
          : 'space-y-3'
        }>
          {filteredMaterials.map(material => {
            const typeInfo = getTypeInfo(material.type);
            const TypeIcon = typeInfo?.icon || FileText;
            const isFavorited = favorites.includes(material.id);

            return (
              <button
                key={material.id}
                onClick={() => handleResourceClick(material)}
                className={`bg-white rounded-2xl border-3 p-4 shadow-md hover:shadow-lg 
                           transition-all text-left group relative ${
                             viewMode === 'list' ? 'flex items-center gap-4' : ''
                           }`}
                style={{ borderColor: typeInfo?.color || '#ccc' }}
              >
                {/* Favorite button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(material.id); }}
                  className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors z-10 ${
                    isFavorited ? 'bg-pink-100 text-pink-500' : 'bg-gray-100 text-gray-300 hover:text-pink-400'
                  }`}
                >
                  <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
                </button>
                
                {/* Icon */}
                <div 
                  className={`rounded-xl flex items-center justify-center ${
                    viewMode === 'grid' ? 'w-10 h-10 mb-3' : 'w-12 h-12 flex-shrink-0'
                  }`}
                  style={{ backgroundColor: `${typeInfo?.color}20` }}
                >
                  <TypeIcon size={viewMode === 'grid' ? 20 : 24} style={{ color: typeInfo?.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-display text-sm text-gray-800 truncate">{material.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    {material.isFree && (
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex-shrink-0">Free</span>
                    )}
                    {material.canPreview && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full flex-shrink-0">Preview</span>
                    )}
                    {material.directDownload && !material.canPreview && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full flex-shrink-0 flex items-center gap-1">
                        <Download size={10} /> PDF
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-crayon mb-1" style={{ color: typeInfo?.color }}>
                    {material.organization}
                  </p>
                  <p className="text-xs text-gray-500 font-crayon line-clamp-2 mb-2">
                    {material.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                      {material.rating}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: `${typeInfo?.color}15`, color: typeInfo?.color }}
                    >
                      {typeInfo?.name}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <ExternalLink 
                  size={18} 
                  className="text-gray-300 group-hover:text-[#10B981] transition-colors flex-shrink-0 absolute bottom-4 right-4" 
                />
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredMaterials.length === 0 && selectedCategory !== 'favorites' && (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-crayon text-gray-500">No resources found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* About Section */}
        <div className="mt-8 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Heart size={28} />
            <h3 className="text-xl font-display">About This Library</h3>
          </div>
          <p className="font-crayon text-white/90 mb-4">
            This library contains {THERAPY_MATERIALS.length} curated resources from authoritative organizations 
            including CDC, ASHA, Stuttering Foundation, CASANA, AssistiveWare, ARASAAC, and many more trusted sources. 
            All resources are evidence-based and most are completely free.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-crayon">CDC</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-crayon">ASHA</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-crayon">Stuttering Foundation</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-crayon">CASANA</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-crayon">AssistiveWare</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-crayon">ARASAAC</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-crayon">PBIS</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-crayon">OT Toolbox</span>
          </div>
        </div>
      </main>

      {/* PDF Viewer Modal */}
      {viewingPDF && (
        <PDFViewerModal 
          material={viewingPDF} 
          onClose={() => setViewingPDF(null)} 
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-800 text-white rounded-lg font-crayon text-sm shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
};

export default TherapyMaterialsLibrary;
