import React from "react";

export default function EscolhaCadastro() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.fechar}>Fechar</span>
        <p style={styles.texto}>
          Antes de fazer o cadastro, nos diga o que você é!
        </p>
        <button style={styles.botao}>Sou uma empresa</button>
        <button style={styles.botao}>Sou um estagiário</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff"
  },
  card: {
    background: "linear-gradient(to bottom right, #2d0cff, #000428)",
    borderRadius: "12px",
    padding: "30px",
    width: "350px",
    textAlign: "center",
    color: "white",
    position: "relative"
  },
  fechar: {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "12px",
    color: "lime",
    cursor: "pointer"
  },
  texto: {
    fontSize: "16px",
    marginBottom: "20px",
    fontFamily: "Arial, sans-serif"
  },
  botao: {
    display: "block",
    width: "80%",
    margin: "10px auto",
    padding: "12px",
    backgroundColor: "#8000ff",
    border: "none",
    borderRadius: "25px",
    color: "white",
    fontSize: "14px",
    cursor: "pointer"
  }
};
