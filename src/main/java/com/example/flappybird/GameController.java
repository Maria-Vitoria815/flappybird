package com.example.flappybird;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final ScoreRepository scoreRepository;

    public GameController(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    @GetMapping("/best-score")
    public ResponseEntity<Map<String, Object>> getBestScore() {
        ScoreRecord record = scoreRepository.findTopByOrderByBestScoreDesc();

        if (record == null) {
            return ResponseEntity.ok(Map.of("bestScore", 0, "playerName", "-"));
        }

        return ResponseEntity.ok(Map.of(
                "bestScore", record.getBestScore(),
                "playerName", record.getPlayerName() != null ? record.getPlayerName() : "-"
        ));
    }

    @PostMapping("/best-score")
    public ResponseEntity<Map<String, Object>> updateBestScore(@RequestBody Map<String, Object> payload) {
        Integer score = (Integer) payload.get("score");
        String playerName = payload.getOrDefault("playerName", "Player").toString();

        if (score == null || score < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Pontuação inválida"));
        }

        ScoreRecord record = scoreRepository.findTopByOrderByBestScoreDesc();

        if (record == null || score > record.getBestScore()) {
            if (record == null) {
                record = new ScoreRecord(playerName, score);
            } else {
                record.setPlayerName(playerName);
                record.setBestScore(score);
            }

            scoreRepository.save(record);
        }

        return ResponseEntity.ok(Map.of(
                "bestScore", record.getBestScore(),
                "playerName", record.getPlayerName()
        ));
    }
}
