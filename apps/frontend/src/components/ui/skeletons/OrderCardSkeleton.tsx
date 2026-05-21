import { Skeleton, SkeletonBox } from "../Skeleton";

export function OrderCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <Skeleton
      delay={delay}
      className="rounded-2xl border border-white/[.06] overflow-hidden"
    >
      {/* Header do card */}
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex flex-col gap-2 flex-1">
          {/* ID + data */}
          <div className="flex items-center gap-3">
            <SkeletonBox width={90} height={14} rounded="full" />
            <SkeletonBox width={70} height={12} rounded="full" />
          </div>
          {/* Status badge */}
          <SkeletonBox width={140} height={26} rounded="full" />
          {/* Resumo de itens */}
          <SkeletonBox width="60%" height={12} rounded="full" />
        </div>

        {/* Total */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <SkeletonBox width={80} height={24} />
          <SkeletonBox width={20} height={16} rounded="full" />
        </div>
      </div>

      {/* Footer com imagens */}
      <div className="px-5 pb-4 flex items-center justify-between gap-4">
        {/* Stack de imagens */}
        <div className="flex">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg skeleton-shimmer border border-white/[.06]"
              style={{
                marginLeft: i === 0 ? 0 : -8,
                position: "relative",
                zIndex: 3 - i,
              }}
            />
          ))}
        </div>
        {/* Botão cancelar placeholder */}
        <SkeletonBox width={110} height={30} rounded="lg" />
      </div>
    </Skeleton>
  );
}

export function OrdersListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} delay={i * 100} />
      ))}
    </div>
  );
}
