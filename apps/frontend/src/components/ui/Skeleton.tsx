interface SkeletonBoxProps {
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
  mt?: number;
  mb?: number;
}

// Componente base do skeleton
// Por que aceitar width/height como number ou string?
// number → converte para px (height={16} = 16px)
// string → usa diretamente (width="70%" = 70%)
export function SkeletonBox({
  width = "100%",
  height = 16,
  rounded = "lg",
  className = "",
  mt,
  mb,
}: SkeletonBoxProps) {
  const roundedMap = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  return (
    <div
      className={`skeleton-shimmer ${roundedMap[rounded]} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        marginTop: mt ? `${mt}px` : undefined,
        marginBottom: mb ? `${mb}px` : undefined,
        // Garante que o shimmer não vaza para fora
        isolation: "isolate",
      }}
    />
  );
}

// Wrapper que agrupa boxes e aplica delay escalonado
// delay faz os skeletons animarem em sequência — parece mais orgânico
interface SkeletonProps {
  children: React.ReactNode;
  className?: string;
  // delay em ms — para escalonar múltiplos skeletons
  delay?: number;
}

export function Skeleton({
  children,
  className = "",
  delay = 0,
}: SkeletonProps) {
  return (
    <div className={className} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
