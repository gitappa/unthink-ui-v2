import server from "./server";
import pkg from "./package";
require("dotenv").config();
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
	console.log(`${pkg.name}: listening on port ${PORT}`);
});
