const express = require('express');
const app = express();
const port = 3000;

const onePieceCharacters = [
  { nombre: "Monkey D. Luffy", fruta: "Gomu Gomu no Mi" },
  { nombre: "Roronoa Zoro", fruta: "No tiene" },
  { nombre: "Nami", fruta: "No tiene" },
  { nombre: "Sanji", fruta: "No tiene" }
];

app.get('/', (req, res) => {
  let html = '<h1>Personajes de One Piece</h1><ul>';
  onePieceCharacters.forEach(c => {
    html += `<li>${c.nombre} - Fruta: ${c.fruta}</li>`;
  });
  html += '</ul>';
  res.send(html);
});

app.listen(port, () => {
  console.log(`App de One Piece escuchando en http://localhost:${port}`);
});
