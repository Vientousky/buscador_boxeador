"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { FC } from "react";
import styles from "./index.module.css";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";

// Definir tipo de Boxeador
interface Boxeador {
  id: number;
  nombre: string;
  fecha_nac: string;
  num_lic: string;
  peso: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const Tabla: FC = () => {
  const [boxeadores, setBoxeadores] = useState<Boxeador[]>([]);
  const [search, setSearch] = useState<string>("");

  const supabase: SupabaseClient = useMemo(() => createClient(supabaseUrl, supabaseAnonKey), []);

  const fetchBoxeadores = useCallback(async () => {
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
  }, [supabase]);

  useEffect(() => {
    fetchBoxeadores();

    const subscription = supabase
      .channel("realtime:boxeadores")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "perfil" },
        () => {
          fetchBoxeadores(); // Actualizar datos tras inserción
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchBoxeadores, supabase]);

  const filteredBoxeadores = useMemo(
    () =>
      boxeadores.filter((boxeador) =>
        boxeador.nombre.toLowerCase().includes(search.toLowerCase())
      ),
    [boxeadores, search]
  );

  return (
    <section>
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

      <div className={`${styles.tableWrapper} ${filteredBoxeadores.length > 0 ? styles.show : ""}`}>
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
              filteredBoxeadores.map((boxeador, index) => (
                <tr key={boxeador.id} className={styles.show} style={{ animationDelay: `${index * 100}ms` }}>
                  <td data-cell="id" >{boxeador.id}</td>
                  <td data-cell="nombre" >
                    <Link href={`/boxeador/${boxeador.id}`}>{boxeador.nombre}</Link>
                  </td>
                  <td data-cell="fecha_nac" >{boxeador.fecha_nac}</td>
                  <td data-cell="num_lic" >{boxeador.num_lic}</td>
                  <td data-cell="peso" >{boxeador.peso} kg</td>
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

export default Tabla