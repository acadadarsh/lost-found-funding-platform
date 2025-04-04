
import { MapPin, Search, Award } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Post a Lost or Found Item",
    description:
      "Easily post details about a lost or found item including location, photos, and description.",
    icon: <MapPin className="h-6 w-6" />,
    iconBg: "bg-lost-light",
    iconColor: "text-lost",
  },
  {
    id: 2,
    title: "Browse the Map",
    description:
      "Search items on an interactive map to find lost items or check if someone found yours.",
    icon: <Search className="h-6 w-6" />,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: 3,
    title: "Claim Rewards",
    description:
      "Offer or contribute to rewards for lost items. Get rewarded for returning found items.",
    icon: <Award className="h-6 w-6" />,
    iconBg: "bg-found-light",
    iconColor: "text-found",
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-lg text-primary font-semibold">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find lost items through community support
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform connects people who have lost items with those who have found them.
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {steps.map((step) => (
              <div key={step.id} className="relative">
                <div
                  className={`absolute flex items-center justify-center h-12 w-12 rounded-md ${step.iconBg} ${step.iconColor}`}
                >
                  {step.icon}
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  {step.title}
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
