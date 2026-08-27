import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  MdOutlineAdd,
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineFileUpload,
} from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { certificationService } from "../../services/certification.service";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import EmptyState from "../../components/shared/EmptyState";
import { formatMonthYear } from "../../utils/formatDate";

const inputClass = `w-full bg-background border border-border rounded-xl
  px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`;

const EMPTY_FORM = {
  title: "",
  issuer: "",
  issueDate: "",
  verificationUrl: "",
};

const ManageCertifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCerts = () => {
    setLoading(true);
    certificationService
      .getAll()
      .then((res) => setCerts(res.data))
      .catch(() => toast.error("Failed to load certifications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (cert) => {
    setEditTarget(cert);
    setForm({
      title: cert.title || "",
      issuer: cert.issuer || "",
      issueDate: cert.issueDate?.slice(0, 10) || "",
      verificationUrl: cert.verificationUrl || "",
    });
    setImagePreview(cert.imageUrl || null);
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
      if (imageFile) fd.append("certificate_image", imageFile);

      if (editTarget) {
        await certificationService.update(editTarget._id, fd);
        toast.success("Certification updated");
      } else {
        await certificationService.create(fd);
        toast.success("Certification added");
      }
      setDialogOpen(false);
      fetchCerts();
    } catch {
      toast.error("Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await certificationService.delete(deleteDialog.id);
      toast.success("Certification deleted");
      setDeleteDialog({ open: false, id: null });
      fetchCerts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {certs.length} certification{certs.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-primary text-primary-foreground text-sm font-semibold
                           hover:opacity-90 transition-opacity"
        >
          <MdOutlineAdd className="text-lg" />
          Add Certification
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && certs.length === 0 && (
        <EmptyState
          icon={HiOutlineBadgeCheck}
          title="No certifications yet"
          action={{ label: "Add Certification", onClick: openCreate }}
        />
      )}

      {!loading && certs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {certs.map((cert, i) => (
            <Motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4
                         flex flex-col gap-3 hover:border-primary/30
                         transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-12 h-12 rounded-xl object-contain bg-muted p-1"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl bg-accent flex
                                  items-center justify-center flex-shrink-0"
                  >
                    <HiOutlineBadgeCheck className="text-primary text-2xl" />
                  </div>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(cert)}
                    className="p-1.5 rounded-lg text-muted-foreground
                                     hover:bg-accent transition-colors"
                  >
                    <MdOutlineEdit />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteDialog({ open: true, id: cert._id })
                    }
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
                  {cert.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cert.issuer}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatMonthYear(cert.issueDate)}
                </p>
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
              {editTarget ? "Edit Certification" : "Add Certification"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            {/* Image upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Badge / Certificate Image
              </label>
              <div
                className="relative w-24 h-24 rounded-xl bg-muted border
                              border-border overflow-hidden cursor-pointer"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MdOutlineFileUpload className="text-2xl text-muted-foreground" />
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
                placeholder="React - The Complete Guide"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Issuer *
              </label>
              <input
                name="issuer"
                value={form.issuer}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Udemy / Coursera / AWS"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Issue Date *
              </label>
              <input
                type="date"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Verification URL
              </label>
              <input
                name="verificationUrl"
                value={form.verificationUrl}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://verify.example.com"
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
        title="Delete Certification?"
        description="This will permanently delete this certification."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageCertifications;
