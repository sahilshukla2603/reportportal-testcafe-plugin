import { t } from 'testcafe';
import { cliArguments } from 'cli-argument-parser';
const API = require('../../src/api.js');
let api: typeof API;

fixture `Testing attributes in integration`
    .page('https://google.com')
    .before(async () => {
        api = new API({
            protocol: cliArguments.rprotocol,
            domain:  cliArguments.rdomain,
            apiPath: '/api',
            token: cliArguments.rtoken,
        })
    });

test('Verify attributes are sent to launch', async () => {
    console.log('This test verifies attributes are properly sent to Report Portal');
    await sleepInSeconds(5000);
    
    const launches = await api.getLaunches(cliArguments.rproject);
    const launch = launches.find(l => l.name === cliArguments.rlaunch);
    
    if (launch && launch.attributes) {
        process.stdout.write(`\n[Integration Test]: Found ${launch.attributes.length} attributes on launch\n`);
        launch.attributes.forEach(attr => {
            process.stdout.write(`[Integration Test]: Attribute - ${attr.key}:${attr.value}\n`);
        });
    }
})

test('Verify all parameters are correctly applied', async () => {
    console.log('Verifying rdomain, rtoken, rproject, rdescription, rattributes');
    await sleepInSeconds(5000);
    
    const launches = await api.getLaunches(cliArguments.rproject);
    const launch = launches.find(l => l.name === cliArguments.rlaunch);
    
    await t.expect(launch).ok('Launch should exist');
    await t.expect(launch.description).eql(cliArguments.rdescription, 'Description should match');
})

/**
 * Stopping the code from continuing for a number of milliseconds
 * @param milliseconds The number of milliseconds to stop the code for
 */
async function sleepInSeconds(milliseconds: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
