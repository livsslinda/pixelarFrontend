import React from "react";

export default function PerfilUsuario() {
  return (
    <div style={styles.page}>
      {/* Menu */}
      <nav style={styles.navbar}>
        <span style={styles.logo}>⌗</span>
        <a href="#" style={styles.link}>Experiência</a>
        <a href="#" style={styles.link}>Educação</a>
        <a href="#" style={styles.link}>Portfólio</a>
        <a href="#" style={styles.link}>Configurações</a>
      </nav>

      {/* Conteúdo do perfil */}
      <div style={styles.profileContainer}>
        <img
          src="https://br.web.img2.acsta.net/pictures/18/09/17/22/41/1680893.jpg"
          alt="Foto de perfil"
          style={styles.profileImage}
        />
        <h2 style={styles.nome}>Rihanna Silva</h2>
        <p style={styles.cargo}>Desenvolvedor de Software</p>
      </div>

      {/* Resumo */}
      <div style={styles.resumoBox}>
        <h3 style={styles.resumoTitulo}>Resumo</h3>
        <p style={styles.resumoTexto}>
          Desenvolvedor de software com mais de 5 anos de experiência em
          desenvolvimento web e móvel. Apaixonado por criar aplicações eficientes
          e escaláveis utilizando tecnologias modernas.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#f0eefc",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    padding: "20px"
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    marginBottom: "40px"
  },
  logo: {
    fontSize: "30px",
    color: "#2c146f",
    marginRight: "40px",
    cursor: "pointer"
  },
  link: {
    textDecoration: "none",
    color: "black",
    fontSize: "16px"
  },
  profileContainer: {
    textAlign: "center"
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px"
  },
  nome: {
    fontSize: "24px",
    margin: "5px 0"
  },
  cargo: {
    fontSize: "14px",
    color: "gray"
  },
  resumoBox: {
    marginTop: "30px",
    border: "1px solid #aaa",
    padding: "20px",
    borderRadius: "5px",
    backgroundColor: "#f0eefc",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  resumoTitulo: {
    fontSize: "22px",
    marginBottom: "10px"
  },
  resumoTexto: {
    fontSize: "15px",
    lineHeight: "1.6"
  }
};
