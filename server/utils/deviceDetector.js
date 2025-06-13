// utils/deviceDetector.js
const useragent = require('useragent');

module.exports = (ua) => {
  const agent = useragent.parse(ua);
  const os = agent.os.toString().toLowerCase();

  if (/mobile/.test(os)) return 'mobile';
  if (/tablet/.test(os)) return 'tablet';
  return 'desktop';
};
