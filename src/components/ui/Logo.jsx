import { BookOpen } from "lucide-react";

export default function Logo({ size = "text-2xl" }) {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <BookOpen className="text-blue-600 w-6 h-6" />
      <div>
        <h1 className={`font-heading ${size} text-blue-600 leading-none`}>
          Universely
        </h1>
        <p className="font-body text-xs text-gray-600 dark:text-gray-300 leading-tight -mt-1">
          Interactive stories
        </p>
      </div>
    </div>
  );
}
