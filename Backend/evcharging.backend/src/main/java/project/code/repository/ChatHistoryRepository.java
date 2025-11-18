package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.ChatHistory;
import project.code.model.EVDriver;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByDriverOrderByTimestampDesc(EVDriver driver);
    List<ChatHistory> findTop20ByDriverOrderByTimestampDesc(EVDriver driver);
}
