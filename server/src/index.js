const { server } = require('./utils/socket');
const PORT = process.env.PORT || 5000;

const main = () => server.listen(PORT, () => console.log(`listening port ${PORT} `));

main();