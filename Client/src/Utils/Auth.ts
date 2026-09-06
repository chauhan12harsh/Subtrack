export const getToken = () => {
  return localStorage.getItem("accessToken");
};

export const isAuthenticated = () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const expiry = payload.exp;

    const currentTime = Math.floor(Date.now() / 1000);

    return expiry > currentTime;
  } catch {
    return false;
  }
};