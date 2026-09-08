// CertiUni API Test Script
const http = require('http');
const BASE_URL = 'http://localhost:3000/api/v1';
let authToken = '';
let testResults = { passed: 0, failed: 0, errors: [] };

function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
                catch (e) { resolve({ status: res.statusCode, data: body }); }
            });
        });
        req.on('error', (err) => reject(err));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function test(name, method, path, data = null, token = null, expectedStatus = 200) {
    try {
        const result = await makeRequest(method, path, data, token);
        const passed = result.status === expectedStatus || (expectedStatus === 0 && result.status >= 200 && result.status < 500);
        if (passed) {
            testResults.passed++;
            console.log(`✅ PASS: ${name} (${result.status})`);
        } else {
            testResults.failed++;
            testResults.errors.push(`${name}: Expected ${expectedStatus}, got ${result.status}`);
            console.log(`❌ FAIL: ${name} - Expected ${expectedStatus}, got ${result.status}`);
            console.log(`   Response:`, JSON.stringify(result.data).substring(0, 200));
        }
        return result;
    } catch (err) {
        testResults.failed++;
        testResults.errors.push(`${name}: ${err.message}`);
        console.log(`❌ ERROR: ${name} - ${err.message}`);
        return null;
    }
}
async function runTests() {
    console.log('\n🚀 Starting CertiUni API Tests...\n');
    console.log('='.repeat(60));
    const uniqueId = Date.now();

    // HEALTH CHECK
    console.log('\n📋 HEALTH CHECK');
    await test('Health Check', 'GET', '/health');

    // AUTH MODULE
    console.log('\n📋 AUTH MODULE');
    const registerResult = await test('Register User', 'POST', '/auth/register', {
        email: `test${uniqueId}@example.com`, password: 'TestPassword123!', firstName: 'Test', lastName: 'User', role: 'SUPER_ADMIN'
    });

    const loginResult = await test('Login', 'POST', '/auth/login', {
        email: `test${uniqueId}@example.com`, password: 'TestPassword123!'
    });

    if (loginResult?.data?.accessToken) {
        authToken = loginResult.data.accessToken;
        console.log(`   🔑 Token obtained: ${authToken.substring(0, 30)}...`);
    }

    await test('Get Profile', 'GET', '/auth/profile', null, authToken);

    // UNIVERSITIES
    console.log('\n📋 UNIVERSITIES MODULE');
    const uniResult = await test('Create University', 'POST', '/universities', {
        name: `Test University ${uniqueId}`, code: `TU${uniqueId}`, contactEmail: 'contact@test.com', address: '123 Test St'
    }, authToken);
    let universityId = uniResult?.data?.id;
    await test('Get All Universities', 'GET', '/universities', null, authToken);
    if (universityId) await test('Get University by ID', 'GET', `/universities/${universityId}`, null, authToken);

    // USERS
    console.log('\n📋 USERS MODULE');
    await test('Get All Users', 'GET', '/users', null, authToken);

    // STUDENTS
    console.log('\n📋 STUDENTS MODULE');
    const studentResult = await test('Create Student', 'POST', '/students', {
        userId: registerResult?.data?.id || 'test-user-id', matricule: `MAT${uniqueId}`, birthDate: '2000-01-01', birthPlace: 'Test City', nationality: 'Cameroonian', gender: 'MALE'
    }, authToken);
    let studentId = studentResult?.data?.id;
    await test('Get All Students', 'GET', '/students', null, authToken);
    if (studentId) await test('Get Student by ID', 'GET', `/students/${studentId}`, null, authToken);

    // SERVICES
    console.log('\n📋 SERVICES MODULE');
    const serviceResult = await test('Create Service', 'POST', '/services', {
        name: `Test Service ${uniqueId}`, code: `SRV${uniqueId}`, description: 'Test service'
    }, authToken);
    let serviceId = serviceResult?.data?.id;
    await test('Get All Services', 'GET', '/services', null, authToken);

    // PROGRAMS
    console.log('\n📋 PROGRAMS MODULE');
    const programResult = await test('Create Program', 'POST', '/programs', {
        name: `Test Program ${uniqueId}`, code: `PRG${uniqueId}`, description: 'Test program', universityId: universityId || 'test-university-id'
    }, authToken);
    let programId = programResult?.data?.id;
    await test('Get All Programs', 'GET', '/programs', null, authToken);

    // CERTIFICATES
    console.log('\n📋 CERTIFICATES MODULE');
    const certResult = await test('Create Certificate', 'POST', '/certificates', {
        studentId: studentId || 'test-student-id', universityId: universityId || 'test-university-id', degreeTitle: 'Bachelor of Science', fieldOfStudy: 'Computer Science', grade: 'A', issueDate: new Date().toISOString()
    }, authToken);
    let certificateId = certResult?.data?.id;
    await test('Get All Certificates', 'GET', '/certificates', null, authToken);
    if (certificateId) await test('Get Certificate by ID', 'GET', `/certificates/${certificateId}`, null, authToken);

    // VERIFICATION
    console.log('\n📋 VERIFICATION MODULE');
    await test('Verify by Hash (not found)', 'POST', '/verify/hash', { hash: 'test-hash-123' }, null, 404);
    await test('Verify by QR (not found)', 'POST', '/verify/qr', { qrData: 'CERT-TEST-123' }, null, 404);

    // REQUESTS
    console.log('\n📋 REQUESTS MODULE');
    const requestResult = await test('Create Verification Request', 'POST', '/requests', {
        requesterName: 'John Doe', requesterEmail: 'john@example.com', documentHash: 'test-doc-hash', reason: 'Employment verification', universityId: universityId || 'test-university-id'
    }, null, 201);
    let requestId = requestResult?.data?.id;
    await test('Get All Requests', 'GET', '/requests', null, authToken);
    if (requestResult?.data?.trackingCode) await test('Get Request by Tracking Code', 'GET', `/requests/tracking/${requestResult.data.trackingCode}`);

    // PAYMENTS
    console.log('\n📋 PAYMENTS MODULE');
    await test('Get All Payments', 'GET', '/payments', null, authToken);

    // TARIFFS
    console.log('\n📋 TARIFFS MODULE');
    const tariffResult = await test('Create Tariff', 'POST', '/tariffs', {
        name: `Test Tariff ${uniqueId}`, serviceId: serviceId || 'test-service-id', amount: 5000, currency: 'XAF'
    }, authToken);
    await test('Get All Tariffs', 'GET', '/tariffs', null, authToken);

    // ACADEMIC
    console.log('\n📋 ACADEMIC MODULE');
    await test('Get Academic Levels', 'GET', '/academic-levels', null, authToken);
    await test('Get Academic Years', 'GET', '/academic-years', null, authToken);

    // DOCUMENT TYPES
    console.log('\n📋 DOCUMENT TYPES MODULE');
    await test('Get Document Types', 'GET', '/document-types', null, authToken);

    // ENROLLMENTS
    console.log('\n📋 ENROLLMENTS MODULE');
    await test('Get All Enrollments', 'GET', '/enrollments', null, authToken);

    // TEMPLATES
    console.log('\n📋 TEMPLATES MODULE');
    await test('Get All Templates', 'GET', '/templates', null, authToken);

    // ORGANIZATION
    console.log('\n📋 ORGANIZATION MODULE');
    await test('Get All Organizations', 'GET', '/organization', null, authToken);

    // AUDIT
    console.log('\n📋 AUDIT MODULE');
    await test('Get Audit Logs', 'GET', '/audit', null, authToken);

    // NOTIFICATIONS
    console.log('\n📋 NOTIFICATIONS MODULE');
    await test('Get Notifications', 'GET', '/notifications', null, authToken);

    // FILES
    console.log('\n📋 FILES MODULE');
    await test('Get All Files', 'GET', '/files', null, authToken);

    // ACCESS
    console.log('\n📋 ACCESS MODULE');
    await test('Get Access Logs', 'GET', '/access', null, authToken);

    // ROLES & PERMISSIONS
    console.log('\n📋 ROLES & PERMISSIONS MODULE');
    await test('Get Roles', 'GET', '/roles', null, authToken);
    await test('Get Permissions', 'GET', '/permissions', null, authToken);

    // UNIVERSITY USERS
    console.log('\n📋 UNIVERSITY USERS MODULE');
    await test('Get University Users', 'GET', '/university-users', null, authToken);

    // BATCH
    console.log('\n📋 BATCH MODULE');
    await test('Get Batch Status', 'GET', '/batch/status', null, authToken);

    // UPLOADS
    console.log('\n📋 UPLOADS MODULE');
    await test('Get Upload Config', 'GET', '/uploads/config', null, authToken);

    // RESULTS
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 TEST RESULTS:');
    console.log(`   ✅ Passed: ${testResults.passed}`);
    console.log(`   ❌ Failed: ${testResults.failed}`);
    console.log(`   📈 Total: ${testResults.passed + testResults.failed}`);
    if (testResults.errors.length > 0) {
        console.log('\n❌ ERRORS:');
        testResults.errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
    }
    const successRate = ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1);
    console.log(`\n🎯 Success Rate: ${successRate}%`);
    if (testResults.failed === 0) console.log('\n🎉 ALL TESTS PASSED! Backend is fully functional!');
    else console.log('\n⚠️  Some tests failed. Please review the errors above.');
    console.log('='.repeat(60) + '\n');
}

async function checkServer() {
    try {
        await makeRequest('GET', '/health');
        console.log('✅ Server is running at ' + BASE_URL);
        return true;
    } catch (err) {
        console.log('❌ Server is not running! Start with: npm run start');
        return false;
    }
}

async function main() {
    const serverRunning = await checkServer();
    if (serverRunning) await runTests();
    else process.exit(1);
}

main();
