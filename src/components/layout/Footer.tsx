import { motion } from "motion/react";

import { Facebook, Twitter, Instagram, Mail, ArrowRight } from "lucide-react";

const FooterSection = () => (
  <footer className="relative z-10 bg-white text-foreground dark:bg-black w-full h-full flex items-center justify-center">
    <div className="max-w-5xl w-full px-8">
      {/* Top Footer Section */}
      <motion.div
        className="grid grid-cols-4 gap-6 pb-8 border-b border-[var(--wisely-champagne)]/20"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
      >
        {/* Logo and Description */}
        <div className="flex flex-col space-y-4">
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <div className="p-1 rounded-full bg-gradient-to-r from-orange-600 to-orange-100">
              {" "}
              <img
                src="/src/assets/logos/icon.svg"
                alt="TimeWisely Logo"
                className="w-7 h-7"
                loading="lazy"
              />{" "}
            </div>{" "}
            <span className="font-bold text-xl text-[var(--wisely-dark)] dark:text-white">
              {" "}
              Time.Wisely{" "}
            </span>{" "}
          </div>{" "}
          <p className="text-sm text-[var(--wisely-gray)] pr-4">
            {" "}
            Revolutionize your time management and productivity with AI-powered
            scheduling and personalized recommendations.{" "}
          </p>{" "}
        </div>{" "}
        {/* Quick Links */}
        <div className="flex flex-col space-y-4">
          {" "}
          <h4 className="text-[var(--wisely-dark)] dark:text-white font-semibold text-lg">
            {" "}
            Quick Links{" "}
          </h4>{" "}
          <div className="flex flex-col space-y-2 text-[var(--wisely-gray)]">
            {" "}
            <a
              href="#features"
              className="hover:text-[var(--wisely-gold)] transition-colors duration-200"
            >
              {" "}
              Features{" "}
            </a>{" "}
            <a
              href="#pricing"
              className="hover:text-[var(--wisely-gold)] transition-colors duration-200"
            >
              {" "}
              Pricing{" "}
            </a>{" "}
            <a
              href="#about"
              className="hover:text-[var(--wisely-gold)] transition-colors duration-200"
            >
              {" "}
              About Us{" "}
            </a>{" "}
            <a
              href="#"
              className="hover:text-[var(--wisely-gold)] transition-colors duration-200"
            >
              {" "}
              Blog{" "}
            </a>{" "}
          </div>{" "}
        </div>{" "}
        {/* Legal */}
        <div className="flex flex-col space-y-4">
          {" "}
          <h4 className="text-[var(--wisely-dark)] dark:text-white font-semibold text-lg">
            {" "}
            Legal{" "}
          </h4>{" "}
          <div className="flex flex-col space-y-2 text-[var(--wisely-gray)]">
            {" "}
            <a
              href="#"
              className="hover:text-[var(--wisely-gold)] transition-colors duration-200"
            >
              {" "}
              Privacy Policy{" "}
            </a>{" "}
            <a
              href="#"
              className="hover:text-[var(--wisely-gold)] transition-colors duration-200"
            >
              {" "}
              Terms of Service{" "}
            </a>{" "}
            <a
              href="#"
              className="hover:text-[var(--wisely-gold)] transition-colors duration-200"
            >
              {" "}
              Cookie Policy{" "}
            </a>{" "}
            <a
              href="#"
              className="hover:text-[var(--wisely-gold)] transition-colors duration-200"
            >
              {" "}
              GDPR{" "}
            </a>{" "}
          </div>{" "}
        </div>{" "}
        {/* Newsletter */}
        <div className="flex flex-col space-y-4">
          {" "}
          <h4 className="text-[var(--wisely-dark)] dark:text-white font-semibold text-lg">
            {" "}
            Stay Updated{" "}
          </h4>{" "}
          <p className="text-sm text-[var(--wisely-gray)]">
            {" "}
            Subscribe to our newsletter for productivity tips and updates.{" "}
          </p>{" "}
          <div className="flex">
            {" "}
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 text-sm border border-[var(--wisely-gray)]/30 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[var(--wisely-gold)] flex-grow"
            />{" "}
            <button className="bg-[var(--wisely-gold)] text-white px-3 rounded-r-lg hover:bg-[var(--wisely-gold)]/90 transition-colors">
              {" "}
              <ArrowRight size={16} />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </motion.div>{" "}
      {/* Bottom Footer Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between mt-8 text-[var(--wisely-gray)]"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.4,
        }}
      >
        {" "}
        <p className="text-sm mb-4 md:mb-0">
          {" "}
          &copy; {new Date().getFullYear()}
          TimeWisely. All rights reserved.{" "}
        </p>{" "}
        {/* Social Media Icons */}
        <div className="flex items-center space-x-6">
          {" "}
          <a
            href="#"
            className="text-[var(--wisely-gray)] hover:text-[var(--wisely-gold)] transition-colors"
          >
            {" "}
            <Facebook size={18} /> <span className="sr-only">Facebook</span>{" "}
          </a>{" "}
          <a
            href="#"
            className="text-[var(--wisely-gray)] hover:text-[var(--wisely-gold)] transition-colors"
          >
            {" "}
            <Twitter size={18} /> <span className="sr-only">Twitter</span>{" "}
          </a>{" "}
          <a
            href="#"
            className="text-[var(--wisely-gray)] hover:text-[var(--wisely-gold)] transition-colors"
          >
            {" "}
            <Instagram size={18} /> <span className="sr-only">Instagram</span>{" "}
          </a>{" "}
          <a
            href="#"
            className="text-[var(--wisely-gray)] hover:text-[var(--wisely-gold)] transition-colors"
          >
            <Mail size={18} /> <span className="sr-only">Email</span>
          </a>
        </div>
      </motion.div>
    </div>
  </footer>
);

export default FooterSection;
