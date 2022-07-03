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
      "https://api.github.com/repos/Pana-Mafia/Astar-Hackathon/commits?per_page=100&sha=" +
      sha,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + accessToken,
    },
  });
  return response;
};

export const fetchPanaMafiaRepos = async () => {
  const response = await axios({
    method: "get",
    url: "https://api.github.com/orgs/Pana-Mafia/repos",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + accessToken,
    },
  });
  return response;
};
