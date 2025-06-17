import React from "react";
import {
  BarChart3,
  Calculator,
  FileText,
  PieChart,
  Clock,
  Shield,
  Users,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import "./globals.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                MAS IT
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 font-medium"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-gray-500 hover:text-blue-600 px-3 py-2 font-medium"
              >
                Services
              </a>
              <a
                href="#features"
                className="text-gray-500 hover:text-blue-600 px-3 py-2 font-medium"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-500 hover:text-blue-600 px-3 py-2 font-medium"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="text-gray-500 hover:text-blue-600 px-3 py-2 font-medium"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center">
              <Link href={"/login"}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Modern Accounting Solutions for Your Business
              </h1>
              <p className="mt-6 text-xl text-blue-100">
                Streamline your bookkeeping and accounting processes with MAS
                IT&apos;s comprehensive suite of financial management tools.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium text-lg">
                  Start Free Trial
                </button>
                <button className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium text-lg">
                  Book a Demo
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Accounting Dashboard"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive accounting solutions tailored to meet your business
              needs
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full w-fit">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Bookkeeping
              </h3>
              <p className="mt-4 text-gray-600">
                Accurate and timely recording of all financial transactions for
                your business.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center text-blue-600 font-medium"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full w-fit">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Tax Preparation
              </h3>
              <p className="mt-4 text-gray-600">
                Comprehensive tax services to ensure compliance and maximize
                deductions.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center text-blue-600 font-medium"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full w-fit">
                <PieChart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Financial Reporting
              </h3>
              <p className="mt-4 text-gray-600">
                Detailed financial reports and analysis to guide your business
                decisions.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center text-blue-600 font-medium"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to simplify your accounting processes
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Real-time Updates
              </h3>
              <p className="mt-2 text-gray-600">
                Access your financial data in real-time from anywhere.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Secure Platform
              </h3>
              <p className="mt-2 text-gray-600">
                Bank-level security to protect your sensitive financial
                information.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Team Collaboration
              </h3>
              <p className="mt-2 text-gray-600">
                Seamlessly collaborate with your team and accountants.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Advanced Analytics
              </h3>
              <p className="mt-2 text-gray-600">
                Gain insights with powerful reporting and analytics tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Powerful Dashboard
              </h2>
              <p className="mt-4 text-lg text-gray-600 ">
                Our intuitive dashboard gives you a complete overview of your
                financial health at a glance. Track income, expenses, and
                profitability with ease.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="ml-3 text-gray-600">
                    Customizable reports and visualizations
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="ml-3 text-gray-600">
                    Automated financial statement generation
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="ml-3 text-gray-600">
                    Cash flow forecasting and budgeting tools
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Financial Dashboard"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by businesses of all sizes
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Client"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Sarah Johnson
                  </h4>
                  <p className="text-gray-600">Small Business Owner</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600">
                &ldquo;MAS IT has transformed how we manage our finances. The
                platform is intuitive and has saved us countless hours on
                bookkeeping tasks.&ldquo;
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Client"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    David Chen
                  </h4>
                  <p className="text-gray-600">CFO, Tech Startup</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600">
                &quot;The reporting features are exceptional. We can now make
                data-driven decisions with confidence thanks to the insights
                provided by MAS IT.&quot;
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Client"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Maria Rodriguez
                  </h4>
                  <p className="text-gray-600">Retail Business Owner</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600">
                &quot;The tax preparation features have been a game-changer for
                our business. We&apos;ve reduced our tax preparation time by
                75%.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to streamline your accounting?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of businesses that trust MAS IT for their accounting
            needs.
          </p>
          <div className="mt-10">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-md font-medium text-lg">
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
              <p className="mt-4 text-lg text-gray-600">
                Have questions about our services? Our team is here to help.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 font-medium">Phone</p>
                    <p className="text-gray-600">+880 1915 682291</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 font-medium">Email</p>
                    <p className="text-gray-600">sarker24@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 font-medium">Address</p>
                    <p className="text-gray-600">
                      Mirpur
                      <br />
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-white border"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-white border"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-white border"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">MAS IT</span>
              </div>
              <p className="mt-4 text-gray-400">
                Providing modern accounting solutions for businesses of all
                sizes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Services</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Bookkeeping
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Tax Preparation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Financial Reporting
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Payroll Services
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} MAS IT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
