"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import style from "./page.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Boxeador {
  id: number | null;
  dni: string;
  nombre: string;
  apellido: string;
  localidad: string;
  peso: string;
  fecha_nac: string;
  num_lic: string;
  ganadas: string;
  perdidas: string;
  empatadas: string;
}

const AdminPage: React.FC = () => {
  const [boxeadores, setBoxeadores] = useState<Boxeador[]>([]);

  useEffect(() => {
    fetchBoxeadores();
  }, []);

  const fetchBoxeadores = async () => {
    const { data, error } = await supabase.from("perfil").select("*");
    if (error) console.error(error);
    else setBoxeadores(data as Boxeador[]);
  };


  return (
    <section className={style.container}>
      <h1>Administrar Boxeadores</h1>
      <form className={style.form} >
        <div  className={style.formGroup}>
          <label htmlFor="Nombre">Nombre</label>
          <input type="text" id="Nombre"  />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="Apellido">Apellido</label>
          <input type="text" id="Apellido"  />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="DNI">DNI</label>
          <input type="text" id="DNI"  />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="Localidad">Localidad</label>
          <input type="text" id="Localidad"  />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="Peso">Peso</label>
          <input type="text" id="Peso"  />
        </div>


        <div className={style.formGroup}>
          <label htmlFor="Ganadas">Victorias</label>
          <input type="number" id="Ganadas"  />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="Perdidas">Derrotas</label>
          <input type="number" id="Perdidas"  />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="Empatadas">Empatadas</label>
          <input type="number" id="Empatadas"  />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="FechaNac">Sin decición</label>
          <input type="number" id="FechaNac"  />
        </div>

        <div className={style.imgGroup}>
          <label htmlFor="Foto">Foto</label>
          <input type="file" id="Foto"  />
        </div>

        <button className={style.btn} >Crear Boxeador</button>

      </form>

      <table className={style.table}>
        <caption>Boxeadores</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>DNI</th>
            <th>Peso</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Localidad</th>
            <th>Fecha Nac.</th>
            <th>Fecha Lic.</th>
            <th>Victorias</th>
            <th>Derrotas</th>
            <th>Empates</th>
          </tr>
        </thead>
        <tbody>
          {boxeadores.map((boxeador) => (
            <tr key={boxeador.id}>
              <td>{boxeador.id}</td>
              <td>{boxeador.dni}</td>
              <td>{boxeador.peso}</td>
              <td>{boxeador.nombre}</td>
              <td>{boxeador.apellido}</td>
              <td>{boxeador.localidad}</td>
              <td>{boxeador.fecha_nac}</td>
              <td>{boxeador.num_lic}</td>
              <td>{boxeador.ganadas}</td>
              <td>{boxeador.perdidas}</td>
              <td>{boxeador.empatadas}</td>
              <td>
                <button>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminPage;