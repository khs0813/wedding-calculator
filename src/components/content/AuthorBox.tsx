import type { AuthorProfile } from "@/types/calculator";

export function AuthorBox({ author, reviewer, updatedAt }: { author: AuthorProfile; reviewer?: AuthorProfile; updatedAt: string }) {
  return (
    <div className="rounded-3xl border border-blush-100 bg-blush-50/60 p-5">
      <h2 className="text-lg font-black text-slate-950">작성 및 검토 정보</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blush-700">Author</p>
          <p className="mt-2 font-black text-slate-950">{author.name}</p>
          <p className="text-sm text-slate-600">{author.role}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{author.bio}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blush-700">Review</p>
          <p className="mt-2 font-black text-slate-950">{reviewer?.name || author.name}</p>
          <p className="text-sm text-slate-600">{reviewer?.role || author.role}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{reviewer?.bio || author.bio}</p>
          <p className="mt-3 text-xs font-bold text-slate-500">최종 업데이트: {updatedAt}</p>
        </div>
      </div>
    </div>
  );
}
