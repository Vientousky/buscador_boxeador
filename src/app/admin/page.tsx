"use client";

import { useState, useEffect, FormEvent } from "react";
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
  sin_dec: string;
  imagen_url?: string;
}

const AdminPage: React.FC = () => {
  const [boxeadores, setBoxeadores] = useState<Boxeador[]>([]);
  const [formData, setFormData] = useState<Boxeador>({
    id: null,
    dni: "",
    nombre: "",
    apellido: "",
    localidad: "",
    peso: "",
    fecha_nac: "",
    num_lic: "",
    ganadas: "0",
    perdidas: "0",
    empatadas: "0",
    sin_dec: "0",
    imagen_url: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBoxeadores();
  }, []);

  const fetchBoxeadores = async () => {
    const { data, error } = await supabase.from("perfil").select("*");
    if (error) {
      console.error("Error al obtener boxeadores:", error.message);
    } else {
      setBoxeadores(data as Boxeador[]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let imageUrl = formData.imagen_url;

    if (imageFile) {
      const { data, error } = await supabase.storage
        .from("boxeadores")
        .upload(`images/${formData.dni}`, imageFile, { upsert: true });

      if (error) {
        console.error("Error al subir la imagen:", error.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("boxeadores")
        .getPublicUrl(data.path);

      imageUrl = publicUrlData?.publicUrl ?? "";
    }

    const { error } = await supabase.from("perfil").upsert({
      ...formData,
      imagen_url: imageUrl
    });

    if (error) {
      console.error("Error al guardar el boxeador:", error.message);
    } else {
      resetForm();
      fetchBoxeadores();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      dni: "",
      nombre: "",
      apellido: "",
      localidad: "",
      peso: "",
      fecha_nac: "",
      num_lic: "",
      ganadas: "0",
      perdidas: "0",
      empatadas: "0",
      sin_dec: "0",
      imagen_url: ""
    });
    setImageFile(null);
  };

  const handleEdit = (boxeador: Boxeador) => {
    setFormData(boxeador);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className={style.container}>
      <h1>Administrar Boxeadores</h1>

      <form className={style.form} onSubmit={handleSubmit}>
        {["dni", "nombre", "apellido", "localidad", "peso", "fecha_nac", "num_lic", "ganadas", "perdidas", "empatadas", "sin_dec"].map((field) => (
          <div key={field} className={style.formGroup}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              id={field}
              value={formData[field as keyof Boxeador] || ""}
              onChange={handleInputChange}
            />
          </div>
        ))}

        <div className={style.imgGroup}>
          <label htmlFor="Foto">Foto</label>
          <input type="file" id="Foto" onChange={handleImageChange} />
        </div>

        <button className={style.btn} type="submit">
          {formData.id ? "Actualizar Boxeador" : "Crear Boxeador"}
        </button>
      </form>

      <table className={style.table}>
        <caption>Boxeadores</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha de Nacimiento</th>
            <th>Localidad</th>
            <th>Empatadas</th>
            <th>Perdidas</th>
            <th>Ganadas</th>
            <th>Sin Decisión</th>
            <th>Peso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {boxeadores.map((boxeador) => (
            <tr key={boxeador.id}>
              <td>{boxeador.id}</td>
              <td>{boxeador.dni}</td>
              <td>{boxeador.nombre}</td>
              <td>{boxeador.apellido}</td>
              <td>{boxeador.fecha_nac}</td>
              <td>{boxeador.localidad}</td>
              <td>{boxeador.empatadas}</td>
              <td>{boxeador.perdidas}</td>
              <td>{boxeador.ganadas}</td>
              <td>{boxeador.sin_dec}</td>
              <td>{boxeador.peso}</td>
              <td>
                <button onClick={() => handleEdit(boxeador)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminPage;
