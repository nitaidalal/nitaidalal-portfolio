import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { MdOutlineAdd, MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { skillService } from "../../services/skill.service";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import EmptyState from "../../components/shared/EmptyState";
import { SKILL_CATEGORIES } from "../../utils/constants";
import { HiOutlineChip } from "react-icons/hi";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";

const inputClass = `w-full bg-background border border-border rounded-xl
  px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`;

const EMPTY_FORM = {
  name: "",
  category: "Languages",
  iconSlug: "",
  proficiencyPercentage: 80,
  skillOrder: 0,
  isFeatured: false,
};

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchSkills = () => {
    setLoading(true);
    skillService
      .getAll()
      .then((res) => {
        setSkills(res.data.allSkills);
        setGrouped(res.data.groupedSkills);
      })
      .catch(() => toast.error("Failed to load skills"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (skill) => {
    setEditTarget(skill);
    setForm({
      name: skill.name || "",
      category: skill.category || "Languages",
      iconSlug: skill.iconSlug || "",
      proficiencyPercentage: skill.proficiencyPercentage || 80,
      skillOrder: skill.skillOrder || 0,
      isFeatured: skill.isFeatured || false,
    });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "proficiencyPercentage" || name === "skillOrder"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        await skillService.update(editTarget._id, form);
        toast.success("Skill updated");
      } else {
        await skillService.create(form);
        toast.success("Skill added");
      }
      setDialogOpen(false);
      fetchSkills();
    } catch {
      toast.error("Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await skillService.delete(deleteDialog.id);
      toast.success("Skill deleted");
      setDeleteDialog({ open: false, id: null });
      fetchSkills();
    } catch {
      toast.error("Failed to delete skill");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {skills?.length} skill{skills?.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-primary text-primary-foreground text-sm font-semibold
                           hover:opacity-90 transition-opacity"
        >
          <MdOutlineAdd className="text-lg" />
          Add Skill
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && skills?.length === 0 && (
        <EmptyState
          icon={HiOutlineChip}
          title="No skills yet"
          action={{ label: "Add Skill", onClick: openCreate }}
        />
      )}

      {/* Grouped skills */}
      {!loading && skills?.length > 0 && (
        <div className="flex flex-col gap-6">
          {SKILL_CATEGORIES.map((cat) => {
            const catSkills = grouped[cat];
            if (!catSkills?.length) return null;
            return (
              <div key={cat} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3
                    className="text-xs font-bold text-muted-foreground
                                 uppercase tracking-wider"
                  >
                    {cat}
                  </h3>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2
                                md:grid-cols-3 gap-3"
                >
                  {catSkills.map((skill, i) => (
                    <Motion.div
                      key={skill._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-card border border-border rounded-xl p-4
                                 flex items-center gap-3 hover:border-primary/30
                                 transition-all duration-200"
                    >
                      {/* Icon */}
                      {skill.iconSlug ? (
                        <img
                          src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.iconSlug}/${skill.iconSlug}-original.svg`}
                          alt={skill.name}
                          className="w-8 h-8 object-contain flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-lg bg-accent flex
                                        items-center justify-center flex-shrink-0"
                        >
                          <span className="text-sm font-bold text-primary">
                            {skill.name?.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${skill.proficiencyPercentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {skill.proficiencyPercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => openEdit(skill)}
                          className="p-1.5 rounded-lg text-muted-foreground
                                           hover:bg-accent transition-colors"
                        >
                          <MdOutlineEdit />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({ open: true, id: skill._id })
                          }
                          className="p-1.5 rounded-lg text-muted-foreground
                                           hover:bg-destructive/10 hover:text-destructive
                                           transition-colors"
                        >
                          <MdOutlineDelete />
                        </button>
                      </div>
                    </Motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold">
              {editTarget ? "Edit Skill" : "Add Skill"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="React"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Devicon Slug
                <a
                  href="https://devicons.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary ml-2 font-normal hover:underline"
                >
                  Browse icons →
                </a>
              </label>
              <input
                name="iconSlug"
                value={form.iconSlug}
                onChange={handleChange}
                className={inputClass}
                placeholder="react, nodejs, mongodb"
              />
              {form.iconSlug && (
                <img
                  src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${form.iconSlug}/${form.iconSlug}-original.svg`}
                  alt="preview"
                  className="w-10 h-10 object-contain"
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Proficiency: {form.proficiencyPercentage}%
              </label>
              <input
                type="range"
                name="proficiencyPercentage"
                min={0}
                max={100}
                step={5}
                value={form.proficiencyPercentage}
                onChange={handleChange}
                className="accent-primary"
              />
            </div>

            {/* isFeatured toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured || false}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))
                }
                className="hidden"
              />
              {form.isFeatured ? (
                <BsToggleOn className="text-2xl text-primary" />
              ) : (
                <BsToggleOff className="text-2xl text-muted-foreground" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  Show in About section
                </span>
                <span className="text-xs text-muted-foreground">
                  Featured skills appear in the About Me tech stack row
                </span>
              </div>
            </label>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Order
              </label>
              <input
                type="number"
                name="skillOrder"
                value={form.skillOrder}
                onChange={handleChange}
                className={inputClass}
                min={0}
              />
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
        title="Delete Skill?"
        description="This will permanently delete this skill."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageSkills;
