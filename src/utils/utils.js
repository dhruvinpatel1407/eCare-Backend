// validationUtils.js
const mobileNumberValidator = (number) => {
  return /^([6-9]{1}[0-9]{9})$/.test(number);
};

const emailValidator = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const passwordValidator = (password) => { 
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);
}

const dateValidator = (dateString) => {
  return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dateString);
};

const timeValidator = (timeString) => {
  return /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])\s(AM|PM)$/i.test(timeString);
};

const emptyFieldValidator = (value) => {
  return value !== undefined && value !== null && value !== '';
};

const formattedDateValidator = (dateString) => {
  return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} (\d{1,2}):(\d{2})\s(AM|PM)$/i.test(dateString);
};

const zipCodeValidator = (zipCode) => {
  return /^\d{6}$/.test(zipCode);
};

const imageTypeValidator = (type) => {
  const allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];
  return allowedTypes.includes(type.toLowerCase());
};

const imageSizeValidator = (buffer, maxSizeMB) => {
  // Convert MB to bytes
  const maxSize = maxSizeMB * 1024 * 1024;
  return buffer ? buffer.length <= maxSize : true;
};

module.exports = {
  mobileNumberValidator,
  emailValidator,
  passwordValidator,
  dateValidator,
  timeValidator,
  emptyFieldValidator,
  formattedDateValidator,
  zipCodeValidator,
  imageTypeValidator,
  imageSizeValidator,
};
