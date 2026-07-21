import { Inbox } from "lucide-react";

type EmptyStateProps = {
  message: string;
};

function EmptyState({
  message,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Inbox size={34} />

      <p>{message}</p>
    </div>
  );
}

export default EmptyState;