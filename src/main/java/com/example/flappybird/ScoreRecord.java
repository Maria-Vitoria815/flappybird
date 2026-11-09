package com.example.flappybird;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scores")
public class ScoreRecord {

    @Id
    private String id;

    private String playerName;
    private int bestScore;

    public ScoreRecord() {
    }

    public ScoreRecord(String playerName, int bestScore) {
        this.playerName = playerName;
        this.bestScore = bestScore;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public int getBestScore() {
        return bestScore;
    }

    public void setBestScore(int bestScore) {
        this.bestScore = bestScore;
    }
}
