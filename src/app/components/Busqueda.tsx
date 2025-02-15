"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import type { FC } from "react";
import styles from "./index.module.css";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Boxeador {
  id: number;
  nombre: string;
  fecha_nac: string;
  num_lic: string;
  peso: number;
}

const Tabla: FC = () => {
  const [boxeadores, setBoxeadores] = useState<Boxeador[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const fetchBoxeadores = async () => {
      const { data, error } = await supabase
        .from("perfil")
        .select("*")
        .order("id", { ascending: true })
        .limit(8);

      if (error) {
        console.error("Error al obtener boxeadores:", error);
        return;
      }

      setBoxeadores(data || []);
    };

    fetchBoxeadores();


    const subscription = supabase
      .channel("realtime:boxeadores")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "perfil" },
        (payload) => {
          setBoxeadores((prev) => [payload.new as Boxeador, ...prev.slice(0, 7)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const filteredBoxeadores = boxeadores.filter((boxeador) =>
    boxeador.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section >
      <div className={styles.searchBar}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <BsSearch className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Buscar boxeador..."
            className={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Fecha de Nacimiento</th>
              <th>Número de Licencia</th>
              <th>Peso</th>
            </tr>
          </thead>
          <tbody>
            {filteredBoxeadores.length > 0 ? (
              filteredBoxeadores.map((boxeador) => (
                <tr key={boxeador.id}>
                  <td>{boxeador.id}</td>
                  <td>
                  <Link href={`/boxeador/${boxeador.id}`}>{boxeador.nombre}</Link>
                  </td>
                  <td>{boxeador.fecha_nac}</td>
                  <td>{boxeador.num_lic}</td>
                  <td>{boxeador.peso} kg</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No hay boxeadores disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Tabla;
