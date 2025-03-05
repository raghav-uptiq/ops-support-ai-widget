import { cn } from "@/lib/utils";
import { Action } from "@/types";
import { getActionIcon } from "@/constants";
import { CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

interface ActionItemProps {
  action: Action;
}

export function ActionItem({ action }: ActionItemProps) {
  const ActionIcon = getActionIcon(action.type);

  const statusColorMap = {
    completed: "bg-green-50 text-green-600 border-green-200",
    failed: "bg-red-50 text-red-600 border-red-200",
  };

  const typeColorMap = {
    acknowledgmentEmail: "bg-blue-50 text-blue-600",
    response: "bg-green-50 text-green-600",
    sendToWhatsappSupport: "bg-yellow-50 text-yellow-600",
    apiCall: "bg-purple-50 text-purple-600",
  };

  const metadata =
    action.type === "apiCall"
      ? action.apiCall
      : action.type === "response" || action.type === "acknowledgmentEmail"
      ? action.email
      : action.type === "sendToWhatsappSupport"
      ? action.message
      : undefined;

  const isActionCompleted =
    action.type !== "apiCall" || action.apiCall.result === "Success";

  const StatusIcon = isActionCompleted ? CheckCircle2 : XCircle;

  return (
    <div
      className={cn(
        "p-4 border rounded-lg mb-3 transition-all duration-200 animate-slide-in-right",
        isActionCompleted ? "bg-green-50" : "bg-red-50",
        "hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-full", typeColorMap[action.type])}>
          <ActionIcon className="h-4 w-4" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-sm capitalize mb-1">
                {action.type.replace(/_/g, " ")}
              </h4>
              <p className="text-xs text-gray-700">{action.description}</p>
            </div>

            <div
              className={cn(
                "px-2 py-1 rounded-full text-xs flex items-center gap-1",
                isActionCompleted
                  ? statusColorMap.completed
                  : statusColorMap.failed
              )}
            >
              <StatusIcon className="h-3 w-3" />
              <span className="capitalize">
                {isActionCompleted ? "Completed" : "Failed"}
              </span>
            </div>
          </div>

          {metadata && (
            <div className="mt-3 text-xs bg-black/5 p-2 rounded">
              <p className="font-medium mb-1">Additional Information:</p>
              <ul className="space-y-1">
                {Object.entries(metadata).map(([key, value]) => (
                  <li key={key} className="flex">
                    <span className="font-medium capitalize min-w-[100px]">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span>
                      {Array.isArray(value)
                        ? value.join(", ")
                        : typeof value === "object"
                        ? JSON.stringify(value)
                        : value.toString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3 text-xs text-muted-foreground">
            {format(new Date(action.timestamp), "MMM d, yyyy 'at' h:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
}
