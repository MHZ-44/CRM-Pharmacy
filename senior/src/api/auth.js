export const login = async (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === "test@test.com" && data.password === "123456") {
        resolve({
          token: "fake-jwt-token",
          user: {
            name: "Test User",
            email: data.email,
          },
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
};