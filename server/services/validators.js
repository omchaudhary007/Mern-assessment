export const passwordValidator = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
  return regex.test(password);
};

export const emailValidator = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const mobileValidator = (mobile) => {
  const mobilePattern = /^\d{10}$/;
  return mobilePattern.test(mobile);
};