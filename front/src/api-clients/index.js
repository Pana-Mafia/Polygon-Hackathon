import axios from "axios";

const accessToken = "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";

export const fetchBranches = async () => {
  const response = await axios({
    method: "get",
    url: "https://api.github.com/repos/Pana-Mafia/Astar-Hackathon/branches",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + accessToken,
    },
  });
  return response;
};

export const fetchCommits = async () => {
  const response = await axios({
    method: "get",
    url: "https://api.github.com/repos/Pana-Mafia/Astar-Hackathon/commits",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + accessToken,
    },
  });
  return response;
};

export const fetchSpecificCommits = async (sha) => {
  const response = await axios({
    method: "get",
    url:
      "https://api.github.com/repos/Pana-Mafia/Astar-Hackathon/commits?per_page=50&sha=" +
      sha,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + accessToken,
    },
  });
  return response;
};
