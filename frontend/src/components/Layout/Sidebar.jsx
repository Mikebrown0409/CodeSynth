import { cn } from "../../lib/utils"

export default function Sidebar({ className, children }) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 