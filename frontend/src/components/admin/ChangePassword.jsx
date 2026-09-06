import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const ChangePassword = ({ open, onOpenChange }) => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

        const handleChangePassword = (e) => {
                e.preventDefault();
                console.log(oldPassword, newPassword, confirmPassword);
        };

  return (
        <>
            <button
                type="button"
                onClick={() => onOpenChange(true)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground
                    text-sm font-medium hover:opacity-90 transition-opacity w-fit"
            >
                Change Password
            </button>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-card border border-border rounded-2xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-bold">
                            Change Password
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="w-full bg-background border border-border rounded-xl
                                px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-primary
                                focus:border-transparent transition-colors duration-200"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full bg-background border border-border rounded-xl
                                px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-primary
                                focus:border-transparent transition-colors duration-200"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-background border border-border rounded-xl
                                px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-primary
                                focus:border-transparent transition-colors duration-200"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground
                                text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Change Password
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ChangePassword
