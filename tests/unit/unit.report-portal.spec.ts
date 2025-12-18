import { expect } from 'chai';
import { cliArguments } from 'cli-argument-parser';

describe('ReportPortal Class Unit Tests', () => {
    let ReportPortal: any;
    
    beforeEach(() => {
        // Clear cache to get fresh module
        delete require.cache[require.resolve('../../src/report-portal.js')];
    });

    describe('Constructor validation', () => {
        it('Should throw error when rdomain is missing', () => {
            const originalRdomain = cliArguments.rdomain;
            delete cliArguments.rdomain;
            
            ReportPortal = require('../../src/report-portal.js');
            
            expect(() => new ReportPortal()).to.throw('Missing argument --rdomain');
            
            cliArguments.rdomain = originalRdomain;
        });

        it('Should throw error when rtoken is missing', () => {
            const originalRtoken = cliArguments.rtoken;
            delete cliArguments.rtoken;
            
            ReportPortal = require('../../src/report-portal.js');
            
            expect(() => new ReportPortal()).to.throw('Missing argument --rtoken');
            
            cliArguments.rtoken = originalRtoken;
        });

        it('Should throw error when rlaunch and rlaunch-id are missing', () => {
            const originalRlaunch = cliArguments.rlaunch;
            const originalRlaunchId = cliArguments['rlaunch-id'];
            delete cliArguments.rlaunch;
            delete cliArguments['rlaunch-id'];
            
            ReportPortal = require('../../src/report-portal.js');
            
            expect(() => new ReportPortal()).to.throw('Missing argument --rlaunch/--rlaunch-id');
            
            cliArguments.rlaunch = originalRlaunch;
            cliArguments['rlaunch-id'] = originalRlaunchId;
        });

        it('Should throw error when rproject is missing', () => {
            const originalRproject = cliArguments.rproject;
            delete cliArguments.rproject;
            
            ReportPortal = require('../../src/report-portal.js');
            
            expect(() => new ReportPortal()).to.throw('Missing argument --rproject');
            
            cliArguments.rproject = originalRproject;
        });

        it('Should throw error when rdescription is missing', () => {
            const originalRdescription = cliArguments.rdescription;
            delete cliArguments.rdescription;
            
            ReportPortal = require('../../src/report-portal.js');
            
            expect(() => new ReportPortal()).to.throw('Missing argument --rdescription');
            
            cliArguments.rdescription = originalRdescription;
        });
    });

    describe('Attributes parsing', () => {
        it('Should parse single attribute correctly', () => {
            cliArguments.rattributes = 'key:value';
            ReportPortal = require('../../src/report-portal.js');
            
            const rp = new ReportPortal();
            expect(rp.attributesList).to.have.lengthOf(1);
            expect(rp.attributesList[0]).to.deep.equal({ key: 'key', value: 'value', system: false });
        });

        it('Should parse multiple attributes correctly', () => {
            cliArguments.rattributes = 'env:test|type:unit|browser:chrome';
            ReportPortal = require('../../src/report-portal.js');
            
            const rp = new ReportPortal();
            expect(rp.attributesList).to.have.lengthOf(3);
            expect(rp.attributesList[0]).to.deep.equal({ key: 'env', value: 'test', system: false });
            expect(rp.attributesList[1]).to.deep.equal({ key: 'type', value: 'unit', system: false });
            expect(rp.attributesList[2]).to.deep.equal({ key: 'browser', value: 'chrome', system: false });
        });

        it('Should handle empty attributes string', () => {
            cliArguments.rattributes = '';
            ReportPortal = require('../../src/report-portal.js');
            
            const rp = new ReportPortal();
            expect(rp.attributesList).to.have.lengthOf(0);
        });

        it('Should handle whitespace-only attributes string', () => {
            cliArguments.rattributes = '   ';
            ReportPortal = require('../../src/report-portal.js');
            
            const rp = new ReportPortal();
            expect(rp.attributesList).to.have.lengthOf(0);
        });

        it('Should handle undefined attributes', () => {
            delete cliArguments.rattributes;
            ReportPortal = require('../../src/report-portal.js');
            
            const rp = new ReportPortal();
            expect(rp.attributesList).to.have.lengthOf(0);
        });
    });

    describe('Suite configuration', () => {
        it('Should initialize suite when rsuite is provided', () => {
            cliArguments.rsuite = 'MySuite';
            ReportPortal = require('../../src/report-portal.js');
            
            const rp = new ReportPortal();
            expect(rp.suiteName).to.equal('MySuite');
            expect(rp.suiteStatus).to.equal('passed');
        });

        it('Should not initialize suite when rsuite is not provided', () => {
            delete cliArguments.rsuite;
            ReportPortal = require('../../src/report-portal.js');
            
            const rp = new ReportPortal();
            expect(rp.suiteName).to.be.undefined;
            expect(rp.suiteStatus).to.be.undefined;
        });
    });

    describe('Protocol configuration', () => {
        it('Should use provided protocol', () => {
            cliArguments.rprotocol = 'http';
            ReportPortal = require('../../src/report-portal.js');
            
            const rp = new ReportPortal();
            expect(rp.client.baseURL).to.include('http://');
        });

        it('Should default to https when protocol not provided', () => {
            delete cliArguments.rprotocol;
            ReportPortal = require('../../src/report-portal.js');
            
            const rp = new ReportPortal();
            expect(rp.client.baseURL).to.include('https://');
        });
    });

    describe('Live reporting configuration', () => {
        it('Should enable live reporting by default', () => {
            // Ensure the flag is not in process.argv
            const originalArgv = process.argv;
            process.argv = process.argv.filter(arg => arg !== '--disable-live-reporting');
            
            ReportPortal = require('../../src/report-portal.js');
            const rp = new ReportPortal();
            
            expect(rp.liveReporting).to.be.true;
            
            process.argv = originalArgv;
        });

        it('Should disable live reporting when flag is present', () => {
            const originalArgv = process.argv;
            if (!process.argv.includes('--disable-live-reporting')) {
                process.argv.push('--disable-live-reporting');
            }
            
            // Need to reload module to pick up new process.argv
            delete require.cache[require.resolve('../../src/report-portal.js')];
            ReportPortal = require('../../src/report-portal.js');
            const rp = new ReportPortal();
            
            expect(rp.liveReporting).to.be.false;
            
            process.argv = originalArgv;
        });
    });

    describe('Debug logs configuration', () => {
        it('Should disable debug logs by default', () => {
            const originalArgv = process.argv;
            process.argv = process.argv.filter(arg => arg !== '--display-debug-logs');
            
            ReportPortal = require('../../src/report-portal.js');
            const rp = new ReportPortal();
            
            expect(rp.displayDebugLogs).to.be.false;
            
            process.argv = originalArgv;
        });

        it('Should enable debug logs when flag is present', () => {
            const originalArgv = process.argv;
            if (!process.argv.includes('--display-debug-logs')) {
                process.argv.push('--display-debug-logs');
            }
            
            delete require.cache[require.resolve('../../src/report-portal.js')];
            ReportPortal = require('../../src/report-portal.js');
            const rp = new ReportPortal();
            
            expect(rp.displayDebugLogs).to.be.true;
            
            process.argv = originalArgv;
        });
    });
});
