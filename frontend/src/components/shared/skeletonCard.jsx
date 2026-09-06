const SkeletonCard = () => {
    return (
      <div
        className="bg-card border border-border rounded-2xl p-5
                  flex flex-col gap-4 animate-pulse"
      >
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-muted rounded-lg w-3/4" />
          <div className="h-3 bg-muted rounded-lg w-full" />
          <div className="h-3 bg-muted rounded-lg w-2/3" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-16 bg-muted rounded-full" />
        </div>
      </div>
    );
}

export default SkeletonCard;