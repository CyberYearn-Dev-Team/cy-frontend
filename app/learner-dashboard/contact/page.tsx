"use client";

import React, { useState } from "react";
import Sidebar from "@/components/ui/learner-sidebar";
import Header from "@/components/ui/learner-header";
import LearnerFooter from "@/components/ui/learner-footer";
import { Phone, Mail, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLabel = "text-gray-700 dark:text-gray-200";
const borderLight = "border-gray-300 dark:border-gray-600";

export default function ContactUsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactReason: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactReason: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (!formData.contactReason) {
      toast.warning("Please select a contact reason");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Your message has been sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contactReason: "",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content + Footer wrapper */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <main className="flex-1 mx-auto lg:px-20 px-6 py-12 w-full">
            <div className="max-w-7xl mx-auto">
              {/* Page Title */}
              <div className="text-center mb-8 sm:mb-12">
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${textDark} mb-4`}>
                  Contact Us
                </h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <Card className={`shadow-lg border-0 ${cardBg}`}>
                    <CardHeader>
                      <CardTitle className={`text-xl sm:text-2xl font-semibold ${textDark}`}>
                        Send us a message
                      </CardTitle>
                      <p className={`${textMedium} mt-2 text-sm sm:text-base`}>
                        Do you have a question? Let us know and we&apos;ll do our best to answer it.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName" className={`py-3 ${textLabel}`}>
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Enter your first name"
                              required
                              className="py-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-[#72a210]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className={`py-3 ${textLabel}`}>
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Enter your last name"
                              required
                              className="py-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-[#72a210]"
                            />
                          </div>
                        </div>

                        {/* Email & Contact Reason */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email" className={`py-3 ${textLabel}`}>
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email address"
                              required
                              className="py-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-[#72a210]"
                            />
                          </div>

                          <div>
                            <Label htmlFor="contactReason" className={`py-3 ${textLabel}`}>
                              Contact Reason
                            </Label>
                            <Select onValueChange={handleSelectChange} value={formData.contactReason}>
                              <SelectTrigger
                                className={`w-full h-11 rounded-md border ${borderLight} px-3 py-6 text-sm focus:outline-none focus:ring-2 focus:ring-[${primary}] cursor-pointer dark:bg-gray-800 dark:text-gray-100`}
                              >
                                <SelectValue placeholder="Select a reason" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                                <SelectItem value="general" className="dark:text-gray-100 dark:hover:bg-gray-700">General Inquiry</SelectItem>
                                <SelectItem value="course-info" className="dark:text-gray-100 dark:hover:bg-gray-700">Course Information</SelectItem>
                                <SelectItem value="tech-support" className="dark:text-gray-100 dark:hover:bg-gray-700">Technical Support</SelectItem>
                                <SelectItem value="certification" className="dark:text-gray-100 dark:hover:bg-gray-700">Certification & Exams</SelectItem>
                                <SelectItem value="billing" className="dark:text-gray-100 dark:hover:bg-gray-700">Billing & Payments</SelectItem>
                                <SelectItem value="security-report" className="dark:text-gray-100 dark:hover:bg-gray-700">Report a Security Issue</SelectItem>
                                <SelectItem value="career" className="dark:text-gray-100 dark:hover:bg-gray-700">Career / Internship</SelectItem>
                                <SelectItem value="other" className="dark:text-gray-100 dark:hover:bg-gray-700">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Message */}
                        <div>
                          <Label htmlFor="message" className={`py-3 ${textLabel}`}>
                            Message
                          </Label>
                          <textarea
                            id="message"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Enter your message"
                            className={`w-full rounded-md border ${borderLight} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[${primary}] focus:border-transparent resize-vertical dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400`}
                            required
                          />
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          className={`inline-flex items-center gap-2 bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium py-6 cursor-pointer`}
                        >
                          <Send className="h-4 w-4" />
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Info Sidebar */}
                <div className="lg:col-span-1">
                  <div className={`rounded-3xl p-6 sm:p-8 text-white bg-[${primaryDarker}]`}>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      We are always here to help you.
                    </h3>
                    <p className="text-green-50 mb-6 sm:mb-8 text-sm sm:text-base">
                      Get in touch with us for any queries or support.
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 bg-[${primary}] rounded-full flex items-center justify-center`}>
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">Hotline</p>
                          <p className="text-green-50 text-sm">+84 906 088 009</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 bg-[${primary}] rounded-full flex items-center justify-center`}>
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">WhatsApp</p>
                          <p className="text-green-50 text-sm">+84 374 559 209</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 bg-[${primary}] rounded-full flex items-center justify-center`}>
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">Email</p>
                          <p className="text-green-50 text-sm">info@cyberlearn.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <LearnerFooter />
        </div>
      </div>
    </div>
  );
}
