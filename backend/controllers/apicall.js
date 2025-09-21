const handleAPICall = (req, res) => {
  const PAT = process.env.CLARIFY_API;
  const USER_ID = process.env.CLARIFY_USER_ID;
  const APP_ID = process.env.CLARIFY_APP_ID;
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = process.env.CLARIFY_MODEL_VERSION_ID;
  const IMAGE_URL = req.body.input;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Key ' + PAT,
    },
    body: raw,
  };

  fetch(
    'https://api.clarifai.com/v2/models/' +
      MODEL_ID +
      '/versions/' +
      MODEL_VERSION_ID +
      '/outputs',
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json('Unable API call'));
};

export default handleAPICall;
