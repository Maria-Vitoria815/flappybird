package com.example.flappybird;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreRepository extends MongoRepository<ScoreRecord, String> {
    ScoreRecord findTopByOrderByBestScoreDesc();
}
