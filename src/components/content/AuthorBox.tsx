import type { AuthorProfile } from "@/types/calculator";

export function AuthorBox({ author, reviewer, updatedAt }: { author: AuthorProfile; reviewer?: AuthorProfile; updatedAt: string }) {
  const reviewCriteria = reviewer?.reviewCriteria || author.reviewCriteria;

  return (
    <div className="rounded-3xl border border-blush-100 bg-blush-50/60 p-5">
      <h2 className="text-lg font-black text-slate-950">작성 및 검토 정보</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blush-700">Author</p>
          <p className="mt-2 font-black text-slate-950">{author.name}</p>
          <p className="text-sm text-slate-600">{author.role}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{author.bio}</p>
          {author.scope ? <p className="mt-2 text-sm leading-7 text-slate-600"><span className="font-black text-slate-800">담당 영역</span> {author.scope}</p> : null}
          {author.updateCycle ? <p className="text-sm leading-7 text-slate-600"><span className="font-black text-slate-800">업데이트 주기</span> {author.updateCycle}</p> : null}
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blush-700">Review</p>
          <p className="mt-2 font-black text-slate-950">{reviewer?.name || author.name}</p>
          <p className="text-sm text-slate-600">{reviewer?.role || author.role}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{reviewer?.bio || author.bio}</p>
          {reviewCriteria?.length ? (
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
              {reviewCriteria.map((item) => (
                <li key={item}>검토 기준: {item}</li>
              ))}
            </ul>
          ) : null}
          <p className="mt-3 text-xs font-bold text-slate-500">최종 업데이트: {updatedAt}</p>
          <p className="mt-1 text-xs font-bold text-slate-500">문의 채널: {reviewer?.contact || author.contact || "moneyfinancecalculator@gmail.com"}</p>
        </div>
      </div>
    </div>
  );
}
