# 🔐 Template de API com Spring Boot & JWT

Este repositório contém um **Template de API**, desenvolvido com **Spring Boot** e **Spring Security**, que serve como uma base robusta para projetos que exigem autenticação e autorização.

---

## 🚀 Tecnologias Utilizadas

- Java 17+
- Spring Boot 3.x
- Spring Security 6.x
- PostgreSQL 15
- Maven
- JJWT (JSON Web Tokens)
- Lombok

---

## 🏁 Como Executar o Projeto

Siga os passos abaixo para executar o projeto localmente.

### Pré-requisitos
* Java (JDK) 17 ou superior
* Apache Maven
* PostgreSQL 15
* Um cliente de API (como o Postman)

### Passos
1.  **Clone o Repositório:**
    ```bash
    git clone URL_DO_SEU_REPOSITORIO.git
    cd nome-do-projeto
    ```
2.  **Prepare o Banco de Dados:**
    * Garanta que o serviço do PostgreSQL está a correr.
    * Crie uma base de dados para a aplicação (ex: `api_db`).

3.  **Configure as Variáveis de Ambiente:**
    Na configuração de execução da sua IDE (`Run -> Edit Configurations...`), adicione as seguintes variáveis:
    * `DB_USERNAME`: O seu utilizador do PostgreSQL.
    * `DB_PASSWORD`: A sua senha do PostgreSQL.
    * `JWT_SECRET`: Uma chave secreta longa e segura.

4.  **Execute a Aplicação:**
    * Abra o projeto na sua IDE e execute a classe principal `ApiApplication.java`.
    * O servidor iniciará em `http://localhost:8080`.

---

## 📡 Endpoints Públicos

### Utilizadores
- `POST /usuarios` – Cria um novo utilizador.

**Exemplo de corpo JSON:**
```json
{
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "senha": "password123"
}
```

### Autenticação
- `POST /auth/login` – Autentica um utilizador e retorna um token JWT.

**Exemplo de corpo JSON:**
```json
{
  "email": "usuario@email.com",
  "senha": "password123"
}
```

---

## 🧩 Arquitetura

Este Template de API foi construído seguindo uma **arquitetura em camadas**, na qual as responsabilidades são claramente separadas, facilitando a manutenção e a escalabilidade do projeto.

---

## 📦 Estrutura do Projeto

```
api
├── .mvn/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/camila/api/
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── exception/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       └── service/
│   │   │       └── ApiApplication 
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│   │   ├── java/
│   │   │   └── com/camila/api/
│   │   │       ├── controller/
│   │   │       └── service/
│   │   │       └── ApiApplicationTests
├── .gitignore
├── pom.xml
└── README.md
```

---

## 🧪 Testes

Este projeto está configurado para suportar **testes de unidade e integração** utilizando o ecossistema padrão do Spring Boot, incluindo **JUnit 5** e **Mockito**.

### Executando os Testes

A forma mais simples de executar toda a suíte de testes é através do Maven, na linha de comando.

Na raiz do projeto, execute:
```bash
mvn clean test
```

Este comando irá compilar o código, executar todos os testes encontrados em `src/test/java` e apresentar um relatório no final.  
Você também pode executar classes de teste individuais diretamente pela sua IDE.

---

## 🛠️ Futuras Melhorias

- Implementar testes de unidade e integração mais abrangentes.
- Adicionar roles (perfis) de utilizador (ex: ADMIN, USER).
- Criar um endpoint para refresh de token.

---

## 🧑‍💻 Autora

- [Camila Ribeiro](https://github.com/camilasribeiro)

Template de API com Spring Boot, JWT & PostgreSQL.
