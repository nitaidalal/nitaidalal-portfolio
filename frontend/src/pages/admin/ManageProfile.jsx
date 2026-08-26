import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { MdOutlineEdit, MdOutlineFileUpload } from "react-icons/md";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { toast } from "sonner";
import { profileService } from "../../services/profile.service";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const inputClass = `w-full bg-background border border-border rounded-xl
  px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`;

const labelClass = `text-xs font-semibold text-foreground`;

const ManageProfile = () => {
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({});

  // avatar + resume
  const [avatarFile,  setAvatarFile]  = useState(null);
  const [resumeFile,  setResumeFile]  = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    profileService.getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else if (name === "taglines") {
      setForm((prev) => ({
        ...prev,
        taglines: value.split(",").map((t) => t.trim()),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { avatarUrl, avatarPublicId, resumeUrl, resumePublicId,
              _id, __v, createdAt, updatedAt, ...cleanForm } = form;
      await profileService.updateProfile(cleanForm);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      const res = await profileService.updateAvatar(fd);
      setProfile((prev) => ({ ...prev, avatarUrl: res.data.avatarUrl }));
      setAvatarPreview(null);
      setAvatarFile(null);
      toast.success("Avatar updated");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    try {
      const fd = new FormData();
      fd.append("resume", resumeFile);
      await profileService.updateResume(fd);
      toast.success("Resume updated");
      setResumeFile(null);
    } catch {
      toast.error("Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.3 }}
      >

        {/* ── Avatar + Resume row ───────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

          {/* Avatar card */}
          <div className="bg-card border border-border rounded-2xl p-5
                          flex flex-col gap-4">
            <p className="text-sm font-bold text-foreground">Profile Photo</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden
                              bg-accent border border-border flex-shrink-0">
                {avatarPreview || profile?.avatarUrl ? (
                  <img
                    src={avatarPreview || profile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {profile?.name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="flex items-center gap-2 text-xs font-medium
                                  text-primary cursor-pointer hover:underline">
                  <MdOutlineFileUpload />
                  Choose photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                </label>
                {avatarFile && (
                  <button
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground
                               text-xs font-medium hover:opacity-90 disabled:opacity-60
                               transition-opacity w-fit"
                  >
                    {uploadingAvatar ? "Uploading..." : "Upload"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Resume card */}
          <div className="bg-card border border-border rounded-2xl p-5
                          flex flex-col gap-4">
            <p className="text-sm font-bold text-foreground">Resume (PDF)</p>
            <div className="flex flex-col gap-2">
              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View current resume →
                </a>
              )}
              <label className="flex items-center gap-2 text-xs font-medium
                                text-primary cursor-pointer hover:underline">
                <MdOutlineFileUpload />
                Choose PDF
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </label>
              {resumeFile && (
                <>
                  <p className="text-xs text-muted-foreground truncate">
                    {resumeFile.name}
                  </p>
                  <button
                    onClick={handleResumeUpload}
                    disabled={uploadingResume}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground
                               text-xs font-medium hover:opacity-90 disabled:opacity-60
                               transition-opacity w-fit"
                  >
                    {uploadingResume ? "Uploading..." : "Upload"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Profile form ──────────────────────── */}
        <form
          onSubmit={handleSave}
          className="bg-card border border-border rounded-2xl p-6
                     flex flex-col gap-5"
        >
          <p className="text-sm font-bold text-foreground border-b
                        border-border pb-3">
            Profile Information
          </p>

          {/* Name + heroSubtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Full Name</label>
              <input name="name" value={form.name || ""}
                     onChange={handleChange} className={inputClass}
                     placeholder="Nitai Dalal" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Hero Subtitle</label>
              <input name="heroSubtitle" value={form.heroSubtitle || ""}
                     onChange={handleChange} className={inputClass}
                     placeholder="I build things for the web" />
            </div>
          </div>

          {/* Taglines */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Taglines
              <span className="text-muted-foreground font-normal ml-1">
                (comma separated)
              </span>
            </label>
            <input
              name="taglines"
              value={form.taglines?.join(", ") || ""}
              onChange={handleChange}
              className={inputClass}
              placeholder="Full Stack Developer, MERN Developer, Problem Solver"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Bio</label>
            <textarea
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Tell the world about yourself..."
            />
          </div>

          {/* Currently building + learning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Currently Building</label>
              <input name="currentlyBuilding" value={form.currentlyBuilding || ""}
                     onChange={handleChange} className={inputClass}
                     placeholder="My developer portfolio" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Currently Learning</label>
              <input name="currentlyLearning" value={form.currentlyLearning || ""}
                     onChange={handleChange} className={inputClass}
                     placeholder="Docker, AWS" />
            </div>
          </div>

          {/* Fun fact + location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Fun Fact</label>
              <input name="funFact" value={form.funFact || ""}
                     onChange={handleChange} className={inputClass}
                     placeholder="I solve LeetCode in C++" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Location</label>
              <input name="location" value={form.location || ""}
                     onChange={handleChange} className={inputClass}
                     placeholder="Kolkata, West Bengal" />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Public Email</label>
            <input type="email" name="email" value={form.email || ""}
                   onChange={handleChange} className={inputClass}
                   placeholder="nitai@example.com" />
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-foreground uppercase
                          tracking-wider border-b border-border pb-2">
              Social Links
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "github",    icon: FaGithub,   placeholder: "https://github.com/username"   },
                { key: "linkedin",  icon: FaLinkedin, placeholder: "https://linkedin.com/in/username" },
                { key: "leetcode",  icon: SiLeetcode, placeholder: "https://leetcode.com/username"  },
                { key: "twitter",   icon: FaTwitter,  placeholder: "https://twitter.com/username"   },
                { key: "instagram", icon: FaInstagram,placeholder: "https://instagram.com/username" },
              ].map(({ key, icon: Icon, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs
                                    font-semibold text-foreground capitalize">
                    <Icon className="text-primary" />
                    {key}
                  </label>
                  <input
                    name={`socialLinks.${key}`}
                    value={form.socialLinks?.[key] || ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-foreground uppercase
                          tracking-wider border-b border-border pb-2">
              SEO
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Meta Title</label>
                <input name="metaTitle" value={form.metaTitle || ""}
                       onChange={handleChange} className={inputClass}
                       placeholder="Nitai Dalal — Full Stack Developer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Meta Description</label>
                <input name="metaDescription" value={form.metaDescription || ""}
                       onChange={handleChange} className={inputClass}
                       placeholder="Portfolio of Nitai Dalal..." />
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground
                         text-sm font-semibold hover:opacity-90 disabled:opacity-60
                         transition-opacity"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

export default ManageProfile;