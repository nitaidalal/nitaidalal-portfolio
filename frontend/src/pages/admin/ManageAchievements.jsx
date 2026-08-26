import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  MdOutlineAdd,
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineFileUpload,
} from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { achievementService } from "../../services/achievement.service";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import EmptyState from "../../components/shared/EmptyState";
import { ACHIEVEMENT_CATEGORIES } from "../../utils/constants";
import { formatFullDate } from "../../utils/formatDate";

const inputClass = `w-full bg-background border border-border rounded-xl
  px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`;

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  category: "Other",
  proofLink: "",
};

const ManageAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAchievements = () => {
    setLoading(true);
    achievementService
      .getAll()
      .then((res) => setAchievements(res.data))
      .catch(() => toast.error("Failed to load achievements"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (a) => {
    setEditTarget(a);
    setForm({
      title: a.title || "",
      description: a.description || "",
      date: a.date?.slice(0, 10) || "",
      category: a.category || "Other",
      proofLink: a.proofLink || "",
    });
    setImagePreview(a.imageUrl || null);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      if (imageFile) fd.append("image", imageFile);

      if (editTarget) {
        await achievementService.update(editTarget._id, fd);
        toast.success("Achievement updated");
      } else {
        await achievementService.create(fd);
        toast.success("Achievement added");
      }
      setDialogOpen(false);
      fetchAchievements();
    } catch {
      toast.error("Failed to save achievement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await achievementService.delete(deleteDialog.id);
      toast.success("Achievement deleted");
      setDeleteDialog({ open: false, id: null });
      fetchAchievements();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {achievements?.length} achievement
          {achievements?.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-primary text-primary-foreground text-sm font-semibold
                           hover:opacity-90 transition-opacity"
        >
          <MdOutlineAdd className="text-lg" />
          Add Achievement
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && achievements.length === 0 && (
        <EmptyState
          icon={FaTrophy}
          title="No achievements yet"
          action={{ label: "Add Achievement", onClick: openCreate }}
        />
      )}

      {!loading && achievements.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <Motion.div
              key={a._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4
                         flex flex-col gap-3 hover:border-primary/30
                         transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {a.imageUrl ? (
                    <img
                      src={a.imageUrl}
                      alt={a.title}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-xl bg-accent flex
                                    items-center justify-center text-lg"
                    >
                      🏆
                    </div>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full
                                   bg-primary/10 text-primary font-medium"
                  >
                    {a.category}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(a)}
                    className="p-1.5 rounded-lg text-muted-foreground
                                     hover:bg-accent transition-colors"
                  >
                    <MdOutlineEdit />
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ open: true, id: a._id })}
                    className="p-1.5 rounded-lg text-muted-foreground
                                     hover:bg-destructive/10 hover:text-destructive
                                     transition-colors"
                  >
                    <MdOutlineDelete />
                  </button>
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm leading-snug">
                  {a.title}
                </p>
                {a.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {a.description}
                  </p>
                )}
                {a.date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFullDate(a.date)}
                  </p>
                )}
              </div>
            </Motion.div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold">
              {editTarget ? "Edit Achievement" : "Add Achievement"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="1st Place - Hackathon 2024"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {ACHIEVEMENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Brief description of the achievement..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Proof Link
                </label>
                <input
                  name="proofLink"
                  value={form.proofLink}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Image (optional)
              </label>
              <div
                className="relative w-20 h-20 rounded-xl bg-muted border
                              border-border overflow-hidden cursor-pointer"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MdOutlineFileUpload className="text-xl text-muted-foreground" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setImageFile(f);
                      setImagePreview(URL.createObjectURL(f));
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2 rounded-xl border border-border
                                 text-sm text-muted-foreground hover:bg-accent
                                 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-xl bg-primary
                                 text-primary-foreground text-sm font-semibold
                                 hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {saving ? "Saving..." : editTarget ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
        title="Delete Achievement?"
        description="This will permanently delete this achievement."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageAchievements;
