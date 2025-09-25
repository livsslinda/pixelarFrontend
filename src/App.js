import CadastroEmpresa from "./components/CadastroEmpresa";
import CadastroUsuario from "./components/CadastroUsuario";
import Candidatos from "./components/TelaEmpresa/Candidatos";
import Dashboard from "./components/TelaEmpresa/Dashboard";

import Login from "./components/Login";
import OpcoesU from "./components/Opcoes";
import OpcoesE from "./components/TelaEmpresa/OpcoesE";
import PaginaInicial from "./components/TelaEmpresa/PaginaInicial";
import PerfilU from "./components/TelaUsuario/Perfil";
import PerfilE from "./components/TelaEmpresa/PerfilE";
import Relatorios from "./components/TelaUsuario/Relatorios";

import CandidaturaUsuario from "./components/TelaUsuario/Candidatura";

import PaginalInicialU from "./components/TelaUsuario/PaginaInicial";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rotas usuario */}

        <Route path="/opcoesU" element={<OpcoesU />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/cadastroU" element={<CadastroUsuario />} />
        <Route path="/perfilU" element={<PerfilU />} />
        <Route path="/candidaturaUsuario" element={<CandidaturaUsuario />} />
        <Route path="/vagasU" element={<PaginalInicialU />} />
        {/* rotas empresa */}
        <Route path="/vagas" element={<PaginaInicial />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidatos" element={<Candidatos />} />
        <Route path="/perfilE" element={<PerfilE />} />
        <Route path="/cadastroE" element={<CadastroEmpresa />} />
        <Route path="/opcoesE" element={<OpcoesE />} />

        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
