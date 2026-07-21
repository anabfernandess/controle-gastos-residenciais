type AvatarProps = {
  nome: string;
  tamanho?: "pequeno" | "medio" | "grande";
};

function obterCorAvatar(nome: string): number {
  const somaCaracteres = nome
    .split("")
    .reduce(
      (total, caractere) =>
        total + caractere.charCodeAt(0),
      0
    );

  return (somaCaracteres % 6) + 1;
}

function Avatar({
  nome,
  tamanho = "medio",
}: AvatarProps) {
  const nomeFormatado = nome.trim();
  const inicial = nomeFormatado
    ? nomeFormatado.charAt(0).toUpperCase()
    : "?";

  const cor = obterCorAvatar(nomeFormatado);

  return (
    <div
      className={`avatar avatar-${tamanho} avatar-cor-${cor}`}
      aria-label={`Avatar de ${nomeFormatado}`}
      title={nomeFormatado}
    >
      {inicial}
    </div>
  );
}

export default Avatar;