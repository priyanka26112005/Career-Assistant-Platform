const { analyzeEmail } = require('./services/llmService');
const {
  analyzeEmail: analyzeController,
  getHistory: getHistoryController,
  getAnalysisById: getAnalysisByIdController,
  deleteAnalysis: deleteController
} = require('./controllers/emailController');

// Mock req and res objects for testing Express controller functions directly
const createMockReqRes = (body = {}, params = {}) => {
  const req = { body, params };
  let statusCode = 200;
  let responseData = null;

  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
  };

  return { req, res, getResult: () => ({ statusCode, responseData }) };
};

async function runTests() {
  console.log('--------------------------------------------------');
  console.log('🧪 Starting Automated Backend & LLM Service Tests');
  console.log('--------------------------------------------------');

  // Test 1: Direct LLM Service Call
  console.log('\n[Test 1] Testing llmService.analyzeEmail...');
  const sampleSubject = 'Interview Confirmation';
  const sampleBody = `Dear Priyanka,\n\nYour technical interview has been scheduled for Tuesday at 11 AM.\n\nPlease bring your updated resume.\n\nRegards,\nHR Team`;

  const serviceResult = await analyzeEmail(sampleSubject, sampleBody);
  console.log('✅ LLM Service Result:', JSON.stringify(serviceResult, null, 2));

  if (!serviceResult.category || !Array.isArray(serviceResult.keywords) || !Array.isArray(serviceResult.action_items)) {
    throw new Error('Test 1 Failed: LLM Service structure invalid');
  }

  // Test 2: Controller POST /api/email/analyze
  console.log('\n[Test 2] Testing analyzeEmail Controller Handler...');
  const { req: req2, res: res2, getResult: getResult2 } = createMockReqRes({
    subject: sampleSubject,
    body: sampleBody,
  });

  await analyzeController(req2, res2);
  const result2 = getResult2();
  console.log(`✅ Status: ${result2.statusCode}`);
  console.log('✅ Response:', JSON.stringify(result2.responseData, null, 2));

  if (result2.statusCode !== 200 || !result2.responseData.success) {
    throw new Error('Test 2 Failed: Controller failed to analyze email');
  }

  const createdId = result2.responseData.data._id;

  // Test 3: Input Validation Error (Empty Body)
  console.log('\n[Test 3] Testing 400 Validation Error on empty body...');
  const { req: req3, res: res3, getResult: getResult3 } = createMockReqRes({
    subject: 'Invalid Test',
    body: '',
  });

  await analyzeController(req3, res3);
  const result3 = getResult3();
  console.log(`✅ Status: ${result3.statusCode} (Expected 400)`);
  console.log('✅ Error Message:', result3.responseData.message);

  if (result3.statusCode !== 400 || result3.responseData.success !== false) {
    throw new Error('Test 3 Failed: Validation error not returned properly');
  }

  // Test 4: History Retrieval GET /api/email/history
  console.log('\n[Test 4] Testing getHistory Controller...');
  const { req: req4, res: res4, getResult: getResult4 } = createMockReqRes();
  await getHistoryController(req4, res4);
  const result4 = getResult4();
  console.log(`✅ Status: ${result4.statusCode}, Count: ${result4.responseData.count}`);

  if (result4.statusCode !== 200 || !Array.isArray(result4.responseData.data)) {
    throw new Error('Test 4 Failed: History failed');
  }

  // Test 5: Get Analysis By ID
  console.log('\n[Test 5] Testing getAnalysisById Controller...');
  const { req: req5, res: res5, getResult: getResult5 } = createMockReqRes({}, { id: createdId });
  await getAnalysisByIdController(req5, res5);
  const result5 = getResult5();
  console.log(`✅ Status: ${result5.statusCode}, Subject: ${result5.responseData.data.subject}`);

  // Test 6: Delete Analysis By ID
  console.log('\n[Test 6] Testing deleteAnalysis Controller...');
  const { req: req6, res: res6, getResult: getResult6 } = createMockReqRes({}, { id: createdId });
  await deleteController(req6, res6);
  const result6 = getResult6();
  console.log(`✅ Status: ${result6.statusCode}, Message: ${result6.responseData.message}`);

  console.log('\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
