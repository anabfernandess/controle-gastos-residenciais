type StatCardProps = {
  titulo: string;
  valor: string;
  tipo: "receita" | "despesa" | "saldo";
};

function StatCard({
  titulo,
  valor,
  tipo,
}: StatCardProps) {
  return (
    <article className={`card summary-card ${tipo}`}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </article>
  );
}

export default StatCard;