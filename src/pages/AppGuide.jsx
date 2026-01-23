// AppGuide.jsx - Comprehensive app guide and onboarding for ATLASassist
// Shows detailed information about all features and how they integrate
// Auto-shows for new users, accessible from hub info button

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  MessageSquare,
  Wrench,
  Heart,
  Gamepad2,
  Palette,
  FileText,
  BookOpen,
  Users,
  Bell,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  Lightbulb,
  Star,
  Home,
  Activity,
  Brain
} from 'lucide-react';

// ============================================
// GUIDE CONTENT DATA
// ============================================

const GUIDE_SECTIONS = [
  {
    id: 'welcome',
    title: 'Welcome to ATLASassist! 🌟',
    icon: Sparkles,
    color: '#8E6BBF',
    content: {
      intro: "ATLASassist (Assistive Tools for Learning, Access & Support) is designed for individuals with neurodiverse abilities and their families.",
      points: [
        "📱 Works on any device - phone, tablet, or computer",
        "🔔 Get helpful reminders and notifications",
        "☁️ Your data syncs across devices when logged in",
        "🎨 Kid-friendly design with large, easy-to-tap buttons",
        "♿ Built with accessibility in mind"
      ],
      tip: "Tip: Install ATLASassist to your home screen for the best experience! Look for the 'Add to Home Screen' prompt."
    }
  },
  {
    id: 'visual-schedule',
    title: 'Visual Schedule 📅',
    icon: Calendar,
    color: '#E63B2E',
    content: {
      intro: "The heart of ATLASassist! Create visual daily schedules using pictures and icons to help with routines and transitions.",
      features: [
        "Week view with half-hour time slots",
        "Drag-and-drop activities",
        "Pre-built templates (School Day, Weekend, etc.)",
        "100+ activity icons to choose from",
        "Check off activities as you complete them",
        "Custom images and activities"
      ],
      integrations: [
        {
          app: "First-Then Board",
          description: "Activities can be added directly to your schedule"
        },
        {
          app: "Choice Board",
          description: "Chosen activities can be scheduled"
        },
        {
          app: "Push Notifications",
          description: "Get reminders before activities start"
        }
      ],
      tip: "Tip: Set up recurring activities for daily routines like morning hygiene, meals, and bedtime!"
    }
  },
  {
    id: 'point-to-talk',
    title: 'Point to Talk 💬',
    icon: MessageSquare,
    color: '#F5A623',
    content: {
      intro: "An AAC (Augmentative and Alternative Communication) tool that helps communicate needs through pictures and text-to-speech.",
      features: [
        "Build sentences by tapping word buttons",
        "Text-to-speech reads sentences aloud",
        "Three board layouts: Basic, Personal, Cloud",
        "Add custom words with AI suggestions",
        "ARASAAC pictogram support",
        "Customizable quick-access footer"
      ],
      layouts: [
        {
          name: "Basic",
          description: "Default vocabulary with core words"
        },
        {
          name: "Personal",
          description: "Your custom words appear first"
        },
        {
          name: "Cloud",
          description: "Popular words from the community"
        }
      ],
      tip: "Tip: Customize the 4 footer words to the most frequently needed phrases!"
    }
  },
  {
    id: 'tools',
    title: 'Daily Tools 🔧',
    icon: Wrench,
    color: '#B8860B',
    content: {
      intro: "Helpful everyday tools for managing time, routines, and transitions.",
      tools: [
        {
          name: "Visual Timer",
          description: "Shows time passing visually - great for transitions and time-limited activities",
          icon: "⏱️"
        },
        {
          name: "First-Then Board",
          description: "Shows 'First do this, Then do that' - helps with motivation and expectations",
          icon: "1️⃣➡️2️⃣"
        },
        {
          name: "Counter",
          description: "Count anything - reps, items, behaviors",
          icon: "🔢"
        },
        {
          name: "Soundboard",
          description: "Quick audio feedback and alerts",
          icon: "🔊"
        },
        {
          name: "Daily Routines",
          description: "Step-by-step routine guides",
          icon: "📋"
        },
        {
          name: "Milestone Guide",
          description: "Developmental milestone reference",
          icon: "📈"
        }
      ],
      tip: "Tip: The Visual Timer is perfect for helping with transitions - 'When the red is gone, it's time to stop!'"
    }
  },
  {
    id: 'wellness',
    title: 'Emotional Wellness 💚',
    icon: Brain,
    color: '#20B2AA',
    content: {
      intro: "Tools to understand, express, and regulate emotions. Essential for emotional development and self-regulation.",
      tools: [
        {
          name: "Calm Down Corner",
          description: "Breathing exercises, calming activities, and sensory tools",
          icon: "🧘"
        },
        {
          name: "Feelings Tracker",
          description: "Track emotions throughout the day",
          icon: "😊"
        },
        {
          name: "Emotion Chart",
          description: "Visual reference for identifying emotions",
          icon: "🎭"
        },
        {
          name: "Coping Skills Chart",
          description: "Strategies for managing big feelings",
          icon: "💪"
        },
        {
          name: "Circles of Control",
          description: "Learn what you can and can't control",
          icon: "⭕"
        },
        {
          name: "Growth Mindset",
          description: "Activities promoting positive thinking",
          icon: "🌱"
        },
        {
          name: "Body Check-In",
          description: "Connect physical sensations with emotions",
          icon: "🫀"
        }
      ],
      tip: "Tip: Use the Calm Down Corner BEFORE a meltdown starts - watch for early warning signs!"
    }
  },
  {
    id: 'health',
    title: 'Health & Wellness ❤️',
    icon: Heart,
    color: '#E86B9A',
    content: {
      intro: "Track physical health, nutrition, sleep, and daily wellness activities.",
      trackers: [
        {
          name: "Water Tracker",
          description: "Track daily water intake with visual progress",
          icon: "💧"
        },
        {
          name: "Sleep Tracker",
          description: "Log sleep times and quality",
          icon: "😴"
        },
        {
          name: "Nutrition Guide",
          description: "Healthy eating tips and recipes",
          icon: "🥗"
        },
        {
          name: "Movement & Exercise",
          description: "Fun physical activities",
          icon: "🏃"
        },
        {
          name: "OT Exercises",
          description: "Occupational therapy activities",
          icon: "✋"
        },
        {
          name: "Healthy Choices",
          description: "Visual decision helper for healthy options",
          icon: "✅"
        }
      ],
      tip: "Tip: Sleep and hydration significantly impact behavior and regulation - track these first!"
    }
  },
  {
    id: 'games',
    title: 'Games 🎮',
    icon: Gamepad2,
    color: '#5CB85C',
    content: {
      intro: "Fun educational games that build cognitive and motor skills while entertaining.",
      games: [
        { name: "Matching Game", description: "Memory and pattern matching", icon: "🃏" },
        { name: "Emotion Match", description: "Match emotions to faces/situations", icon: "😀" },
        { name: "Bubble Pop", description: "Calming and motor skills", icon: "🫧" },
        { name: "Color Sort", description: "Sorting and categorization", icon: "🎨" },
        { name: "Shape Match", description: "Shape recognition", icon: "🔷" },
        { name: "Simple Puzzles", description: "Visual-spatial skills", icon: "🧩" },
        { name: "Pattern Sequence", description: "Pattern recognition", icon: "🔢" },
        { name: "Sound Match", description: "Auditory matching", icon: "🔊" }
      ],
      tip: "Tip: The Emotion Match game is great practice for recognizing feelings in others!"
    }
  },
  {
    id: 'activities',
    title: 'Activities & Learning 🎨',
    icon: Palette,
    color: '#4A9FD4',
    content: {
      intro: "Creative activities, learning tools, and educational content.",
      activities: [
        {
          name: "Social Stories",
          description: "AI-generated stories that help explain situations and expectations",
          icon: "📖",
          highlight: true
        },
        {
          name: "Choice Board",
          description: "Visual choice-making tool",
          icon: "🎯"
        },
        {
          name: "Coloring Book",
          description: "Digital coloring activities",
          icon: "🖍️"
        },
        {
          name: "Pronunciation Practice",
          description: "Speech practice with visual cues",
          icon: "🗣️"
        },
        {
          name: "Photo Journal",
          description: "Visual diary with photos",
          icon: "📸"
        },
        {
          name: "Reward Chart",
          description: "Positive reinforcement tracking",
          icon: "⭐"
        },
        {
          name: "Sensory Breaks",
          description: "Quick sensory regulation activities",
          icon: "🌈"
        },
        {
          name: "Music & Sounds",
          description: "Calming and engaging sounds",
          icon: "🎵"
        }
      ],
      socialStoriesNote: "Social Stories use AI to create personalized narratives about going to the doctor, trying new foods, handling changes, and more!",
      tip: "Tip: Create Social Stories BEFORE new experiences to reduce anxiety!"
    }
  },
  {
    id: 'planning',
    title: 'Planning & Documents 📋',
    icon: FileText,
    color: '#CD853F',
    content: {
      intro: "Important planning tools and document storage for families and caregivers.",
      documents: [
        {
          name: "Student Profile",
          description: "Comprehensive profile for schools and caregivers",
          icon: "👤"
        },
        {
          name: "File of Life",
          description: "Emergency medical information",
          icon: "🏥"
        },
        {
          name: "Person-Centered Plan",
          description: "Goals, preferences, and support needs",
          icon: "🎯"
        },
        {
          name: "Memorandum of Intent",
          description: "Future planning document",
          icon: "📝"
        }
      ],
      tip: "Tip: Keep the File of Life updated - it can be critical in emergencies!"
    }
  },
  {
    id: 'resources',
    title: 'Resources & Research 📚',
    icon: BookOpen,
    color: '#8E6BBF',
    content: {
      intro: "Knowledge base, research, printables, and helpful resources.",
      resources: [
        { name: "Knowledge Base", description: "State-specific resources and laws", icon: "📚" },
        { name: "Research Hub", description: "Evidence-based information", icon: "🔬" },
        { name: "Printables", description: "Visual supports to print", icon: "🖨️" },
        { name: "Recommended Products", description: "Helpful tools and toys", icon: "🛒" },
        { name: "Therapy Types", description: "Guide to different therapies", icon: "💆" },
        { name: "Definitions", description: "Glossary of terms", icon: "📖" },
        { name: "FAQ", description: "Frequently asked questions", icon: "❓" }
      ],
      tip: "Tip: Check the Knowledge Base for your state's specific disability rights and resources!"
    }
  },
  {
    id: 'notifications',
    title: 'Notifications & Reminders 🔔',
    icon: Bell,
    color: '#4A9FD4',
    content: {
      intro: "Stay on track with helpful push notifications and reminders.",
      features: [
        "Activity reminders from Visual Schedule",
        "Customizable reminder times (5, 10, 15, 30 min before)",
        "Repeat notifications until acknowledged",
        "Enable/disable per app in Settings",
        "Works even when app is closed"
      ],
      setup: [
        "Allow notifications when prompted",
        "Go to Settings to customize timing",
        "Enable/disable for specific apps",
        "Test notifications work on your device"
      ],
      tip: "Tip: Set reminders 5-10 minutes before transitions to allow processing time!"
    }
  },
  {
    id: 'care-team',
    title: 'My Care Team 👥',
    icon: Users,
    color: '#008B8B',
    content: {
      intro: "Manage appointments, track goals, and coordinate with your support team.",
      tools: [
        {
          name: "Appointment Tracker",
          description: "Keep track of therapy and doctor appointments",
          icon: "📅"
        },
        {
          name: "Goal Tracker",
          description: "Track IEP and therapy goals",
          icon: "🎯"
        },
        {
          name: "My Team",
          description: "Contact info for all providers",
          icon: "👥"
        },
        {
          name: "Quick Notes",
          description: "Jot down observations for appointments",
          icon: "📝"
        },
        {
          name: "Reminders",
          description: "Medication and appointment reminders",
          icon: "⏰"
        }
      ],
      tip: "Tip: Write Quick Notes throughout the week to share at appointments!"
    }
  },
  {
    id: 'getting-started',
    title: 'Getting Started ✅',
    icon: CheckCircle2,
    color: '#5CB85C',
    content: {
      intro: "Here's the recommended order to set up ATLASassist for success!",
      steps: [
        {
          step: 1,
          title: "Set up Visual Schedule",
          description: "Create a basic daily schedule with key activities",
          path: "/visual-schedule"
        },
        {
          step: 2,
          title: "Enable Notifications",
          description: "Turn on reminders in Settings",
          path: "/settings"
        },
        {
          step: 3,
          title: "Customize Point to Talk",
          description: "Add frequently used words and phrases",
          path: "/point-to-talk"
        },
        {
          step: 4,
          title: "Explore Calm Down Tools",
          description: "Find what works for regulation",
          path: "/wellness"
        },
        {
          step: 5,
          title: "Create a Social Story",
          description: "For an upcoming challenging situation",
          path: "/activities/social-stories"
        }
      ],
      tip: "Tip: Start small! Add features gradually as you and your child get comfortable with each tool."
    }
  }
];

