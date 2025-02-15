"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Reemplazo de useRouter
import { createClient } from "@supabase/supabase-js";
import styles from "./boxers.module.css";
import Image from "next/image";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Boxeador {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  localidad: string;
  fecha_nac: string;
  num_lic: string;
  peso: number;
  img_url?: string;
  ganadas: number;
  perdidas: number;
  empatadas: number;
  sin_dec: number;
}

export default function PerfilBoxeador() {
  const [boxeador, setBoxeador] = useState<Boxeador | null>(null);
  const params = useParams(); // Obtiene los parámetros de la URL
  const id = params.id; // Extrae el ID de la URL

  useEffect(() => {
    if (!id) return;

    const fetchBoxeador = async () => {
      const { data, error } = await supabase
        .from("perfil")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener boxeador:", error);
        return;
      }

      setBoxeador(data);
    };

    fetchBoxeador();
  }, [id]);

  if (!boxeador) return;

  return (
    <section className={styles.container}>
      <figure className={styles.img}>
        <Image
          src={boxeador.img_url || "/img/defaul.jpeg"} // Usa una imagen por defecto si no hay imagen
          alt={boxeador.nombre}
          width={240}
          height={240}
          style={{

            objectFit: "cover"
          }}
        />
      </figure>

      <article className={styles.info}>
        <h1>
          {boxeador.nombre} {boxeador.apellido}
        </h1>
        <p>
          <strong>Fecha de Nacimiento:</strong> {boxeador.fecha_nac}
        </p>
        <p>
          <strong>DNI:</strong> {boxeador.dni}
        </p>
        <p>
          <strong>Localidad:</strong> {boxeador.localidad}
        </p>
        <p>
          <strong>Número de Licencia:</strong> {boxeador.num_lic}
        </p>
        <p>
          <strong>Peso:</strong> {boxeador.peso} kg
        </p>
        <p>
          <strong>Sin Decisión:</strong> {boxeador.sin_dec}
        </p>
      </article>

      <article className={styles.VED}>
        <div className={styles.card}>
          <h1>Victorias</h1>
          <p>{boxeador.ganadas}</p>
        </div>

        <div className={styles.card}>
          <h1>Empates</h1>
          <p>{boxeador.empatadas}</p>
        </div>

        <div className={styles.card}>
          <h1>Derrotas</h1>
          <p>{boxeador.perdidas}</p>
        </div>
      </article>
    </section>
  );
}
