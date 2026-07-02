const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); 
const consultasMedicas = [
    { 
        id: 1, 
        pacienteId: 101, 
        nome: "Paciente A (Você)", 
        data: "2023-10-15", 
        exame: "Hemograma", 
        receita: "Vitamina C e Repouso" 
    },
    { 
        id: 2, 
        pacienteId: 102, 
        nome: "Paciente B (Alvo)", 
        data: "2023-10-16", 
        exame: "Raio-X Tórax", 
        receita: "Tratamento para pneumonia" 
    }
];

app.get('/api/consultas/:id', (req, res) => {
    const consultaId = parseInt(req.params.id);
    
    const consulta = consultasMedicas.find(c => c.id === consultaId);

    if (consulta) {
        res.json(consulta);
    } else {
        res.status(404).json({ erro: "Consulta não encontrada" });
    }
});

/*// Rota PROTEGIDA contra IDOR
app.get('/api/consultas/:id', (req, res) => {
    const consultaId = parseInt(req.params.id);
    

    const usuarioLogadoId = 101; 
    
    const consulta = consultasMedicas.find(c => c.id === consultaId);

    if (!consulta) {
        return res.status(404).json({ erro: "Consulta não encontrada" });
    }

    if (consulta.pacienteId !== usuarioLogadoId) {
        return res.status(403).json({ erro: "Acesso Negado: Você não tem permissão para visualizar este prontuário." });
    }

    res.json(consulta);
}); */

app.listen(port, () => {
    console.log(`MedCentral API rodando em http://localhost:${port}`);
});