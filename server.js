const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 
const usuarios = [
    { id: 101, login: "christopher", senha: "123", nome: "Paciente A (Christopher)" },
    { id: 102, login: "alvo", senha: "123", nome: "Paciente B (Alvo)" }
];

const consultasMedicas = [
    { 
        id: 1, 
        pacienteId: 101, 
        nome: "Paciente A (Christopher)", 
        data: "2023-10-15", 
        exame: "Hemograma Completo", 
        receita: "Vitamina C e Repouso" 
    },
    { 
        id: 2, 
        pacienteId: 102, 
        nome: "Paciente B (Alvo)", 
        data: "2023-10-16", 
        exame: "Raio-X Tórax e Tomografia", 
        receita: "Antibiótico forte" 
    }
];

// ROTA DE LOGIN
app.post('/api/login', (req, res) => {
    const { login, senha } = req.body;
    
    const usuario = usuarios.find(u => u.login === login && u.senha === senha);
    
    if (usuario) {
        res.json({ sucesso: true, usuarioId: usuario.id, nome: usuario.nome });
    } else {
        res.status(401).json({ erro: "Usuário ou senha incorretos." });
    }
});

// ROTA VULNERÁVEL (Ataque IDOR)
app.get('/api/vulneravel/consultas/:id', (req, res) => {
    const consultaId = parseInt(req.params.id);
    const consulta = consultasMedicas.find(c => c.id === consultaId);

    if (consulta) return res.json(consulta);
    res.status(404).json({ erro: "Consulta não encontrada" });
});

// ROTA SEGURA (Defesa)
app.get('/api/seguro/consultas/:id', (req, res) => {
    const consultaId = parseInt(req.params.id);
    const usuarioLogadoId = parseInt(req.headers['usuario-logado-id']); 
    
    const consulta = consultasMedicas.find(c => c.id === consultaId);

    if (!consulta) {
        return res.status(404).json({ erro: "Consulta não encontrada" });
    }

    if (consulta.pacienteId !== usuarioLogadoId) {
        return res.status(403).json({ erro: "Acesso Negado: Registro pertence a outro paciente." });
    }

    res.json(consulta);
});

app.listen(port, () => {
    console.log(`🚀 MedCentral API rodando em http://localhost:${port}`);
});