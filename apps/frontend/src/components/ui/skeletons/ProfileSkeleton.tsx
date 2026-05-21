import { SkeletonBox } from "../Skeleton";

export function ProfileHeroSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[.06] p-8">
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <SkeletonBox width={64} height={64} rounded="2xl" />
        <div className="flex-1 flex flex-col gap-2">
          {/* Nome + badge */}
          <div className="flex items-center gap-3">
            <SkeletonBox width={160} height={24} />
            <SkeletonBox width={80} height={22} rounded="full" />
          </div>
          {/* Email */}
          <SkeletonBox width={200} height={16} />
          {/* Membro desde */}
          <SkeletonBox width={130} height={12} />
        </div>
        {/* Botão editar */}
        <SkeletonBox width={96} height={36} rounded="xl" />
      </div>
    </div>
  );
}

export function StatCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="rounded-2xl border border-white/[.06] p-5 flex flex-col gap-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <SkeletonBox width={40} height={40} rounded="xl" />
      <SkeletonBox width="60%" height={12} />
      <SkeletonBox width="40%" height={28} />
      <SkeletonBox width="70%" height={10} />
    </div>
  );
}

export function ProfileStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <StatCardSkeleton key={i} delay={i * 80} />
      ))}
    </div>
  );
}
