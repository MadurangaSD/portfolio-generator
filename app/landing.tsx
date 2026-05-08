'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Code, Palette, Brain } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(30,144,255,0.08),transparent_30%),radial-gradient(circle_at_80%_90%,rgba(59,130,246,0.06),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(226,232,240,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(226,232,240,0.015)_1px,transparent_1px)] bg-[length:80px_80px] opacity-40" />
      </div>

      <motion.main
        className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-24 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section className="mb-20 text-center md:mb-32" variants={itemVariants}>
          <motion.div
            className="mb-6 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 backdrop-blur-xl"
            variants={itemVariants}
          >
            <span className="text-sm font-medium text-cyan-300">
              ✨ AI-Powered Portfolio Generation
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
            variants={itemVariants}
          >
            Build Your Premium Professional
            <motion.span
              className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Portfolio in Seconds
            </motion.span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl"
            variants={itemVariants}
          >
            AI-powered storytelling for Developers, Photographers, and Professionals. Create a
            stunning portfolio that showcases your skills without the hassle.
          </motion.p>

          <motion.div className="flex flex-col gap-4 sm:flex-row sm:justify-center" variants={itemVariants}>
            <Link
              href="/sign-up"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 px-8 py-4 font-semibold text-white transition hover:border-cyan-400/60 hover:from-cyan-400/30 hover:to-blue-400/30 backdrop-blur-xl"
            >
              Get Started
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight size={20} />
              </motion.div>
            </Link>

            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/10 backdrop-blur-xl"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="mb-20 md:mb-32"
          variants={itemVariants}
        >
          <motion.h2
            className="mb-16 text-center text-4xl font-bold text-white md:text-5xl"
            variants={itemVariants}
          >
            Why Choose Our Portfolio Builder?
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <motion.div
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/8"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="mb-4 inline-flex rounded-lg bg-cyan-400/20 p-3"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain size={28} className="text-cyan-400" />
              </motion.div>
              <h3 className="mb-3 text-xl font-semibold text-white">AI-Powered Content</h3>
              <p className="text-slate-300">
                Let AI craft compelling stories about your projects and skills. Showcase your
                expertise effortlessly.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/8"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="mb-4 inline-flex rounded-lg bg-blue-400/20 p-3"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              >
                <Palette size={28} className="text-blue-400" />
              </motion.div>
              <h3 className="mb-3 text-xl font-semibold text-white">Premium Design</h3>
              <p className="text-slate-300">
                Modern glassmorphism UI with stunning gradients. Your portfolio will look like a
                $5K custom build.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/8"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="mb-4 inline-flex rounded-lg bg-cyan-500/20 p-3"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              >
                <Zap size={28} className="text-cyan-400" />
              </motion.div>
              <h3 className="mb-3 text-xl font-semibold text-white">Lightning Fast</h3>
              <p className="text-slate-300">
                Built with Next.js and optimized for performance. Your portfolio loads instantly,
                every time.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          className="mb-20 md:mb-32"
          variants={itemVariants}
        >
          <motion.h2
            className="mb-16 text-center text-4xl font-bold text-white md:text-5xl"
            variants={itemVariants}
          >
            How It Works
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up in seconds with Clerk' },
              { step: '2', title: 'Fill Your Info', desc: 'Enter your details and projects' },
              { step: '3', title: 'AI Crafts Stories', desc: 'Let AI enhance your content' },
              { step: '4', title: 'Share & Impress', desc: 'Get a stunning portfolio URL' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center"
                variants={itemVariants}
              >
                <motion.div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-400/50 bg-cyan-400/10"
                  whileHover={{ scale: 1.1, borderColor: '#06b6d4' }}
                >
                  <span className="text-2xl font-bold text-cyan-400">{item.step}</span>
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-center text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 p-12 text-center backdrop-blur-xl md:p-16"
          variants={itemVariants}
        >
          <motion.h2 className="mb-4 text-4xl font-bold text-white md:text-5xl" variants={itemVariants}>
            Ready to Build Your Portfolio?
          </motion.h2>
          <motion.p className="mb-8 text-lg text-slate-300" variants={itemVariants}>
            Join hundreds of professionals creating stunning portfolios in minutes.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/sign-up"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 px-10 py-4 text-lg font-semibold text-white transition hover:border-cyan-400 hover:from-cyan-400/50 hover:to-blue-400/50"
            >
              Get Started Now
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight size={24} />
              </motion.div>
            </Link>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t border-white/10 py-8 text-center text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>© 2026 Portfolio Generator. Built with Next.js, React, and AI.</p>
      </motion.footer>
    </div>
  );
}
