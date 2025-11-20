import usersData from '../data/users.json';

let users = usersData.slice();

export const getUsers = async () => {
  await new Promise(r => setTimeout(r, 80));
  return users;
};

export const getUserById = async (id) => {
  await new Promise(r => setTimeout(r, 80));
  return users.find(u => u.id === Number(id));
};

export const createUser = async (user) => {
  await new Promise(r => setTimeout(r, 200));
  const newUser = { ...user, id: users.length ? Math.max(...users.map(u=>u.id))+1 : 1 };
  users.push(newUser);
  return newUser;
};

export const filterUsers = async ({ role, committee, q }) => {
  await new Promise(r => setTimeout(r, 80));
  return users.filter(u => {
    if (role && u.role !== role) return false;
    if (committee && u.committee !== committee) return false;
    if (q && !(u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });
};
