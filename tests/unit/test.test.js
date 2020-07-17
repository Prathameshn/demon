import { Db } from "../../src/config/dbconfig";
//console.log(Db);
//const Db = require('../src/config/dbconfig');
describe('Db test', async ()=>{
    it('First test', async()=>{
        let conn = await Db.getTestCollObj();
        console.log(conn);
        
        expect(conn).toBe(1);
    })
})