package edu.aut_conference.backend.repository.Organizer;

import edu.aut_conference.backend.model.Shared.Conference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import edu.aut_conference.backend.model.Shared.Conference;
import edu.aut_conference.backend.model.Shared.ConferenceStatus;
import java.util.List;

@Repository
public interface ConferenceRepository extends JpaRepository<Conference, Long> {

    // 搜索功能，根据关键字匹配标题或描述
    @Query("SELECT c FROM Conference c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Conference> searchByKeyword(@Param("keyword") String keyword);

    // 查询 conference_registered_users 表中与特定 conferenceID 关联的所有 userID
    @Query(value = "SELECT user_id FROM conference_registered_users WHERE conference_id = :conferenceId", nativeQuery = true)
    List<Long> findRegisteredUserIdsByConferenceId(@Param("conferenceId") Long conferenceId);

    // 查询当天特定状态的会议数量，使用枚举类型作为参数
    @Query("SELECT COUNT(c) FROM Conference c WHERE c.status = :status AND c.date = CURRENT_DATE")
    int countTodayByStatus(@Param("status") ConferenceStatus status);

    // 自定义查询：统计每个月的会议数量
    @Query("SELECT MONTH(c.date), COUNT(c) FROM Conference c GROUP BY MONTH(c.date) ORDER BY MONTH(c.date)")
    List<Object[]> getMonthlyConferenceStats();


    // 查询特定状态的会议数量，使用枚举类型作为参数
    @Query("SELECT COUNT(c) FROM Conference c WHERE c.status = :status")
    int countByStatus(@Param("status") ConferenceStatus status);

    // 查询状态为指定枚举值的会议
    List<Conference> findByStatus(ConferenceStatus status);
    // 自定义查询：按枚举状态统计每个月的会议数量
    @Query("SELECT MONTH(c.date), COUNT(c) FROM Conference c WHERE c.status = :status GROUP BY MONTH(c.date) ORDER BY MONTH(c.date)")
    List<Object[]> getMonthlyStatusStats(@Param("status") ConferenceStatus status);

    @Query("SELECT c FROM Conference c JOIN c.registeredUsers u WHERE u = :userID AND c.status <> :status")
    List<Conference> findConferencesByUserAndStatusNotDraft(@Param("userID") Long userID, @Param("status") ConferenceStatus status);
}


