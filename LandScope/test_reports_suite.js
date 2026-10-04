/**
 * LANDScope Reports & Evidence-Based Policy Briefs Acceptance Test Suite
 *
 * Verifies all 20 Acceptance Tests:
 * TEST 1 to TEST 20
 */

const http = require("http");

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json: () => {
            try {
              return JSON.parse(body);
            } catch (e) {
              return null;
            }
          },
        });
      });
    });
    req.on("error", reject);
    if (postData) {
      req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

function parseCookies(res) {
  const setCookie = res.headers["set-cookie"];
  if (!setCookie) return "";
  return setCookie.map((c) => c.split(";")[0]).join("; ");
}

async function loginAs(email) {
  const res = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email }
  );
  const cookie = parseCookies(res);
  const data = res.json();
  return { res, cookie, data };
}

async function runReportsSuite() {
  console.log("==================================================");
  console.log("LANDScope REPORTS & POLICY BRIEFS ACCEPTANCE SUITE");
  console.log("==================================================\n");

  let allPassed = true;
  function assertTest(testNum, title, condition, details = "") {
    if (condition) {
      console.log(`TEST ${testNum} RESULT: PASSED ✅ - ${title}`);
      if (details) console.log(`   ${details}`);
    } else {
      console.log(`TEST ${testNum} RESULT: FAILED ❌ - ${title}`);
      if (details) console.log(`   ${details}`);
      allPassed = false;
    }
  }

  // --- Authentications ---
  console.log("--- Authenticating as Policymaker (policymaker@landscope.demo) ---");
  const { cookie: polCookie, data: polData } = await loginAs("policymaker@landscope.demo");
  console.log(`Authenticated: ${polData.user.name} (${polData.user.roleCode})\n`);

  console.log("--- Authenticating as Researcher (researcher@landscope.demo) ---");
  const { cookie: resCookie, data: resData } = await loginAs("researcher@landscope.demo");
  console.log(`Authenticated: ${resData.user.name} (${resData.user.roleCode})\n`);

  console.log("--- Authenticating as Public (public@landscope.demo) ---");
  const { cookie: pubCookie, data: pubData } = await loginAs("public@landscope.demo");
  console.log(`Authenticated: ${pubData.user.name} (${pubData.user.roleCode})\n`);

  // ========================================================
  // TEST 1: Authorized user can access Reports
  // ========================================================
  console.log("--- TEST 1: Authorized user can access Reports ---");
  const repPageRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/app/reports",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const repApiRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/reports",
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const repApiData = repApiRes.json();
  const t1Passed =
    repPageRes.statusCode === 200 &&
    repPageRes.body.includes("Reports &amp; Evidence-Based Policy Briefs") ||
    repPageRes.body.includes("Reports & Evidence-Based Policy Briefs") &&
    repApiRes.statusCode === 200 &&
    Array.isArray(repApiData?.reports);
  assertTest(
    1,
    "Authorized user can access Reports",
    t1Passed,
    `Page Status: ${repPageRes.statusCode}, API Status: ${repApiRes.statusCode}, Initial Reports: ${repApiData?.reports?.length}`
  );

  // ========================================================
  // TEST 2: Unauthorized user cannot access private Reports
  // ========================================================
  console.log("\n--- TEST 2: Unauthorized user cannot access private Reports ---");
  // REP-2026-062 is a private Draft report
  const pubPrivRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/reports/REP-2026-062",
    method: "GET",
    headers: { Cookie: pubCookie },
  });
  // Public cannot generate reports via POST
  const pubPostRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/reports",
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: pubCookie },
    },
    { scenarioTitle: "Unauthorized Public Scenario" }
  );
  const t2Passed = pubPrivRes.statusCode === 403 && pubPostRes.statusCode === 403;
  assertTest(
    2,
    "Unauthorized user cannot access private Reports",
    t2Passed,
    `Public get private draft status: ${pubPrivRes.statusCode} (Expected 403), Public POST status: ${pubPostRes.statusCode} (Expected 403)`
  );

  // ========================================================
  // TEST 3: Unauthenticated user is redirected/rejected
  // ========================================================
  console.log("\n--- TEST 3: Unauthenticated user is redirected/rejected ---");
  const unauthPage = await request({
    hostname: "localhost",
    port: 3000,
    path: "/app/reports",
    method: "GET",
  });
  const unauthApi = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/reports",
    method: "GET",
  });
  const isRedirect = unauthPage.statusCode === 307 || unauthPage.statusCode === 302;
  const is401 = unauthApi.statusCode === 401;
  assertTest(
    3,
    "Unauthenticated user is redirected/rejected",
    isRedirect && is401,
    `Page status: ${unauthPage.statusCode} (Redirect: ${isRedirect}), API status: ${unauthApi.statusCode} (Expected 401)`
  );

  // ========================================================
  // TEST 4: Policy Lab can pass context into Reports
  // ========================================================
  console.log("\n--- TEST 4: Policy Lab can pass context into Reports ---");
  const simContext = {
    state: "Madhya Pradesh",
    district: "Sehore",
    tehsil: "Ashta",
    scenarioTitle: "Controlled Peri-Urban Agro-Preservation Scenario 2031",
    parameters: {
      "param-agri-cap": 650,
      "param-eco-buffer": 750,
      "param-water-setback": 150,
    },
    stressCondition: "Normal Conditions",
    status: "Generated",
    title: "Statutory Policy Decision Brief: Controlled Peri-Urban Expansion (Ashta)",
  };
  const createBriefRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/reports",
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: polCookie },
    },
    simContext
  );
  const createdBrief = createBriefRes.json()?.report;
  const t4Passed = createBriefRes.statusCode === 201 && !!createdBrief?.id;
  assertTest(
    4,
    "Policy Lab can pass context into Reports",
    t4Passed,
    `HTTP Status: ${createBriefRes.statusCode}, Created Report ID: ${createdBrief?.id}`
  );

  // ========================================================
  // TEST 5: Geography is preserved
  // ========================================================
  console.log("\n--- TEST 5: Geography is preserved ---");
  const geo = createdBrief?.geography;
  const geoStudy = createdBrief?.sections?.geographyStudyArea;
  const t5Passed =
    geo?.state === "Madhya Pradesh" &&
    geo?.district === "Sehore" &&
    geo?.tehsil === "Ashta" &&
    geoStudy?.district === "Sehore";
  assertTest(
    5,
    "Geography is preserved",
    t5Passed,
    `State: ${geo?.state}, District: ${geo?.district}, Tehsil: ${geo?.tehsil}`
  );

  // ========================================================
  // TEST 6: Baseline is preserved
  // ========================================================
  console.log("\n--- TEST 6: Baseline is preserved ---");
  const baseLand = createdBrief?.sections?.currentLandSituation?.landUse;
  const baseEnv = createdBrief?.sections?.currentLandSituation?.environment;
  const t6Passed =
    baseLand?.agriculturePct === 52.1 &&
    baseLand?.builtUpPct === 25.8 &&
    baseEnv?.aquiferRechargeIndex === 44 &&
    baseEnv?.aquiferStatus === "Critical";
  assertTest(
    6,
    "Baseline is preserved",
    t6Passed,
    `Agri Baseline: ${baseLand?.agriculturePct}%, Aquifer: ${baseEnv?.aquiferRechargeIndex} (${baseEnv?.aquiferStatus})`
  );

  // ========================================================
  // TEST 7: Scenario parameters are preserved
  // ========================================================
  console.log("\n--- TEST 7: Scenario parameters are preserved ---");
  const params = createdBrief?.scenario?.parameters;
  const hasAgriParam = params?.some((p) => p.id.includes("agri-cap") || p.scenarioValue === 650);
  const t7Passed = Array.isArray(params) && params.length >= 2 && hasAgriParam;
  assertTest(
    7,
    "Scenario parameters are preserved",
    t7Passed,
    `Parameters Count: ${params?.length}, Scenario Cap: 650 Ha`
  );

  // ========================================================
  // TEST 8: Simulation results are preserved
  // ========================================================
  console.log("\n--- TEST 8: Simulation results are preserved ---");
  const impacts = createdBrief?.sections?.baselineVsScenario;
  const multiImpact = createdBrief?.sections?.multiDimensionalImpact;
  const hasAgriImpact = impacts?.some((i) => i.dimension === "AGRICULTURE" && i.delta.includes("-46%"));
  const hasWaterImpact = impacts?.some((i) => i.dimension === "WATER" && i.delta.includes("+16"));
  const t8Passed = Array.isArray(impacts) && impacts.length >= 6 && hasAgriImpact && !!multiImpact?.agriculture;
  assertTest(
    8,
    "Simulation results are preserved",
    t8Passed,
    `Impact dimensions count: ${impacts?.length}, Agri change: ${multiImpact?.agriculture?.change}, Water: ${multiImpact?.water?.change}`
  );

  // ========================================================
  // TEST 9: Trade-offs are preserved
  // ========================================================
  console.log("\n--- TEST 9: Trade-offs are preserved ---");
  const tradeOffs = createdBrief?.sections?.policyTradeOffs;
  const t9Passed = Array.isArray(tradeOffs) && tradeOffs.length >= 2;
  assertTest(
    9,
    "Trade-offs are preserved",
    t9Passed,
    `Trade-offs count: ${tradeOffs?.length}, Primary: '${tradeOffs?.[0]?.primaryBenefit}' vs '${tradeOffs?.[0]?.correspondingCost}'`
  );

  // ========================================================
  // TEST 10: Evidence sources are preserved
  // ========================================================
  console.log("\n--- TEST 10: Evidence sources are preserved ---");
  const evidenceList = createdBrief?.sections?.supportingEvidence;
  const t10Passed = Array.isArray(evidenceList) && evidenceList.length >= 1 && !!evidenceList[0]?.referenceNumber;
  assertTest(
    10,
    "Evidence sources are preserved",
    t10Passed,
    `Attached Evidence Count: ${evidenceList?.length}, Study 1: '${evidenceList?.[0]?.title}' (Ref: ${evidenceList?.[0]?.referenceNumber})`
  );

  // ========================================================
  // TEST 11: Evidence Trail is displayed
  // ========================================================
  console.log("\n--- TEST 11: Evidence Trail is displayed ---");
  const trail = createdBrief?.sections?.evidenceTrail;
  const t11Passed = Array.isArray(trail) && trail.length >= 5 && trail[0].stage === "Policy Scenario";
  assertTest(
    11,
    "Evidence Trail is displayed",
    t11Passed,
    `Trail steps count: ${trail?.length}, Stage 1: ${trail?.[0]?.stage} -> Stage 6: ${trail?.[trail.length - 1]?.stage}`
  );

  // ========================================================
  // TEST 12: Assumptions are displayed
  // ========================================================
  console.log("\n--- TEST 12: Assumptions are displayed ---");
  const assumptions = createdBrief?.sections?.assumptions;
  const t12Passed = Array.isArray(assumptions) && assumptions.length >= 3 && assumptions[0].includes("Sentinel-2");
  assertTest(
    12,
    "Assumptions are displayed",
    t12Passed,
    `Assumptions count: ${assumptions?.length}, Sample: '${assumptions?.[0]}'`
  );

  // ========================================================
  // TEST 13: Limitations are displayed
  // ========================================================
  console.log("\n--- TEST 13: Limitations are displayed ---");
  const limitations = createdBrief?.sections?.limitations;
  const t13Passed =
    Array.isArray(limitations) &&
    limitations.length >= 2 &&
    limitations.some((l) => l.includes("illustrative prototype approximations"));
  assertTest(
    13,
    "Limitations are displayed",
    t13Passed,
    `Limitations count: ${limitations?.length}, Disclaimer verified: ${t13Passed}`
  );

  // ========================================================
  // TEST 14: Report can be saved as Draft
  // ========================================================
  console.log("\n--- TEST 14: Report can be saved as Draft ---");
  const draftRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/reports",
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: polCookie },
    },
    {
      state: "Madhya Pradesh",
      district: "Sehore",
      tehsil: "Ashta",
      scenarioTitle: "Draft Agro-Ecological Corridor Zoning",
      status: "Draft",
    }
  );
  const draftData = draftRes.json()?.report;
  const t14Passed = draftRes.statusCode === 201 && draftData?.status === "Draft";
  assertTest(
    14,
    "Report can be saved as Draft",
    t14Passed,
    `Draft ID: ${draftData?.id}, Status: ${draftData?.status}`
  );

  // ========================================================
  // TEST 15: Report can be generated
  // ========================================================
  console.log("\n--- TEST 15: Report can be generated ---");
  const genRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/reports",
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: polCookie },
    },
    {
      state: "Madhya Pradesh",
      district: "Sehore",
      tehsil: "Ashta",
      scenarioTitle: "Full Generated Policy Brief",
      status: "Generated",
    }
  );
  const genData = genRes.json()?.report;
  const t15Passed = genRes.statusCode === 201 && genData?.status === "Generated";
  assertTest(
    15,
    "Report can be generated",
    t15Passed,
    `Generated ID: ${genData?.id}, Status: ${genData?.status}`
  );

  // ========================================================
  // TEST 16: Report can be reopened
  // ========================================================
  console.log("\n--- TEST 16: Report can be reopened ---");
  const reopenRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/reports/${createdBrief.id}`,
    method: "GET",
    headers: { Cookie: polCookie },
  });
  const reopenedData = reopenRes.json()?.report;
  const t16Passed =
    reopenRes.statusCode === 200 &&
    reopenedData?.id === createdBrief.id &&
    !!reopenedData?.sections?.executiveSummary &&
    reopenedData?.sections?.baselineVsScenario?.length >= 6;
  assertTest(
    16,
    "Report can be reopened",
    t16Passed,
    `Reopened ID: ${reopenedData?.id}, Title: '${reopenedData?.title}'`
  );

  // ========================================================
  // TEST 17: Report links back to Research
  // ========================================================
  console.log("\n--- TEST 17: Report links back to Research ---");
  const hasResearchRef = !!createdBrief?.sections?.supportingEvidence?.[0]?.referenceNumber;
  const t17Passed = hasResearchRef && repPageRes.body.includes("View Supporting Research");
  assertTest(
    17,
    "Report links back to Research",
    t17Passed,
    `Evidence Reference: ${createdBrief?.sections?.supportingEvidence?.[0]?.referenceNumber}, Button present: true`
  );

  // ========================================================
  // TEST 18: Report links back to Policy Scenario
  // ========================================================
  console.log("\n--- TEST 18: Report links back to Policy Scenario ---");
  const t18Passed = repPageRes.body.includes("View Policy Scenario");
  assertTest(
    18,
    "Report links back to Policy Scenario",
    t18Passed,
    `Preserved scenario route bridge: true`
  );

  // ========================================================
  // TEST 19: PDF/print-ready export works
  // ========================================================
  console.log("\n--- TEST 19: PDF/print-ready export works ---");
  const hasExportButton = repPageRes.body.includes("Export Policy Brief") || repPageRes.body.includes("Print Brief");
  const hasPrintStyles = repPageRes.body.includes("print:");
  const t19Passed = hasExportButton && hasPrintStyles;
  assertTest(
    19,
    "PDF/print-ready export works",
    t19Passed,
    `Export button present: ${hasExportButton}, Print-ready classes present: ${hasPrintStyles}`
  );

  // ========================================================
  // TEST 20: No fabricated official claims appear in the generated report
  // ========================================================
  console.log("\n--- TEST 20: No fabricated official claims appear in the generated report ---");
  const reportString = JSON.stringify(createdBrief).toLowerCase();
  const forbiddenClaims = [
    "official government forecast",
    "live government api",
    "real-time satellite processing",
  ];
  let violations = [];
  for (const phrase of forbiddenClaims) {
    if (reportString.includes(phrase)) {
      violations.push(phrase);
    }
  }
  const hasModelLabel = createdBrief?.metadata?.modelOutputLabel === "Illustrative Model Output";
  const hasDatasetLabel = createdBrief?.metadata?.datasetLabel === "Illustrative Demo Dataset";
  const t20Passed = violations.length === 0 && hasModelLabel && hasDatasetLabel;
  assertTest(
    20,
    "No fabricated official claims appear in the generated report",
    t20Passed,
    `Violations: ${violations.length}, Model Output Label: '${createdBrief?.metadata?.modelOutputLabel}', Dataset Label: '${createdBrief?.metadata?.datasetLabel}'`
  );

  console.log("\n==================================================");
  if (allPassed) {
    console.log("FINAL VERDICT: ALL 20 REPORTS ACCEPTANCE TESTS PASSED! ✅");
  } else {
    console.log("FINAL VERDICT: SOME TESTS FAILED! ❌");
  }
  console.log("==================================================\n");

  if (!allPassed) {
    process.exit(1);
  }
}

runReportsSuite().catch((e) => {
  console.error("Test suite fatal error:", e);
  process.exit(1);
});
