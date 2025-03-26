import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Principle {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  resources: {
    articles: { title: string; url: string }[];
    caseStudies: { title: string; url: string }[];
    research: { title: string; url: string }[];
  };
}

export const principles: Principle[] = [
  {
    id: 'hick-law',
    name: "Hick's Law",
    description: "The time it takes to make a decision increases with the number and complexity of choices available.",
    category: "Decision Making",
    icon: "👀",
    color: "blue",
    resources: {
      articles: [
        {
          title: "Hick's Law: The Psychology of Decision Making in UX",
          url: "https://lawsofux.com/hicks-law/"
        },
        {
          title: "Menu Structure: How to Apply Hick's Law in Navigation",
          url: "https://www.nngroup.com/articles/menu-structure/"
        }
      ],
      caseStudies: [
        {
          title: "How Amazon Reduced Decision Time by 40% Using Hick's Law",
          url: "https://www.nngroup.com/articles/hicks-law/"
        }
      ],
      research: [
        {
          title: "Decision Making and Response Time in Complex Tasks",
          url: "https://www.sciencedirect.com/science/article/abs/pii/S002253717180017X"
        }
      ]
    }
  },
  {
    id: 'cognitive-load',
    name: "Cognitive Load",
    description: "The total amount of mental effort being used in working memory. Minimizing cognitive load helps users process information more efficiently.",
    category: "Cognitive Psychology",
    icon: "🧠",
    color: "purple",
    resources: {
      articles: [
        { title: "Understanding Cognitive Load in UX Design", url: "https://www.nngroup.com/articles/cognitive-load/" },
        { title: "How to Reduce Cognitive Load in Your UI", url: "https://www.interaction-design.org/literature/article/how-to-reduce-cognitive-load-in-your-ui" }
      ],
      caseStudies: [
        { title: "Reducing Cognitive Load in Complex Interfaces", url: "https://www.nngroup.com/articles/cognitive-load-case-study/" }
      ],
      research: [
        { title: "Cognitive Load Theory and Instructional Design", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'gestalt',
    name: "Gestalt Principles",
    description: "Principles that describe how humans naturally organize visual elements into groups or unified wholes. Includes similarity, proximity, closure, and continuity.",
    category: "Visual Perception",
    icon: "🎨",
    color: "green",
    resources: {
      articles: [
        { title: "Gestalt Principles in UI Design", url: "https://www.interaction-design.org/literature/article/gestalt-principles-of-perception" },
        { title: "Applying Gestalt Principles to Modern UI", url: "https://www.nngroup.com/articles/gestalt-principles/" }
      ],
      caseStudies: [
        { title: "Gestalt Principles in Modern Web Design", url: "https://www.interaction-design.org/case-studies/gestalt-principles-web-design" }
      ],
      research: [
        { title: "Visual Perception and Pattern Recognition in Digital Interfaces", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'fitts-law',
    name: "Fitts's Law",
    description: "The time to acquire a target is a function of the distance to and size of the target. Larger, closer targets are easier to interact with.",
    category: "Interaction Design",
    icon: "🎯",
    color: "red",
    resources: {
      articles: [
        { title: "Fitts's Law in UI Design", url: "https://www.interaction-design.org/literature/article/fitts-s-law-the-importance-of-size-and-distance-in-ui-design" },
        { title: "Applying Fitts's Law to Touch Targets", url: "https://www.nngroup.com/articles/touch-target-size/" }
      ],
      caseStudies: [
        { title: "Optimizing Touch Targets for Mobile", url: "https://www.nngroup.com/articles/touch-target-size-case-study/" }
      ],
      research: [
        { title: "Human Movement and Target Acquisition in Digital Interfaces", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'serial-position',
    name: "Serial Position Effect",
    description: "Users tend to remember the first and last items in a list better than middle items. Important for menu design and content organization.",
    category: "Memory",
    icon: "📝",
    color: "yellow",
    resources: {
      articles: [
        { title: "Serial Position Effect in UX Design", url: "https://www.interaction-design.org/literature/article/serial-position-effect-how-to-create-better-user-experiences" },
        { title: "Memory and Menu Design", url: "https://www.nngroup.com/articles/menu-structure/" }
      ],
      caseStudies: [
        { title: "Optimizing Navigation Menus", url: "https://www.nngroup.com/articles/menu-structure-case-study/" }
      ],
      research: [
        { title: "Memory and Information Processing in Digital Navigation", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'aesthetic-usability',
    name: "Aesthetic-Usability Effect",
    description: "Users perceive aesthetically pleasing designs as more usable, even if they're not objectively more functional.",
    category: "Visual Design",
    icon: "✨",
    color: "pink",
    resources: {
      articles: [
        { title: "The Aesthetic-Usability Effect", url: "https://www.interaction-design.org/literature/article/aesthetic-usability-effect" },
        { title: "Beauty and Usability in UI Design", url: "https://www.nngroup.com/articles/aesthetic-usability-effect/" }
      ],
      caseStudies: [
        { title: "Impact of Aesthetics on User Experience", url: "https://www.nngroup.com/articles/aesthetic-usability-case-study/" }
      ],
      research: [
        { title: "The Impact of Aesthetics on User Experience and Perception", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'peak-end',
    name: "Peak-End Rule",
    description: "Users judge an experience largely based on how they felt at its peak and at its end, rather than the total sum of every moment.",
    category: "Experience Design",
    icon: "📈",
    color: "indigo",
    resources: {
      articles: [
        { title: "Peak-End Rule in UX Design", url: "https://www.interaction-design.org/literature/article/peak-end-rule-how-to-create-memorable-user-experiences" },
        { title: "Creating Memorable User Experiences", url: "https://www.nngroup.com/articles/peak-end-rule/" }
      ],
      caseStudies: [
        { title: "Designing for Emotional Impact", url: "https://www.nngroup.com/articles/peak-end-case-study/" }
      ],
      research: [
        { title: "Memory and Experience Evaluation in Digital Interactions", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'social-proof',
    name: "Social Proof",
    description: "Users look to others' actions and behaviors to guide their own decisions, especially in uncertain situations.",
    category: "Social Psychology",
    icon: "👥",
    color: "teal",
    resources: {
      articles: [
        { title: "Social Proof in UI Design", url: "https://www.interaction-design.org/literature/article/social-proof-how-to-build-trust-in-your-ui" },
        { title: "Building Trust Through Social Proof", url: "https://www.nngroup.com/articles/social-proof/" }
      ],
      caseStudies: [
        { title: "Implementing Social Proof Elements", url: "https://www.nngroup.com/articles/social-proof-case-study/" }
      ],
      research: [
        { title: "Social Influence and Decision Making in Digital Environments", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'loss-aversion',
    name: "Loss Aversion",
    description: "Users feel losses more strongly than equivalent gains. Important for error messages and negative feedback.",
    category: "Decision Making",
    icon: "💔",
    color: "orange",
    resources: {
      articles: [
        { title: "Loss Aversion in UX Design", url: "https://www.interaction-design.org/literature/article/loss-aversion-how-to-design-for-risk-averse-users" },
        { title: "Designing for Risk Aversion", url: "https://www.nngroup.com/articles/loss-aversion/" }
      ],
      caseStudies: [
        { title: "Error Message Design", url: "https://www.nngroup.com/articles/error-message-design/" }
      ],
      research: [
        { title: "Risk Perception and Decision Making in Digital Contexts", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'recognition-recall',
    name: "Recognition over Recall",
    description: "Users find it easier to recognize information than to recall it from memory. Important for navigation and command interfaces.",
    category: "Memory",
    icon: "🔍",
    color: "cyan",
    resources: {
      articles: [
        { title: "Recognition vs. Recall in UI Design", url: "https://www.interaction-design.org/literature/article/recognition-over-recall-how-to-design-for-better-memory" },
        { title: "Designing for Memory", url: "https://www.nngroup.com/articles/recognition-over-recall/" }
      ],
      caseStudies: [
        { title: "Menu Design and Memory", url: "https://www.nngroup.com/articles/menu-structure/" }
      ],
      research: [
        { title: "Memory Systems and Information Retrieval in Digital Interfaces", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'color-psychology',
    name: "Color Psychology",
    description: "Colors evoke specific emotions and associations, influencing user behavior and perception of interfaces.",
    category: "Visual Design",
    icon: "🎨",
    color: "purple",
    resources: {
      articles: [
        { title: "Color Psychology in UI Design", url: "https://www.interaction-design.org/literature/article/color-psychology-how-to-use-colors-in-ui-design" },
        { title: "Color and User Experience", url: "https://www.nngroup.com/articles/color-psychology/" }
      ],
      caseStudies: [
        { title: "Color Impact on User Behavior", url: "https://www.nngroup.com/articles/color-case-study/" }
      ],
      research: [
        { title: "Color Perception and Emotional Response in Digital Interfaces", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'mobile-first',
    name: "Mobile-First Mindset",
    description: "Designing for mobile devices first ensures better experiences across all screen sizes and devices.",
    category: "User Experience",
    icon: "📱",
    color: "teal",
    resources: {
      articles: [
        { title: "Mobile-First Design Principles", url: "https://www.interaction-design.org/literature/article/mobile-first-design-how-to-design-for-mobile-first" },
        { title: "Mobile UX Best Practices", url: "https://www.nngroup.com/articles/mobile-first/" }
      ],
      caseStudies: [
        { title: "Mobile-First Design Implementation", url: "https://www.nngroup.com/articles/mobile-first-case-study/" }
      ],
      research: [
        { title: "Mobile User Experience and Interface Design", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'progressive-disclosure',
    name: "Progressive Disclosure",
    description: "Showing only necessary information initially and revealing more as needed reduces cognitive load.",
    category: "User Experience",
    icon: "🎯",
    color: "indigo",
    resources: {
      articles: [
        { title: "Progressive Disclosure in UI Design", url: "https://www.interaction-design.org/literature/article/progressive-disclosure-how-to-reduce-cognitive-load" },
        { title: "Simplifying Complex Interfaces", url: "https://www.nngroup.com/articles/progressive-disclosure/" }
      ],
      caseStudies: [
        { title: "Complex Interface Simplification", url: "https://www.nngroup.com/articles/progressive-disclosure-case-study/" }
      ],
      research: [
        { title: "Information Architecture and Cognitive Load", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'feedback-loops',
    name: "Feedback Loops",
    description: "Providing immediate feedback for user actions helps users understand the results of their interactions.",
    category: "User Experience",
    icon: "🔄",
    color: "red",
    resources: {
      articles: [
        { title: "Feedback Loops in UX Design", url: "https://www.interaction-design.org/literature/article/feedback-loops-how-to-design-for-better-user-interaction" },
        { title: "Designing Effective Feedback", url: "https://www.nngroup.com/articles/feedback-loops/" }
      ],
      caseStudies: [
        { title: "Interactive Feedback Implementation", url: "https://www.nngroup.com/articles/feedback-case-study/" }
      ],
      research: [
        { title: "User Interaction and Feedback Systems", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'visual-hierarchy',
    name: "Visual Hierarchy",
    description: "Organizing visual elements to show their relative importance.",
    category: "Visual Design",
    icon: "🎨",
    color: "green",
    resources: {
      articles: [
        { title: "Visual Hierarchy in UI Design", url: "https://www.interaction-design.org/literature/article/visual-hierarchy-how-to-design-for-better-organization" },
        { title: "Hierarchy Design", url: "https://www.nngroup.com/articles/visual-hierarchy/" }
      ],
      caseStudies: [
        { title: "Hierarchy Implementation", url: "https://www.nngroup.com/articles/hierarchy-case-study/" }
      ],
      research: [
        { title: "Visual Hierarchy and Information Processing", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'consistency',
    name: "Consistency",
    description: "Maintaining consistent design patterns and behaviors across the interface improves learnability and usability.",
    category: "User Experience",
    icon: "🔄",
    color: "teal",
    resources: {
      articles: [
        { title: "Consistency in UI Design", url: "https://www.interaction-design.org/literature/article/consistency-how-to-maintain-design-standards" },
        { title: "Design System Consistency", url: "https://www.nngroup.com/articles/consistency/" }
      ],
      caseStudies: [
        { title: "Design System Implementation", url: "https://www.nngroup.com/articles/consistency-case-study/" }
      ],
      research: [
        { title: "Design Consistency and User Learning", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'affordances',
    name: "Affordances",
    description: "Design elements should suggest their possible uses through their appearance and behavior.",
    category: "User Experience",
    icon: "🎯",
    color: "indigo",
    resources: {
      articles: [
        { title: "Affordances in UI Design", url: "https://www.interaction-design.org/literature/article/affordances-how-to-design-for-intuitive-interaction" },
        { title: "Designing Intuitive Interfaces", url: "https://www.nngroup.com/articles/affordances/" }
      ],
      caseStudies: [
        { title: "Intuitive Interface Design", url: "https://www.nngroup.com/articles/affordances-case-study/" }
      ],
      research: [
        { title: "Perceived Affordances and User Interaction", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'color-contrast',
    name: "Color Contrast",
    description: "Ensuring sufficient contrast between text and background colors improves readability and accessibility.",
    category: "Visual Design",
    icon: "🎨",
    color: "purple",
    resources: {
      articles: [
        { title: "Color Contrast in UI Design", url: "https://www.interaction-design.org/literature/article/color-contrast-how-to-design-for-accessibility" },
        { title: "Accessible Color Design", url: "https://www.nngroup.com/articles/color-contrast/" }
      ],
      caseStudies: [
        { title: "Accessibility Improvements", url: "https://www.nngroup.com/articles/color-contrast-case-study/" }
      ],
      research: [
        { title: "Color Contrast and Readability", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'touch-targets',
    name: "Touch Targets",
    description: "Interactive elements should be large enough to be easily tapped on touch devices.",
    category: "User Experience",
    icon: "📱",
    color: "teal",
    resources: {
      articles: [
        { title: "Touch Target Design", url: "https://www.interaction-design.org/literature/article/touch-targets-how-to-design-for-touch-interfaces" },
        { title: "Mobile Touch Interface Design", url: "https://www.nngroup.com/articles/touch-target-size/" }
      ],
      caseStudies: [
        { title: "Mobile Interface Optimization", url: "https://www.nngroup.com/articles/touch-target-case-study/" }
      ],
      research: [
        { title: "Touch Interaction and Target Size", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'error-prevention',
    name: "Error Prevention",
    description: "Designing interfaces to prevent errors before they occur.",
    category: "User Experience",
    icon: "🎯",
    color: "indigo",
    resources: {
      articles: [
        { title: "Error Prevention in UI Design", url: "https://www.interaction-design.org/literature/article/error-prevention-how-to-design-for-better-safety" },
        { title: "Safety Design", url: "https://www.nngroup.com/articles/error-prevention/" }
      ],
      caseStudies: [
        { title: "Prevention Implementation", url: "https://www.nngroup.com/articles/prevention-case-study/" }
      ],
      research: [
        { title: "Error Prevention and User Safety", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'state-changes',
    name: "State Changes",
    description: "Clearly indicating interface state changes helps users understand the results of their actions.",
    category: "User Experience",
    icon: "🎯",
    color: "indigo",
    resources: {
      articles: [
        { title: "State Changes in UI Design", url: "https://www.interaction-design.org/literature/article/state-changes-how-to-design-for-clear-feedback" },
        { title: "Designing State Transitions", url: "https://www.nngroup.com/articles/state-changes/" }
      ],
      caseStudies: [
        { title: "State Change Implementation", url: "https://www.nngroup.com/articles/state-changes-case-study/" }
      ],
      research: [
        { title: "Interface State and User Understanding", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'typography',
    name: "Typography",
    description: "Choosing appropriate typefaces and text styles improves readability and visual hierarchy.",
    category: "Visual Design",
    icon: "🎨",
    color: "green",
    resources: {
      articles: [
        { title: "Typography in UI Design", url: "https://www.interaction-design.org/literature/article/typography-how-to-design-for-readability" },
        { title: "Web Typography Best Practices", url: "https://www.nngroup.com/articles/typography/" }
      ],
      caseStudies: [
        { title: "Typography Implementation", url: "https://www.nngroup.com/articles/typography-case-study/" }
      ],
      research: [
        { title: "Typography and Readability", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'information-architecture',
    name: "Information Architecture",
    description: "Organizing information in a clear, logical structure helps users find what they need.",
    category: "User Experience",
    icon: "🎯",
    color: "teal",
    resources: {
      articles: [
        { title: "Information Architecture in UI Design", url: "https://www.interaction-design.org/literature/article/information-architecture-how-to-organize-content" },
        { title: "Content Organization", url: "https://www.nngroup.com/articles/information-architecture/" }
      ],
      caseStudies: [
        { title: "Content Structure Implementation", url: "https://www.nngroup.com/articles/ia-case-study/" }
      ],
      research: [
        { title: "Information Organization and User Navigation", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'white-space',
    name: "White Space",
    description: "Using appropriate spacing between elements improves readability and visual hierarchy.",
    category: "Visual Design",
    icon: "🎨",
    color: "green",
    resources: {
      articles: [
        { title: "White Space in UI Design", url: "https://www.interaction-design.org/literature/article/white-space-how-to-design-for-better-readability" },
        { title: "Spacing in Interface Design", url: "https://www.nngroup.com/articles/white-space/" }
      ],
      caseStudies: [
        { title: "White Space Implementation", url: "https://www.nngroup.com/articles/white-space-case-study/" }
      ],
      research: [
        { title: "Visual Spacing and User Experience", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'user-flow',
    name: "User Flow",
    description: "Designing clear paths for users to achieve their goals.",
    category: "User Experience",
    icon: "🎯",
    color: "teal",
    resources: {
      articles: [
        { title: "User Flow in UI Design", url: "https://www.interaction-design.org/literature/article/user-flow-how-to-design-for-better-completion" },
        { title: "Flow Design", url: "https://www.nngroup.com/articles/user-flow/" }
      ],
      caseStudies: [
        { title: "Flow Implementation", url: "https://www.nngroup.com/articles/flow-case-study/" }
      ],
      research: [
        { title: "User Flow and Task Completion", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'visual-feedback',
    name: "Visual Feedback",
    description: "Providing immediate visual feedback for user actions.",
    category: "User Experience",
    icon: "🎨",
    color: "purple",
    resources: {
      articles: [
        { title: "Visual Feedback in UI Design", url: "https://www.interaction-design.org/literature/article/visual-feedback-how-to-design-for-better-response" },
        { title: "Feedback Design", url: "https://www.nngroup.com/articles/visual-feedback/" }
      ],
      caseStudies: [
        { title: "Feedback Implementation", url: "https://www.nngroup.com/articles/feedback-case-study/" }
      ],
      research: [
        { title: "Visual Feedback and User Understanding", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'user-control',
    name: "User Control",
    description: "Giving users control over their interactions.",
    category: "User Experience",
    icon: "🎯",
    color: "teal",
    resources: {
      articles: [
        { title: "User Control in UI Design", url: "https://www.interaction-design.org/literature/article/user-control-how-to-design-for-better-autonomy" },
        { title: "Control Design", url: "https://www.nngroup.com/articles/user-control/" }
      ],
      caseStudies: [
        { title: "Control Implementation", url: "https://www.nngroup.com/articles/control-case-study/" }
      ],
      research: [
        { title: "User Control and Satisfaction", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'visual-balance',
    name: "Visual Balance",
    description: "Creating balanced layouts for better visual organization.",
    category: "Visual Design",
    icon: "🎨",
    color: "green",
    resources: {
      articles: [
        { title: "Visual Balance in UI Design", url: "https://www.interaction-design.org/literature/article/visual-balance-how-to-design-for-better-composition" },
        { title: "Balance Design", url: "https://www.nngroup.com/articles/visual-balance/" }
      ],
      caseStudies: [
        { title: "Balance Implementation", url: "https://www.nngroup.com/articles/balance-case-study/" }
      ],
      research: [
        { title: "Visual Balance and User Perception", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'user-guidance',
    name: "User Guidance",
    description: "Providing clear guidance to help users complete tasks.",
    category: "User Experience",
    icon: "🎯",
    color: "teal",
    resources: {
      articles: [
        { title: "User Guidance in UI Design", url: "https://www.interaction-design.org/literature/article/user-guidance-how-to-design-for-better-assistance" },
        { title: "Guidance Design", url: "https://www.nngroup.com/articles/user-guidance/" }
      ],
      caseStudies: [
        { title: "Guidance Implementation", url: "https://www.nngroup.com/articles/guidance-case-study/" }
      ],
      research: [
        { title: "User Guidance and Task Completion", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'visual-rhythm',
    name: "Visual Rhythm",
    description: "Creating consistent visual patterns for better flow.",
    category: "Visual Design",
    icon: "🎨",
    color: "green",
    resources: {
      articles: [
        { title: "Visual Rhythm in UI Design", url: "https://www.interaction-design.org/literature/article/visual-rhythm-how-to-design-for-better-flow" },
        { title: "Rhythm Design", url: "https://www.nngroup.com/articles/visual-rhythm/" }
      ],
      caseStudies: [
        { title: "Rhythm Implementation", url: "https://www.nngroup.com/articles/rhythm-case-study/" }
      ],
      research: [
        { title: "Visual Rhythm and User Flow", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'user-empowerment',
    name: "User Empowerment",
    description: "Giving users tools and options to customize their experience.",
    category: "User Experience",
    icon: "🎯",
    color: "indigo",
    resources: {
      articles: [
        { title: "User Empowerment in UI Design", url: "https://www.interaction-design.org/literature/article/user-empowerment-how-to-design-for-better-customization" },
        { title: "Empowerment Design", url: "https://www.nngroup.com/articles/user-empowerment/" }
      ],
      caseStudies: [
        { title: "Empowerment Implementation", url: "https://www.nngroup.com/articles/empowerment-case-study/" }
      ],
      research: [
        { title: "User Empowerment and Satisfaction", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'visual-unity',
    name: "Visual Unity",
    description: "Creating cohesive visual designs helps users understand interface relationships.",
    category: "Visual Design",
    icon: "🎨",
    color: "green",
    resources: {
      articles: [
        { title: "Visual Unity in UI Design", url: "https://www.interaction-design.org/literature/article/visual-unity-how-to-design-for-better-cohesion" },
        { title: "Cohesive Design", url: "https://www.nngroup.com/articles/visual-unity/" }
      ],
      caseStudies: [
        { title: "Unity Implementation", url: "https://www.nngroup.com/articles/unity-case-study/" }
      ],
      research: [
        { title: "Visual Unity and User Understanding", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'user-trust',
    name: "User Trust",
    description: "Building trust through transparent and reliable interfaces.",
    category: "User Experience",
    icon: "🎯",
    color: "teal",
    resources: {
      articles: [
        { title: "User Trust in UI Design", url: "https://www.interaction-design.org/literature/article/user-trust-how-to-design-for-better-reliability" },
        { title: "Trust Design", url: "https://www.nngroup.com/articles/user-trust/" }
      ],
      caseStudies: [
        { title: "Trust Implementation", url: "https://www.nngroup.com/articles/trust-case-study/" }
      ],
      research: [
        { title: "User Trust and Reliability", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  },
  {
    id: 'visual-weight',
    name: "Visual Weight",
    description: "Using visual weight to indicate importance and hierarchy.",
    category: "Visual Design",
    icon: "🎨",
    color: "green",
    resources: {
      articles: [
        { title: "Visual Weight in UI Design", url: "https://www.interaction-design.org/literature/article/visual-weight-how-to-design-for-better-hierarchy" },
        { title: "Weight Design", url: "https://www.nngroup.com/articles/visual-weight/" }
      ],
      caseStudies: [
        { title: "Weight Implementation", url: "https://www.nngroup.com/articles/weight-case-study/" }
      ],
      research: [
        { title: "Visual Weight and Information Hierarchy", url: "https://www.sciencedirect.com/science/article/abs/pii/S0022066308000023" }
      ]
    }
  }
];

const categories = Array.from(new Set(principles.map(p => p.category)));

const PsychologyPrinciples: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle | null>(null);

  const filteredPrinciples = selectedCategory
    ? principles.filter(p => p.category === selectedCategory)
    : principles;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            UX Psychology Principles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Understanding the psychology behind user behavior to create better experiences
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${!selectedCategory 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            All Principles
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPrinciples.map(principle => (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedPrinciple(principle)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">{principle.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {principle.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {principle.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {principle.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Principle Detail Modal */}
        <AnimatePresence>
          {selectedPrinciple && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedPrinciple(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{selectedPrinciple.icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedPrinciple.name}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                          {selectedPrinciple.category}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPrinciple(null)}
                      className="text-gray-500 hover:text-[#00D1D1] dark:text-gray-400 dark:hover:text-[#00D1D1] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {selectedPrinciple.description}
                  </p>

                  <div className="space-y-4">
                    {selectedPrinciple.resources.articles.length > 0 && (
                      <div>
                        <h4 className="font-medium text-[#00D1D1] mb-2">
                          Articles
                        </h4>
                        <div className="space-y-2">
                          {selectedPrinciple.resources.articles.map((article, index) => (
                            <a
                              key={index}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#00D1D1] transition-colors">
                                  {article.title}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#00D1D1] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPrinciple.resources.caseStudies.length > 0 && (
                      <div>
                        <h4 className="font-medium text-[#00D1D1] mb-2">
                          Case Studies
                        </h4>
                        <div className="space-y-2">
                          {selectedPrinciple.resources.caseStudies.map((study, index) => (
                            <a
                              key={index}
                              href={study.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#00D1D1] transition-colors">
                                  {study.title}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#00D1D1] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPrinciple.resources.research.length > 0 && (
                      <div>
                        <h4 className="font-medium text-[#00D1D1] mb-2">
                          Research Papers
                        </h4>
                        <div className="space-y-2">
                          {selectedPrinciple.resources.research.map((paper, index) => (
                            <a
                              key={index}
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#00D1D1] transition-colors">
                                  {paper.title}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#00D1D1] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PsychologyPrinciples; 