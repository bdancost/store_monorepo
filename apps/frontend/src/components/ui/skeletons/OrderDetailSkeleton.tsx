import { SkeletonBox } from "../Skeleton";

// Skeleton do banner de confirmação
function ConfirmationBannerSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[.06] p-8 mb-8 flex flex-col items-center gap-4">
      <SkeletonBox width={72} height={72} rounded="full" />
      <SkeletonBox width={240} height={28} />
      <SkeletonBox width={300} height={16} />
      <SkeletonBox width={160} height={32} rounded="full" />
      <SkeletonBox width={120} height={12} />
    </div>
  );
}

// Skeleton da timeline de status
function TimelineSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[.06] p-6 flex flex-col gap-6">
      <SkeletonBox width={120} height={14} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <SkeletonBox width={36} height={36} rounded="full" />
            {i < 3 && <SkeletonBox width={2} height={24} />}
          </div>
          <div className="flex-1 pb-4 flex flex-col gap-1.5">
            <SkeletonBox width="50%" height={14} />
            <SkeletonBox width="70%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton dos itens do pedido
function OrderItemsSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[.06] p-6 flex flex-col gap-4">
      <SkeletonBox width={100} height={14} />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2 border-b border-white/[.04] last:border-0"
        >
          <SkeletonBox width={48} height={48} rounded="lg" />
          <div className="flex-1 flex flex-col gap-1.5">
            <SkeletonBox width="80%" height={12} />
            <SkeletonBox width="30%" height={10} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <SkeletonBox width={60} height={14} />
            <SkeletonBox width={40} height={10} />
          </div>
        </div>
      ))}
      <div className="flex justify-between pt-2">
        <SkeletonBox width={60} height={14} />
        <SkeletonBox width={80} height={20} />
      </div>
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <ConfirmationBannerSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimelineSkeleton />
        <OrderItemsSkeleton />
      </div>
      {/* Botões de ação */}
      <div className="flex gap-3">
        <SkeletonBox width="50%" height={48} rounded="xl" />
        <SkeletonBox width="50%" height={48} rounded="xl" />
      </div>
    </div>
  );
}
