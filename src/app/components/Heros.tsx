import React from "react";
import Busqueda from "./Busqueda";
import styles from "./index.module.css";
import Image from "next/image";

const Heros: React.FC = () => {
  return (
    <section className={styles.heros}>
      <figure className={styles.img}>
        <Image src="/img/logo.jpg" alt="logo" width={76} height={46} />
      </figure>
      <article className={styles.container}>
        <h1>¿Buscador de boxeadores?</h1>
        <p>encuentra cualquier boxeador de la provincia del chaco argentina</p>
      <Busqueda/>
      </article>
    </section>
  );
};

export default Heros;
