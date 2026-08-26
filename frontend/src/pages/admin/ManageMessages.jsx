import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { MdOutlineDelete, MdOutlineMarkEmailRead,
         MdOutlineEmail, MdOutlineDrafts } from "react-icons/md";
import { BsCircleFill } from "react-icons/bs";
import { toast } from "sonner";
import { contactService } from "../../services/contact.service";
import ConfirmDialog      from "../../components/shared/ConfirmDialog";
import LoadingSpinner     from "../../components/shared/LoadingSpinner";
import EmptyState         from "../../components/shared/EmptyState";
import { formatFullDate } from "../../utils/formatDate";

const ManageMessages = () => {
  const [messages,     setMessages]     = useState([]);
  const [unread,       setUnread]       = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [expanded,     setExpanded]     = useState(null);

  const fetchMessages = () => {
    setLoading(true);
    contactService.getAll()
      .then((res) => {
        const messageList = Array.isArray(res.data) ? res.data : [];
        setMessages(messageList);
        setUnread(messageList.filter((message) => !message.isRead).length);
      })
      .catch(() => toast.error("Failed to load messages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      setMessages((prev) =>
        prev.map((m) => m._id === id ? { ...m, isRead: true } : m)
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async () => {
    try {
      await contactService.delete(deleteDialog.id);
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleExpand = (msg) => {
    setExpanded(expanded === msg._id ? null : msg._id);
    if (!msg.isRead) handleMarkRead(msg._id);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {messages?.length} message{messages?.length !== 1 ? "s" : ""}
          </p>
          {unread > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-semibold
                             text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              <BsCircleFill className="text-xs animate-pulse" />
              {unread} unread
            </span>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && messages?.length === 0 && (
        <EmptyState
          icon={MdOutlineEmail}
          title="No messages yet"
          message="Messages from your contact form will appear here"
        />
      )}

      {!loading && messages?.length > 0 && (
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <Motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: i * 0.04 }}
              className={`bg-card border rounded-2xl overflow-hidden
                          transition-all duration-200 cursor-pointer
                          ${!msg.isRead
                            ? "border-primary/40 shadow-sm"
                            : "border-border"
                          }`}
              onClick={() => handleExpand(msg)}
            >
              {/* Message row */}
              <div className="flex items-center gap-4 p-4">

                {/* Unread dot */}
                <div className="w-2 flex-shrink-0">
                  {!msg.isRead && (
                    <BsCircleFill className="text-primary text-xs" />
                  )}
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-accent flex items-center
                                justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {msg.name?.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate ${
                      !msg.isRead
                        ? "font-bold text-foreground"
                        : "font-medium text-foreground"
                    }`}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatFullDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {msg.subject || msg.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0"
                     onClick={(e) => e.stopPropagation()}>
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkRead(msg._id)}
                      className="p-1.5 rounded-lg text-muted-foreground
                                 hover:bg-accent hover:text-primary
                                 transition-colors"
                      title="Mark as read"
                    >
                      <MdOutlineMarkEmailRead className="text-lg" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteDialog({ open: true, id: msg._id })}
                    className="p-1.5 rounded-lg text-muted-foreground
                               hover:bg-destructive/10 hover:text-destructive
                               transition-colors"
                  >
                    <MdOutlineDelete className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Expanded message */}
              {expanded === msg._id && (
                <Motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                  className="px-6 pb-5 border-t border-border"
                >
                  <div className="pt-4 flex flex-col gap-3">
                    <div className="flex items-center gap-4 text-xs
                                    text-muted-foreground flex-wrap">
                      <span>
                        <strong className="text-foreground">From:</strong>{" "}
                        {msg.name}
                      </span>
                      <a href={`mailto:${msg.email}`}
                         className="text-primary hover:underline">
                        {msg.email}
                      </a>
                      {msg.subject && (
                        <span>
                          <strong className="text-foreground">Subject:</strong>{" "}
                          {msg.subject}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed
                                  whitespace-pre-wrap bg-background rounded-xl
                                  p-4 border border-border">
                      {msg.message}
                    </p>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your message"}`}
                      className="text-xs font-semibold text-primary hover:underline w-fit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Reply via email →
                    </a>
                  </div>
                </Motion.div>
              )}
            </Motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
        title="Delete Message?"
        description="This will permanently delete this message."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageMessages;