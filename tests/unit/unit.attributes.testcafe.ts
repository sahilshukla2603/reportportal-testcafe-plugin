import { loadArguments } from '../utils/cli-loader';

fixture `Testing attributes functionality`
    .page('https://google.com')
    .before(async () => {
        loadArguments();
    });

test('Test with attributes - should pass attributes to launch', async() => {
    console.log('Testing that attributes are properly parsed and sent to Report Portal');
    console.log('Attributes should be sent when launch finishes');
    console.log('Expected attributes: environment:test, type:unit');
})

test('Verify attributes are system:false', async() => {
    console.log('All attributes should have system property set to false');
})
