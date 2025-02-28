"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupportTicket {
  title: string;
  category: string;
  priority: string;
  description: string;
  contactinfo: number;
}

export function TicketSubmissionForm() {
  const [ticket, setTicket] = useState<SupportTicket>({
    title: "",
    category: "",
    priority: "",
    description: "",
    contactinfo: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newValue = name === "contactinfo" ? Number(value) : value;
    setTicket((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", ticket.title);
    formData.append("category", ticket.category);
    formData.append("priority", ticket.priority);
    formData.append("description", ticket.description);
    formData.append("contactinfo", ticket.contactinfo.toString());
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/supports/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit ticket");
      }

      console.log("Ticket submitted successfully:", await response.json());
      setSuccess(true);

      setTicket({
        title: "",
        category: "",
        priority: "",
        description: "",
        contactinfo: 0,
      });
      setFile(null);
      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Error submitting ticket:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-indigo-700 dark:text-indigo-300">
          Submit a Support Ticket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 dark:text-red-400">{error}</div>}
          {success && <div className="text-green-500 dark:text-green-400">Ticket submitted successfully!</div>}
          <div>
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Ticket Title</Label>
            <Input
              id="title"
              name="title"
              value={ticket.title}
              onChange={handleInputChange}
              placeholder="Enter a brief summary of the issue"
              required
            />
          </div>
          <div>
            <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Category</Label>
            <Select
              name="category"
              value={ticket.category}
              onValueChange={(value) => setTicket((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing Inquiry</SelectItem>
                <SelectItem value="general">General Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">Priority Level</Label>
            <Select
              name="priority"
              value={ticket.priority}
              onValueChange={(value) => setTicket((prev) => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={ticket.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of the issue"
              required
            />
          </div>
          <div>
            <Label htmlFor="contactinfo" className="text-gray-700 dark:text-gray-300">Contact Information</Label>
            <Input
              id="contactinfo"
              name="contactinfo"
              type="number"
              value={ticket.contactinfo === 0 ? "" : ticket.contactinfo}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <Label htmlFor="file" className="text-gray-700 dark:text-gray-300">Attach File</Label>
            <Input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <Button type="submit">Submit Ticket</Button>
        </form>
      </CardContent>
    </Card>
  );
}