import {
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

type BadgeProps = {
  tipo: string;
};

function Badge({ tipo }: BadgeProps) {
  const ehReceita = tipo.toLowerCase() === "receita";

  return (
    <span
      className={`badge ${
        ehReceita ? "badge-receita" : "badge-despesa"
      }`}
    >
      {ehReceita ? (
        <ArrowUpCircle size={14} />
      ) : (
        <ArrowDownCircle size={14} />
      )}

      {ehReceita ? "Receita" : "Despesa"}
    </span>
  );
}

export default Badge;