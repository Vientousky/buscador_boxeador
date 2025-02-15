"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Reemplazo de useRouter
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Boxeador {
  id: number;
  nombre: string;
  fecha_nac: string;
  num_lic: string;
  peso: number;
  imagen_url?: string;
}

export default function PerfilBoxeador() {
  const [boxeador, setBoxeador] = useState<Boxeador | null>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };

    fetchBoxeador();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!boxeador) return <p>Boxeador no encontrado</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{boxeador.nombre}</h1>
      <p><strong>Fecha de Nacimiento:</strong> {boxeador.fecha_nac}</p>
      <p><strong>Número de Licencia:</strong> {boxeador.num_lic}</p>
      <p><strong>Peso:</strong> {boxeador.peso} kg</p>

    </div>
  );
}
