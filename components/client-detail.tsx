import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "lucide-react";

interface ClientDetailProps {
  client: {
    id: number;
    name: string;
    project: string;
    contactinfo: string;
    email: string;
    status: string;
  };
  onClose: () => void;
  onUpdate: (updatedClient: any) => void; // Kept for compatibility, though not used here
  projects: string[];
}

export function ClientDetail({ client, onClose, onUpdate, projects }: ClientDetailProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[90vw] rounded-xl bg-white dark:bg-gray-900 shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            Client Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col">
            <strong className="text-gray-700 dark:text-gray-300">Client Name:</strong>
            <span className="text-gray-800 dark:text-gray-200 mt-1">{client.name}</span>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 dark:text-gray-300">Project:</strong>
            <span className="text-gray-800 dark:text-gray-200 mt-1">{client.project}</span>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 dark:text-gray-300">Email:</strong>
            <span className="text-gray-800 dark:text-gray-200 mt-1">{client.email}</span>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 dark:text-gray-300">Contact Info:</strong>
            <span className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap break-words">
              {client.contactinfo}
            </span>
          </div>
          <div className="flex flex-col">
            <strong className="text-gray-700 dark:text-gray-300">Status:</strong>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium mt-1 ${
                client.status === "Active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : client.status === "On Hold"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {client.status}
            </span>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => {/* Add linking logic here if needed */}}
              className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
            >
              <Link className="h-4 w-4 mr-2" />
              Link Project
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}