// ============================================
// SUB-COMPONENTS
// ============================================

const FeatureList = ({ items, showIcons = true }) => (
  <ul className="space-y-2">
    {items.map((item, idx) => (
      <li key={idx} className="flex items-start gap-2">
        {showIcons && <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />}
        <span className="text-gray-700 font-crayon text-sm">{item}</span>
      </li>
    ))}
  </ul>
);

const ToolCard = ({ tool }) => (
  <div className="bg-white rounded-xl p-3 border-2 border-gray-200 hover:border-gray-300 transition-colors">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xl">{tool.icon}</span>
      <span className="font-display text-sm text-gray-800">{tool.name}</span>
    </div>
    <p className="text-xs text-gray-600 font-crayon">{tool.description}</p>
  </div>
);

const IntegrationBadge = ({ integration }) => (
  <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
    <div className="flex items-center gap-2">
      <ArrowRight size={14} className="text-blue-500" />
      <span className="font-display text-xs text-blue-700">{integration.app}</span>
    </div>
    <p className="text-xs text-blue-600 font-crayon mt-1">{integration.description}</p>
  </div>
);

const SetupStep = ({ step, navigate, onClose }) => (
  <button
    onClick={() => {
      onClose();
      navigate(step.path);
    }}
    className="w-full bg-white rounded-xl p-3 border-2 border-gray-200 hover:border-green-400 
               hover:bg-green-50 transition-all text-left group"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">
        {step.step}
      </div>
      <div className="flex-1">
        <h4 className="font-display text-sm text-gray-800 group-hover:text-green-700">{step.title}</h4>
        <p className="text-xs text-gray-600 font-crayon">{step.description}</p>
      </div>
      <ChevronRight size={18} className="text-gray-400 group-hover:text-green-500" />
    </div>
  </button>
);

