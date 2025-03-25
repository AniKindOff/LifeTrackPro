export interface Question {
  id: number;
  question: {
    en: string;
    hi: string;
  };
  options: {
    en: string[];
    hi: string[];
  };
  correctAnswer: number;
  explanation: {
    en: string;
    hi: string;
  };
  category: 'basic' | 'intermediate' | 'advanced';
  points: number;
}

export const questions: Question[] = [
  {
    id: 1,
    question: {
      en: "What is the first step in creating a budget?",
      hi: "बजट बनाने का पहला कदम क्या है?"
    },
    options: {
      en: [
        "Track your expenses",
        "Set financial goals",
        "Calculate your income",
        "Start saving money"
      ],
      hi: [
        "खर्चों को ट्रैक करें",
        "वित्तीय लक्ष्य तय करें",
        "आय की गणना करें",
        "पैसे बचाना शुरू करें"
      ]
    },
    correctAnswer: 2,
    explanation: {
      en: "Knowing your income is essential to create a realistic budget.",
      hi: "एक यथार्थवादी बजट बनाने के लिए अपनी आय जानना आवश्यक है।"
    },
    category: 'basic',
    points: 50
  },
  {
    id: 2,
    question: {
      en: "What is the 50/30/20 budgeting rule?",
      hi: "50/30/20 बजट नियम क्या है?"
    },
    options: {
      en: [
        "50% savings, 30% needs, 20% wants",
        "50% needs, 30% wants, 20% savings",
        "50% wants, 30% savings, 20% needs",
        "50% needs, 30% savings, 20% wants"
      ],
      hi: [
        "50% बचत, 30% जरूरतें, 20% इच्छाएं",
        "50% जरूरतें, 30% इच्छाएं, 20% बचत",
        "50% इच्छाएं, 30% बचत, 20% जरूरतें",
        "50% जरूरतें, 30% बचत, 20% इच्छाएं"
      ]
    },
    correctAnswer: 1,
    explanation: {
      en: "The 50/30/20 rule suggests spending 50% on needs, 30% on wants, and 20% on savings.",
      hi: "50/30/20 नियम सुझाव देता है कि 50% जरूरतों पर, 30% इच्छाओं पर, और 20% बचत पर खर्च करें।"
    },
    category: 'basic',
    points: 50
  },
  {
    id: 3,
    question: {
      en: "What is compound interest?",
      hi: "चक्रवृद्धि ब्याज क्या है?"
    },
    options: {
      en: [
        "Interest earned only on the principal amount",
        "Interest earned on both principal and accumulated interest",
        "Interest that decreases over time",
        "Interest paid at a fixed rate"
      ],
      hi: [
        "केवल मूल राशि पर अर्जित ब्याज",
        "मूल राशि और जमा ब्याज दोनों पर अर्जित ब्याज",
        "समय के साथ घटने वाला ब्याज",
        "एक निश्चित दर पर भुगतान किया गया ब्याज"
      ]
    },
    correctAnswer: 1,
    explanation: {
      en: "Compound interest is interest earned on both the initial principal and the accumulated interest from previous periods.",
      hi: "चक्रवृद्धि ब्याज मूल राशि और पिछली अवधियों के जमा ब्याज दोनों पर अर्जित ब्याज है।"
    },
    category: 'intermediate',
    points: 75
  },
  {
    id: 4,
    question: {
      en: "What is diversification in investing?",
      hi: "निवेश में विविधीकरण क्या है?"
    },
    options: {
      en: [
        "Investing all money in one stock",
        "Spreading investments across different assets",
        "Only investing in safe assets",
        "Investing in high-risk assets only"
      ],
      hi: [
        "सभी पैसे एक स्टॉक में निवेश करना",
        "विभिन्न परिसंपत्तियों में निवेश को फैलाना",
        "केवल सुरक्षित परिसंपत्तियों में निवेश करना",
        "केवल उच्च जोखिम वाली परिसंपत्तियों में निवेश करना"
      ]
    },
    correctAnswer: 1,
    explanation: {
      en: "Diversification means spreading investments across different assets to reduce risk.",
      hi: "विविधीकरण का अर्थ है जोखिम को कम करने के लिए विभिन्न परिसंपत्तियों में निवेश को फैलाना।"
    },
    category: 'intermediate',
    points: 75
  },
  {
    id: 5,
    question: {
      en: "What is a credit score?",
      hi: "क्रेडिट स्कोर क्या है?"
    },
    options: {
      en: [
        "Your bank account balance",
        "A number representing your creditworthiness",
        "The amount of money you can borrow",
        "Your monthly income"
      ],
      hi: [
        "आपका बैंक खाता बैलेंस",
        "आपकी क्रेडिट योग्यता को दर्शाने वाला एक नंबर",
        "वह राशि जो आप उधार ले सकते हैं",
        "आपकी मासिक आय"
      ]
    },
    correctAnswer: 1,
    explanation: {
      en: "A credit score is a numerical representation of your creditworthiness based on your credit history.",
      hi: "क्रेडिट स्कोर आपके क्रेडिट इतिहास के आधार पर आपकी क्रेडिट योग्यता का संख्यात्मक प्रतिनिधित्व है।"
    },
    category: 'basic',
    points: 50
  }
]; 