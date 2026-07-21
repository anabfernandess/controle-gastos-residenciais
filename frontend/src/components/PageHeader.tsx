import type { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  titulo: string;
  descricao: string;
  icone: LucideIcon;
};

function PageHeader({
  titulo,
  descricao,
  icone: Icone,
}: PageHeaderProps) {
  return (
    <header className="page-heading">
      <div className="page-heading-accent" />

      <div className="page-heading-icon">
        <Icone size={38} strokeWidth={1.8} />
      </div>

      <div className="page-heading-content">
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
    </header>
  );
}

export default PageHeader;