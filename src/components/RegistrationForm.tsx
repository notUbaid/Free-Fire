"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

interface FormData {
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_school: string;
  player2_name: string;
  player2_phone: string;
  player2_school: string;
  player3_name: string;
  player3_phone: string;
  player3_school: string;
  player4_name: string;
  player4_phone: string;
  player4_school: string;
}

const initialFormData: FormData = {
  team_name: "",
  leader_name: "",
  leader_email: "",
  leader_phone: "",
  leader_school: "",
  player2_name: "",
  player2_phone: "",
  player2_school: "",
  player3_name: "",
  player3_phone: "",
  player3_school: "",
  player4_name: "",
  player4_phone: "",
  player4_school: "",
};

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-white/60 text-xs uppercase tracking-widest mb-1.5 font-medium">
        {label} {required && <span className="text-ff-red">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-ff-orange/50 transition-colors text-sm"
      />
    </div>
  );
}

export default function RegistrationForm() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPlayer4, setShowPlayer4] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate phone numbers are exactly 10 digits
    const phoneFields = ["leader_phone", "player2_phone", "player3_phone", "player4_phone"];
    for (const field of phoneFields) {
      const value = formData[field as keyof FormData];
      if (value && !/^\d{10}$/.test(value)) {
        toast.error(`${field.replace("_", " ")} must be exactly 10 digits`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setIsSuccess(true);
      if (data.waitlist) {
        toast.success(data.message || "You've been added to the waitlist!", {
          duration: 7000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid #ffa50040",
          },
        });
      } else {
        toast.success("Registration successful!", {
          duration: 5000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid #ff6a0040",
          },
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong", {
        style: {
          background: "#1a1a2e",
          color: "#fff",
          border: "1px solid #ff174440",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 diagonal-stripes" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ff-orange/30 to-transparent" />

      <div ref={ref} className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
            <span className="bg-gradient-to-r from-ff-orange to-ff-red bg-clip-text text-transparent">
              Registrations
            </span>
            <span className="text-white"> Closed</span>
          </h2>
          <p className="text-white/40 mt-3 text-sm sm:text-base">
            Thank you for your interest! Registration is now closed.
          </p>
        </motion.div>
      </div>
    </section>
  );

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8 sm:p-12 text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                You&apos;re In! 🔥
              </h3>
              <p className="text-white/60 mb-2">
                Team <span className="text-ff-orange font-bold">{formData.team_name}</span> has been registered successfully.
              </p>
              <p className="text-white/40 text-sm">
                Make sure to bring your official school/college ID card for all players.
                <br />Arrive at IAR A3 Building before 9:15 AM on April 18.
              </p>
              <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/10">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Venue</p>
                <a
                  href="https://maps.app.goo.gl/9ZbJN5PvMv2CzBLA8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ff-orange hover:underline text-sm"
                >
                  IAR Main Campus, A3 Building →
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-5 sm:p-10 space-y-8"
            >
              {/* Team Name */}
              <div>
                <h3 className="text-lg font-bold text-ff-orange mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-ff-orange/20 rounded-lg flex items-center justify-center text-sm">1</span>
                  Team Information
                </h3>
                <InputField
                  label="Team Name"
                  name="team_name"
                  placeholder="Enter your squad name"
                  value={formData.team_name}
                  onChange={handleChange}
                />
              </div>

              {/* Leader details */}
              <div>
                <h3 className="text-lg font-bold text-ff-orange mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-ff-orange/20 rounded-lg flex items-center justify-center text-sm">2</span>
                  Team Leader Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    name="leader_name"
                    placeholder="Your full name"
                    value={formData.leader_name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Email"
                    name="leader_email"
                    type="email"
                    placeholder="you@email.com"
                    value={formData.leader_email}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Phone Number"
                    name="leader_phone"
                    type="tel"
                    placeholder="10 digit number"
                    value={formData.leader_phone}
                    onChange={handleChange}
                  />
                  <InputField
                    label="School / College"
                    name="leader_school"
                    placeholder="Your institution name"
                    value={formData.leader_school}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Team members */}
              <div>
                <h3 className="text-lg font-bold text-ff-orange mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-ff-orange/20 rounded-lg flex items-center justify-center text-sm">3</span>
                  Team Members
                </h3>

                {/* Player 2 */}
                <div className="mb-4 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Player 2</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Name"
                      name="player2_name"
                      placeholder="Player 2 name"
                      value={formData.player2_name}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Phone"
                      name="player2_phone"
                      type="tel"
                      placeholder="10 digit number"
                      value={formData.player2_phone}
                      onChange={handleChange}
                    />
                    <InputField
                      label="School / College"
                      name="player2_school"
                      placeholder="Institution name"
                      value={formData.player2_school}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Player 3 */}
                <div className="mb-4 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Player 3</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Name"
                      name="player3_name"
                      placeholder="Player 3 name"
                      value={formData.player3_name}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Phone"
                      name="player3_phone"
                      type="tel"
                      placeholder="10 digit number"
                      value={formData.player3_phone}
                      onChange={handleChange}
                    />
                    <InputField
                      label="School / College"
                      name="player3_school"
                      placeholder="Institution name"
                      value={formData.player3_school}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Player 4 (optional) */}
                <button
                  type="button"
                  onClick={() => setShowPlayer4(!showPlayer4)}
                  className="flex items-center gap-2 text-ff-orange text-sm font-medium hover:text-ff-yellow transition-colors"
                >
                  {showPlayer4 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {showPlayer4 ? "Remove" : "Add"} Player 4 (Optional)
                </button>

                <AnimatePresence>
                  {showPlayer4 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                        <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Player 4</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField
                            label="Name"
                            name="player4_name"
                            placeholder="Player 4 name"
                            required={false}
                            value={formData.player4_name}
                            onChange={handleChange}
                          />
                          <InputField
                            label="Phone"
                            name="player4_phone"
                            type="tel"
                            placeholder="10 digit number"
                            required={false}
                            value={formData.player4_phone}
                            onChange={handleChange}
                          />
                          <InputField
                            label="School / College"
                            name="player4_school"
                            placeholder="Institution name"
                            required={false}
                            value={formData.player4_school}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Important note */}
              <div className="flex gap-3 bg-ff-orange/5 border border-ff-orange/20 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-ff-orange shrink-0 mt-0.5" />
                <div className="text-sm text-white/60">
                  <p className="font-semibold text-white/80 mb-1">Important</p>
                  <ul className="space-y-1 text-xs">
                    <li>• All players must bring their official school/college ID card</li>
                    <li>• Registration starts at 9:00 AM. Arrive by 9:15 AM (doors open at 8:45 AM)</li>
                    <li>• No emulators allowed — mobile devices only</li>
                    <li>• Outside school/college teams are welcome</li>
                  </ul>
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-ff-orange to-ff-red text-white py-4 rounded-xl font-black text-lg tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 pulse-glow"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Lock In Your Squad
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
