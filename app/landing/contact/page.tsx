"use client";

import React, { useState } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Phone, Mail, Send } from "lucide-react";
// NOTE: Assuming Card, Input, Label, Button, Select components are themable via Tailwind dark mode setup
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
import { toast } from "sonner"; // ✅ import Sonner toast

// Theme Constants
const primary = "#72a210";
const primaryDarker = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950"; // Main section background
const cardBg = "bg-white dark:bg-gray-900"; // Card background
const textDark = "text-gray-900 dark:text-gray-100"; // Headings/Strong text
const textMedium = "text-gray-600 dark:text-gray-300"; // Body text
const textLabel = "text-gray-700 dark:text-gray-200"; // Label text
const borderLight = "border-gray-300 dark:border-gray-600"; // Light border

export default function ContactUsPage() {
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

    // ✅ Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (!formData.contactReason) {
      toast.warning("Please select a contact reason");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Your message has been sent successfully!");

      // Reset form after submission
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
    // Applied dark mode background to outer container
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header (Assuming it handles its own theme) */}
      <Header />

      {/* Main Content Section */}
      <div className={`min-h-screen ${bgLight} py-8 sm:py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-8 sm:mb-12">
            {/* Applied dark mode text color */}
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${textDark} mb-4`}>
              Contact Us
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              {/* Added dark mode card styles */}
              <Card className={`shadow-lg border-0 ${cardBg}`}>
                <CardHeader>
                  {/* Applied dark mode text color */}
                  <CardTitle className={`text-xl sm:text-2xl font-semibold ${textDark}`}>
                    Send us a message
                  </CardTitle>
                  {/* Applied dark mode text color */}
                  <p className={`${textMedium} mt-2 text-sm sm:text-base`}>
                    Do you have a question? Let us know and we&apos;ll do our best to answer it.
                  </p>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        {/* Applied dark mode label text color */}
                        <Label htmlFor="firstName" className={`py-3 ${textLabel}`}>
                          First Name
                        </Label>
                        {/* Assuming Input component handles dark mode internally, ensuring placeholder and text contrast */}
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
                        {/* Applied dark mode label text color */}
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
                        {/* Applied dark mode label text color */}
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
                        {/* Applied dark mode label text color */}
                        <Label htmlFor="contactReason" className={`py-3 ${textLabel}`}>
                          Contact Reason
                        </Label>
                        <Select onValueChange={handleSelectChange} value={formData.contactReason}>
                          {/* Applied dark mode border, background, and focus ring with theme color */}
                          <SelectTrigger className={`w-full h-11 rounded-md border ${borderLight} px-3 py-6 text-sm focus:outline-none focus:ring-2 focus:ring-[${primary}] cursor-pointer dark:bg-gray-800 dark:text-gray-100`}>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          {/* NOTE: SelectContent/SelectItem typically need global dark styles, adding dark: classes here for SelectContent and SelectItem for thoroughness */}
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
                      {/* Applied dark mode label text color */}
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
                        // Applied dark mode styles and theme focus ring
                        className={`w-full rounded-md border ${borderLight} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[${primary}] focus:border-transparent resize-vertical dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400`}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      // Applied theme colors
                      className={`inline-flex items-center gap-2 bg-[${primary}] hover:bg-[${primaryDarker}] text-white font-medium py-6 cursor-pointer`}>
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Applied theme colors to sidebar background */}
              <div className={`rounded-3xl p-6 sm:p-8 text-white bg-[${primaryDarker}]`}>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  We are always here to help you.
                </h3>
                {/* Applied slightly lighter theme color for secondary text */}
                <p className={`text-green-50 mb-6 sm:mb-8 text-sm sm:text-base`}>
                  Get in touch with us for any queries or support.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    {/* Applied theme color to icon background */}
                    <div className={`flex-shrink-0 w-8 h-8 bg-[${primary}] rounded-full flex items-center justify-center`}>
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Hotline</p>
                      {/* Applied slightly lighter theme color for secondary text */}
                      <p className={`text-green-50 text-sm`}>+84 906 088 009</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {/* Applied theme color to icon background */}
                    <div className={`flex-shrink-0 w-8 h-8 bg-[${primary}] rounded-full flex items-center justify-center`}>
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">WhatsApp</p>
                      {/* Applied slightly lighter theme color for secondary text */}
                      <p className={`text-green-50 text-sm`}>+84 374 559 209</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {/* Applied theme color to icon background */}
                    <div className={`flex-shrink-0 w-8 h-8 bg-[${primary}] rounded-full flex items-center justify-center`}>
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Email</p>
                      {/* Applied slightly lighter theme color for secondary text */}
                      <p className={`text-green-50 text-sm`}>info@cyberlearn.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (Assuming it handles its own theme) */}
      <Footer />
    </div>
  );
}