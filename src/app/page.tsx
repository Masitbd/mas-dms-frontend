import Image from "next/image";
import {
  BuildingStorefrontIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  PlayIcon,
  CubeIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "@/components/layout/Navlink";
import Link from "next/link";

export default function PharmacyLandingPage() {
  const features = [
    {
      title: "Inventory Management",
      description:
        "Real-time stock tracking, automated reordering, and expiry date monitoring.",
      icon: CubeIcon,
      color: "bg-blue-500",
    },
    {
      title: "E-Commerce Platform",
      description:
        "Complete online pharmacy with secure payment processing and delivery tracking.",
      icon: ShoppingCartIcon,
      color: "bg-green-500",
    },
    {
      title: "Prescription Management",
      description:
        "Digital prescription processing, verification, and patient history tracking.",
      icon: ClipboardDocumentListIcon,
      color: "bg-purple-500",
    },
    {
      title: "Patient Management",
      description:
        "Comprehensive patient profiles, medication history, and consultation records.",
      icon: UserGroupIcon,
      color: "bg-orange-500",
    },
    {
      title: "Sales & Analytics",
      description:
        "Detailed sales reports, profit analysis, and business intelligence dashboards.",
      icon: ChartBarIcon,
      color: "bg-indigo-500",
    },
    {
      title: "Compliance & Security",
      description:
        "HIPAA compliant, secure data handling, and regulatory compliance tools.",
      icon: ShieldCheckIcon,
      color: "bg-red-500",
    },
  ];

  const benefits = [
    "Cloud-based solution - access anywhere, anytime",
    "Mobile app for on-the-go management",
    "Automated insurance claim processing",
    "Multi-location support for pharmacy chains",
    "Integration with major drug databases",
    "Real-time notifications and alerts",
    "24/7 technical support and training",
    "Regular updates and feature enhancements",
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      company: "City Care Pharmacy",
      role: "Owner & Pharmacist",
      content:
        "This system revolutionized our pharmacy operations. Inventory management is now effortless, and our online sales have increased by 400%.",
      rating: 5,
    },
    {
      name: "James Rodriguez",
      company: "MedPlus Chain",
      role: "Operations Manager",
      content:
        "Managing 15 locations was a nightmare before. Now we have complete visibility and control over all our pharmacies from one dashboard.",
      rating: 5,
    },
    {
      name: "Dr. Emily Chen",
      company: "Community Health Pharmacy",
      role: "Chief Pharmacist",
      content:
        "The prescription management and patient tracking features have improved our service quality tremendously. Highly recommended!",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small independent pharmacies",
      features: [
        "Up to 1,000 products",
        "Basic inventory management",
        "Point of sale system",
        "Customer management",
        "Basic reporting",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$199",
      period: "/month",
      description: "Ideal for growing pharmacies with online presence",
      features: [
        "Up to 10,000 products",
        "Advanced inventory management",
        "E-commerce platform",
        "Prescription management",
        "Advanced analytics",
        "Mobile app access",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$399",
      period: "/month",
      description: "Complete solution for pharmacy chains",
      features: [
        "Unlimited products",
        "Multi-location management",
        "Advanced e-commerce features",
        "Custom integrations",
        "White-label options",
        "Dedicated account manager",
        "24/7 phone support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <BuildingStorefrontIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Mas IT Solutions
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Benefits
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Reviews
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
              <NavLink href={"/login"}>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Login
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  🏥 Complete Pharmacy Management Solution
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Modernize Your
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {" "}
                    Pharmacy Business
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Comprehensive pharmacy management system with e-commerce
                  capabilities. Streamline operations, boost online sales, and
                  provide better patient care with our all-in-one solution.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 group">
                  <span className="font-semibold">Start Free Trial</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-2">
                  <PlayIcon className="w-5 h-5" />
                  <span className="font-semibold">Watch Demo</span>
                </button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>30-Day Free Trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>No Setup Fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Pharmacy Dashboard
                    </h3>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="w-4/5 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Sales Performance: 85% of target
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        1,247
                      </div>
                      <div className="text-sm text-gray-600">
                        Products in Stock
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        $12,450
                      </div>
                      <div className="text-sm text-gray-600">Today's Sales</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        89
                      </div>
                      <div className="text-sm text-gray-600">Prescriptions</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        456
                      </div>
                      <div className="text-sm text-gray-600">
                        Active Patients
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Pharmacy Management Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a modern pharmacy - from inventory
              management to e-commerce, all in one integrated platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <button className="mt-6 text-blue-600 font-semibold flex items-center space-x-2 group-hover:space-x-3 transition-all">
                  <span>Learn More</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Pharmacy Management System?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Built specifically for modern pharmacies, our system combines
                traditional pharmacy operations with cutting-edge e-commerce
                capabilities to help you serve patients better and grow your
                business.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">500+</div>
                    <div className="text-blue-100">Pharmacies Served</div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold">99.9%</div>
                      <div className="text-blue-100">Uptime Guarantee</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-blue-100">Support Available</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold">$2M+</div>
                      <div className="text-blue-100">
                        Online Sales Processed
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">HIPAA</div>
                      <div className="text-blue-100">Compliant & Secure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your pharmacy's needs. All plans include
              free setup and training.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-sm p-8 relative ${
                  plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Start Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Pharmacy Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what pharmacy owners and managers say about our system
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Pharmacy?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of pharmacies already using our system. Start your
            free trial today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Start 30-Day Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold">
              Schedule Demo
            </button>
          </div>
          <p className="text-blue-100 mt-4 text-sm">
            No credit card required • Setup in minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Mas IT Solutions</span>
              </div>
              <p className="text-gray-400">
                Empowering pharmacies with modern technology solutions for
                better patient care and business growth.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Training
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    System Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>pharmacy@masitsolutions.com</li>
                <li>+1 (555) PHARMACY</li>
                <li>123 Healthcare Blvd</li>
                <li>Medical City, MC 12345</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Mas IT Solutions. All rights reserved. | HIPAA
              Compliant | SOC 2 Certified
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
