import { loadArguments } from '../utils/cli-loader';

fixture `Testing suite functionality`
    .page('https://google.com')
    .before(async () => {
        loadArguments();
    });

test('Test under suite - should create suite item', async() => {
    console.log('This test should be under a suite when --rsuite parameter is provided');
    console.log('Suite should be created at launch start');
})

test('Suite status tracking - passing test', async() => {
    console.log('Passing tests should not change suite status to failed');
})
