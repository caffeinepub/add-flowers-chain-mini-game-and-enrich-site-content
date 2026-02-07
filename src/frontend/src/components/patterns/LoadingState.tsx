export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
