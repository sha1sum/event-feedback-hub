export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
        &copy; {year} Event Feedback Hub. All rights reserved.
      </div>
    </footer>
  );
}
