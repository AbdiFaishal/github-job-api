const axios = require('axios');

// https://jobs.github.com/positions.json

exports.getAllJobs = async (req, res) => {
  try {
    let url = 'https://jobs.github.com/positions.json';

    const { data } = await axios.get(url);

    res.send({ totalJobs: data.length, data });
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    let query = req.query;
    let url = 'https://jobs.github.com/positions.json?';

    for (let props in query) {
      url += `${props}=${query[props]}&`;
    }

    if (url[url.length - 1] === '&') {
      url = url.slice(0, url.length - 1);
    }

    console.log('url: ', url);

    const { data } = await axios.get(url);

    res.send({
      totalJobs: data.length,
      data,
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.detailJob = async (req, res) => {
  try {
    const { id } = req.params;

    let url = '';

    if (id) {
      url = `https://jobs.github.com/positions/${id}.json`;
    }

    const { data } = await axios.get(url);

    res.send(data);
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};
