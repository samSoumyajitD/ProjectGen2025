import React from "react";
import {
  ClipboardCheck,
  BookOpen,
  User,
  Target,
  Star,
  ListOrdered,
  Calendar,
  GitMerge,
} from "lucide-react";
import { motion } from "framer-motion";

interface ReviewSection {
  title: string;
  icon: React.ReactNode;
  data: { label: string; value: string | string[] }[];
}

interface UserData {
  organization: string;
  currentPosition: string;
  fieldOfStudy: string;
  aboutYourself: string;
  takeNotes: string;
  learningType: string;
  expertiseLevel: string;
  prefersGroupLearning: string;
  avatar: string;
  preferredLearningTime: string;
  areasOfInterest: string[];
  preferredResources: string[];
  priorities: string[];
  schedule?: {
    weekday?: { work: string; development: string; personal: string };
    weekend?: { development: string; personal: string };
  };
  learningFlow?: { nodes: any[]; edges: any[] };
}

interface FifthPageProps {
  data: UserData | null;
}

const FifthPage: React.FC<FifthPageProps> = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  const sections: ReviewSection[] = [
    {
      title: "Professional Information",
      icon: <User className="w-5 h-5 text-gray-600" />,
      data: [
        { label: "Organization", value: data.organization },
        { label: "Current Position", value: data.currentPosition },
        { label: "Field of Study", value: data.fieldOfStudy },
        { label: "About Yourself", value: data.aboutYourself },
      ],
    },
    {
      title: "Learning Preferences",
      icon: <BookOpen className="w-5 h-5 text-gray-600" />,
      data: [
        { label: "Note-Taking Style", value: data.takeNotes },
        { label: "Learning Type", value: data.learningType },
        { label: "Expertise Level", value: data.expertiseLevel },
        { label: "Group Learning", value: data.prefersGroupLearning },
      ],
    },
    {
      title: "Profile Settings",
      icon: <Target className="w-5 h-5 text-gray-600" />,
      data: [
        { label: "Avatar", value: data.avatar },
        { label: "Preferred Time", value: data.preferredLearningTime },
      ],
    },
    {
      title: "Interests & Resources",
      icon: <Star className="w-5 h-5 text-gray-600" />,
      data: [
        {
          label: "Areas of Interest",
          value: data.areasOfInterest?.join(", ") || "Not specified",
        },
        {
          label: "Preferred Resources",
          value: data.preferredResources?.join(", ") || "Not specified",
        },
      ],
    },
   
    {
      title: "Learning Flow",
      icon: <GitMerge className="w-5 h-5 text-gray-600" />,
      data: [
        {
          label: "Learning Steps",
          value: Array.isArray(data.learningFlow?.nodes)
            ? data.learningFlow.nodes
                .map((node: any) => node.data?.label)
                .join(" → ") || "Not specified"
            : "Not specified",
        },
      ],
    },
    {
      title: "Course Priorities",
      icon: <ListOrdered className="w-5 h-5 text-gray-600" />,
      data: data.priorities.map((priority, index) => ({
        label: `Priority ${index + 1}`,
        value: priority,
      })),
    },
    {
      title: "Schedule Overview",
      icon: <Calendar className="w-5 h-5 text-gray-600" />,
      data: [
        {
          label: "Total Weekday Work Hours",
          value: `${parseInt(data.schedule?.weekday?.work || "0") * 5} hours`,
        },
        {
          label: "Total Weekday Development Hours",
          value: `${parseInt(data.schedule?.weekday?.development || "0") * 5} hours`,
        },
        {
          label: "Total Weekday Personal Time",
          value: `${parseInt(data.schedule?.weekday?.personal || "0") * 5} hours`,
        },
        {
          label: "Total Weekend Development Hours",
          value: `${parseInt(data.schedule?.weekend?.development || "0") * 2} hours`,
        },
        {
          label: "Total Weekend Personal Time",
          value: `${parseInt(data.schedule?.weekend?.personal || "0") * 2} hours`,
        },
      ],
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8  font-sans">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <ClipboardCheck className="mx-auto h-16 w-16 text-primary" />

        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-lg ${
                ["Learning Flow", "Schedule Overview", "Course Priorities"].includes(section.title) ? "md:col-span-2" : ""
              }`}
              
            >
              <div className="px-6 py-4 flex items-center space-x-3 bg-gray-50">
                {section.icon}
                <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                {section.data.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-baseline">
                    <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                    <dd className="text-sm text-gray-900 font-semibold">{item.value}</dd>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FifthPage;