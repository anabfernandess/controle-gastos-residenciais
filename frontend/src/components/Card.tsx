import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <article className="card">
      {title && <h2>{title}</h2>}

      {children}
    </article>
  );
}

export default Card;