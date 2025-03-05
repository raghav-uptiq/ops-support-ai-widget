import { useState, useEffect } from "react";
import { EmailRequest } from "@/types";
import { EmailItem } from "./EmailItem";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { v4 as uuid } from "uuid";
import { getSamuelConfig, getSamuelUser } from "@/lib/utils";
import axios from "axios";

export const EmailsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [emails, setEmails] = useState<EmailRequest[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<
    string | undefined
  >(emails.at(0)?._id);

  const handleRunWorkflow = async (taskInputs: any) => {
    const executionId = uuid();
    const { uid } = getSamuelUser();
    const { appId, serverUrl, widgetKey } = getSamuelConfig();

    const workflowId = taskInputs?.workflowId;
    if (!workflowId) throw new Error("workflowId is required");

    const response = await axios.post(
      `${serverUrl}/workflow-defs/run-sync`,
      { executionId, uid, integrationId: workflowId, appId, taskInputs },
      { headers: { widgetKey, appid: appId } }
    );
    console.log(response.data);
    return response.data;
  };

  const onSelectEmail = async (requestId: string) => {
    setSelectedRequestId(requestId);
    await handleRunWorkflow({
      workflowId: "emit-event-3817",
      data: { ticketId: requestId },
    });
  };

  useEffect(() => {
    async function fetchEmails() {
      const response = await handleRunWorkflow({
        workflowId: "get-data-for-email-list-widget-9231",
      });
      setEmails(response.data);
    }
    fetchEmails();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmails(emails);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = emails.filter(
        (email) =>
          email.subject?.toLowerCase().includes(lowercasedSearch) ||
          email.fromName?.toLowerCase().includes(lowercasedSearch) ||
          email.fromEmail?.toLowerCase().includes(lowercasedSearch) ||
          email.text?.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredEmails(filtered);
    }
  }, [searchTerm, emails]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b sticky top-0 z-10 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-primary"
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{ height: "calc(100% - 9rem)" }}
      >
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <p className="text-muted-foreground">No emails found</p>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <EmailItem
              key={email._id}
              email={email}
              isSelected={email._id === selectedRequestId}
              onClick={() => onSelectEmail(email._id)}
            />
          ))
        )}
      </div>

      <div className="p-3 border-t bg-muted/30 text-xs text-center text-muted-foreground sticky bottom-0 z-10 bg-white">
        Showing {filteredEmails.length} of {emails.length} emails
      </div>
    </div>
  );
};
