import { errorResponse, successResponse } from "../utils/apiResponse.js";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

export const getLeetCodeStats = async (req, res, next) => {
    try {
        const { username } = req.params;

        if (!username || !/^[A-Za-z0-9_-]+$/.test(username)) {
            return res.status(400).json(errorResponse("Invalid LeetCode username"));
        }

        const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
        allQuestionsCount {
          difficulty
          count
        }
        userContestRanking(username: $username) {
            rating
            globalRanking
            totalParticipants
            topPercentage
          }
      }
    `;

    const response = await fetch(LEETCODE_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      return errorResponse(res, 502, "Failed to fetch from LeetCode");
    }

    const json = await response.json();

    if (!json.data?.matchedUser) {
      return errorResponse(res, 404, "LeetCode user not found");
    }

    const user = json.data.matchedUser;
    const allCounts = json.data.allQuestionsCount;
    const acCounts = user.submitStats.acSubmissionNum;
    const contestRanking = json.data?.userContestRanking;


    const getCount = (arr, difficulty) =>
      arr.find((d) => d.difficulty === difficulty)?.count || 0;

    const stats = {
      totalSolved: getCount(acCounts, "All"),
      easySolved: getCount(acCounts, "Easy"),
      mediumSolved: getCount(acCounts, "Medium"),
      hardSolved: getCount(acCounts, "Hard"),
      totalEasy: getCount(allCounts, "Easy"),
      totalMedium: getCount(allCounts, "Medium"),
      totalHard: getCount(allCounts, "Hard"),
      ranking: user.profile.ranking,
      contestRating: contestRanking?.rating
    ? Math.round(contestRanking.rating)
    : null,
    };

    return successResponse(res, 200, "LeetCode stats fetched", stats);
    } catch (error) {
        next(error);
    }
}