import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  MdOutlineDelete,
  MdOutlineMarkEmailRead,
  MdOutlineEmail,
  MdOutlineSend,
  MdOutlineReply,
} from "react-icons/md";
import { BsCircleFill } from "react-icons/bs";
import { toast } from "sonner";
import { contactService } from "../../services/contact.service";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import EmptyState from "../../components/shared/EmptyState";
import { formatFullDate } from "../../utils/formatDate";

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [expanded, setExpanded] = useState(null);

  const [replyText, setReplyText] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [replySending, setReplySending] = useState(false);

  const fetchMessages = () => {
    setLoading(true);
    contactService
      .getAll()
      .then((res) => {
        const messageList = Array.isArray(res.data.messages) ? res.data.messages : [];
        setMessages(messageList);
        setUnread(res.data.unreadCount || 0);
      })
      .catch(() => toast.error("Failed to load messages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async (msg) => {
    if (!replyText.trim()) return;
    setReplySending(true);
    try {
      await contactService.reply(msg._id, replyText);
      toast.success(`Reply sent to ${msg.name}!`);
      setReplyText("");
      setReplyingId(null);
      // update message in local state
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id
            ? { ...m, isReplied: true, replyMessage: replyText }
            : m,
        ),
      );
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setReplySending(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)),
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
            <span
              className="flex items-center gap-1.5 text-xs font-semibold
                             text-primary bg-primary/10 px-2.5 py-1 rounded-full"
            >
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-card border rounded-2xl overflow-hidden
                          transition-all duration-200 cursor-pointer
                          ${
                            !msg.isRead
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
                <div
                  className="w-9 h-9 rounded-full bg-accent flex items-center
                                justify-center flex-shrink-0"
                >
                  <span className="text-sm font-bold text-primary">
                    {msg.name?.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm truncate ${
                        !msg.isRead
                          ? "font-bold text-foreground"
                          : "font-medium text-foreground"
                      }`}
                    >
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
                <div
                  className="flex items-center gap-1 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
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
                    <div
                      className="flex items-center gap-4 text-xs
                                    text-muted-foreground flex-wrap"
                    >
                      <span>
                        <strong className="text-foreground">From:</strong>{" "}
                        {msg.name}
                      </span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-primary hover:underline"
                      >
                        {msg.email}
                      </a>
                      {msg.subject && (
                        <span>
                          <strong className="text-foreground">Subject:</strong>{" "}
                          {msg.subject}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm text-foreground leading-relaxed
                                  whitespace-pre-wrap bg-background rounded-xl
                                  p-4 border border-border"
                    >
                      {msg.message}
                    </p>
                    {!msg.isReplied ? (
                      <div className="flex flex-col gap-2">
                        {replyingId === msg._id ? (
                          <>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={4}
                              placeholder={`Reply to ${msg.name}...`}
                              className="w-full bg-background border border-border rounded-xl
                     px-4 py-3 text-sm text-foreground resize-none
                     placeholder:text-muted-foreground focus:outline-none
                     focus:ring-2 focus:ring-ring transition-all"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="flex gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleReply(msg)}
                                disabled={replySending || !replyText.trim()}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                       bg-primary text-primary-foreground text-xs
                       font-semibold hover:opacity-90 disabled:opacity-50
                       transition-opacity"
                              >
                                <MdOutlineSend className="text-sm" />
                                {replySending ? "Sending..." : "Send Reply"}
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingId(null);
                                  setReplyText("");
                                }}
                                className="px-4 py-2 rounded-xl border border-border
                       text-xs text-muted-foreground hover:bg-accent
                       transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReplyingId(msg._id);
                            }}
                            className="flex items-center gap-1.5 text-xs font-semibold
                   text-primary hover:underline w-fit"
                          >
                            <MdOutlineReply className="text-sm" />
                            Reply to {msg.name}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div
                        className="flex flex-col gap-1.5 bg-primary/5 rounded-xl p-3
                  border border-primary/20"
                      >
                        <p className="text-xs font-semibold text-primary flex items-center gap-1">
                          <MdOutlineMarkEmailRead />
                          Replied {formatFullDate(msg.repliedAt)}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {msg.replyMessage}
                        </p>
                      </div>
                    )}
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
