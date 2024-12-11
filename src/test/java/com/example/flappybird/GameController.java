package com.example.flappybird;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private int score = 0;

    // Endpoint para obter a pontuação atual
    @GetMapping("/score")
    public int getScore() {
        return score;
    }

    // Endpoint para atualizar a pontuação (envia um novo valor)
    @PostMapping("/update-score")
    public void updateScore(@RequestBody int newScore) {
        this.score = newScore;
    }

    // Endpoint para reiniciar o jogo (resetar a pontuação)
    @PostMapping("/reset")
    public void resetGame() {
        this.score = 0;
    }
}
