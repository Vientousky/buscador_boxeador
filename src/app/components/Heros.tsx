import React from "react";
import Busqueda from "./Busqueda";
import styles from "./index.module.css";

const Heros: React.FC = () => {
  return (
    <section className={styles.heros}>
      <article className={styles.container}>
        <h1>¿Buscador de boxeadores?</h1>
        <p>encuentra cualquier boxeador de la provincia del chaco argentina</p>
      <Busqueda/>
      </article>
    </section>
  );
};

export default Heros;
