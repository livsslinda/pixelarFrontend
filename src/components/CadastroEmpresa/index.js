import React from "react";

import { useNavigate } from "react-router-dom";

export default function CadastroEmpresa() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate("/");
  };

  const handleCadastrar = () => {
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>CADASTRO</h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Nome da empresa</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Digite seu Nome..."
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>CNPJ</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Digite seu CNPJ..."
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>E-mail</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Digite seu E-mail..."
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Senha</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Digite sua Senha..."
          />
        </div>

        <button style={styles.button} onClick={handleCadastrar}>
          CADASTRAR-SE
        </button>

        <a style={styles.backLink} onClick={handleVoltar}>
          Voltar
        </a>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#c4caffff",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "500px",
    background: "linear-gradient(to bottom right, #2c2cfc, #1e1e2f)",
    borderRadius: "20px",
    padding: "40px",
    color: "#fff",
    boxShadow: "0 0 10px #00ccff",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "30px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "25px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    backgroundColor: "#9100ff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "18px",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
  },
  backLink: {
    display: "block",
    textAlign: "center",
    color: "#00ff66",
    textDecoration: "none",
    marginTop: "15px",
    fontSize: "18px",
  },
};
