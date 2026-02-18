# Relatorio de Implementacao - Agendamentos PetShop

## Resumo

Foram implementadas 3 funcionalidades de agendamento de forma sequencial e atomica na branch `GabrielDEV`.

---

## 1. Agendamento de Vacinas

### Arquivos Criados
- `api/api/src/main/java/com/pet/api/model/Vacina.java`
- `api/api/src/main/java/com/pet/api/model/AgendamentoVacina.java`
- `api/api/src/main/java/com/pet/api/model/StatusAgendamento.java`
- `api/api/src/main/java/com/pet/api/repository/VacinaRepository.java`
- `api/api/src/main/java/com/pet/api/repository/AgendamentoVacinaRepository.java`
- `api/api/src/main/java/com/pet/api/dto/agendamento/AgendamentoVacinaRequestDTO.java`
- `api/api/src/main/java/com/pet/api/dto/agendamento/AgendamentoVacinaResponseDTO.java`
- `api/api/src/main/java/com/pet/api/service/AgendamentoVacinaService.java`
- `api/api/src/main/java/com/pet/api/controller/AgendamentoVacinaController.java`
- `api/api/src/main/java/com/pet/api/controller/VacinaController.java`
- `api/api/src/main/java/com/pet/api/exception/BusinessException.java`
- `api/api/src/main/java/com/pet/api/exception/ConflictException.java`

### Arquivos Alterados
- `api/api/src/main/java/com/pet/api/exception/GlobalExceptionHandler.java` (adicionados handlers para BusinessException e ConflictException)
- `api/api/src/main/java/com/pet/api/config/SecurityConfig.java` (adicionadas rotas de agendamentos e vacinas)

### Regras de Negocio
- Validacao de data futura (nao permite agendar para hoje ou datas passadas)
- Validacao de existencia do animal (retorna 404 se nao encontrado)
- Validacao de existencia da vacina (retorna 404 se nao encontrada)
- Validacao de estoque da vacina (retorna 400 se estoque zerado)
- Decremento automatico do estoque ao agendar
- Reposicao do estoque ao cancelar agendamento
- Bloqueio de cancelamento de agendamentos ja cancelados ou realizados

### Comandos para Testar

```bash
# Registrar usuario
curl -X POST http://localhost:8080/usuarios -H "Content-Type: application/json" -d '{"nome":"Teste","email":"teste@test.com","senha":"123456"}'

# Login (obter token)
curl -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{"email":"teste@test.com","senha":"123456"}'

# Cadastrar animal
curl -X POST http://localhost:8080/animais -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"nome":"Rex","idade":3,"especie":"Cachorro","raca":"Labrador","cor":"Dourado","sexo":"Macho","tamanho":"Grande","descricao":"Cachorro amigavel","vacinado":false,"castrado":true}'

# Cadastrar vacina
curl -X POST http://localhost:8080/vacinas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"nome":"Antirrabica","fabricante":"Zoetis","estoque":10}'

# Agendar vacina (caminho feliz)
curl -X POST http://localhost:8080/agendamentos/vacinas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"vacinaId":1,"dataAgendamento":"2026-06-15","observacoes":"Primeira dose"}'

# Erro - Data passada
curl -X POST http://localhost:8080/agendamentos/vacinas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"vacinaId":1,"dataAgendamento":"2020-01-01"}'

# Erro - Vacina inexistente
curl -X POST http://localhost:8080/agendamentos/vacinas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"vacinaId":999,"dataAgendamento":"2026-06-15"}'

# Erro - Vacina sem estoque
curl -X POST http://localhost:8080/vacinas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"nome":"V8","fabricante":"MSD","estoque":0}'
curl -X POST http://localhost:8080/agendamentos/vacinas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"vacinaId":2,"dataAgendamento":"2026-06-15"}'

# Listar agendamentos
curl http://localhost:8080/agendamentos/vacinas -H "Authorization: Bearer <TOKEN>"

# Cancelar agendamento
curl -X PATCH http://localhost:8080/agendamentos/vacinas/1/cancelar -H "Authorization: Bearer <TOKEN>"
```

---

## 2. Agendamento de Banho e Tosa

### Arquivos Criados
- `api/api/src/main/java/com/pet/api/model/Funcionario.java`
- `api/api/src/main/java/com/pet/api/model/TipoServico.java`
- `api/api/src/main/java/com/pet/api/model/AgendamentoBanhoTosa.java`
- `api/api/src/main/java/com/pet/api/repository/FuncionarioRepository.java`
- `api/api/src/main/java/com/pet/api/repository/AgendamentoBanhoTosaRepository.java`
- `api/api/src/main/java/com/pet/api/dto/agendamento/AgendamentoBanhoTosaRequestDTO.java`
- `api/api/src/main/java/com/pet/api/dto/agendamento/AgendamentoBanhoTosaResponseDTO.java`
- `api/api/src/main/java/com/pet/api/service/AgendamentoBanhoTosaService.java`
- `api/api/src/main/java/com/pet/api/controller/AgendamentoBanhoTosaController.java`
- `api/api/src/main/java/com/pet/api/controller/FuncionarioController.java`

### Arquivos Alterados
- `api/api/src/main/java/com/pet/api/config/SecurityConfig.java` (adicionadas rotas de funcionarios)

