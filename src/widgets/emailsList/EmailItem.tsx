import { cn } from "@/lib/utils";
import { EmailRequest } from "@/types";
import { getPriorityIcon, getStatusIcon } from "@/constants";
import { format, isToday, isYesterday } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface EmailItemProps {
  email: EmailRequest;
  isSelected: boolean;
  onClick: () => void;
}

export function EmailItem({ email, isSelected, onClick }: EmailItemProps) {
  console.log(email.status);

  const UrgentIcon = getPriorityIcon("urgent");
  const StatusIcon = getStatusIcon(email.status);

  const formattedDate = () => {
    if (!email.timestamp) return;
    const date = new Date(email.timestamp);
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  const statusColorMap = {
    Processing: "bg-purple-50 text-purple-600",
    Completed: "bg-green-50 text-green-600",
    Failed: "bg-red-50 text-red-600",
  };

  return (
    <div
      className={cn(
        "p-4 border-b transition-all-200 cursor-pointer relative overflow-hidden",
        isSelected
          ? "bg-primary/5 border-l-4 border-l-primary"
          : "hover:bg-gray-50",
        isSelected && "animate-scale-in"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 rounded-full border bg-muted">
          <User className="h-5 w-5" />
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3
              className={cn(
                "font-medium text-sm truncate max-w-[180px]",
                isSelected && "text-primary"
              )}
            >
              {email.fromName || email.fromEmail}
            </h3>
            <span className="text-xs text-gray-500">{formattedDate()}</span>
          </div>

          <h4 className="font-medium text-sm mb-1.5 truncate">
            {email.subject}
          </h4>

          <p className="text-xs text-gray-600 line-clamp-1 mb-2">
            {email.text}
          </p>

          <div className="flex items-center gap-2">
            {email.kind === "urgent" && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-2 py-0.5 h-6 rounded-full flex items-center gap-1",
                  "bg-red-50 text-red-600"
                )}
              >
                <UrgentIcon className="h-3 w-3" />
                <span className="capitalize">{email.priority}</span>
              </Badge>
            )}

            <Badge
              variant="outline"
              className={cn(
                "text-xs px-2 py-0.5 h-6 rounded-full flex items-center gap-1",
                statusColorMap[email.status]
              )}
            >
              <StatusIcon className="h-3 w-3" />
              <span className="capitalize">{email.status}</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
