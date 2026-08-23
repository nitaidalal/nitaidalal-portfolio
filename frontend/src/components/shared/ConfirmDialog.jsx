import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmDialog = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "destructive", // "destructive" | "default"
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="bg-card border border-border rounded-2xl
                     shadow-xl max-w-sm"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            className="rounded-lg border border-border bg-secondary
                         text-secondary-foreground hover:bg-muted
                         transition-colors text-sm"
          >
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className={`rounded-lg text-sm font-medium transition-opacity
                          hover:opacity-90 ${
                            variant === "destructive"
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
