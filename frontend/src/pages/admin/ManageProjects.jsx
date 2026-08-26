import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  MdOutlineAdd,
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineFileUpload,
} from "react-icons/md";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { projectService } from "../../services/project.service";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import EmptyState from "../../components/shared/EmptyState";
import { PROJECT_CATEGORIES } from "../../utils/constants";
import { TbCode } from "react-icons/tb";

const inputClass = `w-full bg-background border border-border rounded-xl
  px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`;

const EMPTY_FORM = {
  title: "",
  shortDescription: "",
  description: "",
  techTags: "",
  category: "Full Stack",
  liveUrl: "",
  repoUrl: "",
  startDate: "",
  endDate: "",
  isFeatured: false,
  isPublished: false,
};

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    projectService
      .getAdminAll()
      .then((res) => setProjects(res.data))
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (project) => {
    setEditTarget(project);
    setForm({
      title: project.title || "",
      shortDescription: project.shortDescription || "",
      description: project.description || "",
      techTags: project.techTags?.join(", ") || "",
      category: project.category || "Full Stack",
      liveUrl: project.liveUrl || "",
      repoUrl: project.repoUrl || "",
      startDate: project.startDate?.slice(0, 10) || "",
      endDate: project.endDate?.slice(0, 10) || "",
      isFeatured: project.isFeatured || false,
      isPublished: project.isPublished || false,
    });
    setImagePreview(project.imageUrl || null);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "techTags") {
          fd.append(
            k,
            JSON.stringify(
              v
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            ),
          );
        } else {
          fd.append(k, v);
        }
      });
      if (imageFile) fd.append("project_image", imageFile);

      if (editTarget) {
        await projectService.update(editTarget._id, fd);
        toast.success("Project updated");
      } else {
        await projectService.create(fd);
        toast.success("Project created");
      }

      setDialogOpen(false);
      fetchProjects();
    } catch {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await projectService.delete(deleteDialog.id);
      toast.success("Project deleted");
      setDeleteDialog({ open: false, id: null });
      fetchProjects();
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-primary text-primary-foreground text-sm font-semibold
                     hover:opacity-90 transition-opacity"
        >
          <MdOutlineAdd className="text-lg" />
          Add Project
        </button>
      </div>

      {/* List */}
      {loading && <LoadingSpinner />}

      {!loading && projects.length === 0 && (
        <EmptyState
          icon={TbCode}
          title="No projects yet"
          message="Add your first project"
          action={{ label: "Add Project", onClick: openCreate }}
        />
      )}

      {!loading && projects.length > 0 && (
        <div className="flex flex-col gap-3">
          {projects.map((project, i) => (
            <Motion.div
              key={project._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-2xl p-4
                         flex items-center gap-4 hover:border-primary/30
                         transition-all duration-200"
            >
              {/* Image thumbnail */}
              <div
                className="w-14 h-14 rounded-xl bg-muted overflow-hidden
                              flex-shrink-0"
              >
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TbCode className="text-muted-foreground text-xl" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground text-sm truncate">
                    {project.title}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full bg-accent
                                   text-accent-foreground border border-border"
                  >
                    {project.category}
                  </span>
                  {project.isFeatured && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full
                                     bg-primary/10 text-primary"
                    >
                      Featured
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full
                    ${
                      project.isPublished
                        ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {project.shortDescription}
                </p>
                <div className="flex gap-1 flex-wrap">
                  {project.techTags?.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs text-muted-foreground">
                      {t}
                    </span>
                  ))}
                  {project.techTags?.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{project.techTags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(project)}
                  className="p-2 rounded-lg text-muted-foreground
                             hover:bg-accent hover:text-foreground
                             transition-colors cursor-pointer "
                  aria-label="Edit"
                >
                  <MdOutlineEdit className="text-lg" />
                </button>
                <button
                  onClick={() =>
                    setDeleteDialog({ open: true, id: project._id })
                  }
                  className="p-2 rounded-lg text-muted-foreground
                             hover:bg-destructive/10 hover:text-destructive
                             transition-colors cursor-pointer"
                  aria-label="Delete"
                >
                  <MdOutlineDelete className="text-lg" />
                </button>
              </div>
            </Motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="bg-card border border-border rounded-2xl
                                   max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold">
              {editTarget ? "Edit Project" : "Add Project"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            {/* Image upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground">
                Project Image
              </label>
              <div
                className="relative w-full aspect-video rounded-xl
                              bg-muted overflow-hidden border border-border"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center
                                  justify-center gap-2 text-muted-foreground"
                  >
                    <MdOutlineFileUpload className="text-3xl" />
                    <span className="text-xs">Click to upload image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Title + category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  placeholder="My Project"
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
                  {PROJECT_CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Short description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Short Description *
              </label>
              <input
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Brief one-liner about the project"
              />
            </div>

            {/* Full description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Full Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Detailed description..."
              />
            </div>

            {/* Tech tags */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tech Tags
                <span className="text-muted-foreground font-normal ml-1">
                  (comma separated)
                </span>
              </label>
              <input
                name="techTags"
                value={form.techTags}
                onChange={handleChange}
                className={inputClass}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Live URL
                </label>
                <input
                  name="liveUrl"
                  value={form.liveUrl}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://myproject.com"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  GitHub Repo
                </label>
                <input
                  name="repoUrl"
                  value={form.repoUrl}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              {[
                { name: "isFeatured", label: "Featured" },
                { name: "isPublished", label: "Published" },
              ].map(({ name, label }) => (
                <label
                  key={name}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name]}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {form[name] ? (
                    <BsToggleOn className="text-2xl text-primary" />
                  ) : (
                    <BsToggleOff className="text-2xl text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                </label>
              ))}
            </div>

            {/* Submit */}
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
                                 hover:opacity-90 disabled:opacity-60
                                 transition-opacity"
              >
                {saving ? "Saving..." : editTarget ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
        title="Delete Project?"
        description="This will permanently delete this project and its image."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageProjects;
