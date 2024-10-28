package edu.aut_conference.backend.service.Organizer;

import edu.aut_conference.backend.model.UserLogin.User;
import edu.aut_conference.backend.model.Shared.Conference;
import edu.aut_conference.backend.repository.Organizer.ConferenceRepository;
import edu.aut_conference.backend.repository.User.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import edu.aut_conference.backend.model.Shared.ConferenceStatus;


@Service
public class ConferenceService {

    @Autowired
    private ConferenceRepository conferenceRepository;

    @Autowired
    private UserRepository userRepository;  // 注入 UserRepository

    // 获取所有会议
    public List<Conference> getAllConferences() {
        return conferenceRepository.findAll();
    }

    // 根据ID获取会议
    public Optional<Conference> getConferenceById(Long conferenceID) {
        return conferenceRepository.findById(conferenceID);
    }

    // 搜索会议
    public List<Conference> searchConferences(String keyword) {
        return conferenceRepository.searchByKeyword(keyword);
    }

    // 保存会议（用于添加新会议）
    public Conference saveConference(Conference conference) {
        return conferenceRepository.save(conference);
    }

    public Conference updateConference(Long id, Conference updatedConference) {
        // 查找指定ID的会议
        return conferenceRepository.findById(id)
                .map(existingConference -> {
                    // 更新会议的各个字段
                    existingConference.setTitle(updatedConference.getTitle());
                    existingConference.setDate(updatedConference.getDate());
                    existingConference.setStartTime(updatedConference.getStartTime());
                    existingConference.setLocation(updatedConference.getLocation());
                    existingConference.setDescription(updatedConference.getDescription());
                    existingConference.setEmail(updatedConference.getEmail());

                    // 仅当状态从 'Waiting' 到 'Completed' 或从 'Draft' 到 'Waiting' 时才更新状态
                    if (updatedConference.getStatus() == ConferenceStatus.Completed) {
                        existingConference.setStatus(ConferenceStatus.Completed);
                    } else if (updatedConference.getStatus() == ConferenceStatus.Waiting) {
                        existingConference.setStatus(ConferenceStatus.Waiting);
                    }

                    // 保存更新后的会议信息
                    return conferenceRepository.save(existingConference);
                }).orElseThrow(() -> new RuntimeException("Conference not found with id: " + id));
    }



    // 删除会议
    public void deleteConference(Long id) {
        conferenceRepository.deleteById(id);
    }

    // 获取会议的所有作者
    public List<User> getAuthorsByConferenceId(Long conferenceId) {
        // 从 conference_registered_users 表中查询所有 userID
        List<Long> userIds = conferenceRepository.findRegisteredUserIdsByConferenceId(conferenceId);

        // 根据 userIds 从 user 表中查询用户信息
        return userRepository.findAllById(userIds);
    }
    // 获取当天的会议状态统计
    public Map<String, Integer> getDailyConferenceStats() {
        // 使用枚举值作为参数
        int draftCount = conferenceRepository.countByStatus(ConferenceStatus.Draft);
        int waitingCount = conferenceRepository.countByStatus(ConferenceStatus.Waiting);

        Map<String, Integer> stats = new HashMap<>();
        stats.put("draft", draftCount);
        stats.put("waiting", waitingCount);
        return stats;
    }

    // 获取每月的会议统计数据
    public Map<String, Object> getMonthlyConferenceStats() {
        List<Object[]> result = conferenceRepository.getMonthlyConferenceStats();

        Map<String, Object> response = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();

        for (Object[] row : result) {
            Integer month = (Integer) row[0];
            Integer count = ((Number) row[1]).intValue();

            String label = month + "-1" + "-2024"; // 例如，月份和年份的组合
            labels.add(label);
            data.add(count);
        }

        response.put("labels", labels);
        response.put("data", data);
        return response;
    }
    // 获取草稿状态的会议
    public List<Conference> getDraftConferences() {
        return conferenceRepository.findByStatus(ConferenceStatus.Draft);
    }

    // 获取等待状态的会议
    public List<Conference> getWaitingConferences() {
        return conferenceRepository.findByStatus(ConferenceStatus.Waiting);
    }
    public List<Conference> getConferencesByUser(Long userID) {
        // 传入 `Draft` 状态以排除它
        return conferenceRepository.findConferencesByUserAndStatusNotDraft(userID, ConferenceStatus.Draft);
    }


}
