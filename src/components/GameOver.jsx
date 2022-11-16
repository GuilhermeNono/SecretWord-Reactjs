import React from "react";
import "./GameOver.css";

const GameOver = ({ resetGame, score }) => {
  return (
    <div>
        <h1>Fim de jogo</h1>
        <h2>Sua pontuação foi: <span>{score}</span></h2>
        <button onClick={resetGame}>Reiniciar Jogo</button>
    </div>
  );
};

export default GameOver;
