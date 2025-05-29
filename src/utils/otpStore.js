const otpStore = new Map();

const setOTP = (email, data) => {
  otpStore.set(email, {
    ...data
  });
};

const getOTP = (email) => otpStore.get(email);

const deleteOTP = (email) => otpStore.delete(email);

module.exports = { getOTP, deleteOTP, setOTP };