### Regras de Negocio
- Validacao de data/hora futura
- Validacao de existencia do animal e do funcionario
- Validacao de funcionario ativo (nao permite agendar com funcionario inativo)
- Estimativa automatica de duracao por tipo de servico:
  - BANHO: 60 minutos
  - TOSA: 45 minutos
  - BANHO_E_TOSA: 90 minutos
- Deteccao de conflito de horario (Double Booking): verifica sobreposicao de intervalos entre agendamentos existentes e o novo
- Bloqueio de cancelamento de agendamentos ja cancelados ou realizados

### Comandos para Testar

```bash
# Cadastrar funcionario ativo
curl -X POST http://localhost:8080/funcionarios -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"nome":"Joao Silva","cargo":"Tosador","ativo":true}'

# Cadastrar funcionario inativo
curl -X POST http://localhost:8080/funcionarios -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"nome":"Maria Santos","cargo":"Banhista","ativo":false}'

# Agendar banho (caminho feliz)
curl -X POST http://localhost:8080/agendamentos/banho-tosa -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"funcionarioId":1,"dataHora":"2026-06-15T10:00:00","tipoServico":"BANHO"}'

# Erro - Funcionario inativo
curl -X POST http://localhost:8080/agendamentos/banho-tosa -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"funcionarioId":2,"dataHora":"2026-06-15T10:00:00","tipoServico":"BANHO"}'

# Erro - Conflito de horario (Double Booking)
curl -X POST http://localhost:8080/agendamentos/banho-tosa -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"funcionarioId":1,"dataHora":"2026-06-15T10:30:00","tipoServico":"TOSA"}'

# Listar agendamentos
curl http://localhost:8080/agendamentos/banho-tosa -H "Authorization: Bearer <TOKEN>"

# Cancelar agendamento
curl -X PATCH http://localhost:8080/agendamentos/banho-tosa/1/cancelar -H "Authorization: Bearer <TOKEN>"
```

---

## 3. Agendamento de Consultas Veterinarias

### Arquivos Criados
- `api/api/src/main/java/com/pet/api/model/Veterinario.java`
- `api/api/src/main/java/com/pet/api/model/AgendamentoConsulta.java`
- `api/api/src/main/java/com/pet/api/repository/VeterinarioRepository.java`
- `api/api/src/main/java/com/pet/api/repository/AgendamentoConsultaRepository.java`
- `api/api/src/main/java/com/pet/api/dto/agendamento/AgendamentoConsultaRequestDTO.java`
- `api/api/src/main/java/com/pet/api/dto/agendamento/AgendamentoConsultaResponseDTO.java`
- `api/api/src/main/java/com/pet/api/service/AgendamentoConsultaService.java`
- `api/api/src/main/java/com/pet/api/controller/AgendamentoConsultaController.java`
- `api/api/src/main/java/com/pet/api/controller/VeterinarioController.java`

### Arquivos Alterados
- `api/api/src/main/java/com/pet/api/config/SecurityConfig.java` (adicionadas rotas de veterinarios)

### Regras de Negocio
- Validacao de data/hora futura
- Validacao de existencia do animal e do veterinario
- Validacao de veterinario ativo (nao permite agendar com veterinario inativo)
- Vinculacao obrigatoria ao veterinario especifico
- Deteccao de conflito de horario: cada consulta tem duracao fixa de 30 minutos, verifica sobreposicao
- Bloqueio de cancelamento de agendamentos ja cancelados ou realizados

### Comandos para Testar

```bash
# Cadastrar veterinario ativo
curl -X POST http://localhost:8080/veterinarios -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"nome":"Dr. Carlos","especialidade":"Clinica Geral","ativo":true}'

# Cadastrar veterinario inativo
curl -X POST http://localhost:8080/veterinarios -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"nome":"Dra. Ana","especialidade":"Dermatologia","ativo":false}'

# Agendar consulta (caminho feliz)
curl -X POST http://localhost:8080/agendamentos/consultas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"veterinarioId":1,"dataHora":"2026-06-15T10:00:00","motivo":"Check-up anual"}'

# Erro - Veterinario inativo
curl -X POST http://localhost:8080/agendamentos/consultas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"veterinarioId":2,"dataHora":"2026-06-15T10:00:00","motivo":"Consulta"}'

# Erro - Conflito de horario
curl -X POST http://localhost:8080/agendamentos/consultas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"veterinarioId":1,"dataHora":"2026-06-15T10:15:00","motivo":"Conflito"}'

# Erro - Veterinario inexistente
curl -X POST http://localhost:8080/agendamentos/consultas -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"animalId":1,"veterinarioId":999,"dataHora":"2026-06-16T10:00:00","motivo":"Vet invalido"}'

# Listar agendamentos
curl http://localhost:8080/agendamentos/consultas -H "Authorization: Bearer <TOKEN>"

# Cancelar agendamento
curl -X PATCH http://localhost:8080/agendamentos/consultas/1/cancelar -H "Authorization: Bearer <TOKEN>"
```

---

## Commits Realizados (branch GabrielDEV)

1. `feat: implementa agendamento de vacinas com validacoes de estoque, data futura e IDs`
2. `feat: implementa agendamento de banho e tosa com validacao de disponibilidade e bloqueio de double booking`
3. `feat: implementa agendamento de consultas veterinarias com validacao de veterinario ativo e agenda livre`
