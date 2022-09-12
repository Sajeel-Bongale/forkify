import { TIMEOUT_IN_SECONDS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      }) :
      fetch(url);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_IN_SECONDS)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (e) {
    throw e;
  }
};
