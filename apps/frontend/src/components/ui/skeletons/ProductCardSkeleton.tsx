import { Skeleton, SkeletonBox } from "../Skeleton";

// Reproduz EXATAMENTE a estrutura do ProductCard
// Mesmas proporções → zero layout shift quando carrega
export function ProductCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <Skeleton
      delay={delay}
      className="rounded-2xl border border-white/[.06] overflow-hidden"
    >
      {/* Imagem — aspect-square igual ao ProductCard */}
      <SkeletonBox
        width="100%"
        height="0"
        className="aspect-square"
        rounded="2xl"
      />

      {/* Conteúdo */}
      <div className="p-4 flex flex-col gap-3">
        {/* Badge de categoria */}
        <SkeletonBox width={80} height={20} rounded="full" />

        {/* Título — duas linhas */}
        <div className="flex flex-col gap-1.5">
          <SkeletonBox width="90%" height={14} />
          <SkeletonBox width="60%" height={14} />
        </div>

        {/* Preço + botão */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-1">
            <SkeletonBox width={40} height={10} />
            <SkeletonBox width={80} height={22} />
          </div>
          <SkeletonBox width={100} height={36} rounded="xl" />
        </div>
      </div>
    </Skeleton>
  );
}

// Grid completo de skeletons com delay escalonado
// Por que delay escalonado?
// Os cards aparecem em sequência, não todos de uma vez
// parece que estão sendo carregados individualmente
// mais orgânico e menos "blocky"
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} delay={i * 80} />
      ))}
    </div>
  );
}
