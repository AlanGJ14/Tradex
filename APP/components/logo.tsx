import { cn } from "@/lib/utils";

export const LogoImage = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-5 h-auto", className)}>
      {/* Modo claro */}
      <img
        src="/logo-light.png"
        alt="Logo claro"
        className="block dark:hidden w-full h-auto"
      />
      {/* Modo oscuro */}
      <img
        src="/logo-dark.png"
        alt="Logo oscuro"
        className="hidden dark:block w-full h-auto"
      />
    </div>
  );
};
