import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [cpf_cnpj, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate("/");
  };

  const execSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const resposta = await fetch("http://localhost:3000/usuarios/cadastrar", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ nome, email, cpf_cnpj, senha }),
      });

      console.log("Resposta do servidor:", resposta);

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("Cadastro realizado com sucesso!");
        navigate("/");
      } else {
        setErro(dados.message || "Erro ao fazer o cadastro. Tente novamente.");
      }
    } catch (e) {
      console.error("Falha ao conectar a API:", e);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={execSubmit}>
      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={styles.title}>CADASTRO</h2>

          {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome de Usuário</label>
            <input
              id="nome"
              name="nome"
              value={nome}
              style={styles.input}
              type="text"
              placeholder="Digite seu Nome..."
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input
              id="email"
              name="email"
              value={email}
              style={styles.input}
              type="email"
              placeholder="Digite seu E-mail..."
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>CPF</label>
            <input
              id="cpf_cnpj"
              name="cpf_cnpj"
              value={cpf_cnpj}
              style={styles.input}
              type="text"
              placeholder="Digite seu CPF..."
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              id="senha"
              name="senha"
              value={senha}
              style={styles.input}
              type="password"
              placeholder="Digite sua Senha..."
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "CADASTRAR-SE"}
          </button>

          <a style={styles.backLink} onClick={handleVoltar}>
            Voltar
          </a>
        </div>
      </div>
    </form>
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
    fontSize: "14px",
    cursor: "pointer",
  },
};
