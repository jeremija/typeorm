import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src/connection/Connection";
import {expect} from "chai";

describe("github issues > 2737 mariadb driver wants to recreate create/update date columns CURRENT_TIMESTAMP(6) === current_timestamp(6)", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        // logging: true,
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mariadb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not want to execute migrations twice", () => Promise.all(connections.map(async connection => {
        const sql1 = await connection.driver.createSchemaBuilder().log();
        expect(sql1.upQueries).to.eql([]);
    })));

});
