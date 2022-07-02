import axios from "axios";

const accessToken = "";

export const fetchBranches = async () => {
  const response = await axios({
    method: "get",
    url: "https://api.github.com/repos/Pana-Mafia/Astar-Hackathon/branches",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + accessToken,
    },
  });
  console.log(response);
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
  console.log(response);
  return response;
};

export const fetchSpecificCommits = async () => {
  const response = await axios({
    method: "get",
    url: "https://api.github.com/repos/Pana-Mafia/Astar-Hackathon/commits",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "token " + accessToken,
    },
  });
  console.log(response);
  return response;
};
