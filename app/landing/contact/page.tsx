"use client";

import React, { useState } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Phone, Mail, Clock, Send } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* inporting header drom component */}
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Send us a message
                  </CardTitle>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Do you have a question? Let us know and we&apos;ll do our
                    best to answer your question. Please feel free to contact
                    us.
                  </p>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="py-3">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          required
                          className="py-6"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="py-3">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          required
                          className="py-6"
                        />
                      </div>
                    </div>

                    {/* Email and Contact Reason */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="py-3">
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
                          className="py-6"
                        />
                      </div>

                      {/* Tailwind + shadcn Dropdown */}
                      <div>
                        <Label htmlFor="contactReason" className="py-3">
                          Contact Reason
                        </Label>
                        <Select onValueChange={handleSelectChange}>
                          <SelectTrigger className="w-full h-11 rounded-md border border-gray-300 px-3 py-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#72a210] cursor-pointer">
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="general"
                              className="hover:bg-[#72a210] focus:bg-[#72a210] hover:text-white focus:text-white cursor-pointer"
                            >
                              General Inquiry
                            </SelectItem>
                            <SelectItem
                              value="course-info"
                              className="hover:bg-[#72a210] focus:bg-[#72a210] hover:text-white focus:text-white cursor-pointer"
                            >
                              Course Information
                            </SelectItem>
                            <SelectItem
                              value="tech-support"
                              className="hover:bg-[#72a210] focus:bg-[#72a210] hover:text-white focus:text-white cursor-pointer"
                            >
                              Technical Support
                            </SelectItem>
                            <SelectItem
                              value="certification"
                              className="hover:bg-[#72a210] focus:bg-[#72a210] hover:text-white focus:text-white cursor-pointer"
                            >
                              Certification & Exams
                            </SelectItem>
                            <SelectItem
                              value="billing"
                              className="hover:bg-[#72a210] focus:bg-[#72a210] hover:text-white focus:text-white cursor-pointer"
                            >
                              Billing & Payments
                            </SelectItem>
                            <SelectItem
                              value="security-report"
                              className="hover:bg-[#72a210] focus:bg-[#72a210] hover:text-white focus:text-white cursor-pointer"
                            >
                              Report a Security Issue
                            </SelectItem>
                            <SelectItem
                              value="career"
                              className="hover:bg-[#72a210] focus:bg-[#72a210] hover:text-white focus:text-white cursor-pointer"
                            >
                              Career / Internship
                            </SelectItem>
                            <SelectItem
                              value="other"
                              className="hover:bg-[#72a210] focus:bg-[#72a210] hover:text-white focus:text-white cursor-pointer"
                            >
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="py-3">
                        Message
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Enter your message"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#72a210] focus:border-transparent resize-vertical"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-[#72a210] hover:bg-[#507800] text-white font-medium py-6"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl p-6 sm:p-8 text-white bg-[#72a210]">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  We are always here to help you.
                </h3>
                <p className="text-green-50 mb-6 sm:mb-8 text-sm sm:text-base">
                  Get in touch with us for any queries or support.
                </p>

                <div className="space-y-6">
                  {/* Hotline */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#507800] rounded-full flex items-center justify-center">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">
                        Hotline
                      </p>
                      <p className="text-green-50 text-sm">+84 906 088 009</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#507800] rounded-full flex items-center justify-center">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">
                        WhatsApp
                      </p>
                      <p className="text-green-50 text-sm">+84 374 559 209</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#507800] rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Email</p>
                      <p className="text-green-50 text-sm">
                        info@cyberlearn.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* inporting footer drom component */}
      <Footer />
    </div>
  );
}
