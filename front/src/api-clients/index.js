import axios from "axios";

export const fetchBranches = async (at) => {
  const response = await axios({
    method: "get",
    url: "https://api.github.com/repos/Pana-Mafia/Astar-Hackathon/branches",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + at,
    },
  });
  return response;
};

export const fetchCommits = async (at) => {
  const response = await axios({
    method: "get",
    url: "https://api.github.com/repos/Pana-Mafia/Astar-Hackathon/commits",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + at,
    },
  });
  return response;
};

export const fetchSpecificCommits = async (at, sha) => {
  const response = await axios({
    method: "get",
    url:
      "https://api.github.com/repos/Pana-Mafia/Astar-Hackathon/commits?per_page=100&sha=" +
      sha,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + at,
    },
  });
  return response;
};

export const fetchPanaMafiaRepos = async (at) => {
  const response = await axios({
    method: "get",
    url: "https://api.github.com/orgs/Pana-Mafia/repos",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + at,
    },
  });
  return response;
};
