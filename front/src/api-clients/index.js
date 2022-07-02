import axios from "axios";

// const accessToken = "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";
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
