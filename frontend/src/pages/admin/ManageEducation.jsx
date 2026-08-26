import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { MdOutlineAdd, MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { HiAcademicCap } from "react-icons/hi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { educationService } from "../../services/education.service";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import EmptyState from "../../components/shared/EmptyState";
import { formatYearRange } from "../../utils/formatDate";

const inputClass = `w-full bg-background border border-border rounded-xl
  px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`;

const EMPTY_FORM = {
  institution: "",
  type: "College",
  degree: "",
  branch: "",
  currentYear: "",
  cgpa: "",
  startYear: "",
  endYear: "",
  board: "",
  standard: "",
  percentage: "",
  passingYear: "",
  order: 0,
};

const ManageEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchEducation = () => {
    setLoading(true);
    educationService
      .getAll()
      .then((res) => setEducation(res.data))
      .catch(() => toast.error("Failed to load education"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (edu) => {
    setEditTarget(edu);
    setForm({
      institution: edu.institution || "",
      type: edu.type || "College",
      degree: edu.degree || "",
      branch: edu.branch || "",
      currentYear: edu.currentYear || "",
      cgpa: edu.cgpa || "",
      startYear: edu.startYear || "",
      endYear: edu.endYear || "",
      board: edu.board || "",
      standard: edu.standard || "",
      percentage: edu.percentage || "",
      passingYear: edu.passingYear || "",
      order: edu.order || 0,
    });
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
      // convert numeric strings
      const payload = {
        ...form,
        cgpa: form.cgpa ? Number(form.cgpa) : undefined,
        percentage: form.percentage ? Number(form.percentage) : undefined,
        startYear: form.startYear ? Number(form.startYear) : undefined,
        endYear: form.endYear ? Number(form.endYear) : undefined,
        passingYear: form.passingYear ? Number(form.passingYear) : undefined,
        order: Number(form.order),
      };

      // use FormData so upload middleware doesn't break
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== "") fd.append(k, v);
      });

      if (editTarget) {
        await educationService.update(editTarget._id, fd);
        toast.success("Education updated");
      } else {
        await educationService.create(fd);
        toast.success("Education added");
      }
      setDialogOpen(false);
      fetchEducation();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await educationService.delete(deleteDialog.id);
      toast.success("Education deleted");
      setDeleteDialog({ open: false, id: null });
      fetchEducation();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const isCollege = form.type === "College";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {education.length} entr{education.length !== 1 ? "ies" : "y"}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-primary text-primary-foreground text-sm font-semibold
                           hover:opacity-90 transition-opacity"
        >
          <MdOutlineAdd className="text-lg" />
          Add Education
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && education.length === 0 && (
        <EmptyState
          icon={HiAcademicCap}
          title="No education entries"
          action={{ label: "Add Education", onClick: openCreate }}
        />
      )}

      {!loading && education.length > 0 && (
        <div className="flex flex-col gap-3">
          {education.map((edu, i) => (
            <Motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4
                         flex items-center gap-4 hover:border-primary/30
                         transition-all duration-200"
            >
              <div
                className="w-12 h-12 rounded-xl bg-accent flex items-center
                              justify-center flex-shrink-0"
              >
                <HiAcademicCap className="text-primary text-2xl" />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground text-sm">
                    {edu.institution}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full
                                   bg-primary/10 text-primary"
                  >
                    {edu.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {edu.type === "College"
                    ? `${edu.degree || ""} ${edu.branch ? `· ${edu.branch}` : ""}`
                    : `Class ${edu.standard || ""} · ${edu.board || ""}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {edu.type === "College"
                    ? formatYearRange(edu.startYear, edu.endYear)
                    : `Passed ${edu.passingYear || ""}`}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(edu)}
                  className="p-2 rounded-lg text-muted-foreground
                                   hover:bg-accent transition-colors"
                >
                  <MdOutlineEdit className="text-lg" />
                </button>
                <button
                  onClick={() => setDeleteDialog({ open: true, id: edu._id })}
                  className="p-2 rounded-lg text-muted-foreground
                                   hover:bg-destructive/10 hover:text-destructive
                                   transition-colors"
                >
                  <MdOutlineDelete className="text-lg" />
                </button>
              </div>
            </Motion.div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="bg-card border border-border rounded-2xl
                                   max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold">
              {editTarget ? "Edit Education" : "Add Education"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Institution *
              </label>
              <input
                name="institution"
                value={form.institution}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Brainware University"
              />
            </div>

            {/* Type — only on create */}
            {!editTarget && (
              <div className="flex gap-3">
                {["College", "School"].map((t) => (
                  <label
                    key={t}
                    className={`flex-1 flex items-center justify-center gap-2
                           py-2.5 rounded-xl border text-sm font-medium cursor-pointer
                           transition-all duration-200
                           ${
                             form.type === t
                               ? "bg-primary text-primary-foreground border-primary"
                               : "bg-card text-muted-foreground border-border hover:bg-accent"
                           }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={form.type === t}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {t}
                  </label>
                ))}
              </div>
            )}

            {/* College fields */}
            {isCollege && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Degree *
                    </label>
                    <input
                      name="degree"
                      value={form.degree}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="B.Tech"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Branch *
                    </label>
                    <input
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="CSE (AI & ML)"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Start Year *
                    </label>
                    <input
                      type="number"
                      name="startYear"
                      value={form.startYear}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="2022"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      End Year
                    </label>
                    <input
                      type="number"
                      name="endYear"
                      value={form.endYear}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="2026"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="cgpa"
                      value={form.cgpa}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="8.75"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Current Year
                  </label>
                  <input
                    name="currentYear"
                    value={form.currentYear}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="3rd Year"
                  />
                </div>
              </>
            )}

            {/* School fields */}
            {!isCollege && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Standard *
                    </label>
                    <input
                      name="standard"
                      value={form.standard}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="10th / 12th"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Board *
                    </label>
                    <input
                      name="board"
                      value={form.board}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="WBBSE / CBSE"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Passing Year *
                    </label>
                    <input
                      type="number"
                      name="passingYear"
                      value={form.passingYear}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="2022"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Percentage
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="percentage"
                      value={form.percentage}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="91.4"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </>
            )}

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
        title="Delete Education?"
        description="This will permanently delete this education entry."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageEducation;
