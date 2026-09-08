import type { AuthorProfile } from "@/types/calculator";

export function AuthorBox({ author, reviewer, updatedAt }: { author: AuthorProfile; reviewer?: AuthorProfile; updatedAt: string }) {
  const reviewCriteria = reviewer?.reviewCriteria || author.reviewCriteria;
  const sameReviewer = !reviewer || reviewer.name === author.name;

  if (sameReviewer) {
    return (
      <div className="rounded-2xl border border-border bg-secondary p-5">
        <h2 className="text-lg font-semibold text-foreground">작성 및 검토 정보</h2>
        <p className="mt-3 font-semibold text-foreground">{author.name}</p>
        <p className="text-sm text-muted-foreground">{author.role}</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{author.bio}</p>
        {author.scope ? <p className="mt-2 text-sm leading-7 text-muted-foreground"><span className="font-semibold text-foreground">담당 영역</span> {author.scope}</p> : null}
        {reviewCriteria?.length ? (
          <ul className="mt-3 space-y-1 text-sm leading-6 text-muted-foreground">
            {reviewCriteria.map((item) => (
              <li key={item}>검토 기준: {item}</li>
            ))}
          </ul>
        ) : null}
        {author.updateCycle ? <p className="mt-3 text-sm leading-7 text-muted-foreground"><span className="font-semibold text-foreground">업데이트 주기</span> {author.updateCycle}</p> : null}
        <p className="mt-3 text-xs font-bold text-muted-foreground">최종 업데이트: {updatedAt}</p>
        <p className="mt-1 text-xs font-bold text-muted-foreground">문의 채널: {author.contact || "webinquiry365@gmail.com"}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-secondary p-5">
      <h2 className="text-lg font-semibold text-foreground">작성 및 검토 정보</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">작성자</p>
          <p className="mt-2 font-semibold text-foreground">{author.name}</p>
          <p className="text-sm text-muted-foreground">{author.role}</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{author.bio}</p>
          {author.scope ? <p className="mt-2 text-sm leading-7 text-muted-foreground"><span className="font-semibold text-foreground">담당 영역</span> {author.scope}</p> : null}
          {author.updateCycle ? <p className="text-sm leading-7 text-muted-foreground"><span className="font-semibold text-foreground">업데이트 주기</span> {author.updateCycle}</p> : null}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">검토</p>
          <p className="mt-2 font-semibold text-foreground">{reviewer?.name || author.name}</p>
          <p className="text-sm text-muted-foreground">{reviewer?.role || author.role}</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{reviewer?.bio || author.bio}</p>
          {reviewCriteria?.length ? (
            <ul className="mt-2 space-y-1 text-sm leading-6 text-muted-foreground">
              {reviewCriteria.map((item) => (
                <li key={item}>검토 기준: {item}</li>
              ))}
            </ul>
          ) : null}
          <p className="mt-3 text-xs font-bold text-muted-foreground">최종 업데이트: {updatedAt}</p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">문의 채널: {reviewer?.contact || author.contact || "webinquiry365@gmail.com"}</p>
        </div>
      </div>
    </div>
  );
}
