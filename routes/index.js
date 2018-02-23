const { getBaseDomain } = require('../getBaseDomain');

const search = async (req, res) => {
  const result = await getBaseDomain(req.params.domain);
  res.status(200).json({ publicSlug: result });
};


module.exports = (server) => {
  server.get('/consulta/:domain', search);
};