// ============================================
// SECTION RENDERER
// ============================================

const SectionContent = ({ section, navigate, onClose }) => {
  const content = section.content;
  
  return (
    <div className="space-y-4">
      {/* Intro */}
      <p className="text-gray-700 font-crayon">{content.intro}</p>
      
      {/* Features list */}
      {content.features && (
        <div>
          <h4 className="font-display text-sm text-gray-800 mb-2">Features:</h4>
          <FeatureList items={content.features} />
        </div>
      )}
      
      {/* Points list */}
      {content.points && (
        <FeatureList items={content.points} showIcons={false} />
      )}
      
      {/* Tools grid */}
      {content.tools && (
        <div className="grid grid-cols-2 gap-2">
          {content.tools.map((tool, idx) => (
            <ToolCard key={idx} tool={tool} />
          ))}
        </div>
      )}
      
      {/* Trackers */}
      {content.trackers && (
        <div className="grid grid-cols-2 gap-2">
          {content.trackers.map((tracker, idx) => (
            <ToolCard key={idx} tool={tracker} />
          ))}
        </div>
      )}
      
      {/* Games */}
      {content.games && (
        <div className="grid grid-cols-2 gap-2">
          {content.games.map((game, idx) => (
            <ToolCard key={idx} tool={game} />
          ))}
        </div>
      )}
      
      {/* Activities */}
      {content.activities && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {content.activities.map((activity, idx) => (
              <ToolCard key={idx} tool={activity} />
            ))}
          </div>
          {content.socialStoriesNote && (
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
              <div className="flex items-start gap-2">
                <Star className="text-purple-500 flex-shrink-0" size={16} />
                <p className="text-sm text-purple-700 font-crayon">{content.socialStoriesNote}</p>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Documents */}
      {content.documents && (
        <div className="grid grid-cols-2 gap-2">
          {content.documents.map((doc, idx) => (
            <ToolCard key={idx} tool={doc} />
          ))}
        </div>
      )}
      
      {/* Resources */}
      {content.resources && (
        <div className="grid grid-cols-2 gap-2">
          {content.resources.map((resource, idx) => (
            <ToolCard key={idx} tool={resource} />
          ))}
        </div>
      )}
      
      {/* Integrations */}
      {content.integrations && (
        <div>
          <h4 className="font-display text-sm text-gray-800 mb-2">Integrates with:</h4>
          <div className="space-y-2">
            {content.integrations.map((integration, idx) => (
              <IntegrationBadge key={idx} integration={integration} />
            ))}
          </div>
        </div>
      )}
      
      {/* Layouts (for Point to Talk) */}
      {content.layouts && (
        <div>
          <h4 className="font-display text-sm text-gray-800 mb-2">Board Layouts:</h4>
          <div className="space-y-2">
            {content.layouts.map((layout, idx) => (
              <div key={idx} className="bg-orange-50 rounded-lg p-2 border border-orange-200">
                <span className="font-display text-xs text-orange-700">{layout.name}:</span>
                <span className="text-xs text-orange-600 font-crayon ml-1">{layout.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Setup steps */}
      {content.steps && (
        <div className="space-y-2">
          {content.steps.map((step, idx) => (
            <SetupStep key={idx} step={step} navigate={navigate} onClose={onClose} />
          ))}
        </div>
      )}
      
      {/* Setup list */}
      {content.setup && (
        <div>
          <h4 className="font-display text-sm text-gray-800 mb-2">Setup:</h4>
          <ol className="list-decimal list-inside space-y-1">
            {content.setup.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 font-crayon">{item}</li>
            ))}
          </ol>
        </div>
      )}
      
      {/* Tip */}
      {content.tip && (
        <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-300">
          <div className="flex items-start gap-2">
            <Lightbulb className="text-yellow-600 flex-shrink-0" size={18} />
            <p className="text-sm text-yellow-800 font-crayon">{content.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const AppGuide = ({ isOpen, onClose, isFirstTime = false }) => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [viewMode, setViewMode] = useState(isFirstTime ? 'walkthrough' : 'menu'); // menu or walkthrough
  
  useEffect(() => {
    if (isOpen) {
      setCurrentSection(0);
      setViewMode(isFirstTime ? 'walkthrough' : 'menu');
    }
  }, [isOpen, isFirstTime]);
  
  if (!isOpen) return null;
  
  const section = GUIDE_SECTIONS[currentSection];
  const Icon = section.icon;
  
  const goNext = () => {
    if (currentSection < GUIDE_SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };
  
  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };
  
  const handleClose = () => {
    // Mark guide as seen
    localStorage.setItem('snw_guide_seen', 'true');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFEF5] w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden border-4 border-[#8E6BBF] flex flex-col">
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: section.color }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg text-white">{section.title}</h2>
              <p className="text-white/80 text-xs font-crayon">
                {currentSection + 1} of {GUIDE_SECTIONS.length}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${((currentSection + 1) / GUIDE_SECTIONS.length) * 100}%`,
              backgroundColor: section.color 
            }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'menu' ? (
            // Menu View - Show all sections
            <div className="space-y-2">
              <p className="font-crayon text-gray-600 text-sm mb-4">
                Tap any section to learn more, or use the arrows to go through the guide.
              </p>
              {GUIDE_SECTIONS.map((sec, idx) => {
                const SecIcon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setCurrentSection(idx);
                      setViewMode('walkthrough');
                    }}
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all
                      ${idx === currentSection 
                        ? 'border-gray-800 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: sec.color }}
                    >
                      <SecIcon size={18} className="text-white" />
                    </div>
                    <span className="font-display text-sm text-gray-800">{sec.title}</span>
                    <ChevronRight size={16} className="text-gray-400 ml-auto" />
                  </button>
                );
              })}
            </div>
          ) : (
            // Walkthrough View - Show current section content
            <SectionContent 
              section={section} 
              navigate={navigate}
              onClose={handleClose}
            />
          )}
        </div>
        
        {/* Footer Navigation */}
        <div className="p-4 border-t-2 border-gray-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (viewMode === 'walkthrough' && currentSection > 0) {
                goPrev();
              } else {
                setViewMode('menu');
              }
            }}
            className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-crayon"
          >
            <ChevronLeft size={18} />
            {viewMode === 'walkthrough' && currentSection === 0 ? 'Menu' : 'Back'}
          </button>
          
          {viewMode === 'menu' && (
            <button
              onClick={() => setViewMode('walkthrough')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-crayon hover:bg-gray-200"
            >
              Start Tour
            </button>
          )}
          
          {viewMode === 'walkthrough' && currentSection < GUIDE_SECTIONS.length - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-1 px-4 py-2 text-white rounded-xl font-display"
              style={{ backgroundColor: section.color }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : viewMode === 'walkthrough' && (
            <button
              onClick={handleClose}
              className="flex items-center gap-1 px-4 py-2 bg-[#5CB85C] text-white rounded-xl font-display"
            >
              Get Started!
              <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppGuide;
