import Link from "next/link";

const nav = [
  { href: "/calculators/", label: "계산기" },
  { href: "/summary/", label: "내 예산표" },
  { href: "/guides/", label: "가이드" },
  { href: "/methodology/", label: "계산 기준" },
  { href: "/contact/", label: "문의" },
];

export function Header() {
  return (
    <header className="no-print sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-h-11 min-w-0 items-center text-lg font-bold tracking-tight">
          웨딩 예산 계산기
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="주요 메뉴">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/calculators/wedding-cost/"
          className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          계산 시작
        </Link>
      </div>
      <nav
        className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="모바일 주요 메뉴"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex min-h-11 shrink-0 items-center rounded-xl border bg-background px-3 py-2 text-sm font-medium text-muted-foreground"
          >
            {item.label}
          </Link>
        ))}
        <span className="w-2 shrink-0" aria-hidden="true" />
      </nav>
    </header>
  );
}
