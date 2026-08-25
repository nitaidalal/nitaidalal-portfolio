import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { MdOutlineEmail, MdOutlineSend } from "react-icons/md";
import { contactService } from "../../services/contact.service";
import SectionHeading from "../shared/SectionHeading";
import PageWrapper from "../layout/PageWrapper";

const SOCIAL_LINKS = [
  { icon: FaGithub,   href: "https://github.com/nitaidalal",   label: "GitHub"   },
  { icon: FaLinkedin, href: "https://linkedin.com/in/nitaidalal",  label: "LinkedIn" },
  { icon: SiLeetcode, href: "https://leetcode.com/nitai_dalal_01",  label: "LeetCode" },
  { icon: FaTwitter,  href: "https://twitter.com/nitaidalal",   label: "Twitter"  },
];

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

const Contact = () => {
  const [form,     setForm]     = useState(INITIAL_FORM);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await contactService.send(form);
      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full bg-background border border-border rounded-xl
    px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground
    focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`;

  return (
    <section id="contact" className="py-24 bg-background">
      <PageWrapper>
        <div className="flex flex-col gap-12">
          <SectionHeading
            label="Contact"
            title="Get In Touch"
            subtitle="Have a project in mind or just want to say hi? I'd love to hear from you."
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto w-full">

            {/* ── Left: info + socials ─────────── */}
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Let's talk
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I'm always open to discussing new projects, creative ideas,
                  or opportunities to be part of your vision.
                </p>
              </div>

              {/* Email */}
              <a
                href="mailto:nitai@example.com"
                className="flex items-center gap-3 text-sm text-muted-foreground
                           hover:text-primary transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center
                                justify-center group-hover:bg-primary/10
                                transition-colors">
                  <MdOutlineEmail className="text-primary text-lg" />
                </div>
                <span>nitai@example.com</span>
              </a>

              {/* Social links */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground
                               uppercase tracking-wider">
                  Find me on
                </p>
                <div className="flex items-center gap-2">
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <Motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      whileHover={{ scale: 1.12, y: -2 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="w-10 h-10 rounded-xl bg-card border border-border
                                 flex items-center justify-center text-muted-foreground
                                 hover:text-primary hover:border-primary/40
                                 hover:bg-accent transition-colors duration-200"
                    >
                      <Icon className="text-base" />
                    </Motion.a>
                  ))}
                </div>
              </div>
            </Motion.div>

            {/* ── Right: form ──────────────────── */}
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-2xl p-6
                           flex flex-col gap-4 shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nitai Dalal"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project collaboration"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Success */}
                {success && (
                  <Motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0  }}
                    className="text-sm text-green-600 bg-green-50 dark:bg-green-950/30
                               border border-green-200 rounded-xl px-4 py-2.5"
                  >
                    ✅ Message sent! I'll get back to you soon.
                  </Motion.p>
                )}

                {/* Error */}
                {error && (
                  <Motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0  }}
                    className="text-sm text-destructive bg-destructive/10
                               border border-destructive/20 rounded-xl px-4 py-2.5"
                  >
                    {error}
                  </Motion.p>
                )}

                <Motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2
                             w-full bg-primary text-primary-foreground
                             font-semibold py-3 rounded-xl text-sm
                             hover:opacity-90 disabled:opacity-60
                             disabled:cursor-not-allowed transition-opacity"
                >
                  <MdOutlineSend className="text-base" />
                  {loading ? "Sending..." : "Send Message"}
                </Motion.button>
              </form>
            </Motion.div>
          </div>
        </div>
      </PageWrapper>
    </section>
  );
};

export default Contact;