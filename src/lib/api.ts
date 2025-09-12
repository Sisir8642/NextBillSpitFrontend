import axios from "./axios"; 

export const fetchGroups = async () => {
  const res = await axios.get("/groups/");
  return res.data;
};

export const fetchGroupDetail = async (groupId: string) => {
  const res = await axios.get(`/groups/${groupId}/`);
  return res.data;
};

export const fetchExpenses = async (groupId: string) => {
  const res = await axios.get(`/groups/${groupId}/expenses/`);
  return res.data;
};

export const fetchActivityLog = async (groupId: string) => {
  const res = await axios.get(`/groups/${groupId}/activity/`);
  return res.data;
};
